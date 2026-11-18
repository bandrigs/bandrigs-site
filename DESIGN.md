# BandRigs design system

Direction: **a labeled road rack, not a tech startup.** Dark graphite like a rack case, warm off-white text,
one brand blue for actions, and monospace "rack label" text for specs and prices. Real photos of real builds
do the selling. Layouts are left-aligned and asymmetric, with hairline rules instead of floating cards.
(This direction was chosen from the existing brand and the real build photos. It wasn't compared against a
library of reference sites.)

Avoid: AI concept renders, gradient text, glass panels, three identical feature cards, emoji, centered-everything
sections, slogan triplets ("Your sound. Your stage.").

## Color (dark only)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0d0e10` | Page background |
| `--surface` | `#15171a` | Panels, form fields, finder |
| `--surface-2` | `#1c1f23` | Hover / selected option, gear photo backing |
| `--line` | `#2a2e34` | Hairline rules and borders |
| `--line-strong` | `#3a4048` | Input borders, outline buttons |
| `--text` | `#f1f0ec` | Body and headings (17:1 on bg) |
| `--muted` | `#a4a8ae` | Secondary text (8:1 on bg) |
| `--primary` | `#8ec5ff` | Brand blue: primary buttons, links, focus, "Rigs" in the logo |
| `--primary-ink` | `#0d0e10` | Text on primary buttons |
| `--signal` | `#f2b443` | The only accent, like a rack LED: active step, "starting at" price marks. Never for body text blocks |
| `--error` | `#ff8a7a` | Form errors |
| `--success` | `#86dba0` | Sent / confirmed states |

## Typography

- Display: **Barlow Condensed** 600 (headings, uppercase only for short labels).
- Body: **IBM Plex Sans** 400/500/600.
- Labels, specs, prices: **IBM Plex Mono** 500.

| Step | Size / line height | Use |
|---|---|---|
| `--fs-label` | 13px / 1.4, mono, 0.08em tracking, uppercase | Rack labels, eyebrows, captions |
| `--fs-small` | 15px / 1.5 | Notes, footer |
| `--fs-body` | 17px / 1.6 | Body |
| `--fs-lead` | 20px / 1.5 | Intro paragraphs |
| `--fs-h3` | 24px / 1.2 | Card and step titles (Barlow 600) |
| `--fs-h2` | clamp(32px, 4vw, 48px) / 1.05 | Section headings |
| `--fs-h1` | clamp(44px, 7vw, 88px) / 0.98 | Page headline |

Text measure: 66ch max.

## Spacing and layout

8px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections: 96px (desktop), 64px (phone).
Container 1200px plus 24px gutters (16px under 480px). Grid: 12 columns, mostly 5/7 or 4/8 splits.

## Shape and depth

Radius: 4px for buttons, inputs and panels, 2px for tags. No shadows: depth comes from `--surface` steps and hairlines.

## Components

- **Primary button**: `--primary` fill, `--primary-ink` text, 600, 48px tall, arrow at the end. Hover: lighten 8%. Focus: 2px `--text` outline, 3px offset. Disabled: 40% opacity.
- **Secondary button**: 1px `--line-strong` border, `--text` text. Hover: `--surface-2`.
- **Quiet link**: `--primary` text with →, underline on hover.
- **Option tile (finder)**: full-width row, 1px `--line-strong`, 56px min height, title + one-line hint; selected = `--primary` border plus `--surface-2`.
- **Input**: `--surface` fill, 1px `--line-strong`, 48px; label above in 15px 500; error text in `--error` below.
- **Spec row**: mono label left (`--muted`), value right, hairline between rows. Used for packages and the case study.
- **Nav**: logo left, 3 links + "Plan my rig" primary button right. On phones: logo + "Plan my rig" button + menu toggle.
- **Footer**: contact, socials, small links, all on `--bg` above a hairline.

## Imagery and icons

- Real BandRigs build photos (`/assets/photos/rig-*.webp`), captioned with a mono label naming the gear.
- Manufacturer product shots only on `--surface-2` backing, for "typical gear".
- Icons: inline SVG, 1.5px stroke, currentColor, used only where they add meaning (phone, mail, socials, arrows).
