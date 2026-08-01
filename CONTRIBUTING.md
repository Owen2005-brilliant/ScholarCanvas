# Contributing to ScholarCanvas

Thank you for helping make academic homepages easier to maintain and more inclusive. Contributions may include bug fixes, documentation, configuration validation, accessibility improvements, original visual assets, or focused components that fit the static-first scope.

## Development setup

ScholarCanvas has no build step or Node.js dependency. Start a local server from the repository root:

```bash
python3 -m http.server 8000
```

Open these pages:

- `http://localhost:8000/`
- `http://localhost:8000/setup.html`
- `http://localhost:8000/tests/smoke.html`
- `http://localhost:8000/tests/setup-smoke.html`

Also verify `index.html` and `setup.html` directly through `file://`, because local-file use is a core product requirement. Advanced configuration details are documented in the [manual configuration guide](docs/manual-configuration.md).

## Validation and browser tests

Run the configuration validator, compile every Python tool, and check the patch for whitespace errors:

```bash
python3 tools/validate_config.py
python3 -m py_compile tools/*.py
git diff --check
```

`tests/smoke.html` covers homepage rendering and interactions. `tests/setup-smoke.html` covers Visual Setup state, validation, serialization, drafts, preview messages, folder writes, and ZIP export. Both pages print their real assertion totals and must report no failures.

The intentionally invalid fixture verifies that the validator rejects duplicate IDs, unsafe links, and unsupported values:

```bash
python3 tools/validate_config.py --check-file tests/config-fixtures/invalid-publication.js
```

This fixture command must exit non-zero. It is a failure-path check, not a passing configuration.

## Maintenance tools

- `tools/validate_config.py` checks required files, namespaces, fields, IDs, dates, publication statuses, asset paths, URLs, and static HTML constraints.
- `tools/update_date.py` updates `site.lastUpdated`; use `--check` for CI-style comparison.
- `tools/optimize_images.py` creates non-destructive WebP versions of local images. It optionally uses Pillow:

  ```bash
  python3 -m pip install Pillow
  python3 tools/optimize_images.py assets/projects/my-image.png --quality 84
  ```

Do not commit `__pycache__`, temporary exports, or generated QA artifacts.

## GitHub Actions

- `.github/workflows/validate.yml` runs repository validation for pushes and pull requests.
- `.github/workflows/deploy-pages.yml` validates `main`, uploads the static repository, and deploys GitHub Pages.

When a workflow fails, inspect the failing job and fix the real validation, asset, permission, or deployment issue. Do not use empty commits or force pushes to bypass checks.

## Branches

- Start feature branches from the latest default branch.
- Use a short descriptive name such as `fix/mobile-publication-links` or `docs/add-orcid-example`.
- Keep unrelated changes in separate branches and pull requests.
- Do not commit generated caches, private profile data, access tokens, or temporary QA artifacts.

## Commit style

Use an imperative, scoped subject when useful:

```text
fix: preserve focus after closing the project dialog
docs: explain translation fallback
feat(publications): add a safe status label
```

Commits should be reviewable and should not mix broad formatting rewrites with behavioral changes.

## Code style

- Use semantic HTML and native browser APIs.
- Do not add frontend frameworks, jQuery, CSS frameworks, runtime `fetch()` for configuration, or a Node.js build requirement.
- Keep all configuration under `window.SCHOLAR_CANVAS`; avoid new global variables.
- Use `createElement`, `textContent`, and attribute setters for configuration-driven DOM.
- Never pass configuration text into untrusted `innerHTML`.
- Do not use inline event handlers, `eval`, or `new Function`.
- Ensure external links use `target="_blank" rel="noopener noreferrer"` where appropriate.
- Keep functions focused and preserve missing-field fallbacks.
- Use CSS custom properties for theme values and respect the Student/Researcher distinction.

## Original work and licensing

Do not copy code, illustrations, screenshots, icons, fonts, or text from another academic homepage without clear compatible permission. New assets must be original or include documented license and attribution. A pull request that reproduces another repository's implementation or restricted artwork will not be accepted.

Never add a real person's private email, phone number, private identifier, unpublished result, or misleading sample paper. Demo data must remain clearly fictional.

## Accessibility requirements

Every new or changed component must:

- work with keyboard-only navigation;
- have a visible focus state and useful accessible name;
- preserve a logical heading hierarchy;
- include meaningful `alt` text or empty alt text for decoration;
- meet WCAG AA color contrast;
- use at least 44px touch targets for primary mobile controls;
- announce meaningful asynchronous or filtered state changes;
- respect `prefers-reduced-motion`;
- avoid horizontal overflow at 360px;
- preserve modal focus trapping and Escape behavior when applicable.

## Pull request checklist

- [ ] The change is original and license-compatible.
- [ ] `python3 tools/validate_config.py` passes.
- [ ] `python3 -m py_compile tools/*.py` passes.
- [ ] `tests/smoke.html` and `tests/setup-smoke.html` show all browser assertions passing.
- [ ] Student and Researcher modes were checked.
- [ ] Chinese and English were checked.
- [ ] Light and dark themes were checked.
- [ ] A 360px mobile viewport has no horizontal overflow.
- [ ] Keyboard focus, Escape behavior, and reduced motion were checked where relevant.
- [ ] No secret, API token, private sample data, remote core dependency, or unauthorized asset was added.
- [ ] Documentation and example configuration were updated if public behavior changed.

## Pull requests

Describe the user-facing problem, the chosen solution, validation performed, and remaining limitations. Screenshots are helpful for visual changes but do not replace interaction and accessibility verification. Maintainers may request a smaller scope when a change adds long-term complexity to the zero-backend template.
