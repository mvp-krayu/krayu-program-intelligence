#!/usr/bin/env python3
"""
Interrogation trail persistence for governed PI runtime.

Governed persistence of exploration trails that are currently session-scoped
and lost on exit. Trails capture the cognitive path through structural
depth — which claims were investigated, what evidence was examined, what
depth was reached, and what conclusions were drawn.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P3)
"""

from __future__ import annotations

import argparse
import json
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class TrailEntry:
    """A single step in an interrogation trail."""

    def __init__(
        self,
        action: str,
        target: str,
        depth: str,
        persona: str,
        detail: Optional[str] = None,
    ):
        self.entry_id = str(uuid.uuid4())[:8]
        self.timestamp = _now()
        self.action = action
        self.target = target
        self.depth = depth
        self.persona = persona
        self.detail = detail

    def to_dict(self) -> dict:
        d = {
            "entry_id": self.entry_id,
            "timestamp": self.timestamp,
            "action": self.action,
            "target": self.target,
            "depth": self.depth,
            "persona": self.persona,
        }
        if self.detail:
            d["detail"] = self.detail
        return d


class InterrogationTrail:
    """A governed interrogation trail capturing cognitive exploration."""

    def __init__(self, session_id: str, client: str, run_id: str):
        self.trail_id = str(uuid.uuid4())
        self.session_id = session_id
        self.client = client
        self.run_id = run_id
        self.created_at = _now()
        self.entries = []
        self.max_depth_reached = "Z1"
        self.personas_used = set()
        self.closed = False

    def add_entry(self, entry: TrailEntry):
        if self.closed:
            raise ValueError("Trail is closed — no further entries permitted")
        self.entries.append(entry)
        self.personas_used.add(entry.persona)

        from scripts.pios.governance.depth_traversal import DEPTH_ORDER
        current_max = DEPTH_ORDER.get(self.max_depth_reached, 1)
        entry_depth = DEPTH_ORDER.get(entry.depth, 1)
        if entry_depth > current_max:
            self.max_depth_reached = entry.depth

    def record_descent(self, target: str, from_depth: str, to_depth: str, persona: str):
        self.add_entry(TrailEntry(
            action="DESCENT",
            target=target,
            depth=to_depth,
            persona=persona,
            detail=f"Descended from {from_depth} to {to_depth}",
        ))

    def record_ascent(self, target: str, from_depth: str, to_depth: str, persona: str):
        self.add_entry(TrailEntry(
            action="ASCENT",
            target=target,
            depth=to_depth,
            persona=persona,
            detail=f"Ascended from {from_depth} to {to_depth}",
        ))

    def record_examination(self, target: str, depth: str, persona: str, finding: str = None):
        self.add_entry(TrailEntry(
            action="EXAMINE",
            target=target,
            depth=depth,
            persona=persona,
            detail=finding,
        ))

    def record_query(self, query: str, depth: str, persona: str, result_summary: str = None):
        self.add_entry(TrailEntry(
            action="QUERY",
            target=query,
            depth=depth,
            persona=persona,
            detail=result_summary,
        ))

    def close(self) -> dict:
        self.closed = True
        return {
            "trail_id": self.trail_id,
            "closed_at": _now(),
            "total_entries": len(self.entries),
            "max_depth_reached": self.max_depth_reached,
            "personas_used": sorted(self.personas_used),
        }

    def to_dict(self) -> dict:
        return {
            "trail_id": self.trail_id,
            "session_id": self.session_id,
            "client": self.client,
            "run_id": self.run_id,
            "created_at": self.created_at,
            "closed": self.closed,
            "max_depth_reached": self.max_depth_reached,
            "personas_used": sorted(self.personas_used),
            "entry_count": len(self.entries),
            "entries": [e.to_dict() for e in self.entries],
        }


def save_trail(trail: InterrogationTrail, run_dir: Path) -> Path:
    """Persist a trail to the run directory."""
    trail_dir = run_dir / "governance" / "trails"
    trail_dir.mkdir(parents=True, exist_ok=True)
    path = trail_dir / f"trail_{trail.trail_id[:8]}.json"
    with open(path, "w") as f:
        json.dump(trail.to_dict(), f, indent=2)
    return path


def load_trail(trail_path: Path) -> InterrogationTrail:
    """Load a persisted trail."""
    with open(trail_path) as f:
        data = json.load(f)
    trail = InterrogationTrail(data["session_id"], data["client"], data["run_id"])
    trail.trail_id = data["trail_id"]
    trail.created_at = data["created_at"]
    trail.closed = data.get("closed", False)
    trail.max_depth_reached = data.get("max_depth_reached", "Z1")
    trail.personas_used = set(data.get("personas_used", []))
    for entry_data in data.get("entries", []):
        entry = TrailEntry(
            action=entry_data["action"],
            target=entry_data["target"],
            depth=entry_data["depth"],
            persona=entry_data["persona"],
            detail=entry_data.get("detail"),
        )
        entry.entry_id = entry_data["entry_id"]
        entry.timestamp = entry_data["timestamp"]
        trail.entries.append(entry)
    return trail


def list_trails(run_dir: Path) -> list:
    """List all persisted trails in a run directory."""
    trail_dir = run_dir / "governance" / "trails"
    if not trail_dir.exists():
        return []
    trails = []
    for f in sorted(trail_dir.glob("trail_*.json")):
        with open(f) as fh:
            data = json.load(fh)
        trails.append({
            "trail_id": data["trail_id"][:8],
            "session_id": data["session_id"][:8],
            "entries": data.get("entry_count", len(data.get("entries", []))),
            "max_depth": data.get("max_depth_reached", "?"),
            "closed": data.get("closed", False),
            "personas": data.get("personas_used", []),
        })
    return trails


def main():
    parser = argparse.ArgumentParser(
        description="Interrogation trail persistence"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    list_parser = subparsers.add_parser("list", help="List trails for a run")
    list_parser.add_argument("run_dir", help="Path to run directory")

    show_parser = subparsers.add_parser("show", help="Show trail details")
    show_parser.add_argument("trail_file", help="Path to trail JSON")

    args = parser.parse_args()

    if args.command == "list":
        trails = list_trails(Path(args.run_dir))
        if not trails:
            print("No trails found")
        else:
            for t in trails:
                status = "CLOSED" if t["closed"] else "ACTIVE"
                print(f"  {t['trail_id']} [{status}] entries={t['entries']} depth={t['max_depth']} personas={t['personas']}")

    elif args.command == "show":
        trail = load_trail(Path(args.trail_file))
        print(f"Trail: {trail.trail_id[:8]}")
        print(f"  Session: {trail.session_id[:8]}")
        print(f"  Entries: {len(trail.entries)}")
        print(f"  Max depth: {trail.max_depth_reached}")
        print(f"  Personas: {sorted(trail.personas_used)}")
        for entry in trail.entries:
            d = entry.to_dict()
            print(f"  [{d['timestamp'][:19]}] {d['action']} {d['target']} @{d['depth']} ({d['persona']})")
            if d.get("detail"):
                print(f"    → {d['detail']}")


if __name__ == "__main__":
    main()
