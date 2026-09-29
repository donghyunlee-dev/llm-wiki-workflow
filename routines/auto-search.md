# 루틴: SFOOD Wiki Auto Search

- **루틴 ID**: `trig_01H5zJmHSadkTVEwuk7WRESG`
- **관리 링크**: https://claude.ai/code/routines/trig_01H5zJmHSadkTVEwuk7WRESG
- **스케줄**: `0 0/3 * * *` (UTC 3시간마다 = KST 00·03·06·09·12·15·18·21시, 실제 발화는 정각 +2분 내외)
- **모델**: claude-haiku-4-5-20251001

## 목적

Claude Academy, ChatGPT Learn, Google AI Learn 등 공식 AI 교육 사이트의 실제 커리큘럼을 배우는 초보자 페르소나를 시뮬레이션해,
검색창에 실제로 입력할 법한 질문 5개를 자동으로 생성합니다.

질문 생성은 다음 세 목적을 동시에 가집니다:
- 최근 검색에서 **불충분** 판정을 받은 질문을 다른 각도에서 재탐색한다.
- 교육 사이트 커리큘럼 주제와 막힌 지점을 바탕으로 위키의 미개척 문서 공백을 드러낸다.
- 위키가 실제 초보자 학습 순서(교육 사이트 커리큘럼)를 빠짐없이 커버하는지 검증한다.

생성된 질문으로 Confluence Wiki를 검색하고, 결과를 Playbook 페이지에 적재합니다.
반복 실행으로 위키 커버리지의 공백을 지속적으로 파악하고 지식을 유기적으로 축적합니다.

## 실행 방식

