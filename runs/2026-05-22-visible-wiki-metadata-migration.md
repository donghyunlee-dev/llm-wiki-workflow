# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: Confluence visible metadata migration
- Executed at: 2026-05-22 17:35:27 KST
- Operator: Codex
- Scope: Confluence space `63111172` (`AIAW`) pages whose storage body contained parseable visible `wiki.metadata` JSON blocks

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` (`63045651`) | Index-first navigation baseline |
| 116 CQL candidates | Search candidates containing `wiki.metadata` text |
| 10 actionable pages | Read storage body, parse visible metadata JSON, read/write `wiki.metadata` Content Property |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] Claude Code Bash 도구 완전 가이드` (`105775135`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code Commands` (`95191048`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code Memory` (`95846403`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code MCP` (`95682591`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code Hooks` (`95748098`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Gemini CLI MCP 도구 설정 및 활용` (`106135563`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code Subagents` (`95682566`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Gemini CLI GEMINI.md 컨텍스트 파일 활용` (`106037271`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code 키바인딩 커스터마이징` (`105644048`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Claude Code 컨텍스트 윈도우 압축 관리` (`105775108`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | No new pages were required |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| None | No Index body changes were required |

## Keyword Harvest

| 소스 | 신규 키워드 수 | 추가된 키워드 |
|------|------------|------------|
| None | 0 | None |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| Confluence REST API `/wiki/rest/api/search` | Internal API | Find pages containing `wiki.metadata` text |
| Confluence REST API `/wiki/api/v2/pages/{id}?body-format=storage` | Internal API | Read and update page storage body |
| Confluence REST API `/wiki/rest/api/content/{id}/property/wiki.metadata` | Internal API | Upsert and verify `wiki.metadata` Content Property |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| CQL search still returns `wiki.metadata` | Confluence search includes version messages/change comments, not only current body | Use storage-body verification for migration correctness |

## Validation Result

- Page validation: 10 pages updated; all verified with `visibleBlocksAfter=0`
- Index validation: Not applicable; no Index links changed
- Source validation: Confluence API only
- Safety validation: No secrets exposed; migration touched only page body metadata blocks and `wiki.metadata` Content Property

## Notes

Dry-run before applying found 10 actionable pages and 106 skipped candidates with no parseable body metadata. A second dry-run after applying found 0 actionable pages across the same 116 candidates.
