# Security policy

## Supported version

Security fixes are applied to the current `main` branch and the latest published release. Older snapshots may not receive backports.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could expose users, private profile data, or deployment credentials. Use GitHub's private **Report a vulnerability** / Security Advisory feature for the repository. If that feature is unavailable, contact the repository owner through a private channel listed on the hosting account.

Include:

- the affected file and version or commit;
- a minimal reproduction that does not contain real secrets or private data;
- the likely impact;
- any suggested mitigation;
- whether the issue is already public.

You can expect an acknowledgement within seven days when the repository is actively maintained. Maintainers will validate the report, agree on a disclosure timeline, prepare a fix, and credit the reporter if desired.

## Scope

In scope:

- unsafe DOM injection from configuration;
- URL handling that enables script execution;
- deployment workflow weaknesses;
- accidental secret or private-data exposure;
- focus or UI behavior that creates a meaningful security or privacy risk.

Generally out of scope:

- denial-of-service against a user's chosen static host;
- issues requiring a user to intentionally paste hostile code into the repository;
- social engineering unrelated to ScholarCanvas code;
- vulnerabilities in browsers, GitHub Pages, or optional third-party hosts.

ScholarCanvas does not require API tokens. Never commit credentials. If a secret is exposed, revoke it at the provider first, then remove it from the repository and history using the provider's recommended process.
