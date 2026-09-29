# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: targeted Confluence page check
- Executed at: 2026-06-04 KST
- Operator: Codex
- Scope: Verify whether the `related pages` section on Confluence page `95846431` is broken

## Pages Read

| Page | Purpose |
|---|---|
| `AGENTS.md` | Repository operating rules |
| `skills/confluence-guide-maintainer/SKILL.md` | Required wiki maintainer workflow |
| `skills/confluence-guide-maintainer/commands.md` | Confirm no write workflow was required |
| `skills/confluence-guide-maintainer/templates/run-report-template.md` | Report structure |
| `[Guide] Claude Code Checkpointing` (`95846431`) | Inspect page body in markdown and ADF |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| None | N/A | Read-only verification only |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | N/A | No page creation requested or required |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| None | N/A | Read-only verification only |

## Keyword Harvest

| 소스 | 신규 키워드 수 | 추가된 키워드 |
|------|------------|------------|
| N/A | 0 | Verification-only run |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| Confluence API (`getConfluencePage`) | Primary source | Inspect page content in markdown and ADF |
| Confluence API (`getAccessibleAtlassianResources`) | Primary source | Resolve `cloudId` |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| None | The issue is confirmed, not ambiguous | N/A |

## Validation Result

- Page validation: Passed. The `related pages` section contains malformed HTML/link markup in the stored content, so the links are broken.
- Index validation: Not applicable. No page or index updates were made.
- Source validation: Passed. The conclusion comes directly from the page body returned by Confluence API.
- Safety validation: Passed. No content changes were made.

## Notes

- The page body includes a `related pages` section written as raw HTML inside the content, and the `href` values are malformed. In the fetched content, each link target is polluted by text like `%22%3EClaude`, which indicates the anchor markup was stored incorrectly.
- No Confluence write action was taken.
