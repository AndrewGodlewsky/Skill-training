# Design and review notes

## Intended experience

A calm, self-contained field guide for technical colleagues who are new to AI agent skills. The primary journey is one readable chapter at a time; the same file also supports full-document reading and printing. Advanced material is disclosed on demand. The running example is a release-note drafting skill that needs no external services.

## Visual plan

- Paper: `#ffffff`; canvas: `#f1f5fa`; ink: `#172d45`; secondary ink: `#4c6076`; blue: `#224fc4`; teal: `#14695f`.
- Typography: local Bahnschrift for display, Segoe UI/Aptos for reading, Consolas for code. No downloaded fonts.
- Layout: a fixed learning-path sidebar, a quiet utility bar, and a centered reading column. Use a larger two-column composition only for the opening skill-folder illustration and comparisons.
- Identity: the literal `SKILL.md` file is the visual anchor. The folder metaphor connects the design to the subject and introduces progressive disclosure without decorative graphics.
- Alignment: left-aligned prose, generous leading, readable line lengths, meaningful sequential chapter numbers.

```
Desktop                       Mobile
┌─────────┬────────────────┐  ┌──────────────────┐
│ path    │ tools / mode   │  │ menu / title     │
│ search  ├────────────────┤  ├──────────────────┤
│ lessons │ chapter        │  │ chapter          │
│         │ example        │  │ example          │
│ progress│ previous / next│  │ previous / next  │
└─────────┴────────────────┘  └──────────────────┘
```

The plan avoids a slideshow, an endless wall of cards, remote font dependencies, and a busy dashboard. The strong visual gesture is the explorable skill folder. Everything else supports reading and practice.

## Review protocol

Check the actual file in Brave at desktop, tablet, narrow mobile and print widths. Exercise chapter navigation, URL history, local progress, search, copying, downloading, quizzes, reading mode, keyboard focus, reduced motion, and JavaScript-disabled fallback. Check console errors, overflow, internal links, external dependency requests, and exported content. Independently review product claims and learning sequence. Record results in `docs/verification.md`.
