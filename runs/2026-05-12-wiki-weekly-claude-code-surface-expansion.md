# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: `wiki-update weekly`
- Executed at: `2026-05-12`
- Operator: `Codex`
- Scope: Weekly Confluence maintenance pass focused on the Claude Code surface. Read the configured index pages, compared the live wiki against the current official Claude Code docs, created missing canonical guides for commands, skills, subagents, memory, hooks, and general MCP usage, and recompiled the Claude Code index so the new pages are directly reachable.

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` (`63045651`) | Root navigation entry point |
| `[Guide] Tool Index` (`87851100`) | Tool-level navigation and canonical links |
| `[Guide] Codex Index` (`63995906`) | Codex guide family navigation |
| `[Guide] Claude Code Index` (`66846748`) | Claude Code guide family navigation and index update target |
| `[Guide] Gemini Index` (`88211525`) | Gemini guide family navigation |
| `[Guide] OS Setup Index` (`90636291`) | Related setup coverage |
| `[Guide] Development Environment Index` (`90669057`) | Related setup coverage |
| `[Guide] MCP Setup Index` (`90406972`) | Related MCP coverage |
| `[Guide] AI Agent Workflow Index` (`89161779`) | Related workflow coverage |
| `[Guide] App Making Index` (`88834163`) | Related app-making coverage |
| `[Guide] Integration Index` (`88834211`) | Related integration coverage |
| `[Guide] Claude CLI Setup` (`88211499`) | Existing Claude setup reference |
| `[Guide] Claude Code Plugin Setup` (`94601252`) | Existing Claude extension reference |
| `[Guide] Claude Code Jira Skill Setup` (`66682913`) | Existing Claude extension reference |
| `[Ops] Knowledge Change Log` (`63111673`) | Post-run log target |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] Claude Code Index` (`66846748`) | `INDEX_UPDATE_REQUIRED` | Recompiled the Claude Code navigation map to include direct links for commands, skills, subagents, memory, hooks, and the new general MCP page. |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| `[Guide] Claude Code Commands` (`95191048`) | `[Guide] Claude Code Index` (`66846748`) | Official Claude Code docs now expose a command reference and bundled skills surface that was not yet represented by a canonical wiki page. |
| `[Guide] Claude Code Skills` (`95715350`) | `[Guide] Claude Code Index` (`66846748`) | Official Claude Code docs separate skill creation and management from command reference, so a canonical guide was needed. |
| `[Guide] Claude Code Subagents` (`95682566`) | `[Guide] Claude Code Index` (`66846748`) | Official Claude Code docs expose subagent configuration and forked subagents as a distinct workflow worth documenting separately. |
| `[Guide] Claude Code Memory` (`95846403`) | `[Guide] Claude Code Index` (`66846748`) | Official Claude Code docs describe persistent `CLAUDE.md` memory and auto memory as a separate topic from skills and commands. |
| `[Guide] Claude Code Hooks` (`95748098`) | `[Guide] Claude Code Index` (`66846748`) | Official Claude Code docs expose hook events, settings scopes, and enforcement behavior as a separate guide topic. |
| `[Guide] Claude Code MCP` (`95682591`) | `[Guide] Claude Code Index` (`66846748`) | Official Claude Code docs now present a general MCP connection model that should sit above the tool-specific MCP setup pages. |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| `[Guide] Claude Code Index` (`66846748`) | Added direct navigation entries for the six new Claude Code pages and refreshed the Claude Code navigation flow. |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| `https://code.claude.com/docs/en/commands` | Official Anthropic docs | Claude Code command reference and bundled skill surface |
| `https://code.claude.com/docs/en/slash-commands` | Official Anthropic docs | Claude Code skills creation and invocation details |
| `https://code.claude.com/docs/en/sub-agents` | Official Anthropic docs | Claude Code subagent configuration and forked subagent behavior |
| `https://code.claude.com/docs/en/memory` | Official Anthropic docs | Claude Code `CLAUDE.md`, `CLAUDE.local.md`, and auto memory |
| `https://code.claude.com/docs/en/hooks` | Official Anthropic docs | Claude Code hook events, settings scopes, and hook execution model |
| `https://code.claude.com/docs/en/mcp` | Official Anthropic docs | Claude Code MCP connection model and server setup patterns |
| `https://github.com/anthropics/claude-code/releases` | Official GitHub releases | Claude Code release scan during source comparison |
| `https://github.com/openai/codex/releases` | Official GitHub releases | Codex release scan during source comparison |
| `https://github.com/google-gemini/gemini-cli/releases` | Official GitHub releases | Gemini CLI release scan during source comparison |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| Existing Codex manual-review items | `Codex CLI Authentication Guidance` and `Codex Plugin Management` remain open from prior runs and were not changed in this pass. | Keep the existing manual review workflow open until the conflicting Codex guidance is resolved. |

## Validation Result

- Page validation: `PASS`
- Index validation: `PASS`
- Source validation: `PASS`
- Safety validation: `PASS`

## Notes

- `skills/confluence-guide-maintainer/wiki-targets.md` was updated with the new Claude Code pages and their source URLs.
- The Claude Code Index now points directly to the new canonical pages, so the pages are reachable from the navigation tree.
- The shared Ops log page was read, but I did not rewrite its long existing body in this turn.
