# Brand spec — `Luisarg03` profile

**Source of truth:** the existing SVG panels in `images/*.svg` of the `Luisarg03/Luisarg03`
repository. Every value below was read out of those files, not guessed. The generator
`build-profile.mjs` imports this exact palette, so the README, the panels and the preview
can never drift apart.

**One sentence:** a dark terminal that happens to be a résumé — gold prompt, teal paths,
hairline-separated panes locked to a single 900-unit column.

## Tokens

| Token | OKLch | Hex | Role |
|---|---|---|---|
| `--bg` | `oklch(16.25% 0.0143 258.36)` | `#0a0e14` | page + panel chrome bar |
| `--surface` | `oklch(20.77% 0.0177 259.72)` | `#131820` | panel body |
| `--fg` | `oklch(89.53% 0.0127 255.51)` | `#d7dde5` | primary text |
| `--muted` | `oklch(61.96% 0.0229 254.98)` | `#7d8794` | labels, metadata |
| `--border` | `oklch(29.52% 0.0325 259.66)` | `#232d3d` | hairlines, chrome dots |
| `--accent` | `oklch(80.45% 0.1558 82.54)` | `#f0b429` | prompt user, section marks, hero handle |

Supporting tones already present in the source panels, kept because they carry meaning:

| Token | OKLch | Hex | Role |
|---|---|---|---|
| `--muted-strong` | `oklch(71.24% 0.0215 257.49)` | `#9aa3b0` | 11–11.5px body copy (raises 4.89:1 → 6.99:1 on `--surface`) |
| `--line-strong` | `oklch(34.99% 0.0370 259.45)` | `#2f3b4e` | chrome dots and chip strokes — **shapes only, never text** (1.57:1) |
| `--teal` | `oklch(78.72% 0.1300 187.97)` | `#2AD4C9` | shell paths, commands, technology values |
| `--green` | `oklch(69.51% 0.1809 145.62)` | `#3fb950` | status only (`ACTIVE`), AI/agents category |

### Type

```
--font-display: ui-monospace, 'SF Mono', 'JetBrains Mono', 'Cascadia Mono',
                Menlo, Consolas, 'DejaVu Sans Mono', monospace
--font-body:    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans',
                Helvetica, Arial, sans-serif          (prose only — GitHub's own stack)
--font-mono:    same as --font-display
```

Display and body are deliberately different faces: the terminal mono carries every visual
panel and every markdown heading (the brand), while prose inside the README renders in the
reader's GitHub stack, because that is the surface being designed for.

## Observed rules

1. **Every surface is a terminal window.** A 34px chrome bar in `--bg` carrying a `~/name`
   tab label on the left and three `--line-strong` dots on the right, over a `--surface`
   body, closed by a 1px `--border` stroke at 8px radius.
2. **One hue carries structure.** Gold marks the prompt user, the hero handle and section
   marks. Teal marks paths (`~/`), commands and technology values. Green is reserved for
   status and the AI/agents category. Nothing else is coloured.
3. **Mono only, on a fixed baseline grid.** Body copy inside panels never exceeds 12px and
   never uses pure white; hierarchy comes from size, colour and indent — not weight.
4. **No text sits on a fill.** Separation is 1px hairlines plus whitespace. Chips are
   outlines (`--bg` fill, `--border` stroke), never solid blocks.
5. **One column, one measure.** Every panel is exactly 900 units wide so the set scales as a
   single column in GitHub's 1012px README container, and every date, count and index is
   right-aligned to a strict right margin.
6. **Chips wrap, they never shrink.** A skill row fills the column and continues on the next
   row at x=40; the panel height is computed from the wrapped layout, not fixed in advance.

## Content vocabulary

The visual system is only half the spec — the words need one source of truth too, or the
profile drifts from the CV. Canonical sources, in order of authority:

1. `MyCv/assets/profile.yaml` — facts, contact, skills, education.
2. `MyCv/outputs/luis-meyehen-paz-resume.md` — the rendered CV, same facts in prose.
3. This repo's `build-profile.mjs` — the only place those facts may be reworded.

Rules a future edit must not break:

- **Title.** `Cloud & Data Platform Engineer`. At Interbank the formal title is **Cloud
  Engineer** and the functional one is **Cloud & Data Platform Engineer**; the career panel
  uses the formal title and the prose uses both.
- **The audience figure is `15+ Data Scientists`** served by the ML platform. The older `10+`
  figure is obsolete — do not reintroduce it.
- **The Tiendanube title is `Data Engineer`**, not `Data Platform Engineer`.
- **Education is `Computer Technician · Sec. Técnica N°3 · Buenos Aires`.** The
  `Data Architect · NTT Data Academy 2024` credential was deliberately removed from the CV,
  from `profile.yaml` and from this profile. Never re-add it.
- **The only certification shown is `AWS Certified DevOps Engineer — Professional (DOP-C02)`,
  in progress, target Q4 2026.**
- **Skills come from the `skills:` block of `profile.yaml`**, spelled exactly as written there
  (`opencode` lowercase, `Elasticsearch` camelCase). Never add a technology that does not
  appear in that block.
- **No invented metrics.** Every number in the README is either the count of a list that
  exists in the canonical sources or a date. A claim that cannot be traced to `profile.yaml`
  or the CV does not ship.
- **MCP is personal practice, not a production Interbank claim.** The Interbank work is the
  ABT generator (LangGraph + YAML registry + SQL in Athena), the variable catalog, drift and
  pipeline monitoring, and CI/CD templates.
- **The hero identity is the `@Luisarg03` handle.** The full name never appears in a panel or
  in alt text; it may appear in plain prose.
