#!/usr/bin/env python3
"""
Concurrent write guard for governed PI runtime artifacts.

File-based advisory locking for governed artifact mutation. Prevents
concurrent writes to the same governed artifact from multiple pipeline
or operator sessions.

Lock files are advisory — they signal intent, not enforce at OS level.
The guard fails-closed: if a lock is held, the write is rejected.

Stream: PI.NEXTGEN.AGENTIC-RUNTIME-IMPLEMENTATION.01 (P2)
"""

from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


class WriteLockHeld(Exception):
    pass


class WriteLockExpired(Exception):
    pass


LOCK_TIMEOUT_SECONDS = 300
GOVERNED_PATHS = frozenset({
    "spine/spine_objects.json",
    "semantic/spe/semantic_propositions.json",
    "semantic/spe/proposition_review_state.json",
    "ceu/reconciliation_state.json",
    "sqo/promotion_state.json",
    "sqo/revalidation_result.json",
    "sqo/enrichment_plan.json",
})


def _lock_path(artifact_path: Path) -> Path:
    return artifact_path.parent / f".{artifact_path.name}.lock"


def _read_lock(lock_path: Path) -> Optional[dict]:
    if not lock_path.exists():
        return None
    try:
        with open(lock_path) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return None


def _is_expired(lock_info: dict) -> bool:
    acquired = lock_info.get("acquired_at_epoch", 0)
    timeout = lock_info.get("timeout_seconds", LOCK_TIMEOUT_SECONDS)
    return time.time() > acquired + timeout


def acquire_write_lock(
    artifact_path: Path,
    holder: str,
    timeout_seconds: int = LOCK_TIMEOUT_SECONDS,
) -> dict:
    """Acquire advisory write lock on a governed artifact.

    Args:
        artifact_path: Full path to the governed artifact
        holder: Identity of the lock holder (pipeline ID, operator, session)
        timeout_seconds: Lock expiry in seconds

    Returns:
        Lock info dict

    Raises:
        WriteLockHeld: If another holder has the lock and it hasn't expired
    """
    lock_path = _lock_path(artifact_path)
    existing = _read_lock(lock_path)

    if existing is not None:
        if not _is_expired(existing):
            if existing.get("holder") != holder:
                raise WriteLockHeld(
                    f"Write lock on {artifact_path.name} held by {existing.get('holder')} "
                    f"since {existing.get('acquired_at')} — expires in "
                    f"{int(existing.get('acquired_at_epoch', 0) + existing.get('timeout_seconds', 0) - time.time())}s"
                )

    now = datetime.now(timezone.utc)
    lock_info = {
        "artifact": str(artifact_path.name),
        "holder": holder,
        "acquired_at": now.isoformat(),
        "acquired_at_epoch": time.time(),
        "timeout_seconds": timeout_seconds,
        "pid": os.getpid(),
    }

    lock_path.parent.mkdir(parents=True, exist_ok=True)
    with open(lock_path, "w") as f:
        json.dump(lock_info, f, indent=2)

    return lock_info


def release_write_lock(artifact_path: Path, holder: str) -> bool:
    """Release advisory write lock.

    Returns True if lock was released, False if lock wasn't held by this holder.
    """
    lock_path = _lock_path(artifact_path)
    existing = _read_lock(lock_path)

    if existing is None:
        return False

    if existing.get("holder") != holder:
        return False

    lock_path.unlink(missing_ok=True)
    return True


def check_write_lock(artifact_path: Path) -> Optional[dict]:
    """Check if a write lock is held on an artifact.

    Returns lock info if held and not expired, None otherwise.
    Cleans up expired locks.
    """
    lock_path = _lock_path(artifact_path)
    existing = _read_lock(lock_path)

    if existing is None:
        return None

    if _is_expired(existing):
        lock_path.unlink(missing_ok=True)
        return None

    return existing


