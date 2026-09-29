# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: Targeted Confluence metadata and title normalization
- Executed at: 2026-05-22 11:40:27 KST
- Operator: Codex
- Scope: Confluence space `63111172` (`AIAW`) pages whose title prefix was `[Workflow]`, `[Concept & Workflow]`, `[Concept]`, or `[Reference]`

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` (`63045651`) | Index-first navigation baseline |
| Search results for `Workflow`, `Concept`, `Reference` | Identify candidate pages |
| 10 target pages | Read current title, body, version, parent, and `wiki.metadata` property |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| `[Guide] Claude Code로 Git 작업 자동화: 커밋, PR, 병합` (`99745875`) | Title/property normalization | `[Workflow]` prefix changed to `[Guide]`; `docType=guide` verified |
| `[Guide] RAG: 외부 지식으로 LLM 성능 향상` (`99745941`) | Title/property normalization | `[Concept & Workflow]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] AI 에이전트 루프: Observe → Think → Act → Reflect` (`99680384`) | Title/property normalization | `[Concept]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] Claude Code 권한 모델: Ask/Allow/Deny 전략` (`99680303`) | Title/property normalization | `[Concept]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] Codex의 Reasoning Effort: low/medium/high/xhigh 선택` (`99680336`) | Title/property normalization | `[Concept]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] Model Context Protocol (MCP) 개요 및 아키텍처` (`98173006`) | Title/property normalization | `[Concept]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] Subagent 프로토콜: 로컬 실행과 원격 실행` (`99090454`) | Title/property normalization | `[Concept]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] 프롬프트 엔지니어링 기초: 명확함, 구체성, 맥락` (`100040781`) | Title/property normalization | `[Concept]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] Claude Code Bash 도구 완전 가이드` (`105775135`) | Title/property normalization | `[Reference]` prefix changed to `[Guide]`; `docType=guide` set |
| `[Guide] Gemini CLI 슬래시 명령 완전 가이드` (`99057689`) | Title/property normalization | `[Reference]` prefix changed to `[Guide]`; `docType=guide` set |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | No new pages were required |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| `[Guide] Index` (`63045651`) | Updated old Concept/Concept & Workflow links to new `[Guide]` titles |
| `[Guide] Claude Code Index` (`66846748`) | Updated old Workflow/Concept/Reference links to new `[Guide]` titles |
| `[Guide] Codex Index` (`63995906`) | Updated old Concept link to new `[Guide]` title |
| `[Guide] Tool Index` (`87851100`) | Updated old Concept links to new `[Guide]` titles |
| `[Guide] Gemini Index` (`88211525`) | Updated old Reference link to new `[Guide]` title |

## Keyword Harvest

| 소스 | 신규 키워드 수 | 추가된 키워드 |
|------|------------|------------|
| None | 0 | None |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| Confluence REST API `/wiki/rest/api/search` | Internal API | Search candidate pages |
| Confluence REST API `/wiki/api/v2/pages/{id}` | Internal API | Read and update page titles and index bodies |
| Confluence REST API `/wiki/rest/api/content/{id}/property/wiki.metadata` | Internal API | Read, create, update, and verify `wiki.metadata.docType` |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| Search index freshness | CQL search may briefly return stale title matches after page title updates | Use direct page reads for immediate verification; wait for Confluence search indexing to catch up |

## Validation Result

- Page validation: Direct reads confirmed all 10 target pages now have `[Guide]` titles and page version `2`
- Index validation: 5 related Index pages updated with new title links
- Source validation: Confluence API only
- Safety validation: No secrets exposed; changes were limited to page titles, `wiki.metadata.docType`, and related Index links

## Notes

The first update attempt partially completed page `99745875`, then stopped because Confluence returned `&` in one title as `&amp;`. The script was corrected and rerun idempotently.
