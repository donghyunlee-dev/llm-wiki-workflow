# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: `wiki-update weekly`
- Executed at: `2026-05-06 Asia/Seoul`
- Operator: `Codex`
- Scope: Re-checked the active AI development setup guides, refreshed stale root/tool indexes, and recorded one Codex CLI manual-review item due to conflicting official authentication guidance.

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` | Root guide entry point and index quality audit |
| `[Guide] Tool Index` | Tool-based navigation audit |
| `[Guide] Codex Index` | Codex guide family overview |
| `[Guide] Claude Code Index` | Claude Code guide family overview |
| `[Guide] Gemini Index` | Gemini guide family overview |
| `[Guide] Codex CLI Setup` | Codex setup content verification against current official sources |
| `[Guide] Claude CLI Setup` | Claude setup content verification against current official sources |
| `[Guide] Gemini CLI Setup` | Gemini setup content verification against current official sources |
| `[Guide] AnythingLLM Local RAG Setup` | Local RAG guide verification against current official sources |
| `[Guide] Browser MCP Setup` | Confirmed canonical MCP entry for root/tool indexing |
| `[Guide] Desktop Control MCP Setup` | Confirmed canonical MCP entry for root/tool indexing |
| `[Guide] Getting Started` | Verified root navigation relationship and existing entry coverage |
| `[Guide] Node.js Setup` | Confirmed common prerequisite link target |
| `[Guide] npm Setup` | Confirmed common prerequisite link target |
| `[Guide] npx Setup` | Confirmed common prerequisite link target |
| `[Guide] pnpm Setup` | Confirmed common prerequisite link target |
| `[Ops] Knowledge Change Log` | Shared post-run log target |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] Index` | `INDEX_UPDATE_REQUIRED` | Rebuilt the root index into a searchable navigation map with canonical links, document types, use cases, and keywords. |
| `[Guide] Tool Index` | `INDEX_UPDATE_REQUIRED` | Expanded the tool index with direct entry points for Codex, Claude Code, Gemini, AnythingLLM, Browser MCP, and Desktop Control MCP. |
| `[Ops] Knowledge Change Log` | `MINOR_UPDATE` | Appended a factual weekly maintenance entry referencing this run report and the Codex manual-review note. |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | No new Confluence guide page was required for this weekly pass. |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| `[Guide] Index` | Added canonical entry links and metadata fields required by the indexing rules. |
| `[Guide] Tool Index` | Added searchable metadata and direct setup entry points for tool-centric navigation. |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| `https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started` | Official OpenAI help article | Codex CLI install, platform support, and approval mode verification |
| `https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan` | Official OpenAI help article | Codex access model and ChatGPT plan guidance |
| `https://help.openai.com/en/articles/11381614` | Official OpenAI help article | Codex CLI sign-in flow and authentication review |
| `https://docs.anthropic.com/en/docs/claude-code/getting-started` | Official Anthropic docs | Claude Code install, supported environments, and authentication verification |
| `https://docs.anthropic.com/en/docs/claude-code/settings` | Official Anthropic docs | Claude Code settings verification |
| `https://docs.anthropic.com/en/docs/claude-code/mcp` | Official Anthropic docs | Claude Code MCP workflow verification |
| `https://github.com/google-gemini/gemini-cli` | Official Gemini CLI repository | Gemini CLI overview and install verification |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/index.md` | Official Gemini CLI docs | Gemini authentication and startup flow verification |
| `https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md` | Official Gemini CLI docs | Gemini configuration verification |
| `https://docs.anythingllm.com/` | Official AnythingLLM docs | AnythingLLM current official documentation entry point verification |
| `https://github.com/Mintplex-Labs/anything-llm/blob/master/docker/HOW_TO_USE_DOCKER.md` | Official AnythingLLM repository docs | AnythingLLM Docker flow verification |
| `Confluence: [Guide] Index` | Primary source | Root index audit and refresh target |
| `Confluence: [Guide] Tool Index` | Primary source | Tool index audit and refresh target |
| `Confluence: [Guide] Codex CLI Setup` | Primary source | Codex guide comparison target |
| `Confluence: [Guide] Claude CLI Setup` | Primary source | Claude guide comparison target |
| `Confluence: [Guide] Gemini CLI Setup` | Primary source | Gemini guide comparison target |
| `Confluence: [Guide] AnythingLLM Local RAG Setup` | Primary source | AnythingLLM guide comparison target |
| `Confluence: [Ops] Knowledge Change Log` | Primary source | Post-run log target |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| `[Guide] Codex CLI Setup` | Current official OpenAI help sources disagree on whether the primary setup path is ChatGPT sign-in only or API-key-first plus optional sign-in flow. | Review the three OpenAI help articles together and decide which authentication path should be treated as canonical before re-editing the guide. |

## Validation Result

- Page validation: `PASS`
- Index validation: `PASS`
- Source validation: `PASS`
- Safety validation: `PASS`

## Notes

- Claude CLI, Gemini CLI, and AnythingLLM pages did not require safe automatic edits in this run.
- The index refresh corrected an obvious navigation regression in `[Guide] Index`, which had fallen back to placeholder content and no canonical links.
