# 교육 사이트 기반 페르소나 질문 생성 — 설계

## 배경

`routines/auto-search.md`는 매 3시간마다 5개의 시뮬레이션 페르소나 질문을 생성해 Confluence Wiki를 검색하고, 결과를 Playbook 페이지에 적재한다. 현재는 "전문 실무자 3개 + 초급/중급 학습자 2개"로 청중을 고정 배분하며, 질문은 AI가 자유롭게 상상한 상황에서 나온다.

위키의 독자가 대부분 초보자이므로, 질문을 실제 공식 AI 교육 사이트의 커리큘럼에 기반해 생성하면 (1) 위키가 실제로 초보자가 배우는 순서와 용어를 커버하는지 검증할 수 있고, (2) 같은 질문이 반복 생성되는 것을 커리큘럼 커버리지 로그로 방지할 수 있다.

## 대상 교육 사이트

| 사이트 | URL | 접근 방식 |
|---|---|---|
| Claude Academy | https://academy.claude.com/ko | JS 렌더링 SPA — 직접 fetch 불가. `site:academy.claude.com` 웹서치로 코스/레슨 제목을 발견한다. |
| ChatGPT Learn | https://learn.chatgpt.com/docs | 직접 fetch 가능 |
| Google AI Learn (Gemini 대체) | https://ai.google/learn-ai-skills/ | 직접 fetch 가능. Gemini 전용 공식 교육 사이트가 없어 가장 가까운 Google AI 공식 학습 허브로 대체한다. |

## 변경 사항

### 1. `skills/confluence-guide-maintainer/wiki-targets.md`

- 신규 섹션 "교육 사이트 (Education Sites)" 추가: 위 3개 사이트 표.
- 신규 섹션 "교육 사이트 커리큘럼 커버리지 로그" 추가: `주제 | 사이트 | 레슨/섹션 URL | 상태(PENDING/SEARCHED/COVERED) | 매핑된 위키 페이지 ID | 최근 사용일`. Discovery Keywords와 동일한 상태 관리 패턴(PENDING → 처리 후 COVERED, 재사용 시 최근 사용일 갱신).
- **범위 기준(Scope Intent)** 포함 목록에 "AI 리터러시/프롬프팅 기초 (교육 사이트 커리큘럼 기반)" 카테고리 추가 — 위키 스코프를 CLI 도구 중심에서 일반 AI 리터러시 기초까지 확장.

### 2. `routines/auto-search.md`

- "청중 분배 고정 — 전문 실무자 3 + 학습자 2" 규칙 제거.
- 신규 규칙: 질문 5개는 3개 교육 사이트에 라운드로빈 배분(예: 이번 실행 2-2-1, 다음 실행 1-2-2 등 회전)해, 장기적으로 사이트별 커리큘럼을 균등하게 커버한다.
- 각 질문은 배분된 사이트의 실제 커리큘럼 주제(코스/레슨 제목)에서 페르소나·상황·막힌 지점을 도출한다. 순수 상상 질문 생성은 더 이상 기본 방식이 아니다.
- 주제 선택 순서: 커버리지 로그에서 `PENDING` 항목 우선 → 없으면 `COVERED` 중 최근 사용일이 가장 오래된 항목.
- 질문 JSON 구조에 `sourceSite`, `sourceTopic`, `sourceUrl` 필드 추가.
- 재탐색(재시도) 규칙 유지: 최근 불충분 판정 주제 중 최대 2개까지 재탐색 허용(사이트/슬롯 제한 없음).
- 사용한 주제는 실행 후 `wiki-targets.md` 커버리지 로그에 상태/최근 사용일을 갱신(Step 3 이후, 커밋 전 단계로 추가).
- 변경 이력 표에 2026-08-25 항목 추가.

### 3. `skills/confluence-guide-maintainer/workflow.md`

- Keyword Harvest 단계의 "1. 소스 스캔"에서 참조하는 `wiki-targets.md`의 소스 목록에 교육 사이트 3곳이 포함됨을 한 줄로 명시(운영 도구 키워드와 별개로 "AI 리터러시 커리큘럼 주제"도 Discovery Keywords에 유입될 수 있음을 안내).

### 4. 순환 구조 (변경 없음, 재확인)

`auto-search`(질문 생성·검색·Playbook 적재) → `playbook-maintenance`(부족 판정 분류: FAQ 후보/Guide 후보/수동검토) → `weekly-maintenance`(Guide/Page 생성, Index 갱신)로 이어지는 기존 파이프라인을 그대로 재사용한다. 이번 변경은 입력(질문 생성 근거)만 교육 사이트 커리큘럼으로 바꾸는 것이며, 실패 시 문서화하는 순환 구조 자체는 이미 구현되어 있다.

## 영향받는 파일

- `skills/confluence-guide-maintainer/wiki-targets.md`
- `routines/auto-search.md`
- `skills/confluence-guide-maintainer/workflow.md`

## 범위 밖

- Confluence 페이지 실제 생성/수정 (원격 클라우드 루틴 실행 시 자동으로 이루어짐)
- 교육 사이트 커리큘럼 전체를 한 번에 크롤링하는 것 (매 실행마다 일부씩 점진적으로 커버)
