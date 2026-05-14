#!/usr/bin/env python3
"""
psee_json.py — Shared JSON serializer for PSEE pipeline scripts.

Compact rules (derived from reference artifact observation):
  - Arrays of simple scalars: compact if ALL string elements have len <= threshold
  - Single-key dicts with scalar value: always compact
  - CompactDict instances: always compact (regardless of key count)
  - Everything else: expanded with indent=2

Default threshold values:
  THRESHOLD_75X = 8   (for 75.x output files)
  THRESHOLD_41X = 19  (for 41.x output files)
"""

import json as _json

THRESHOLD_75X = 8
THRESHOLD_41X = 19


class CompactDict(dict):
    """Dict subclass that signals psee_dumps to always render compact."""
    pass


class RowGroupedList(list):
    """List subclass that renders as multiple scalar items per row (not one-per-line, not all-on-one-line).
    Rows is a list of lists; each inner list becomes one indented line."""
    def __init__(self, rows):
        self._rows = rows
        super().__init__(item for row in rows for item in row)


def _scalar_compact(obj):
    if obj is None:
        return "null"
    if isinstance(obj, bool):
        return "true" if obj else "false"
    if isinstance(obj, int):
        return str(obj)
    if isinstance(obj, float):
        return _json.dumps(obj)
    if isinstance(obj, str):
        return _json.dumps(obj, ensure_ascii=False)
    raise TypeError(f"Not a scalar: {type(obj)}")


def _is_scalar(obj):
    return obj is None or isinstance(obj, (bool, int, float, str))


def _should_compact_array(lst, threshold):
    if not lst:
        return True
    if not all(_is_scalar(e) for e in lst):
        return False
    return not any(isinstance(e, str) and len(e) > threshold for e in lst)


def _dump(obj, indent, level, threshold):
    pad = " " * (indent * level)
    inner_pad = " " * (indent * (level + 1))

    if _is_scalar(obj):
        return _scalar_compact(obj)

    if isinstance(obj, CompactDict):
        parts = [_json.dumps(k, ensure_ascii=False) + ": " + _scalar_compact(v) for k, v in obj.items()]
        return "{" + ", ".join(parts) + "}"

    if isinstance(obj, RowGroupedList):
        if not obj._rows:
            return "[]"
        row_lines = [inner_pad + ", ".join(_scalar_compact(e) for e in row) for row in obj._rows]
        return "[\n" + ",\n".join(row_lines) + "\n" + pad + "]"

    if isinstance(obj, list):
        if not obj:
            return "[]"
        if _should_compact_array(obj, threshold):
            return "[" + ", ".join(_scalar_compact(e) for e in obj) + "]"
        parts = [inner_pad + _dump(e, indent, level + 1, threshold) for e in obj]
        return "[\n" + ",\n".join(parts) + "\n" + pad + "]"

    if isinstance(obj, dict):
        if not obj:
            return "{}"
        if len(obj) == 1:
            k, v = next(iter(obj.items()))
            if _is_scalar(v):
                return "{" + _json.dumps(k, ensure_ascii=False) + ": " + _scalar_compact(v) + "}"
        parts = []
        for k, v in obj.items():
            parts.append(inner_pad + _json.dumps(k, ensure_ascii=False) + ": " + _dump(v, indent, level + 1, threshold))
        return "{\n" + ",\n".join(parts) + "\n" + pad + "}"

    raise TypeError(f"Unsupported type: {type(obj)}")


def psee_dumps(obj, indent=2, threshold=THRESHOLD_75X):
    """Serialize obj to JSON string with compact short-string arrays."""
    return _dump(obj, indent, 0, threshold) + "\n"
