#!/usr/bin/env python3
"""
demo_activate.py
PIOS-42.13-RUN01-CONTRACT-v1

Demo Activation Status Adapter — Structured JSON

Returns the current demo surface activation state.
Reads from certified 42.28 surface manifest (static, no computation).

Rules:
  R1  output sourced from static governance constants only — no computation
  R2  JSON to stdout; no file writes
  R3  --status flag required

Usage:
  python3 scripts/pios/42.13/demo_activate.py --status
"""

import argparse
import json
import sys
from pathlib import Path

CONTRACT_ID = "PIOS-42.13-RUN01-CONTRACT-v1"

# Static surface state — certified by 42.28 + 42.29 [R1]
DEMO_SURFACE_STATUS = {
    "contract_id":        CONTRACT_ID,
    "surface_status":     "ACTIVE",
    "certified_stream":   "42.29",
    "certified_routes": [
        {"route": "?query=GQ-XXX",                  "adapter": "42.4",  "status": "CERTIFIED"},
        {"route": "?list=true",                      "adapter": "42.4",  "status": "CERTIFIED"},
        {"route": "?overview=true",                  "adapter": "42.6",  "status": "CERTIFIED"},
        {"route": "?topology=true",                  "adapter": "42.7",  "status": "CERTIFIED"},
        {"route": "?topology=true&highlight=GQ-003", "adapter": "42.7",  "status": "CERTIFIED"},
        {"route": "?enl=GQ-XXX",                     "adapter": "42.15", "status": "ACTIVE"},
        {"route": "?persona=P&query=GQ-XXX",         "adapter": "42.16", "status": "ACTIVE"},
        {"route": "?status=true",                    "adapter": "42.13", "status": "ACTIVE"},
    ],
    "demo_sequence":      "51.3 — 9-step unified governed flow",
    "demo_steps":         9,
    "emphasis_active":    True,
    "emphasis_node":      "C_30_Domain_Event_Bus",
    "projection_source":  "docs/pios/44.2/projection_attachment.json",
}


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Demo Activation Status Adapter — PIOS-42.13-RUN01-CONTRACT-v1\n"
            "Returns current demo surface state. Static. No computation."
        ),
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--status",
        action="store_true",
        required=True,
        help="Return demo surface status",
    )
    args = parser.parse_args()

    print(json.dumps(DEMO_SURFACE_STATUS, indent=2))


if __name__ == "__main__":
    main()
