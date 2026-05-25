#!/usr/bin/env python3
"""
Storage-layer terminal state enforcement for governed PI artifacts.

Provides guard functions and a GovernedWriter that reject illegal mutations
to terminal-state artifacts regardless of calling code. This is defense-in-depth
beyond the action-layer guards in proposition_review_action.py and
ceu_reconciliation_action.py.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P0)
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

PROPOSITION_TERMINAL_DISPOSITIONS = frozenset({"ACCEPTED", "REJECTED", "ARBITRATED"})
RECONCILIATION_TERMINAL_STATES = frozenset({"CONFIRMED", "REJECTED", "MERGED"})
REVIEW_TERMINAL_STATUS = "COMPLETE"
RECONCILIATION_TERMINAL_STATUS = "COMPLETE"


class TerminalStateViolation(Exception):
    pass


class ImmutableArtifactViolation(Exception):
    pass


class SStateDemotionViolation(Exception):
    pass


S_STATE_ORDER = {"S0": 0, "S1": 1, "S2": 2, "S3": 3}


def assert_proposition_mutable(review_state: dict, proposition_id: str):
    if review_state.get("status") == REVIEW_TERMINAL_STATUS:
        raise TerminalStateViolation(
            f"Review is COMPLETE — no further proposition mutations permitted"
        )
    dispositions = review_state.get("dispositions", {})
    entry = dispositions.get(proposition_id)
    if entry and entry.get("disposition") in PROPOSITION_TERMINAL_DISPOSITIONS:
        raise TerminalStateViolation(
            f"Proposition {proposition_id} has terminal disposition "
            f"{entry['disposition']} — mutation rejected"
        )


def assert_reconciliation_mutable(recon_state: dict, candidate_id: str = None):
    if recon_state.get("reconciliation_status") == RECONCILIATION_TERMINAL_STATUS:
        raise TerminalStateViolation(
            "Reconciliation is COMPLETE — no further mutations permitted"
        )
    if candidate_id:
        candidates = recon_state.get("candidates", {})
        cand = candidates.get(candidate_id)
        if cand and cand.get("state") in RECONCILIATION_TERMINAL_STATES:
            raise TerminalStateViolation(
                f"Candidate {candidate_id} has terminal state "
                f"{cand['state']} — mutation rejected"
            )


def assert_promotion_not_demoting(current_state: dict, target_s_level: str):
    current_level = current_state.get("s_level", "S0")
    current_order = S_STATE_ORDER.get(current_level, 0)
    target_order = S_STATE_ORDER.get(target_s_level, 0)
    if target_order < current_order:
        raise SStateDemotionViolation(
            f"S-state demotion from {current_level} to {target_s_level} is "
            f"constitutionally illegal — S-state transitions are irreversible"
        )


def assert_event_log_append_only(log_path: Path, new_content: str):
    if not log_path.exists():
        return
    existing = log_path.read_text()
    if not new_content.startswith(existing):
        raise ImmutableArtifactViolation(
            f"Event log {log_path.name} modification detected — "
            f"event logs are append-only"
        )


def assert_checkpoint_immutable(checkpoint_path: Path):
    if checkpoint_path.exists():
        raise ImmutableArtifactViolation(
            f"Checkpoint {checkpoint_path.name} already exists — "
            f"checkpoints are immutable after creation"
        )


class GovernedWriter:
    """Wraps JSON writes with terminal state enforcement.

    Usage:
        writer = GovernedWriter(run_dir)
        writer.write_proposition_review_state(updated_state, proposition_id)
        writer.write_reconciliation_state(updated_state, candidate_id)
        writer.write_promotion_state(updated_state)
        writer.append_event_log(log_name, event)
        writer.write_checkpoint(checkpoint_id, state)
    """

    def __init__(self, run_dir: Path):
        self.run_dir = Path(run_dir)

    def _load_json(self, relative_path: str) -> dict:
        path = self.run_dir / relative_path
        if not path.exists():
            return {}
        with open(path) as f:
            return json.load(f)

    def _write_json(self, relative_path: str, data: dict):
        path = self.run_dir / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(data, f, indent=2)

    def write_proposition_review_state(
        self, updated_state: dict, mutated_proposition_id: str
    ):
        current = self._load_json("semantic/spe/proposition_review_state.json")
        if current:
            assert_proposition_mutable(current, mutated_proposition_id)
        self._write_json("semantic/spe/proposition_review_state.json", updated_state)

    def write_reconciliation_state(
        self, updated_state: dict, mutated_candidate_id: str = None
    ):
        current = self._load_json("ceu/reconciliation_state.json")
        if current:
            assert_reconciliation_mutable(current, mutated_candidate_id)
        self._write_json("ceu/reconciliation_state.json", updated_state)

    def write_promotion_state(self, updated_state: dict):
        current = self._load_json("sqo/promotion_state.json")
        if current:
            new_level = updated_state.get("s_level", "S0")
            assert_promotion_not_demoting(current, new_level)
        self._write_json("sqo/promotion_state.json", updated_state)

    def append_event_log(self, log_relative_path: str, event: dict):
        path = self.run_dir / log_relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        event_line = json.dumps(event, separators=(",", ":")) + "\n"
        with open(path, "a") as f:
            f.write(event_line)

    def write_checkpoint(self, checkpoint_id: str, state: dict):
        path = (
            self.run_dir / "chronicle" / "checkpoints" / f"{checkpoint_id}.json"
        )
        assert_checkpoint_immutable(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            json.dump(state, f, indent=2)


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Terminal state guard — verify enforcement on a run directory"
    )
    parser.add_argument("run_dir", help="Path to run directory")
    parser.add_argument("--check", choices=["propositions", "reconciliation", "promotion"],
                        required=True, help="Which terminal state to check")
    args = parser.parse_args()

    run_dir = Path(args.run_dir)

    if args.check == "propositions":
        path = run_dir / "semantic/spe/proposition_review_state.json"
        if not path.exists():
            print("No proposition review state found")
            sys.exit(0)
        with open(path) as f:
            state = json.load(f)
        status = state.get("status", "UNKNOWN")
        dispositions = state.get("dispositions", {})
        terminal_count = sum(
            1 for d in dispositions.values()
            if d.get("disposition") in PROPOSITION_TERMINAL_DISPOSITIONS
        )
        print(f"Review status: {status}")
        print(f"Total propositions: {len(dispositions)}")
        print(f"Terminal dispositions: {terminal_count}")
        if status == REVIEW_TERMINAL_STATUS:
            print("LOCKED — no further mutations permitted")

    elif args.check == "reconciliation":
        path = run_dir / "ceu/reconciliation_state.json"
        if not path.exists():
            print("No reconciliation state found")
            sys.exit(0)
        with open(path) as f:
            state = json.load(f)
        status = state.get("reconciliation_status", "UNKNOWN")
        candidates = state.get("candidates", {})
        terminal_count = sum(
            1 for c in candidates.values()
            if c.get("state") in RECONCILIATION_TERMINAL_STATES
        )
        print(f"Reconciliation status: {status}")
        print(f"Total candidates: {len(candidates)}")
        print(f"Terminal candidates: {terminal_count}")
        if status == RECONCILIATION_TERMINAL_STATUS:
            print("LOCKED — no further mutations permitted")

    elif args.check == "promotion":
        path = run_dir / "sqo/promotion_state.json"
        if not path.exists():
            print("No promotion state found")
            sys.exit(0)
        with open(path) as f:
            state = json.load(f)
        s_level = state.get("s_level", "S0")
        print(f"S-level: {s_level}")
        print(f"Demotion below {s_level}: CONSTITUTIONALLY ILLEGAL")


if __name__ == "__main__":
    main()
