# Lesson Curriculum Run Report — 2026-07-30

## Step 실행 결과

| Step | Agent | 상태 | 비고 |
|---|---|---|---|
| 0 Charter | charter-agent | 완료 | 최초 생성, 자동 승인 (`CHARTER_APPROVED`). Approval Queue에 `charter / ai-foundation / approved` 행 기록 |
| 1 Course Map | course-map-agent | 완료 | 최초 생성, 자동 승인 (`MAP_APPROVED`). 11 Chapter / 18 Lesson 설계. Approval Queue에 `course-map / ai-foundation / approved` 행 기록 |
| 2 Lesson Brief | lesson-brief-agent | 완료 | 18개 Lesson 전부 Brief 작성 (`BRIEFS_WRITTEN`), manual_review_items 0건 |
| 3 Storyboard | storyboard-writer-agent | 완료 | 18개 Lesson 페이지 생성 (`PAGES_CREATED`), Course Index 하위. 최초 실행 중 Confluence 페이지 status 관련 버그 발견·수정 (아래 참조) |
| 4 Self-check | self-check-agent | 완료 | 18개 전부 검증 (`SELF_CHECK_DONE`). 2건 콘텐츠 이슈 발견 후 수정, 18개 전부 `published` 전환 완료 |
| Weekly Signal | signal-report-agent | 완료 | 최근 auto-search/playbook run report가 2026-06-13로 오래됨 — Lesson 대상 신호 없음, `NO_CHANGE` |

## 신규 생성 페이지

Course Index("AI 기초교육 Index", 183304236) 하위에 18개 Lesson 페이지 생성, 전부 `wiki.metadata.status: published`:

| order | lessonId | page_id | title |
|---|---|---|---|
| 1 | ai-in-work-context | 183238731 | AI는 왜 지금 업무 현장에 빠르게 들어왔을까 |
| 2 | what-is-generative-ai | 183926825 | AI와 생성형 AI는 정확히 무엇일까 |
| 3 | how-ai-generates-answers | 183959594 | AI는 입력을 받아 어떻게 답을 만들어낼까 |
| 4 | ai-capabilities-and-limits | 184090718 | AI는 무엇을 잘하고 어디서 약할까 |
| 5 | ai-hallucination | 183992360 | AI는 왜 틀린 답을 사실처럼 말할까 |
| 6 | chat-model-agent-difference | 183861281 | Chat, Model, Agent는 서로 어떻게 다를까 |
| 7 | agent-and-tools | 183959615 | Agent는 Tool을 왜, 어떻게 사용할까 |
| 8 | prompt-and-instructions | 183992373 | 사람은 AI에게 업무 기준을 어떻게 전달할까 |
| 9 | token-usage-and-plan | 184090753 | 유료 등급과 토큰 사용량은 어떤 관계일까 |
| 10 | files-and-references | 183828541 | AI는 어떤 파일과 참고자료로 작업할까 |
| 11 | context-window-memory-session | 183926838 | Context Window, Memory, Session은 어떻게 다를까 |
| 12 | agent-planning-and-execution | 183599204 | Agent는 어떻게 계획을 세우고 실행할까 |
| 13 | agent-permissions-and-tool-use | 184090766 | Agent의 권한과 도구 사용은 어떻게 통제될까 |
| 14 | long-task-splitting-and-handoff | 183861295 | 긴 작업은 어떻게 나뉘고 다음 단계로 이어질까 |
| 15 | verifying-ai-output | 183075057 | AI의 결과는 왜 틀릴 수 있고 어떻게 검증할까 |
| 16 | security-and-human-responsibility | 184057883 | 결과의 보안과 책임은 누가, 어떻게 질까 |
| 17 | safe-collaboration-overview | 183337215 | 사람이 AI와 안전하게 일하는 전체 구조는 무엇일까 |
| 18 | next-steps-practice-preview | 183271465 | 이후 업무개선 개발 실습에서는 무엇을 하게 될까 |

Course Index의 `lesson.course` Content Property도 18개 lessonId 전부 반영해 갱신 (version 1→2).

## 갱신된 페이지

없음 (최초 실행이므로 기존 Lesson 개선 대상 없음).

## Approval Queue 신규 제안

없음 (Charter/Course Map은 최초 생성으로 자동 승인 처리됨 — Approval Queue에는 `approved` 상태로 기록만 됨, 사람 승인 대기 항목 없음).

## Manual Review Items

없음.

## 실행 중 발견 및 수정한 이슈 (참고)

1. **Confluence REST v2 API 버그 2건** — 단일 속성 GET이 key가 아닌 숫자 id를 요구함(400), 이미 존재하는 key에 POST 시 409 발생. `routines/lesson-curriculum-maintenance.md`의 curl 단계를 PUT 기반 upsert로 수정.
2. **Confluence 페이지 status 오용** — `createConfluencePage`의 `status: "draft"`가 정식 페이지가 아닌 에디터 임시저장본을 만든다는 것을 발견 (18개 중 17개가 영향받음). REST PUT(`version.number: 1`)으로 직접 복구하고, `storyboard-writer-agent.md`를 `status: "current"` 사용으로 수정해 재발 방지.
3. **콘텐츠 이슈 2건** — `prompt-and-instructions`, `verifying-ai-output` Lesson에서 "Vibe Coding" 용어가 course 마지막 Lesson에서야 정의되는데 그보다 먼저 정의 없이 사용됨. 두 Lesson 본문에 인라인 설명을 추가해 수정.
