# GitHub Copilot and VS Code research

Verified against the official pages below on **October 29, 2026**. These are research notes for the training, not a promise that every company-managed installation has every feature. The current VS Code skills and customization pages are dated October 28, 2026. Do not copy older advice that says skills are VS Code Insiders-only or unavailable in Visual Studio.

## Supported surfaces and storage

[GitHub: Agent skills](https://docs.github.com/en/copilot/concepts/customizations/agent-skills)

- Current support includes Copilot app, Copilot CLI, Copilot cloud agent, Copilot code review, and agent mode in VS Code, Visual Studio, and JetBrains. IDE versions matter.
- Project locations: `.github/skills`, `.claude/skills`, `.agents/skills`. Personal locations: `~/.copilot/skills`, `~/.agents/skills`. Recommend `.github/skills/<name>/SKILL.md` for this Copilot-first team and `~/.copilot/skills/<name>/SKILL.md` for personal work. Use the location documented for the actual runtime.
- A personal skill on a laptop is not automatically in a cloud session. Cloud sandbox sessions can receive `.copilot/skills` through a dotfiles repository; this does not cover GitHub Actions-based sessions.
- Copilot CLI availability is subject to the organization's CLI policy. Cloud agent requires an eligible paid plan and repository configuration.

[GitHub: feature matrix](https://docs.github.com/en/copilot/reference/copilot-feature-matrix)

- The retrieved matrix marks VS Code skills supported from 1.108.0; Visual Studio 18.6.0 supported, 17.14.0 unsupported; JetBrains Copilot extension 1.5.64–1.5.66 preview; Eclipse, Xcode, and NeoVim do not show skills support.
- Teach “check your current client/extension version,” rather than hard-code this snapshot as permanent minimums for every optional feature.

## VS Code invocation, format and extensions

[VS Code: Agent Skills](https://code.visualstudio.com/docs/agent-customization/agent-skills)

- Metadata is discovered first; the body loads on selection; referenced resources load as needed. Availability does not guarantee automatic selection.
- Required: `name` (lowercase letters/digits/hyphens, maximum 64 characters, matches directory), `description` (what + when, maximum 1,024 characters).
- VS Code options: `argument-hint` supplies input guidance; `user-invocable: false` hides the slash command; `disable-model-invocation: true` prevents automatic selection. Defaults allow both. Setting both disables both entry routes.
- `context: fork` is experimental: execute in a subagent, return its result. It is not a portable baseline requirement.
- Plugin commands receive the plugin namespace automatically, such as `/plugin:skill`; do not put `/`, `:`, or namespace prefixes in `name`.
- Invoke an available skill through `/skill-name` plus the task. `/skills` and `/create-skill` convenience commands are specifically documented for the **Local** harness. Other harnesses use Open Customizations or a plain-language creation request.
- Relative Markdown links with `/` separators are a portable reference style. VS Code additionally supports `#file:`.

## Settings and policy

[VS Code: AI settings reference](https://code.visualstudio.com/docs/agents/reference/ai-settings)

- `chat.useAgentSkills` defaults to `true`. Do not tell everyone to enable an experimental skills toggle first.
- `github.copilot.chat.skillTool.enabled` defaults to `false`, is experimental, and is required for `context: fork`.
- The settings reference says `chat.agentSkillsLocations` is supported but native folders are preferable: editor-only paths do not automatically travel to CLI/app.
- `chat.customizations.marketplace.enabled` defaults to `true`; the marketplace is preview. Organization policy can turn the preview marketplace and connectors off.
- `chat.plugins.enabled` defaults to `false`. Plugin policy can centrally allow or block packages and marketplaces.
- Managed Copilot settings can disable the separate Claude and Codex harnesses. A user setting does not override enterprise policy.

**Documentation discrepancy:** the skills page's early note and current settings reference say `chat.agentSkillsLocations` is supported/not deprecated and forwarded to Agent Host. A later “Local” subsection of that same skills page says deprecated/not read by Copilot. The training should acknowledge client variance and recommend native folders, without claiming one universal custom-location behavior.

## Recommended beginner walkthrough

[VS Code: Customize agents for your workflow](https://code.visualstudio.com/docs/agent-customization/overview)

1. Use a current company-approved VS Code/Copilot installation and sign in. Select the intended agent harness in Chat; a harness is the runtime, not the chosen language model.
2. Open the repository root. Run **Chat: Open Customizations** from the Command Palette, then choose **Skills**, **New Skill**, and **Workspace**. Manual file creation is also valid.
3. Save a small, project-specific skill, review its generated instructions, and include only necessary resources.
4. Start a fresh chat using the same harness and repository. Confirm discovery; run a representative task. Inspect tool activity and References where available.
5. Test automatic selection separately from explicit invocation, then compare the result with a baseline.

Troubleshoot in order: selected harness, supported location, exact filename/frontmatter, matching activation, disabled/duplicate skill, stale session, required tools/dependencies, organization policy. User customizations must exist on the machine where the agent actually runs; they are not automatically synchronized through VS Code profiles.

## Copilot CLI: distinct from GitHub CLI

[GitHub: skills in Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)

Inside interactive **Copilot CLI**:

```text
/skills list
/skills info release-notes
/skills reload
Use /release-notes to draft notes for the supplied changes.
```

`/skills` also offers enable/disable management. `/skills add` registers an alternate skill location. Plugin-owned skills are managed through their plugin. Outside the interactive session, `copilot skill list`, `copilot skill add <FILE | URL | DIRECTORY>`, and `copilot skill enable/disable <name>` provide management commands.

This CLI documentation explicitly describes `allowed-tools` as tool preapproval. Treat it as a host-sensitive permission setting, not universally portable enforcement. It warns that preapproving `shell` or `bash` removes terminal confirmation. Do not put blanket shell preapproval into a beginner template. Review scripts and use the environment's actual permissions.

## Finding, installing, updating and publishing

[GitHub: adding agent skills](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills)

**GitHub CLI** `gh skill` is public preview and requires `gh` 2.90.0 or later. It is a package discovery/management workflow, separate from the interactive Copilot agent. Copying a reviewed directory remains a valid option.

```text
gh skill search TOPIC
gh skill preview OWNER/REPOSITORY SKILL
gh skill install OWNER/REPOSITORY SKILL
gh skill update
gh skill publish --dry-run
```

Inspect all scripts/resources in addition to the preview. GitHub does not verify the safety of listed skills. Keep provenance and review updates. `gh skill` records source/ref/tree SHA metadata. For reproducibility, pin a reviewed version or commit using supported installation options. Do not present a made-up release tag as a real working example.

For code review, GitHub recommends a review-focused skill directory name such as `code-review`; relevant existing skills can also be selected. A locally installed skill is not proof of cloud availability.

## Choosing the smallest useful customization

[GitHub: comparing customizations](https://docs.github.com/en/copilot/concepts/customizations/comparing-customizations)

| Need | Mechanism |
|---|---|
| Persistent repository conventions | Custom instructions |
| Reusable task procedure with optional resources | Skill |
| Read files, edit, execute commands | Existing tools |
| Access an external API/system | MCP server |
| Run code at a lifecycle event | Hook |
| Delegate a bounded task in separate context | Subagent |
| Reusable specialist role/tool configuration | Custom agent |
| Session-aware coded capability in Copilot CLI | Extension |
| Distribute related capabilities together | Plugin |

Skills supply procedural guidance; they do not create a missing tool or install a service. A custom agent does not inherently mean a subagent: separate context comes from delegated execution. Instructions and skill text guide the model but do not guarantee compliance. Hooks execute runtime code at supported events; permission and security controls still matter.

[VS Code: customization concepts](https://code.visualstudio.com/docs/agents/concepts/customization)

Prompt files are saved tasks invoked manually; current VS Code docs place them in **Local harness** sessions. Use skills for reusable workflows across other skills-compatible harnesses. Changing the selected LLM does not change which customization formats the harness supports. Skills, instructions, agents, tools and hooks can compose; choose the smallest change that remedies an observed failure.

## Concrete file distinctions

[VS Code: custom instructions](https://code.visualstudio.com/docs/agent-customization/custom-instructions)

- `.github/copilot-instructions.md`: project-wide conventions and commands.
- `.github/instructions/<topic>.instructions.md`: targeted guidance; `applyTo` matches file globs and `description` can support task-based loading.
- `AGENTS.md`: shared cross-agent project guidance where supported; not exclusive to Codex.
- `.github/skills/<name>/SKILL.md`: a reusable capability.
- Custom instructions are not used for inline completion suggestions as you type.

[GitHub: customization cheat sheet](https://docs.github.com/en/copilot/reference/customization-cheat-sheet)

- `.github/prompts/*.prompt.md`: reusable prompt files, with client support differences.
- `.github/agents/AGENT-NAME.md`: repository custom-agent profiles.
- `.github/hooks/*.json`: hook configurations.
- MCP configuration location depends on the surface; do not teach `.vscode/mcp.json` as universal.

[VS Code: custom agents](https://code.visualstudio.com/docs/agent-customization/custom-agents)

VS Code supports both `.agent.md` and `.md` profiles under `.github/agents` and `~/.copilot/agents`; its creation flow uses `.agent.md`. The `target` property influences editing guidance, not the active session's harness. Handoffs in the Local harness switch the active agent; subagents do delegated work without switching it.

## Plugins and sharing

[VS Code: Agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins)

Plugins can bundle skills, agents, MCP servers, hooks and other supported components. Installation does not prove activation or working connections. Verify the exact harness and resources after installation. Policy-managed plugins may have locked controls. A marketplace entry is a distribution source, not a security endorsement. A full commit SHA can make marketplace installation reproducible; moving branches/tags are weaker provenance. A single skill is a simpler start when no bundle is needed.

## Suggested original lab design

Use a read-only `release-notes` skill against a tiny supplied change list. Give the model a template with user impact, fixes, breaking changes, and evidence. Make it preserve uncertainty, omit unsupported claims, and output a draft. This avoids making a beginner's first demonstration depend on credentials, shell scripts, MCP or a real production system.

Compare three requests: explicit invocation, naturally matching wording, and an unrelated request that should not activate the skill. Add a fourth test with an ambiguous breaking change. The lab should teach discovery, execution quality and restraint separately. The guide can offer optional script-backed and MCP-backed examples later, clearly labeling their prerequisites.
