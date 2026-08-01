#!/usr/bin/env python3
"""Update ScholarCanvas's data/site.js lastUpdated field."""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--date", help="Date in YYYY-MM-DD format; defaults to today")
    parser.add_argument("--check", action="store_true", help="Check whether the configured date already matches")
    args = parser.parse_args()
    value = args.date or dt.date.today().isoformat()
    try:
        dt.date.fromisoformat(value)
    except ValueError:
        print(f"Invalid date: {value}; expected YYYY-MM-DD.", file=sys.stderr)
        return 2

    path = args.root.resolve() / "data/site.js"
    if not path.is_file():
        print(f"Missing file: {path}", file=sys.stderr)
        return 1
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(r"(\blastUpdated\s*:\s*['\"])(\d{4}-\d{2}-\d{2})(['\"])")
    match = pattern.search(text)
    if not match:
        print("Could not find lastUpdated in data/site.js.", file=sys.stderr)
        return 1
    if args.check:
        if match.group(2) != value:
            print(f"lastUpdated is {match.group(2)}, expected {value}.")
            return 1
        print(f"lastUpdated already matches {value}.")
        return 0
    updated = pattern.sub(rf"\g<1>{value}\g<3>", text, count=1)
    path.write_text(updated, encoding="utf-8")
    print(f"Updated {path} to {value}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
