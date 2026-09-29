# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: Confluence visible metadata migration
- Executed at: 2026-05-26 09:10:58 KST
- Operator: Codex
- Scope: Confluence space `63111172` (`AIAW`) pages whose storage body contained parseable visible `wiki.metadata` JSON blocks

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` (`63045651`) | Index-first navigation baseline |
| 135 CQL candidates | Search candidates containing `wiki.metadata` text |
| 15 actionable pages | Read storage body, parse visible metadata JSON, read/write `wiki.metadata` Content Property |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] MCP Tool 정의 및 명세` (`107708465`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Model Context Protocol (MCP) 개요 및 아키텍처` (`98173006`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Gemini CLI MCP 도구 설정 및 활용` (`106135563`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Codex CLI 작업 환경 완전 설정 가이드: Approval Mode부터 Vim 입력까지` (`107675736`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Subagent 프로토콜: 로컬 실행과 원격 실행` (`99090454`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] RAG: 외부 지식으로 LLM 성능 향상` (`99745941`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] AI 에이전트 루프: Observe → Think → Act → Reflect` (`99680384`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Codex Slash Commands` (`97157123`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Vibe Coding 워크플로우: Intent → Spec → Generate → Review → Iterate` (`99745908`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Codex Sandbox 설정` (`97419267`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Codex Approval Mode (승인 정책 설정)` (`97452033`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Gemini CLI GEMINI.md 컨텍스트 파일 활용` (`106037271`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Codex remote-control로 헤드리스 에이전트 배포하기` (`99090489`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] MCP 공식 서버 레지스트리: 바로 쓸 수 있는 서버 모음` (`107675650`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |
| `[Guide] Codex Vim 편집 모드 / Keymap 설정` (`97386523`) | Metadata migration | Moved visible body metadata to `wiki.metadata` property; removed body block |

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
| CQL search still returns `wiki.metadata` in some excerpts | Confluence search includes version messages/change comments, not only current body | Use storage-body verification for migration correctness |

## Validation Result

- Page validation: 15 pages updated; all verified with `visibleBlocksAfter=0`
- Index validation: Not applicable; no Index links changed
- Source validation: Confluence API only
- Safety validation: No secrets exposed; migration touched only visible body metadata blocks and `wiki.metadata` Content Property

## Notes

Initial dry-run found 15 actionable pages and 120 skipped candidates with no parseable body metadata. A second dry-run after applying found 0 actionable pages across 135 candidates. Search for typo `wiki.mestadata` returned 0 pages.