def list_active_locks(run_dir: Path) -> list:
    """List all active write locks in a run directory."""
    run_dir = Path(run_dir)
    locks = []

    for rel_path in GOVERNED_PATHS:
        artifact_path = run_dir / rel_path
        lock_info = check_write_lock(artifact_path)
        if lock_info:
            locks.append({
                "artifact": rel_path,
                **lock_info,
            })

    for lock_file in run_dir.rglob(".*.lock"):
        try:
            info = _read_lock(lock_file)
            if info and not _is_expired(info):
                rel = str(lock_file.relative_to(run_dir))
                artifact_rel = rel.replace("/.", "/").rstrip(".lock")
                if not any(l["artifact"] == artifact_rel for l in locks):
                    locks.append({"artifact": artifact_rel, **info})
        except Exception:
            pass

    return locks


def force_release_all(run_dir: Path) -> int:
    """Force-release all locks in a run directory. Returns count released."""
    run_dir = Path(run_dir)
    count = 0
    for lock_file in run_dir.rglob(".*.lock"):
        lock_file.unlink(missing_ok=True)
        count += 1
    return count


class GuardedWriteContext:
    """Context manager for guarded writes to governed artifacts.

    Usage:
        with GuardedWriteContext(artifact_path, "pipeline-run-001") as guard:
            data = json.load(open(artifact_path))
            data["field"] = "new_value"
            with open(artifact_path, "w") as f:
                json.dump(data, f, indent=2)
    """

    def __init__(self, artifact_path: Path, holder: str, timeout: int = LOCK_TIMEOUT_SECONDS):
        self.artifact_path = Path(artifact_path)
        self.holder = holder
        self.timeout = timeout
        self.lock_info = None

    def __enter__(self):
        self.lock_info = acquire_write_lock(self.artifact_path, self.holder, self.timeout)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        release_write_lock(self.artifact_path, self.holder)
        self.lock_info = None
        return False


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Concurrent write guard for governed artifacts"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    lock_parser = subparsers.add_parser("lock", help="Acquire write lock")
    lock_parser.add_argument("artifact", help="Path to artifact")
    lock_parser.add_argument("--holder", required=True, help="Lock holder identity")
    lock_parser.add_argument("--timeout", type=int, default=LOCK_TIMEOUT_SECONDS)

    unlock_parser = subparsers.add_parser("unlock", help="Release write lock")
    unlock_parser.add_argument("artifact", help="Path to artifact")
    unlock_parser.add_argument("--holder", required=True, help="Lock holder identity")

    status_parser = subparsers.add_parser("status", help="Check lock status")
    status_parser.add_argument("artifact", help="Path to artifact")

    list_parser = subparsers.add_parser("list", help="List active locks in run directory")
    list_parser.add_argument("run_dir", help="Path to run directory")

    force_parser = subparsers.add_parser("force-release", help="Force-release all locks")
    force_parser.add_argument("run_dir", help="Path to run directory")

    args = parser.parse_args()

    if args.command == "lock":
        try:
            info = acquire_write_lock(Path(args.artifact), args.holder, args.timeout)
            print(f"LOCKED: {args.artifact} by {args.holder}")
        except WriteLockHeld as e:
            print(f"BLOCKED: {e}", file=sys.stderr)
            sys.exit(1)

    elif args.command == "unlock":
        released = release_write_lock(Path(args.artifact), args.holder)
        print(f"{'RELEASED' if released else 'NOT_HELD'}: {args.artifact}")

    elif args.command == "status":
        info = check_write_lock(Path(args.artifact))
        if info:
            print(f"LOCKED by {info['holder']} since {info['acquired_at']}")
        else:
            print("UNLOCKED")

    elif args.command == "list":
        locks = list_active_locks(Path(args.run_dir))
        if locks:
            for l in locks:
                print(f"  {l['artifact']}: held by {l['holder']} since {l.get('acquired_at', '?')}")
        else:
            print("No active locks")

    elif args.command == "force-release":
        count = force_release_all(Path(args.run_dir))
        print(f"Force-released {count} locks")


if __name__ == "__main__":
    main()
