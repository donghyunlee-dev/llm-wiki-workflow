# Lesson Course Targets

| 항목 | Page ID | 상태 |
|---|---|---|
| Lesson Root | 183271425 | 확정 (고정 Root, 제목 "Lesson") |
| AI 기초교육 Index (Course Index) | 183304236 | 확정 (Lesson Root 183271425 하위, docType: nav) |
| Lesson Approval Queue | 183074974 | 확정 (Ops Log 63111673 하위) |

## Course Manifest

`courseId: ai-foundation` — 최초 Course. charter-agent 승인 후 course-map-agent가 Chapter/Lesson 목록을 이 파일 하단에 추가한다.

### Chapter/Lesson 목록 (course-map-agent, 2026-07-30 최초 생성 — 자동 승인, page_id는 storyboard-writer-agent 2026-07-30 갱신)

| order | lessonId | chapter | page_id |
|---:|---|---|---|
| 1 | ai-in-work-context | AI 등장 배경 | 183238731 |
| 2 | what-is-generative-ai | AI의 작동 원리 | 183926825 |
| 3 | how-ai-generates-answers | AI의 작동 원리 | 183959594 |
| 4 | ai-capabilities-and-limits | AI의 능력과 한계 | 184090718 |
| 5 | ai-hallucination | AI의 능력과 한계 | 183992360 |
| 6 | chat-model-agent-difference | Chat에서 Agent로 | 183861281 |
| 7 | agent-and-tools | Chat에서 Agent로 | 183959615 |
| 8 | prompt-and-instructions | 업무 기준 전달 | 183992373 |
| 9 | token-usage-and-plan | 업무 기준 전달 | 184090753 |
| 10 | files-and-references | 정보와 자료 활용 | 183828541 |
| 11 | context-window-memory-session | 정보와 자료 활용 | 183926838 |
| 12 | agent-planning-and-execution | Agent의 실행 구조 | 183599204 |
| 13 | agent-permissions-and-tool-use | Agent의 실행 구조 | 184090766 |
| 14 | long-task-splitting-and-handoff | 긴 작업의 관리 | 183861295 |
| 15 | verifying-ai-output | 결과 검증과 신뢰 | 183075057 |
| 16 | security-and-human-responsibility | 결과 검증과 신뢰 | 184057883 |
| 17 | safe-collaboration-overview | 안전한 협업 구조 | 183337215 |
| 18 | next-steps-practice-preview | 다음 단계 | 183271465 |

## 갱신 규칙

- Course Index / Lesson Approval Queue 페이지 ID는 생성 즉시 이 파일에 기록한다.
- Lesson 페이지가 생성될 때마다 `lessonId → page_id` 매핑을 추가한다 (course-map-agent, storyboard-writer-agent가 갱신).
