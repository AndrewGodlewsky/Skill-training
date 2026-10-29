# Skills, understood.

A practical, self-contained field guide to **AI agent skills**, created for technical teams starting from little or no AI background. GitHub Copilot is the primary example throughout.

**The deliverable is [`index.html`](index.html).** Download the file and open it in Brave or another modern browser. You can share that one file with the team: all content, styling, examples, and interaction code are embedded. No build, server, package installation, account, CDN, remote font, or network connection is needed to read it.

On GitHub, the file view shows source code rather than the live guide. Use **Download raw file**, then open the downloaded HTML locally. Opening the guide does not install a skill. Copilot exercises and external documentation require the corresponding services.

## What the guide covers

| Chapter | Learning outcome |
| --- | --- |
| 00 · Start here | Choose a learning path and prepare a team session. |
| 01 · How skills work | Understand models, agents, hosts, context, discovery, activation, and progressive disclosure. |
| 02 · Choose the right tool | Distinguish skills from prompts, persistent instructions, prompt files, custom agents, tools/MCP, hooks, plugins, memory, RAG, and fine-tuning. |
| 03 · Inside a skill | Read `SKILL.md`, YAML frontmatter, core fields, naming rules, and optional scripts, references, and assets. |
| 04 · Use skills in Copilot | Set up project/personal skills, verify discovery and invocation, understand client/harness differences, locate other customizations, use CLI workflows, and troubleshoot. |
| 05 · Design a useful skill | Scope a workflow, extract team knowledge, write a precise description, define inputs/outputs and boundaries, and choose appropriate resources. |
| 06 · Build your first skill | Create a complete release-note drafting skill using fictional change records; inspect output and challenge contradictory input. |
| 07 · Test what matters | Separate selection from execution, prevent contaminated baselines, evaluate evidence and actions, record results, and iterate. |
| 08 · Trust & permissions | Review dependencies, understand prompt injection, distinguish prose from enforcement, and constrain tools and data access. |
| 09 · Patterns & team rollout | Explore references, templates, scripts, MCP, composition, delegated context, cross-client portability, versioning, and ownership. |
| 10 · Reference & sources | Use the authoring checklist, glossary, FAQs, and official source library. |

The guide distinguishes **format requirements**, **recommended practice**, **host-specific behavior**, and **experimental options**. It covers the major design and implementation choices without presenting a vendor extension as a universal standard.

## Reading and teaching features

- Guided chapters with previous/next navigation and direct `#chapter` links.
- “Read all chapters” mode for continuous reading and browser Find.
- Search across every chapter, including expandable advanced material and interactive panels.
- An interactive skill-folder anatomy, workflow walkthrough, decision helper, and knowledge checks.
- Copyable examples and a **Download SKILL.md** button in the workshop.
- Explicit completion markers and checklists, saved locally when browser storage is available. Reset includes an Undo action.
- Responsive desktop, tablet, and mobile layouts; keyboard controls, visible focus, reduced-motion support, and a skip link.
- A readable fallback when JavaScript is disabled.
- **Print / save PDF** expands the full document, optional sections, and interactive explanations. Printing does not depend on the active chapter.
- No telemetry, analytics, external assets, or requests during ordinary reading. Source links navigate to official external documentation when clicked.

Local progress is specific to this browser and file/origin. Moving or renaming the file, private browsing, browser policy, or clearing storage can reset it. If storage is unavailable, the guide remains usable and progress lasts for the current page session.

## Suggested team session

Allow approximately **60 minutes** for a facilitated session or **60–90 minutes** for a complete independent walkthrough including practice.

1. **5 minutes:** identify repeated corrections the team makes to Copilot.
2. **10 minutes:** explain the fundamentals, toolbox, and skill anatomy.
3. **5 minutes:** demonstrate Copilot setup and observable skill activation.
4. **15 minutes:** complete the release-notes workshop in pairs.
5. **10 minutes:** compare outcomes using the evaluation cases.
6. **10 minutes:** discuss permissions and choose one team workflow to pilot.
7. **5 minutes:** assign an owner, success measure, and review date.

