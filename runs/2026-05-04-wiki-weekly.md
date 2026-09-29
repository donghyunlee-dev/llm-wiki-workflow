# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: `wiki-update weekly`
- Executed at: `2026-05-04 Asia/Seoul`
- Operator: `Codex`
- Scope: Read the root guide index, compared active Claude/Gemini guides against current official sources, and updated the safe canonical pages and related index pages. No unrelated Confluence pages were modified.

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` | Root entry point for AI development guide navigation |
| `[Guide] Tool Index` | Tool-level navigation review |
| `[Guide] Claude Code Index` | Canonical Claude Code guide index review |
| `[Guide] Claude CLI Setup` | Recompile target for current Anthropic CLI guidance |
| `[Guide] Claude Code Jira MCP Setup` | MCP setup review |
| `[Guide] Claude Code Playwright MCP Setup` | MCP setup review and recompile target |
| `[Guide] Claude Code Agent Browser MCP Setup` | MCP setup review and recompile target |
| `[Guide] Claude Code Jira Skill Setup` | Related Claude Code guide reviewed for index consistency |
| `[Guide] Gemini Index` | Canonical Gemini guide index review |
| `[Guide] Gemini CLI Setup` | Recompile target for current Gemini CLI guidance |
| `[Guide] Node.js Setup` | Shared prerequisite reference for setup guides |
| `[Guide] npx Setup` | Shared prerequisite reference for setup guides |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] Claude CLI Setup` | `RECOMPILE_REQUIRED` | Recompiled against current Anthropic docs: install, login, settings, and update flow now match the current Claude Code guidance. |
| `[Guide] Claude Code Jira MCP Setup` | `SECTION_UPDATE` | Reworked MCP connection flow to use `claude mcp add` / `.mcp.json` instead of the older `~/.claude.json` assumption. |
| `[Guide] Claude Code Playwright MCP Setup` | `SECTION_UPDATE` | Reworked MCP connection flow to use current Claude Code MCP configuration patterns and clarified project-scoped setup. |
| `[Guide] Claude Code Agent Browser MCP Setup` | `SECTION_UPDATE` | Reworked MCP connection flow to use current Claude Code MCP configuration patterns and clarified timeout handling. |
| `[Guide] Gemini CLI Setup` | `RECOMPILE_REQUIRED` | Recompiled against current Gemini CLI docs: npx/npm install paths, authentication options, settings, MCP, and update flow. |
| `[Guide] Claude Code Index` | `INDEX_UPDATE_REQUIRED` | Refreshed last-updated dates and summaries for the Claude guides that changed. |
| `[Guide] Gemini Index` | `INDEX_UPDATE_REQUIRED` | Refreshed the Gemini index summary after the Gemini CLI recompile. |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | No new Confluence pages were required for the weekly run. |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| `[Guide] Claude Code Index` | Updated last-updated dates for the changed Claude guides. |
| `[Guide] Gemini Index` | Updated the Gemini guide summary to match the recompiled setup guide. |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| `https://docs.anthropic.com/en/docs/claude-code/getting-started` | Official Anthropic docs | Claude Code install, environment support, and update flow |
| `https://docs.anthropic.com/en/docs/claude-code/settings` | Official Anthropic docs | Claude Code settings file locations and configuration model |
| `https://docs.anthropic.com/en/docs/claude-code/mcp` | Official Anthropic docs | Current Claude Code MCP workflow, scopes, and `.mcp.json` usage |
| `https://github.com/google-gemini/gemini-cli` | Official Gemini CLI repository | Gemini CLI install, authentication, MCP, and update flow |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/index.md` | Official Gemini CLI docs | Gemini quickstart and authentication flow |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md` | Official Gemini CLI docs | Gemini settings file and MCP configuration model |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/cli-reference.md` | Official Gemini CLI docs | Gemini CLI commands and update command |
| `Confluence: [Guide] Claude Code Index` | Primary source | Claude navigation and last-updated metadata |
| `Confluence: [Guide] Gemini Index` | Primary source | Gemini navigation and last-updated metadata |
| `Confluence: [Guide] Claude CLI Setup` | Primary source | Existing Claude setup structure |
| `Confluence: [Guide] Claude Code Jira MCP Setup` | Primary source | Existing Jira MCP setup structure |
| `Confluence: [Guide] Claude Code Playwright MCP Setup` | Primary source | Existing Playwright MCP setup structure |
| `Confluence: [Guide] Claude Code Agent Browser MCP Setup` | Primary source | Existing Agent Browser MCP setup structure |
| `Confluence: [Guide] Gemini CLI Setup` | Primary source | Existing Gemini setup structure |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| None | No official-source conflicts were found for the pages updated in this run. | No manual review needed for this run. |

## Validation Result

- Page validation: `PASS`
- Index validation: `PASS`
- Source validation: `PASS`
- Safety validation: `PASS`

## Notes

- The weekly run focused on the active Claude Code and Gemini guide sets because their official docs had newer configuration and setup guidance than the current wiki pages.
- Codex pages were already brought up to date in the prior tool-specific run and did not need additional changes in this weekly pass.
