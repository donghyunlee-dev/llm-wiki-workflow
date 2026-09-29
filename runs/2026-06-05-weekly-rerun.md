# Wiki Maintainer Run Report

## Execution Summary

- Execution mode: weekly
- Executed at: 2026-06-05
- Operator: confluence-guide-maintainer (automated rerun)
- Scope: Root Guide Index (63045651), Tool Index (87851100), Codex Index (63995906), Claude Code Index (66846748), Gemini Index (88211525), Playbook Index (63799321), FAQ Index (63111558), Approval Queue (120520705), Prompt Caching guide (106791002)

## Pages Read

| Page | Purpose |
|---|---|
| [Guide] Index (63045651) | Root navigation re-read for weekly entry-point validation |
| [Guide] Tool Index (87851100) | Tool-level navigation re-read |
| [Guide] Codex Index (63995906) | Codex coverage check |
| [Guide] Claude Code Index (66846748) | Claude Code coverage and same-day weekly changes verification |
| [Guide] Gemini Index (88211525) | Gemini coverage check against current official announcements |
| [Playbook] Index (63799321) | Weekly playbook input verification |
| [FAQ] Index (63111558) | FAQ input verification |
| [Ops] Weekly Approval Queue (120520705) | Approved-row check before writer execution |
| [Ops] Knowledge Change Log (63111673) | Existing same-day weekly log verification |
| [Guide] Claude Code Commands (95191048) | Search troubleshooting update verification |
| [Guide] Claude Code Worktrees (95780877) | Same-day section update verification |
| [Guide] Claude API Prompt Caching: 비용 90% 절감 전략 (106791002) | Body validation and cleanup target |
| `tmp/playbook-analysis.json` | Latest structured playbook-analysis input |
| `skills/confluence-guide-maintainer/wiki-targets.md` | Local discovery keywords, index registry, and harvest log update |

## Pages Updated

| Page | Change Type | Summary |
|---|---|---|
| [Guide] Claude API Prompt Caching: 비용 90% 절감 전략 (106791002) | MINOR_UPDATE | Removed a malformed visible `</code>` artifact from the TypeScript hit-rate section without changing the guide's substance. |
| [Ops] Knowledge Change Log (63111673) | MINOR_UPDATE | Added a concise footer-comment rerun entry covering the Prompt Caching cleanup and the Gemini CLI transition manual-review carryover. |

## Pages Created

| Page | Parent | Reason |
|---|---|---|
| None | None | No new canonical page was safe to create in this rerun. |

## Index Pages Updated

| Index Page | Summary |
|---|---|
| None | Root, tool, Codex, Claude Code, Gemini, Playbook, and FAQ indexes were re-read; no navigation change was required. |

## Keyword Harvest

| 소스 | 신규 키워드 수 | 추가된 키워드 |
|------|------------|------------|
| Google Developers Blog | 1 | `Antigravity CLI migration` |
| OpenAI Blog | 0 | 신규 키워드 없음 — 2026-06-02 Codex product-surface update는 현재 CLI guide 범위를 바로 변경할 정도로 구체적이지 않음 |
| Anthropic Docs / News | 0 | 신규 키워드 없음 — same-day Claude Code / Prompt Caching updates already reflected |
| Gemini CLI Releases | 0 | 신규 키워드 없음 — release stream은 확인했지만 전환 공지 외 별도 weekly 대상 갭 없음 |

## Sources Used

| Source | Type | Used For |
|---|---|---|
| https://code.claude.com/docs/en/commands | Official docs | Claude Code Commands page verification |
| https://code.claude.com/docs/en/troubleshooting | Official docs | Search / `@file` troubleshooting verification |
| https://code.claude.com/docs/en/worktrees | Official docs | Claude Code Worktrees verification |
| https://platform.claude.com/docs/en/build-with-claude/prompt-caching | Official docs | Prompt Caching guide verification and cleanup validation |
| https://github.com/openai/codex/releases | OFFICIAL_GITHUB_RELEASE | Codex weekly source check |
| https://github.com/google-gemini/gemini-cli/releases | OFFICIAL_GITHUB_RELEASE | Gemini weekly source check |
| https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ | Official blog | Gemini CLI transition keyword harvest and manual-review decision |
| https://github.com/google-gemini/gemini-cli/discussions/27274 | Official repo announcement | Gemini CLI transition timeline and access-tier impact verification |
| https://github.com/modelcontextprotocol/servers | OFFICIAL_GITHUB | MCP weekly source check |

## Manual Review Required

| Item | Reason | Recommended Action |
|---|---|---|
| Gemini CLI → Antigravity CLI 전환 안내 | Google의 2026-05-19 공식 공지와 GitHub discussion에서 Gemini CLI의 사용자 티어별 서비스 전환 일정(2026-06-18)이 확인됨. 기존 Gemini guide surface는 설치/접근/도구명 전반의 구조 변경 가능성이 있어 자동 업데이트보다 수동 범위 결정이 안전함. | Gemini CLI / Antigravity CLI의 문서 전략을 사람이 먼저 결정한다. 최소한 Gemini Index와 Gemini CLI Setup에 전환 공지 또는 후속 가이드 신설 여부를 검토하고, access-tier 설명은 billing/auth 성격을 고려해 수동 승인 후 반영한다. |

## Validation Result

- Page validation: PASS — Prompt Caching guide exists, keeps `[Guide]` title, and no longer exposes the malformed raw tag in the body.
- Index validation: PASS — All weekly entry-point indexes were re-read; no orphan or missing-link issue requiring change was found in this rerun.
- Source validation: PASS — Current official Anthropic, OpenAI, Google, and MCP sources were rechecked before deciding no additional automatic guide/index rewrite.
- Safety validation: PASS — Product-access transition guidance for Gemini was held for manual review instead of being auto-written.

## Notes

- Approval Queue active rows: none. `approved` input was empty, so no queue-driven writer action ran.
- `skills/confluence-guide-maintainer/wiki-targets.md` was reviewed during this rerun, but no local tracking-file edit was kept in the final workspace state. The Gemini/Antigravity follow-up is captured in this run report and should be carried into the next weekly pass or a manual-review update.
- This rerun was recorded separately as `runs/2026-06-05-weekly-rerun.md` to preserve the earlier same-day `runs/2026-06-05-weekly.md` report.