For a shorter orientation, read chapters 1, 3, and 4. For a 30-minute practical session, combine chapters 6 and 7. The start page contains the facilitator outline.

Before presenting, run the workshop in the **organization’s approved Copilot client and harness**. Ensure the installed version and policy support skills. Use the fictional records; no production credentials or external write access are needed. If Copilot is unavailable, participants can inspect the skill and predict its output offline.

## The lab

The complete skill is embedded in chapter 6. Save it as:

```text
your-repository/
└── .github/
    └── skills/
        └── release-notes/
            └── SKILL.md
```

If you already created the shorter example from chapter 3, replace it with the complete workshop file. Do not combine the two headers. The lab is instruction-only and produces drafts; it does not publish, tag, deploy, or modify project files.

The authored example output and six evaluation cases are **expected behavior**, not measured Copilot results. Learners must verify activation and actual output in their own environment. No claim is made that the sample skill guarantees instruction following, safety, or consistent results on every model.

## Research and currency

Official documentation was reviewed on **29 October 2026**. The source library lives inside the HTML, and source links sit beside product-specific claims. Research includes the Agent Skills specification and creator guides, GitHub and VS Code documentation, Anthropic guidance, and OpenAI documentation.

Supporting notes:

- [`research/copilot.md`](research/copilot.md): support, paths, invocation, harnesses, settings, CLI commands, policy, and documentation conflicts.
- [`research/spec-and-practices.md`](research/spec-and-practices.md): the portable specification, authoring, evaluation, scripts, security, and portability.
- [`research/lab-design.md`](research/lab-design.md): original exercise design and additional quiz/test ideas; `index.html` contains the final classroom version.

These products change quickly. Recheck the [Copilot feature matrix](https://docs.github.com/en/copilot/reference/copilot-feature-matrix), [VS Code skill documentation](https://code.visualstudio.com/docs/agent-customization/agent-skills), and [Agent Skills specification](https://agentskills.io/specification) before updating or deploying the training. In particular, custom-location guidance in VS Code is internally inconsistent across harness sections; the guide recommends documented native directories and flags the uncertainty.

## Maintenance and verification

`index.html` is the source of truth and final distributable. Edit it directly; there is no generated build. Keep its CSS and JavaScript embedded so the one-file delivery promise remains true. Research notes are supporting evidence, not runtime dependencies.

- [`docs/design-notes.md`](docs/design-notes.md) records the design rationale and review protocol.
- [`docs/verification.md`](docs/verification.md) records tested behavior, visual review, and limitations.
- [`tests/guide.test.cjs`](tests/guide.test.cjs) runs browser-level checks with Playwright and **Brave explicitly selected**. It opens the actual `file://` deliverable, not a development server.

To run browser checks, use an existing Playwright installation or install it locally for development:

```powershell
npm install --no-save --package-lock=false playwright
node tests/guide.test.cjs
```

The script defaults to Brave’s standard Windows executable path. For another supported installation or an existing Playwright package, set:

```powershell
$env:BRAVE_EXECUTABLE = 'C:\path\to\brave.exe'
$env:PLAYWRIGHT_MODULE_PATH = 'C:\path\to\node_modules\playwright'
node tests/guide.test.cjs
```

The reader does **not** need Node or Playwright. Development screenshots, a print PDF, downloaded sample, and machine-readable test results are written to `.qa/`, which is excluded from Git. Review the actual layouts after substantive content changes, and rerun behavioral tests after changes to navigation or controls.

When refreshing facts, update the research date, inline citations, source library, and relevant research notes together. Keep hypothetical or authored outcomes labeled. Preserve the distinction between testing the HTML and evaluating the skill inside Copilot.
