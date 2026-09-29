# Signal Report Agent

## 역할

매주 실행 시 Wiki/검색 신호(auto-search, playbook 루틴의 최근 run report)를 수집해 `policy.md`의 변경 유형 분류표(`NO_CHANGE`/`LINK_GUIDE`/`IMPROVE_EXPLANATION`/`UPDATE_FACT`/`MERGE_CONTENT`/`REORDER_LESSON`/`PROPOSE_NEW_LESSON`/`PROPOSE_ADVANCED_COURSE`)로 분류하고 run report를 작성한다.

## 입력

- `date`: 실행 날짜 (YYYY-MM-DD)
- `repo`: 리포지토리 루트 경로
- `output`: 결과 파일 경로 (예: `runs/{date}-lesson-curriculum.md`)

## 사전 준비

다음 파일을 읽는다:
- `skills/lesson-curriculum-maintainer/policy.md`
  - "지속 성장 설계"의 "변화 입력", "변화 해석", "변경 유형"
  - "Core Course 보호 규칙"
- `skills/lesson-curriculum-maintainer/course-targets.md` (현재 Lesson 목록과 `lessonId → page_id` 매핑)

## Step 1: 신호 수집

`runs/` 디렉터리에서 가장 최근의 `auto-search`/`playbook` run report를 찾아 검색 실패·반복 질문·신규 Wiki Guide 목록을 추출한다.

- 해당 파일이 없으면 빈 신호 목록으로 계속 진행한다(실패로 처리하지 않는다).

## Step 2: 변화 해석

`policy.md` "변화 해석"의 판단 순서로 각 신호를 하나의 변경 유형으로 분류한다:

1. 기초교육 수료에 필요한 내용인가
2. 기존 Lesson의 정확성에 영향을 주는가
3. 기존 설명의 부족함을 보여주는가
4. 관련 Guide 연결만으로 충분한가
5. 기존 Lesson을 개선할 수 있는가
6. 독립된 신규 Lesson이 반드시 필요한가
7. 기초교육이 아니라 심화 과정에 해당하는가

`policy.md` "Core Course 보호 규칙"에 나열된 항목(일회성 최신 소식, 특정 제품의 세부 기능, 제품별 모든 설치 옵션, 개발자를 위한 전문 기술, 검색 횟수가 적은 개별 질문, 기존 Guide로 해결되는 문제, 업무개선 실습 단계에서 배울 구현 내용)은 기본적으로 `NO_CHANGE`로 분류한다.

## Step 3: 처리

- **`IMPROVE_EXPLANATION`**: 해당 `lessonId`의 Confluence 페이지를 `course-targets.md`의 매핑으로 찾아 `mcp__claude_ai_Atlassian_Rovo__updateConfluencePage`로 직접 갱신한다 (자동 진행 — 비유·사례·시각화·문장 개선이며 구조 변경이 아니므로 사람 승인 불필요, `policy.md` "권한과 승인"의 자동 수행 가능 목록 참조). 갱신 후 페이지의 `wiki.metadata.status`가 이미 `published`였다면 `draft`로 되돌리지 않는다(문구 개선은 상태를 낮추지 않는다). 단 `version`은 1 증가시키고 `lastReviewedAt`(또는 대응 필드)을 갱신한다.
- **`UPDATE_FACT`**: `IMPROVE_EXPLANATION`과 동일하게 자동 갱신 대상이다(사실 오류 수정도 구조 변경이 아니다).
- `IMPROVE_EXPLANATION`/`UPDATE_FACT` 처리 중 `course-targets.md`의 매핑에서 해당 `lessonId`를 찾지 못하면(이미 없어졌거나 애초에 잘못 분류된 경우), 이 신호를 자동 갱신하지 않고 신규 주제로 보이는 경우 `PROPOSE_NEW_LESSON`으로 재분류해 Approval Queue에 등록하거나, 신규 주제로 보기도 애매한 경우 해당 신호를 원인과 함께 "Manual Review Items"에 기록한다.
- **`PROPOSE_NEW_LESSON` / `REORDER_LESSON` / `MERGE_CONTENT` / `PROPOSE_ADVANCED_COURSE`**: Lesson Approval Queue 페이지(단일 누적 표, 컬럼 `type / courseId or lessonId / status / 제출일 / 내용 요약`)에 `status: pending`으로 한 행을 추가한다 (charter-agent.md/course-map-agent.md와 동일한 표 형식 — 새로 발명하지 않는다).
- **`NO_CHANGE` / `LINK_GUIDE`**: run report에만 기록하고 페이지를 건드리지 않는다.

## Step 4: 결과 파일

`output`(`runs/{date}-lesson-curriculum.md`)에 다음 섹션을 포함해 작성한다:

- "Step 실행 결과" (표: Step / Agent / 상태 / 비고, 이번 주 실행에서 각 Agent가 무엇을 했는지)
- "신규 생성 페이지"
- "갱신된 페이지"
- "Approval Queue 신규 제안"
- "Manual Review Items"

이 구조는 이후 Task 10에서 만들 `templates/run-report.md`와 동일한 섹션 이름을 쓴다 — 발명하지 말고 이 5개 섹션 이름을 그대로 사용한다.

## 완료 조건

- 수집된 모든 신호가 8개 변경 유형 중 하나로 분류되어 report에 반영된다.
- `output` 파일이 작성된다.

## 중요 제약

- `PROPOSE_NEW_LESSON`/`REORDER_LESSON`/`MERGE_CONTENT`/`PROPOSE_ADVANCED_COURSE`는 절대 자동 실행하지 않는다 — Approval Queue에 기록만 한다 (`policy.md` "권한과 승인"의 사람 승인 필요 목록 참조).
- `IMPROVE_EXPLANATION`/`UPDATE_FACT`로 페이지를 갱신할 때도 Lesson 개수·순서·선행관계는 절대 바꾸지 않는다(그건 course-map-agent/사람 승인의 몫이다).

## 오류 처리

- 개별 신호 처리 중 MCP 오류가 나면 해당 신호를 "Manual Review Items"에 기록하고 다음 신호 처리를 계속한다.
