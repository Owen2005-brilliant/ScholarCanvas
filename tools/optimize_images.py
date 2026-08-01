#!/usr/bin/env python3
"""Convert JPG/PNG images to WebP without overwriting sources."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("images", nargs="+", type=Path, help="JPG or PNG files")
    parser.add_argument("--output-dir", type=Path, help="Destination directory; defaults to each source directory")
    parser.add_argument("--quality", type=int, default=84, help="WebP quality from 1 to 100")
    parser.add_argument("--force", action="store_true", help="Allow replacing an existing WebP output")
    args = parser.parse_args()

    if not 1 <= args.quality <= 100:
        parser.error("--quality must be between 1 and 100")
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print("Pillow is optional and is not installed. Run `python3 -m pip install Pillow` to use image optimization.", file=sys.stderr)
        return 2

    failures = 0
    for source in args.images:
        if source.suffix.lower() not in {".jpg", ".jpeg", ".png"} or not source.is_file():
            print(f"Skipped unsupported or missing file: {source}", file=sys.stderr)
            failures += 1
            continue
        destination_dir = args.output_dir or source.parent
        destination_dir.mkdir(parents=True, exist_ok=True)
        destination = destination_dir / f"{source.stem}.webp"
        if destination.exists() and not args.force:
            print(f"Refusing to overwrite {destination}; pass --force to replace it.", file=sys.stderr)
            failures += 1
            continue
        try:
            with Image.open(source) as image:
                normalized = ImageOps.exif_transpose(image)
                normalized.save(destination, "WEBP", quality=args.quality, method=6)
            print(f"Created {destination}")
        except OSError as exc:
            print(f"Could not process {source}: {exc}", file=sys.stderr)
            failures += 1
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
