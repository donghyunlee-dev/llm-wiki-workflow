# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: Confluence read-only lookup
- Executed at: 2026-05-22 11:30:44 KST
- Operator: Codex
- Scope: Confluence space `63111172` (`AIAW`) pages with `Concept`, `Reference`, or `Refernce` in title

## Pages Read

| Page | Purpose |
|---|---|
| `[Guide] Index` (`63045651`) | Index-first navigation baseline |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| None | None | Read-only lookup; no Confluence pages were modified |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | Read-only lookup |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| None | Read-only lookup |

## Keyword Harvest

| 소스 | 신규 키워드 수 | 추가된 키워드 |
|------|------------|------------|
| None | 0 | None |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| Confluence REST API `/wiki/api/v2/pages/63045651` | Internal API | Confirm guide index page |
| Confluence REST API `/wiki/rest/api/search` | Internal API | Search current pages where title contains `Concept`, `Reference`, or `Refernce` |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| None | No write action or ambiguous maintenance decision | None |

## Validation Result

- Page validation: `Concept` query returned 7 pages; `Reference` query returned 3 pages; `Refernce` query returned 0 pages
- Index validation: Not applicable; no page/index updates
- Source validation: Confluence API only
- Safety validation: No secrets exposed; no Confluence writes performed

## Notes

The `Reference` result includes one page where `Reference` appears in parentheses rather than as a `[Reference]` title prefix.
