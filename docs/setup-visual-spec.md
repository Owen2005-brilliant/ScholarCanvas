# ScholarCanvas Visual Setup — Visual Specification

This specification translates the approved setup-wizard concepts into implementation rules. The reference concepts are:

- `docs/design-concepts/setup-wizard-desktop.png`
- `docs/design-concepts/setup-wizard-mobile.png`

## Product structure

The initializer is a seven-step product flow: Welcome, Profile, Sections, Content, Appearance, Website, and Review & Export. Desktop uses a quiet 64px header, a 210px step rail, an open form workspace, and a live preview that receives approximately 44% of the available width. Mobile replaces the rail with a seven-node progress line and explicit Edit/Preview tabs.

The preview is a real ScholarCanvas page, not a thumbnail recreation. Desktop keeps it visible beside the form. Mobile gives it the full content canvas when Preview is selected.

## Visual system

- Background: warm white `#fffdf8`; dark background `#0d1724`.
- Surfaces: white `#ffffff`; dark surface `#152231`.
- Primary action and selected state: amber `#f59e0b`, with `#d97706` for hover/strong emphasis.
- Supporting information: pale sky `#e0f2fe` and blue `#1677d2`.
- Advanced configuration: copper `#9a6a22` and fine neutral dividers.
- Text: navy `#15263a`; muted text `#667386`.
- Success: `#238558`; danger: `#b54747`.
- Headings use the existing ScholarCanvas serif stack; form labels and controls use the existing sans-serif stack.
- UI chrome is 13–15px with deliberate line height. Primary page headings are 28–36px desktop and 26–30px mobile.
- Controls are at least 44px high, use 7–12px radii, visible 3px focus rings, and restrained shadows.

Open rails, lists, field groups, and one purposeful preview frame are preferred over nested cards. Gradients, fake metrics, decorative badges, and dashboard-style card walls are not part of the accepted design.

## Responsive behavior

- `>= 1180px`: step rail + editor + live preview.
- `900–1179px`: compact step rail, editor and preview remain side by side.
- `< 900px`: top progress, Edit/Preview tabs, one content column.
- `360–390px`: 14px page gutters, full-width controls, sticky action bar, no horizontal overflow.

## Interaction and state

- The current step is represented by text, number, color, and `aria-current`.
- Repeaters expose add, duplicate, move up, move down, collapse, and delete controls; reordering never depends on drag alone.
- Validation is quiet until a field is touched or a step is submitted. Errors are linked from a summary and focus moves to the first error.
- Draft save, export, and folder writing use explicit confirmation and status announcements.
- Motion is limited to short opacity/position transitions and is disabled for `prefers-reduced-motion`.

## Required visible states

The desktop concept covers Welcome, Profile editing, Content editing, large Student/Researcher previews, and successful Review & Export. The mobile concept covers Welcome, Profile, Content, Preview, folder-write fallback, and export success at phone widths.

