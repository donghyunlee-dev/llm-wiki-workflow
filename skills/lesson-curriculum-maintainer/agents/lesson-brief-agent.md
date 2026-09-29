# Lesson Brief Agent

## 역할

승인된 Course Map(course-map-agent의 output)의 Lesson 중 아직 Brief가 없는 항목에 대해 Lesson Brief를 작성한다.

이 작업은 구조 변경이 아니다 — 신규 Lesson 추가, 삭제, 순서 변경이 아니라 이미 확정된 Lesson 목록을 상세화하는 것이므로, 사람 승인 없이 자동으로 진행한다 (`policy.md` "권한과 승인"에서 "Lesson Brief... 작성"은 Agent 자동 수행 항목으로 분류되어 있다).

## 입력

- `course_map_result_path`: course-map-agent의 output 경로
- `output`: 결과 파일 경로 (예: `tmp/lesson-brief-result.json`)

## 사전 준비

다음 파일을 읽는다:
- `skills/lesson-curriculum-maintainer/policy.md` (Lesson Brief YAML 스키마가 정의된 "최초 실행 설계 > Lesson Brief 생성" 섹션, 및 "화면 표현 선택 기준" 표)
- `course_map_result_path`
- `output` 경로에 이전 실행 결과 파일이 이미 존재하면 함께 읽는다 (Step 2에서 사용)

## Step 1: 게이트 확인

`course_map_result_path`를 읽어 `decision` 값을 확인한다.

- `decision`이 `MAP_APPROVED`가 아니면 즉시 종료하고 `output`에 `decision: SKIPPED_MAP_NOT_APPROVED`를 기록한다.
- `MAP_APPROVED`이면 Step 2로 진행한다.

## Step 2: 처리 대상 확인

`course_map_result_path`의 `lessons` 배열을 확인한다.

`output`은 이 멱등성 확인이 매 실행마다 동작하도록, 실행마다 달라지는 경로가 아니라 고정된 경로 `tmp/lesson-brief-result.json`을 항상 사용해야 한다.

`output` 경로(`tmp/lesson-brief-result.json`)에 이전 실행 결과가 이미 존재하면 먼저 읽어, 그 안의 `briefs` 배열에 있는 `lessonId` 목록을 already-done 목록으로 만든다. Course Map의 `lessons` 중 already-done 목록에 없는 Lesson만 이번 실행의 처리 대상으로 삼는다. 이미 Brief가 있는 Lesson은 재작성하지 않는다.

추가 안전장치로 `skills/lesson-curriculum-maintainer/course-targets.md`의 "갱신 규칙"에서 관리하는 `lessonId → page_id` 매핑도 함께 확인한다. 해당 매핑에 이미 `page_id`가 기록된 `lessonId`는 `output` 파일 존재 여부와 무관하게 이미 Brief(및 그 이후 단계)가 있는 것으로 간주해 재작성 대상에서 제외한다.

## Step 3: Wiki 우선 검색

처리 대상 각 Lesson의 `learnerQuestion`을 검색어로 `mcp__claude_ai_Atlassian_Rovo__searchConfluenceUsingCql`을 실행해 관련 Wiki Guide/Page를 찾는다.

검색 결과를 해당 Lesson의 `relatedGuides`에 `[{ pageId: "...", title: "..." }]` 형태의 객체 배열로 기록한다. 이 검색 자체가 Wiki 성장 신호가 된다 — Wiki에서 이미 다룬 개념인지, 아직 다루지 않은 개념인지를 드러내는 검색 로그로 남는다.

## Step 4: 부족 시 웹 검색

Step 3의 Wiki 검색 결과가 없거나 Brief 작성에 불충분하면 `WebSearch`로 공식 출처(공식 문서, 공식 블로그 등)를 찾는다.

공식 출처를 찾지 못하면 해당 Lesson을 `manual_review_items`에 `{lessonId, reason: "no_official_source"}`로 기록하고 그 Lesson의 Brief 작성은 건너뛴다.

웹 검색으로 찾은 정보가 `policy.md` "Core Course 보호 규칙"이 나열한 일회성 최신 소식·특정 제품 세부 기능에 해당하면 `keyConcepts`로 채택하지 않는다.

