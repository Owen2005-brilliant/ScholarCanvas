#!/usr/bin/env python3
"""Validate ScholarCanvas configuration without requiring a JavaScript runtime."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


REQUIRED_FILES = [
    "index.html",
    "setup.html",
    "README.md",
    "README.zh-CN.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "data/site.js",
    "data/profile.js",
    "data/news.js",
    "data/publications.js",
    "data/projects.js",
    "data/experience.js",
    "data/awards.js",
    "data/skills.js",
    "data/teaching.js",
    "data/service.js",
    "src/app.js",
    "src/renderer.js",
    "src/i18n.js",
    "src/theme.js",
    "src/interactions.js",
    "src/accessibility.js",
    "src/components/hero.js",
    "src/components/news.js",
    "src/components/publications.js",
    "src/components/projects.js",
    "src/components/experience.js",
    "src/components/awards.js",
    "src/components/skills.js",
    "src/components/teaching.js",
    "src/components/service.js",
    "src/components/footer.js",
    "styles/tokens.css",
    "styles/base.css",
    "styles/layout.css",
    "styles/components.css",
    "styles/student.css",
    "styles/researcher.css",
    "styles/dark.css",
    "styles/responsive.css",
    "setup/schema.js",
    "setup/seo.js",
    "setup/state.js",
    "setup/validators.js",
    "setup/serializer.js",
    "setup/exporter.js",
    "setup/importer.js",
    "setup/file-system.js",
    "setup/preview-bridge.js",
    "setup/ui.js",
    "setup/setup.js",
    "setup/setup.css",
    "setup/setup-responsive.css",
    "setup/preview/index.html",
    "setup/preview/bootstrap.js",
    "setup/components/welcome.js",
    "setup/components/stepper.js",
    "setup/components/identity-form.js",
    "setup/components/section-selector.js",
    "setup/components/repeater-editor.js",
    "setup/components/content-editor.js",
    "setup/components/branding-form.js",
    "setup/components/preview-toolbar.js",
    "setup/components/export-panel.js",
    "setup/components/confirmation-dialog.js",
    "tools/update_date.py",
    "tools/optimize_images.py",
    "tests/smoke.html",
    "tests/setup-smoke.html",
    "tests/setup-smoke.js",
    "docs/visual-setup-guide.md",
    "docs/visual-setup-guide.zh-CN.md",
    "examples/student/site.js",
    "examples/researcher/site.js",
    ".github/workflows/validate.yml",
    ".github/workflows/deploy-pages.yml",
    ".github/PULL_REQUEST_TEMPLATE.md",
]

VALID_PUBLICATION_STATUSES = {
    "published",
    "accepted",
    "preprint",
    "under-review",
    "work-in-progress",
}

UNSAFE_PROTOCOL = re.compile(r"\b(?:javascript|vbscript|data)\s*:", re.IGNORECASE)
ID_PATTERN = re.compile(r"\bid\s*:\s*['\"]([^'\"]+)['\"]")
IMAGE_PATTERN = re.compile(r"\b(?:image|avatar|shareImage)\s*:\s*['\"]([^'\"]+)['\"]")


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)


def read_text(path: Path, report: Report) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as exc:
        report.error(f"Cannot read {path}: {exc}")
        return ""


def balanced_delimiters(text: str) -> bool:
    pairs = {"{": "}", "[": "]", "(": ")"}
    closing = set(pairs.values())
    stack: list[str] = []
    quote = ""
    escaped = False
    line_comment = False
    block_comment = False
    index = 0
    while index < len(text):
        char = text[index]
        nxt = text[index + 1] if index + 1 < len(text) else ""
        if line_comment:
            if char == "\n":
                line_comment = False
            index += 1
            continue
        if block_comment:
            if char == "*" and nxt == "/":
                block_comment = False
                index += 2
            else:
                index += 1
            continue
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = ""
            index += 1
            continue
        if char == "/" and nxt == "/":
            line_comment = True
            index += 2
            continue
        if char == "/" and nxt == "*":
            block_comment = True
            index += 2
            continue
        if char in {'"', "'", "`"}:
            quote = char
        elif char in pairs:
            stack.append(pairs[char])
        elif char in closing:
            if not stack or stack.pop() != char:
                return False
        index += 1
    return not stack and not quote and not block_comment


def validate_ids(texts: dict[Path, str], report: Report) -> None:
    locations: dict[str, list[str]] = {}
    for path, text in texts.items():
        for identifier in ID_PATTERN.findall(text):
            locations.setdefault(identifier, []).append(str(path))
    for identifier, files in locations.items():
        if len(files) > 1:
            report.error(f"Duplicate id '{identifier}' found in: {', '.join(files)}")


def validate_images(root: Path, texts: dict[Path, str], report: Report) -> None:
    for path, text in texts.items():
        for image in IMAGE_PATTERN.findall(text):
            if not image or re.match(r"^(?:https?:|data:)", image, re.IGNORECASE):
                continue
            target = root / image
            if not target.is_file():
                report.error(f"Missing image referenced by {path}: {image}")


def validate_site(text: str, report: Report) -> None:
    mode = re.search(r"\bmode\s*:\s*['\"]([^'\"]+)['\"]", text)
    if not mode or mode.group(1) not in {"student", "researcher"}:
        report.error("data/site.js must define mode as 'student' or 'researcher'.")
    language = re.search(r"\bdefaultLanguage\s*:\s*['\"]([^'\"]+)['\"]", text)
    if not language or language.group(1) not in {"zh", "en"}:
        report.error("data/site.js must define defaultLanguage as 'zh' or 'en'.")
    updated = re.search(r"\blastUpdated\s*:\s*['\"]([^'\"]+)['\"]", text)
    if not updated or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", updated.group(1)):
        report.error("data/site.js lastUpdated must use YYYY-MM-DD.")
    sections = re.search(r"\bsections\s*:\s*\{([^}]*)\}", text, re.DOTALL)
    if sections:
        keys = re.findall(r"\b([A-Za-z][\w-]*)\s*:", sections.group(1))
        duplicates = sorted({key for key in keys if keys.count(key) > 1})
        if duplicates:
            report.error(f"Duplicate section keys: {', '.join(duplicates)}")
    else:
        report.error("data/site.js must define a sections object.")


def validate_profile(text: str, report: Report) -> None:
    for field in ("name", "identity", "bio", "email", "avatar"):
        if not re.search(rf"\b{re.escape(field)}\s*:", text):
            report.error(f"data/profile.js is missing required field: {field}")
    email = re.search(r"\bemail\s*:\s*['\"]([^'\"]+)['\"]", text)
    if email and not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.group(1)):
        report.error("data/profile.js contains an invalid email address.")


def validate_news(text: str, report: Report) -> None:
    for date in re.findall(r"\bdate\s*:\s*['\"]([^'\"]+)['\"]", text):
        if not re.fullmatch(r"\d{4}-(?:0[1-9]|1[0-2])", date):
            report.error(f"Invalid news date '{date}'; expected YYYY-MM.")


def validate_publications(text: str, report: Report) -> None:
    statuses = re.findall(r"\bstatus\s*:\s*['\"]([^'\"]+)['\"]", text)
    for status in statuses:
        if status not in VALID_PUBLICATION_STATUSES:
            report.error(f"Invalid publication status: {status}")
    publication_count = len(ID_PATTERN.findall(text))
    if publication_count:
        for field in ("title", "authors", "venue", "year", "status"):
            count = len(re.findall(rf"\b{field}\s*:", text))
            if count < publication_count:
                report.error(f"At least one publication is missing '{field}' ({count}/{publication_count}).")


def validate_html(root: Path, relative: str, report: Report) -> None:
    html = read_text(root / relative, report)
    ids = re.findall(r"\bid\s*=\s*['\"]([^'\"]+)['\"]", html)
    duplicates = sorted({identifier for identifier in ids if ids.count(identifier) > 1})
    if duplicates:
        report.error(f"Duplicate static HTML ids in {relative}: {', '.join(duplicates)}")
    if re.search(r"\son[a-z]+\s*=", html, re.IGNORECASE):
        report.error(f"Inline event handlers are not allowed in {relative}.")
    for reference in re.findall(r"\b(?:src|href)\s*=\s*['\"]([^'\"]+)['\"]", html):
        if not reference or reference.startswith("#") or re.match(r"^(?:https?:|mailto:)", reference, re.IGNORECASE):
            continue
        local_path = reference.split("?", 1)[0].split("#", 1)[0]
        if local_path and not (root / local_path).is_file():
            report.error(f"Missing local HTML asset: {reference}")


def validate_text_file(path: Path, text: str, report: Report) -> None:
    if UNSAFE_PROTOCOL.search(text):
        report.error(f"Unsafe URL protocol found in {path}")
    if path.suffix == ".js":
        if "window.SCHOLAR_CANVAS" not in text and "config-fixtures" not in str(path):
            report.error(f"{path} does not use the window.SCHOLAR_CANVAS namespace.")
        if not balanced_delimiters(text):
            report.error(f"Unbalanced JavaScript delimiters in {path}")
        empty_links = len(re.findall(r"\b(?:link|paper|code|project|dataset|model|poster|slides|github|demo|report|cv)\s*:\s*['\"]\s*['\"]", text))
        if empty_links:
            report.warn(f"{path} contains {empty_links} optional empty link field(s).")


def validate_root(root: Path, check_files: list[Path]) -> Report:
    report = Report()
    for relative in REQUIRED_FILES:
        if not (root / relative).is_file():
            report.error(f"Missing required file: {relative}")

    data_paths = sorted((root / "data").glob("*.js")) if (root / "data").is_dir() else []
    texts: dict[Path, str] = {}
    for path in data_paths:
        text = read_text(path, report)
        texts[path.relative_to(root)] = text
        validate_text_file(path.relative_to(root), text, report)

    for supplied in check_files:
        path = supplied if supplied.is_absolute() else root / supplied
        text = read_text(path, report)
        texts[path] = text
        validate_text_file(path, text, report)
        if "publication" in path.name:
            validate_publications(text, report)

    validate_ids(texts, report)
    validate_images(root, texts, report)
    if (root / "data/site.js").is_file():
        validate_site(texts.get(Path("data/site.js"), ""), report)
    if (root / "data/profile.js").is_file():
        validate_profile(texts.get(Path("data/profile.js"), ""), report)
    if (root / "data/news.js").is_file():
        validate_news(texts.get(Path("data/news.js"), ""), report)
    if (root / "data/publications.js").is_file():
        validate_publications(texts.get(Path("data/publications.js"), ""), report)
    if (root / "index.html").is_file():
        validate_html(root, "index.html", report)
    if (root / "setup.html").is_file():
        validate_html(root, "setup.html", report)

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="ScholarCanvas repository root")
    parser.add_argument("--check-file", action="append", default=[], type=Path, help="Additional fixture file to validate")
    parser.add_argument("--json", action="store_true", help="Print machine-readable output")
    args = parser.parse_args()
    root = args.root.resolve()
    report = validate_root(root, args.check_file)
    if args.json:
        print(json.dumps({"root": str(root), "errors": report.errors, "warnings": report.warnings}, ensure_ascii=False, indent=2))
    else:
        for warning in report.warnings:
            print(f"WARNING: {warning}")
        for error in report.errors:
            print(f"ERROR: {error}")
        print(f"ScholarCanvas validation: {len(report.errors)} error(s), {len(report.warnings)} warning(s).")
    return 1 if report.errors else 0


if __name__ == "__main__":
    sys.exit(main())