### Remote 루틴 (자동 스케줄, 매시간)
Anthropic 클라우드에서 실행. Atlassian Rovo MCP를 통해 Confluence에 직접 접근.
- Step 0: `skills/confluence-guide-maintainer/wiki-targets.md`의 "교육 사이트 커리큘럼 커버리지 로그"를 읽는다.
- Step 1: 최근 auto-search 런 리포트에서 불충분 질문 추출
- Step 2: 3개 교육 사이트 커리큘럼 기반으로 질문 5개 생성 (사이트 배분 라운드로빈)
  - 사이트: Claude Academy(https://academy.claude.com/ko), ChatGPT Learn(https://learn.chatgpt.com/docs), Google AI Learn(https://ai.google/learn-ai-skills/)
  - 이번 실행의 5개 슬롯을 3개 사이트에 순환 배분한다(예: 2-2-1 → 다음 실행 1-2-2 → 다음 2-1-2 …). 직전 실행 리포트의 배분을 확인해 다음 순서로 회전시킨다.
  - 각 슬롯의 주제는 커버리지 로그에서 `PENDING` 항목을 우선 선택하고, `PENDING`이 없으면 `COVERED` 중 "최근 사용일"이 가장 오래된 항목을 선택한다.
  - Claude Academy는 JS 렌더링 SPA라 직접 fetch가 어려우므로 `site:academy.claude.com` 웹서치로 코스/레슨 제목을 발견한다. ChatGPT Learn과 Google AI Learn은 직접 fetch한다.
  - 새로 발견한 커리큘럼 주제는 커버리지 로그에 `PENDING`으로 추가한 뒤 그중 사용한 항목만 `COVERED`로 갱신(최근 사용일 포함).
  - 이 중 최대 2개는 최근 불충분 질문의 재탐색 버전으로 배정 가능 (사이트/슬롯 제한 없음).
- Step 2: Confluence 위키 페이지 검색 (MCP)
- Step 3: 결과를 Playbook 페이지에 직접 기록 (MCP)
- Step 4: `wiki-targets.md`의 커리큘럼 커버리지 로그 갱신 (사용한 주제 `COVERED` + 최근 사용일)
- Step 5: 런 리포트 → `runs/{TODAY}-auto-search-remote.md`
- Step 6: git add + commit + push (GitHub 동기화)

### 로컬 실행 (대시보드 수동 실행)
대시보드의 ▶ 실행 버튼 → `./wiki-update.sh auto-search` → `auto-search.mjs`
- SFOOD-LLM-WIKI 서비스(localhost:5173) 경유
- 출력:
  - `tmp/auto-search-questions.json`
  - `tmp/auto-search-results.json`
  - `runs/{TODAY}-auto-search.md`

## 질문 생성 원칙

- 질문은 **키워드 고정형**이 아니라 **교육 사이트 커리큘럼 기반 생성형**이어야 한다. 순수 상상으로 페르소나를 지어내지 않는다.
- **사이트 배분은 매 실행 회전한다 — 5개 슬롯을 3개 교육 사이트(Claude Academy / ChatGPT Learn / Google AI Learn)에 라운드로빈으로 나눈다.** 배분 비율 자체(2-2-1 등)는 실행마다 순서를 바꿔 장기적으로 사이트별 커리큘럼이 균등하게 커버되게 한다.
- 각 질문은 배분된 사이트의 실제 커리큘럼 주제(코스명·레슨 제목·섹션 제목)에서 페르소나·상황·막힌 지점을 도출한다. 페르소나는 그 커리큘럼 주제를 배우는 중일 법한 역할(입문자·기획자·학생·비개발자·CLI 미숙 주니어 등)로 설정하되, 매 실행 다양화한다.
- 먼저 커리큘럼 주제 → 사용자 역할, 현재 작업 목표, 사용 중인 도구/환경, 실제 막힌 증상, 검색 이유를 만든다.
- 질문 속 핵심 키워드(예: hook, skill, plugin, token, agent, 명령어 등)는 커리큘럼 주제와 상황에 맞게 AI가 스스로 도출한다.
- `설치 방법`, `차이점`, `무엇인가요` 같은 일반형 질문은 최대 1개만 허용한다.
- 제품 이름만 바꾼 유사 질문은 금지한다. 동일 커리큘럼 주제를 다시 쓰는 것도 금지한다 (커버리지 로그의 `COVERED` 항목 중 최근 사용일이 오래된 것만 재선택 허용).
- 최근 불충분 질문은 같은 주제를 더 구체적인 상황으로 재작성해 재탐색한다 (최대 2개, 사이트/슬롯 제한 없음).

## 질문 데이터 구조

질문은 단순 문자열이 아니라 아래 정보를 함께 보존하는 구조를 권장한다:

```json
{
  "question": "실제 검색 질문",
  "persona": "사용자 역할",
  "situation": "현재 작업 상황",
  "painPoint": "막힌 지점",
  "searchIntent": "왜 검색하는지",
  "inferredKeywords": ["상황에서 도출한 키워드1", "키워드2"],
  "sourceSite": "claude_academy | chatgpt_learn | google_ai_learn",
  "sourceTopic": "커리큘럼 코스/레슨 제목",
  "sourceUrl": "해당 레슨/섹션 URL 또는 site: 검색으로 발견한 페이지 URL",
  "isRetry": true,
  "originalQuestion": "이전 불충분 질문"
}
```

이 구조는 이후 `playbook -> weekly` 연결에서 어떤 문서 공백이 반복되는지 분석하는 데 사용한다.

## MCP 연결

| 커넥터 | 용도 |
|---|---|
| Atlassian Rovo | Confluence 페이지 검색·읽기·Playbook 기록 |

## Playbook 페이지

- **부모 페이지 ID**: `62750737`
- **일별 페이지 제목**: `Playbook - YYYY-MM-DD` (KST 기준)

## 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-08-25 | 질문 생성 방식을 청중 고정 분배(전문 3+학습자 2)에서 **교육 사이트 커리큘럼 기반 라운드로빈**(Claude Academy / ChatGPT Learn / Google AI Learn 3곳에 5슬롯 순환 배분)으로 전환. `wiki-targets.md`에 "교육 사이트"·"커리큘럼 커버리지 로그" 섹션 추가, 위키 범위 기준에 "AI 리터러시/프롬프팅 기초" 추가, 질문 구조에 `sourceSite`/`sourceTopic`/`sourceUrl` 필드 추가, Step 4(커버리지 로그 갱신) 추가 |
| 2026-06-09 | 청중 분배 도입 — 질문 5개를 전문 실무자 3개 + 초급/중급 바이브코딩 학습자 2개로 고정. Remote 루틴 프롬프트 및 `auto-search.mjs` 동기화 |
| 2026-06-05 | 스케줄 표기 정정 — 실제 등록값은 `0 0/3 * * *` (3시간마다). 대시보드 동기화 기준 통일 |
| 2026-06-05 | 질문 생성을 페르소나 기반 동적 키워드 방식으로 재설계, 불충분 질문 재탐색 규칙 추가 |
| 2026-06-05 | Step 5 추가 — git commit + push origin HEAD (CCR 환경 동기화 누락 수정) |
| 2026-06-02 | Remote 루틴 등록 (trig_01H5zJmHSadkTVEwuk7WRESG), 매시간 스케줄 |
| 2026-06-02 | 초기 루틴 생성 (로컬 실행 방식) |
