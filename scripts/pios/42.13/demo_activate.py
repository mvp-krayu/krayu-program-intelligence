#!/usr/bin/env python3
"""
demo_activate.py
PIOS-42.13-RUN01-CONTRACT-v1 · run_01_blueedge

Semantic Demo Activation Helper — Stream 42.13

Controls the semantic path activation switch for demo use.
Wraps scripts/pios/42.11/semantic_activation.py.

Usage:
  python3 scripts/pios/42.13/demo_activate.py --enable
  python3 scripts/pios/42.13/demo_activate.py --disable
  python3 scripts/pios/42.13/demo_activate.py --status

Rules:
  - ACTIVATION_STATUS is set in the semantic_activation module
  - --enable  sets ACTIVATION_STATUS = "ACTIVATED"
  - --disable sets ACTIVATION_STATUS = "NOT_ACTIVATED"
  - --status  calls get_path_state() and prints current state
  - No files are written. No artifacts are modified.
  - State persists only for the duration of the Python process.

For persistent activation across separate script invocations,
edit ACTIVATION_STATUS directly in scripts/pios/42.11/semantic_activation.py.

Python 3.9+ standard library only.
"""

import argparse
import sys
from pathlib import Path

# ── Import semantic_activation module ─────────────────────────────────────

_MODULE_PATH = Path(__file__).resolve().parents[1] / "42.11"
if str(_MODULE_PATH) not in sys.path:
    sys.path.insert(0, str(_MODULE_PATH))

try:
    import semantic_activation as sa
except ImportError as e:
    print(f"ERROR: Cannot import semantic_activation: {e}")
    print(f"Expected at: {_MODULE_PATH}/semantic_activation.py")
    sys.exit(1)

# ── Commands ───────────────────────────────────────────────────────────────

def cmd_enable():
    """Set ACTIVATION_STATUS = ACTIVATED and report state."""
    sa.ACTIVATION_STATUS = "ACTIVATED"
    state = sa.get_path_state()
    _print_state(state)
    if state["path_state"] == sa.SEMANTIC_PATH_ACTIVE:
        print()
        print("Semantic path: ACTIVE")
        return 0
    elif state["path_state"] == sa.SEMANTIC_PATH_FALLBACK:
        print()
        print("WARNING: Semantic path entered FALLBACK after activation.")
        print(f"Failing acceptance conditions: {state['fallback_triggers']}")
        print("ENL direct path remains operational.")
        return 1
    return 0


def cmd_disable():
    """Set ACTIVATION_STATUS = NOT_ACTIVATED and report state."""
    sa.ACTIVATION_STATUS = "NOT_ACTIVATED"
    state = sa.get_path_state()
    _print_state(state)
    print()
    print("Semantic path: INACTIVE — ENL direct path active")
    return 0


def cmd_status():
    """Print current path state without modifying anything."""
    state = sa.get_path_state()
    _print_state(state)
    return 0


def _print_state(state: dict):
    print()
    print("SEMANTIC ACTIVATION STATUS")
    print("-" * 40)
    print(f"path_state:         {state['path_state']}")
    print(f"activation_status:  {state['activation_status']}")
    print(f"run_id:             {state['run_id']}")
    if state["acceptance_results"]:
        failed = [k for k, v in sorted(state["acceptance_results"].items()) if not v]
        passed = [k for k, v in sorted(state["acceptance_results"].items()) if v]
        print(f"acceptance_passed:  {len(passed)}/8")
        if failed:
            print(f"fallback_triggers:  {failed}")
        else:
            print(f"fallback_triggers:  []")
    else:
        print("acceptance_results: {} (not evaluated in INACTIVE state)")
        print("fallback_triggers:  []")
    print("-" * 40)


# ── Main ──────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description=(
            "demo_activate.py — Semantic Demo Activation Helper\n"
            "PIOS-42.13-RUN01-CONTRACT-v1 / run_01_blueedge\n\n"
            "Controls the semantic path for ExecLens demo activation."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--enable",
        action="store_true",
        help="Activate semantic path (set ACTIVATION_STATUS = ACTIVATED)",
    )
    group.add_argument(
        "--disable",
        action="store_true",
        help="Deactivate semantic path (set ACTIVATION_STATUS = NOT_ACTIVATED)",
    )
    group.add_argument(
        "--status",
        action="store_true",
        help="Print current semantic path state (read-only)",
    )
    args = parser.parse_args()

    if args.enable:
        sys.exit(cmd_enable())
    elif args.disable:
        sys.exit(cmd_disable())
    elif args.status:
        sys.exit(cmd_status())


if __name__ == "__main__":
    main()
