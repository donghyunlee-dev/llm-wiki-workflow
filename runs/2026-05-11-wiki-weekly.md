# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: `wiki-update weekly`
- Executed at: `2026-05-11 Asia/Seoul`
- Operator: `Codex`
- Scope: Re-checked the active Claude Code, Gemini, Browser MCP, Desktop Control MCP, and AnythingLLM guide set against current official sources. Updated the Claude CLI setup page, recorded one Codex CLI manual-review item, and appended the shared ops log.

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` | Root navigation and index coverage check |
| `[Guide] Tool Index` | Tool-based navigation check |
| `[Guide] OS Setup Index` | Related setup index coverage check |
| `[Guide] Development Environment Index` | Related setup index coverage check |
| `[Guide] MCP Setup Index` | Related setup index coverage check |
| `[Guide] AI Agent Workflow Index` | Related workflow index coverage check |
| `[Guide] App Making Index` | Related workflow index coverage check |
| `[Guide] Integration Index` | Related integration index coverage check |
| `[Guide] Codex Index` | Codex guide family overview |
| `[Guide] Claude Code Index` | Claude Code guide family overview |
| `[Guide] Gemini Index` | Gemini guide family overview |
| `[Guide] Codex CLI Setup` | Codex setup content verification against current official sources |
| `[Guide] Claude CLI Setup` | Claude setup content verification against current official sources |
| `[Guide] Gemini CLI Setup` | Gemini setup content verification against current official sources |
| `[Guide] Browser MCP Setup` | Browser MCP setup verification |
| `[Guide] Desktop Control MCP Setup` | Desktop Control MCP setup verification |
| `[Guide] AnythingLLM Local RAG Setup` | Local RAG setup verification |
| `[Ops] Knowledge Change Log` | Shared post-run log target |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] Claude CLI Setup` | `SECTION_UPDATE` | Refreshed the installation and update guidance to reflect the current Anthropic docs, including supported platforms, `claude doctor`, auto-update controls, and the installer migration note. |
| `[Ops] Knowledge Change Log` | `MINOR_UPDATE` | Appended a concise 2026-05-11 weekly maintenance entry referencing this run report and the Codex manual-review note. |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | No new Confluence guide page was required for this weekly pass. |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| None | The updated Claude page was already reachable from the existing guide indexes, so no index entry changes were required. |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| `https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started` | Official OpenAI help article | Codex CLI install and quick-start verification |
| `https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan` | Official OpenAI help article | Codex access model verification |
| `https://help.openai.com/en/articles/11381614` | Official OpenAI help article | Codex sign-in flow verification |
| `https://docs.anthropic.com/en/docs/claude-code/getting-started` | Official Anthropic docs | Claude Code install, supported environments, and update flow |
| `https://docs.anthropic.com/en/docs/claude-code/overview` | Official Anthropic docs | Claude Code overview and startup behavior |
| `https://docs.anthropic.com/en/docs/claude-code/settings` | Official Anthropic docs | Claude Code settings and update controls |
| `https://docs.anthropic.com/en/docs/claude-code/mcp` | Official Anthropic docs | Claude Code MCP guidance |
| `https://github.com/google-gemini/gemini-cli` | Official Gemini CLI repository | Gemini CLI overview verification |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/index.md` | Official Gemini CLI docs | Gemini install and authentication verification |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md` | Official Gemini CLI docs | Gemini configuration verification |
| `https://docs.anythingllm.com/` | Official AnythingLLM docs | AnythingLLM setup and current documentation entry point verification |
| `Confluence: [Guide] Index` | Primary source | Root index coverage check |
| `Confluence: [Guide] Tool Index` | Primary source | Tool index coverage check |
| `Confluence: [Guide] OS Setup Index` | Primary source | Related setup index coverage check |
| `Confluence: [Guide] Development Environment Index` | Primary source | Related setup index coverage check |
| `Confluence: [Guide] MCP Setup Index` | Primary source | Related MCP index coverage check |
| `Confluence: [Guide] AI Agent Workflow Index` | Primary source | Related workflow index coverage check |
| `Confluence: [Guide] App Making Index` | Primary source | Related workflow index coverage check |
| `Confluence: [Guide] Integration Index` | Primary source | Related integration index coverage check |
| `Confluence: [Guide] Codex Index` | Primary source | Codex navigation and page metadata |
| `Confluence: [Guide] Claude Code Index` | Primary source | Claude navigation and page metadata |
| `Confluence: [Guide] Gemini Index` | Primary source | Gemini navigation and page metadata |
| `Confluence: [Guide] Codex CLI Setup` | Primary source | Codex guide comparison target |
| `Confluence: [Guide] Claude CLI Setup` | Primary source | Claude guide comparison target |
| `Confluence: [Guide] Gemini CLI Setup` | Primary source | Gemini guide comparison target |
| `Confluence: [Guide] Browser MCP Setup` | Primary source | Browser MCP guide comparison target |
| `Confluence: [Guide] Desktop Control MCP Setup` | Primary source | Desktop Control MCP guide comparison target |
| `Confluence: [Guide] AnythingLLM Local RAG Setup` | Primary source | AnythingLLM guide comparison target |
| `Confluence: [Ops] Knowledge Change Log` | Primary source | Post-run log target |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| `[Guide] Codex CLI Setup` | Current official OpenAI help sources still present conflicting authentication guidance between API-key-first and ChatGPT sign-in flows. | Review the OpenAI help articles together and decide which authentication path should be the canonical wiki flow before re-editing the guide. |

## Validation Result

- Page validation: `PASS`
- Index validation: `PASS`
- Source validation: `PASS`
- Safety validation: `PASS`

## Notes

- The Claude CLI page was refreshed to reflect current Anthropic guidance and remains linked from the existing tool and guide indexes.
- The Codex CLI page was left unchanged pending manual review because the official source set is not internally consistent on authentication.