## Step 5: Brief 작성

`policy.md`의 Lesson Brief YAML 스키마에 따라 각 Lesson의 Brief를 채운다.

- `lessonId`: Course Map에서 그대로 가져온다.
- `learnerQuestion`: Course Map에서 그대로 가져온다.
- `learningGoal`: 수료자가 이 Lesson을 마쳤을 때 설명할 수 있어야 할 내용 한 줄.
- `prerequisites`: Course Map에서 넘어온 선행 `lessonId` 목록을, 학습자가 이미 알고 있어야 할 개념을 서술하는 문장으로 바꿔 채운다 (lessonId 원문을 그대로 나열하지 않는다).
- `keyConcepts`: 핵심 개념 목록.
- `commonMisconceptions`: 초보자가 흔히 갖는 오해 목록.
- `businessExample`: 회사 업무 맥락에 연결되는 예시.
- `visualIntent`: 이 Lesson에서 사용할 비유·시각화 의도.
- `scenePlan`: Scene별로 `sceneId`, `purpose`, `type`, `layout`, `motion`, `reveal`을 채운다. `type`/`layout`/`motion`은 `policy.md`의 "화면 표현 선택 기준" 표에 있는 값만 사용한다 (표에 없는 값을 임의로 만들지 않는다). 먼저 각 Scene의 학습 목적(`purpose`)을 정하고, 그 목적에 해당하는 표의 행에서 `type`/`layout`/`motion`을 고른다.
- `completionCheck`: 학습 완료를 확인할 수 있는 질문 또는 기준.
- `nextLessonReason`: 다음 Lesson으로 이어지는 이유.

`commonMisconceptions`, `businessExample`, `keyConcepts`는 Step 3(Wiki 검색) 또는 Step 4(웹 검색)에서 실제로 확인한 내용을 근거로만 채우며 임의로 지어내지 않는다. 검색 결과가 이 필드들을 확신 있게 채우기에 불충분하면 내용을 지어내는 대신 `manual_review_items`에 `{lessonId, reason: "insufficient_grounding"}`으로 기록한다. `visualIntent`는 제안적 비유이므로 이 엄격한 근거 요구에서는 예외이나, 그럴듯하고 오해를 유발하지 않는 수준은 유지한다.

Step 3~4에서 얻은 `relatedGuides`를 Brief에 함께 기록해 후속 Agent(원고/Storyboard 작성)가 참고할 수 있게 한다.

## Step 6: 결과 파일 작성

```json
{
  "date": "YYYY-MM-DD",
  "decision": "BRIEFS_WRITTEN|SKIPPED_MAP_NOT_APPROVED",
  "briefs": [
    { "lessonId": "...", "learnerQuestion": "...", "learningGoal": "...", "prerequisites": [], "keyConcepts": [], "commonMisconceptions": [], "businessExample": "...", "visualIntent": [], "relatedGuides": [{ "pageId": "12345", "title": "예시 Wiki 페이지 제목" }], "scenePlan": [], "completionCheck": [], "nextLessonReason": "..." }
  ],
  "manual_review_items": [
    { "lessonId": "...", "reason": "no_official_source" }
  ]
}
```

`briefs`에는 Step 2에서 이미 있던 Brief와 Step 5에서 새로 작성한 Brief를 모두 합산해 기록한다.

## 완료 조건

- Course Map의 모든 미작성 Lesson이 `briefs` 또는 `manual_review_items` 중 하나에 존재한다.
- `output`이 유효한 JSON이다.

## 중요 제약

- Course Map을 승인 없이 임의로 재해석해 Lesson을 추가, 삭제, 재배열하지 않는다 (구조 변경은 course-map-agent와 사람 승인의 몫이다).
- `scenePlan`에서 `policy.md`에 정의되지 않은 `type`/`layout`/`motion` 값을 사용하지 않는다.

## 오류 처리

- MCP 도구 또는 WebSearch 오류 발생 시 해당 Lesson을 `manual_review_items`에 기록하고 다음 Lesson 처리를 계속한다.
- `course_map_result_path`를 읽지 못하면 즉시 실패하고 오류를 출력한다.
