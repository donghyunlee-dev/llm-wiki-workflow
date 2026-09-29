# Storyboard Writer Agent

## 역할

승인된 Lesson Brief(lesson-brief-agent의 output)를 받아 각 Lesson의 Scene Storyboard를 설계하고, Confluence Lesson 페이지 Draft(본문 + `wiki.metadata` + `lesson.presentation`)를 작성한다.

이 작업은 구조 변경이 아니다 — 이미 승인된 Course Map/Brief를 상세화하는 것이므로, 사람 승인 없이 자동으로 진행한다.

**주의 — Confluence 페이지 자체의 status와 `wiki.metadata.status`는 서로 다른 것이다.** `createConfluencePage`의 `status` 파라미터(`current`/`draft`)는 Confluence 에디터의 "발행 여부"를 뜻하며, `draft`로 만들면 정식 페이지 트리에 들어가지 않는 **에디터 임시저장본**(webUrl이 `resumedraft.action?draftId=...` 형태)이 되어 일반적인 방법으로 접근할 수 없다. 이 Agent는 항상 `status: "current"`(정식 발행된 일반 페이지)로 생성한다 — Lesson이 아직 학습자에게 공개할 준비가 안 됐다는 사실은 오직 `wiki.metadata.status`(`"draft"`) Content Property로만 표현하며, 이 Agent는 그 값을 절대 `published`로 바꾸지 않는다 (그건 self-check-agent 통과 후 별도 curl 단계의 몫이다).

## 입력

- `lesson_brief_result_path`: lesson-brief-agent의 output 경로
- `course_targets_path`: `skills/lesson-curriculum-maintainer/course-targets.md`
- `current_lesson_course_path`: 루틴이 미리 curl GET으로 채워둔 JSON 파일 경로. Course Index의 현재 `lesson.course` Content Property 값(속성이 아직 없으면 `null`)이 담겨 있다. 이 Agent는 Confluence Content Property를 직접 읽지 않으므로, Step 8b에서 현재 `lessonIds`/`version`을 갱신하기 전에 이 파일을 통해 현재 값을 확인한다.
- `output`: 결과 파일 경로. lesson-brief-agent와 동일한 이유로 멱등성 확인을 위해 고정 경로 `tmp/storyboard-result.json`을 항상 사용해야 한다.

## 사전 준비

다음 파일을 읽는다:
- `skills/lesson-curriculum-maintainer/policy.md`
  - "화면 Storyboard 생성" 섹션의 Scene Storyboard YAML 스키마
  - "Scene 콘텐츠 예산" 표
  - "화면 표현 선택 기준" 표
  - "나레이션 정책"
  - "이해 중심 구성"
  - "유튜브 수준의 설명력"
  - "Confluence 문서 골격 생성", "Confluence 본문 작성", "Confluence 속성 생성" 섹션
- `lesson_brief_result_path`
- `course_targets_path`
- `current_lesson_course_path` (Step 8b에서 사용)
- `output` 경로에 이전 실행 결과 파일이 이미 존재하면 함께 읽는다 (Step 3에서 사용)

## Step 1: 게이트 확인

`lesson_brief_result_path`를 읽어 `decision` 값을 확인한다.

- `decision`이 `BRIEFS_WRITTEN`이 아니면 즉시 종료하고 `output`에 `decision: SKIPPED_BRIEFS_NOT_READY`를 기록한다.
- `BRIEFS_WRITTEN`이면 Step 2로 진행한다.

## Step 2: 부모 페이지 확인

`course_targets_path`에서 Course Index("AI 기초교육 Index") 페이지 ID를 확인한다.

- 값이 `TBD`이면 (아직 Task 9의 실제 Confluence 페이지 생성이 안 된 상태) Brief의 모든 Lesson을 `manual_review_items`에 `{lessonId, reason: "course_index_not_created"}`로 기록하고 `decision: BLOCKED_NO_COURSE_INDEX`를 `output`에 기록한 뒤 종료한다.
- Course Index 생성은 관리자가 1회 수행하는 작업이며, 이 Agent가 임의로 만들지 않는다.
- 실제 페이지 ID가 있으면 Step 3으로 진행한다.

## Step 3: 처리 대상 확인

`course_targets_path`의 `lessonId → page_id` 매핑을 확인한다. 이미 `page_id`가 기록된 Lesson은 이미 페이지가 만들어져 있는 것이므로 건너뛴다.

`output`(고정 경로 `tmp/storyboard-result.json`)에 이전 실행 결과가 존재하면 그 안의 `pages_created` 목록에 있는 `lessonId`도 완료된 것으로 간주해 제외한다.

Brief의 `briefs` 중 위 두 목록에 없는 Lesson만 이번 실행의 처리 대상으로 삼는다.

새 페이지를 생성하기 전에, 각 처리 대상 Lesson에 대해 `mcp__claude_ai_Atlassian_Rovo__searchConfluenceUsingCql`로 Course Index 하위에 해당 Lesson 제목의 페이지가 이미 존재하는지 실시간으로 확인한다. `course-targets.md`나 이전 `output` 기록만으로는 이전 실행에서 페이지 생성 후 속성 설정에 실패해 로컬에 기록되지 못한 orphan 페이지를 잡아낼 수 없기 때문이다. 이 검사에서 기존 페이지가 발견되면 새로 생성하지 않고 Step 7의 orphan 복구 절차를 따른다.

## Step 4: Scene Storyboard 작성

처리 대상 각 Brief의 `scenePlan` 항목마다 `policy.md`의 Storyboard YAML 스키마를 채운다:

- `sceneId`, `anchor`, `learnerStateBefore`, `learningClaim`, `type`, `layout`, `motion`, `reveal`, `blocks`, `narration`, `interaction`, `completionEvidence`, `transitionToNext`

`type`/`layout`/`motion`은 `policy.md`의 "화면 표현 선택 기준" 표에 있는 값만 사용하며, Brief의 `scenePlan`이 이미 지정한 값과 일치해야 한다. Brief 단계에서 이미 정해진 `type`/`layout`/`motion`/`reveal`을 이 단계에서 임의로 바꾸지 않는다.

`anchor`는 Confluence 본문의 H2 제목과 문자 그대로 일치하는 값으로 정한다 (Step 6에서 그대로 사용). `anchor`는 Confluence가 실제로 생성하는 URL 프래그먼트(슬러그)와 별개다 — self-check-agent는 이 값을 Confluence가 만든 URL 앵커와 대조하지 않고, `anchor` 문자열과 실제 H2 제목 텍스트를 문자 그대로 비교하는 방식으로 검증한다. 따라서 H2 제목 텍스트를 작성할 때 그대로 `anchor` 값으로 사용한다(하이픈 등 URL 슬러그 표기를 억지로 만들지 않는다).

## Step 5: 나레이션 작성

각 Scene마다 `policy.md`의 "나레이션 정책"에 따라 강사가 말하듯 자연스러운 구어체 산문으로 `narration`을 작성한다.

- 분량 제한 없음.
- 화면 표시 텍스트(제목/핵심 주장/시각자료, 즉 `blocks`)와는 별도로 취급한다.
- 화면 표시 텍스트에는 `policy.md` "Scene 콘텐츠 예산"의 하드 제한(제목 두 줄, 본문 문단 최대 3개·문단 길이 최대 140자, Bullet 최대 5개, 핵심 개념 최대 3개, 주요 시각 자료 1개, 보조 시각 자료 최대 2개, Reveal 단계 최대 6개, 비교표 최대 5열)을 반드시 지킨다.
- 예산을 초과하면 하나의 Scene을 유지한 채 글자를 줄이거나 Scroll을 넣지 않고, `policy.md` "하드 제한을 넘으면 다음 순서로 다시 설계한다"에 따라 Scene을 분리해 다시 설계한다.

Scene 분리 시 다음 규칙을 따른다:

- 분리로 생긴 각 Scene은 원본 `sceneId`에 `-cont-2`, `-cont-3`처럼 순번을 붙인 새로운 고유 `sceneId`를 가진다 (예: `context-window-model` → `context-window-model-cont-2`).
- 분리된 Scene들은 원본 Scene의 위치 바로 뒤에 이어지는 연속된 `order` 값을 받으며, 그 뒤에 있던 Scene들의 `order`는 그만큼 뒤로 밀린다.
- 분리된 Scene들은 원본 Scene과 동일한 `type`/`layout`/`motion`을 유지하는 것이 원칙이다. 단, 분리된 콘텐츠가 `policy.md`의 "화면 표현 선택 기준" 표 기준으로 명백히 다른 학습 목적을 가지는 경우에 한해, 그 부분에만 표에서 허용하는 다른 값을 선택할 수 있다.
- 이는 Step 4의 "Brief가 정한 값과 일치해야 한다" 규칙에 대한 유일한 명시적 예외다. 이 예외는 Step 4의 원칙을 깨는 것이 아니라, Brief 단계에서는 예상하지 못했던 콘텐츠 예산 초과에 한해 이 Step에서만 적용되는 보강 규칙이다.

## Step 6: Confluence 본문 작성

`policy.md`의 "Confluence 본문 작성" 규칙에 따라 Lesson 페이지 본문을 작성한다.

- H1은 Lesson 제목으로 한 번만 사용한다.
- H2는 Scene 하나에 대응하며, 텍스트는 해당 Scene의 `anchor`와 일치시킨다.
- H3는 Scene 내부 보조 구분에만 사용한다.
- Blockquote는 질문/Hook, Numbered List는 순서/Process, Table은 비교, Info Panel은 보충 설명, Warning Panel은 주의/오해 교정에 사용한다.
- 나레이션은 본문 설명과 구분되는 별도 Block(예: Expand 또는 별도 문단 구획)으로 포함한다.
- 지원하지 않는 임의 HTML, Script, iframe, 과도한 중첩 목록·표는 만들지 않는다.

## Step 7: 페이지 생성

`mcp__claude_ai_Atlassian_Rovo__createConfluencePage`로 Course Index 하위에 `status: "current"`(정식 발행된 일반 페이지)로 페이지를 생성한다. `status: "draft"`를 넘기면 안 된다 — 위 "역할" 섹션의 주의사항 참조.

단, Step 3의 live-check에서 이미 존재하는 페이지가 발견된 Lesson은 새 페이지를 생성하지 않고, 해당 `page_id`에 대해 아래 Content Property 설정만 (재)시도한다.

이 Agent는 Content Property를 직접 쓰는 MCP 도구를 호출하지 않는다(그런 도구는 존재하지 않는다). 대신 아래 두 속성 payload 객체를 그대로 계산해 Step 9의 `output`에 포함시킨다 (`policy.md` "Confluence 속성 생성" 참조). 실제 REST 쓰기는 이 Agent 완료 후 루틴 레벨의 Bash/curl 단계(routine Step 3.5)가 `output`을 읽어 그대로 POST한다:

- `wiki.metadata`: `{schemaVersion, docType: "lesson", courseId: "ai-foundation", lessonId, chapter, order, status: "draft", version: 1, audience: "beginner", estimatedMinutes, prerequisites, learningObjectives}`
- `lesson.presentation`: `{schemaVersion, lessonId, theme, scenes: [{sceneId, anchor, type, layout, motion, reveal, narration}, ...]}`

`estimatedMinutes`와 `learningObjectives`는 다음 기준으로 결정한다(임의로 값을 만들지 않는다):

- `estimatedMinutes`: Scene 개수 × 2로 계산하고, `policy.md` "Lesson 분할 기준"의 5~10분 범위로 clamp한다. 즉 `max(5, min(10, sceneCount * 2))`.
- `learningObjectives`: Lesson Brief의 `learningGoal`과 `completionCheck` 값을 그대로 배열로 감싸서 사용한다.

`wiki.metadata.prerequisites`는 Lesson Brief의 서술형 문장이 아니라, `course-targets.md`의 `lessonId → page_id` 매핑을 통해 얻은 선행 Lesson들의 실제 Confluence 페이지 ID 숫자 배열이다(policy.md의 일반 `prerequisites` 필드 정의와 동일). 아직 `page_id`가 없는 선행 Lesson은 배열에서 제외하고 `manual_review_items`에 `{lessonId, reason: "prerequisite_page_not_yet_created"}`로 기록해 나중에 채우도록 한다.

`createConfluencePage`가 성공했지만 이어지는 Content Property 설정이 실패하면, 이 Lesson에 대해 이번 실행 또는 이후 실행에서 두 번째 페이지를 생성하지 않는다. 대신 `manual_review_items`에 `{lessonId, page_id, reason: "orphan_partial_properties"}`를 기록한다. 이후 실행의 Step 3 live-check가 이 기존 페이지를 발견하면, 새 페이지를 생성하는 대신 해당 `page_id`에 속성 설정을 재시도하는 경로로 라우팅해야 한다.

`courseId`, `lessonId`, `sceneId`는 제목과 분리된 안정적인 식별자로 유지하고, 이후 제목이 바뀌어도 임의로 변경하지 않는다.

## Step 8: course-targets.md 갱신

생성된 각 Lesson의 `lessonId → page_id` 매핑을 `course-targets.md`에 추가한다. 이미 매핑이 있으면 갱신하고, 없으면 새로 추가한다. 중복 행을 만들지 않는다.

## Step 8b: Course Index lesson.course 갱신

이번 실행에서 페이지 생성(및 속성 설정)에 성공한 Lesson이 하나 이상 있으면, Course Index 페이지의 `lesson.course` Content Property로 반영될 갱신 객체를 계산한다.

이 Agent는 Content Property를 직접 쓰는 MCP 도구를 호출하지 않는다(그런 도구는 존재하지 않는다). 대신 `current_lesson_course_path`(루틴이 미리 curl GET으로 채워둔, Course Index의 현재 `lesson.course` 값)를 읽어 아래 계산을 수행하고, 그 결과 객체를 그대로 Step 9의 `output`의 `lesson_course_update` 필드에 기록한다. 실제 REST 쓰기는 이 Agent 완료 후 루틴 레벨의 Bash/curl 단계(routine Step 3.5)가 `output`을 읽어 그대로 POST한다:

- `current_lesson_course_path`에서 Course Index의 현재 `lesson.course` 값을 읽는다(없으면 `null`).
- `lessonIds` 배열에 이번에 새로 생성한 `lessonId`들을 추가한다(중복 없이).
- `version`을 1 증가시킨다.
- `updatedAt`을 `{date}`로 설정한다.
- `lesson.course`가 아직 없으면(최초 실행, 즉 `current_lesson_course_path`의 값이 `null`) `policy.md` "Confluence 속성 생성" 섹션의 스키마로 새로 만든다: `{schemaVersion, courseId: "ai-foundation", title: "AI 기초교육", audience: "beginner", status: "draft", version: 1, lessonIds: [...], completionRule, updatedAt}`.
- `lesson.course.status`(과정 전체의 공개 상태)는 개별 Lesson의 `wiki.metadata.status`와 별개이며, 이 스킬의 어떤 Agent도 자동으로 전환하지 않는다 — Course 전체를 `review`나 `published`로 바꾸는 것은 항상 사람이 직접 판단해 Confluence에서 수정하는 영역이다. 이 Step이 계산하는 것은 `lessonIds`/`version`/`updatedAt`뿐이며 `status`는 절대 건드리지 않는다(현재 값을 그대로 유지한다).

## Step 9: 결과 파일

`output`(고정 경로 `tmp/storyboard-result.json`)에 다음을 기록한다:

```json
{
  "date": "YYYY-MM-DD",
  "decision": "PAGES_CREATED|SKIPPED_BRIEFS_NOT_READY|BLOCKED_NO_COURSE_INDEX",
  "pages_created": [
    {
      "page_id": "...", "lessonId": "...", "title": "...",
      "wiki_metadata": { "schemaVersion": 1, "docType": "lesson", "courseId": "ai-foundation", "lessonId": "...", "chapter": "...", "order": 0, "status": "draft", "version": 1, "audience": "beginner", "estimatedMinutes": 0, "prerequisites": [], "learningObjectives": [] },
      "lesson_presentation": { "schemaVersion": 1, "lessonId": "...", "theme": "...", "scenes": [ { "sceneId": "...", "anchor": "...", "type": "...", "layout": "...", "motion": "...", "reveal": "...", "narration": "..." } ] }
    }
  ],
  "pages_created_this_run": [
    { "page_id": "...", "lessonId": "...", "title": "..." }
  ],
  "manual_review_items": [
    { "lessonId": "...", "reason": "course_index_not_created" }
  ],
  "lesson_course_update": { "schemaVersion": 1, "courseId": "ai-foundation", "title": "AI 기초교육", "audience": "beginner", "status": "draft", "version": 1, "lessonIds": [], "completionRule": "...", "updatedAt": "..." }
}
```

`lesson_course_update`는 이번 실행에서 하나 이상의 Lesson 페이지가 생성(또는 orphan 복구)된 경우에만 기록하며, 그렇지 않으면 생략하거나 `null`로 남긴다. `wiki_metadata`/`lesson_presentation`은 `pages_created`의 모든 항목(이전 실행분 포함)에 대해 항상 채워져 있어야 하며, 값이 없으면 루틴의 Step 3.5 curl 단계가 해당 페이지에 대해 아무 것도 POST하지 못한다.

`pages_created`에는 Step 3에서 이미 있던 항목(이전 실행분)과 이번 실행에서 새로 생성한 항목을 모두 합산해 기록하며, Step 7의 orphan 복구 절차로 기존 페이지에 속성 설정을 재시도해 성공한 경우도 새로 생성한 페이지와 동일하게 `{page_id, lessonId, title}`을 `pages_created`에 추가하고, 이전 실행에서 해당 `lessonId`에 대해 `reason: "orphan_partial_properties"`로 남아 있던 `manual_review_items` 항목은 이번 결과에서 제거해 더 이상 이어서 기록하지 않는다.

`pages_created`는 누적 목록이고 `pages_created_this_run`은 이번 실행에서 실제로 페이지를 만들거나 속성을 (재)설정한 항목만 담는다 — Content Property 쓰기가 필요한 대상은 후자뿐이다. `pages_created_this_run`은 `pages_created`의 부분집합이며, 이번 실행에서 새로 생성한 페이지와 Step 7의 orphan 복구로 속성 설정을 재시도해 성공한 페이지만 포함한다. 이전 실행에서 이미 `pages_created`에 있었고 이번 실행에서 손대지 않은 항목은 `pages_created_this_run`에 포함하지 않는다. 이번 실행에서 새로 생성/복구된 페이지가 없으면 `pages_created_this_run`은 빈 배열이다.

## 완료 조건

- Brief의 모든 미생성 Lesson이 `pages_created` 또는 `manual_review_items` 중 하나에 존재한다.
- `output`이 유효한 JSON이다.

## 중요 제약

- 절대 페이지 `status`를 `published`로 바꾸지 않는다.
- Course Index를 스스로 생성하지 않는다. `TBD`이면 건너뛰고 `manual_review_items`에만 기록한다.
- Brief의 `scenePlan`이 정한 Scene 개수·유형(`type`/`layout`/`motion`/`reveal`)을 임의로 늘리거나 줄이지 않는다. 단, Step 5의 콘텐츠 예산 초과로 인한 분리는 예외이며, 이 경우 분리된 결과는 `manual_review_items`가 아니라 `pages_created`의 Scene 목록에 반영한다.

## 오류 처리

- MCP 도구 오류 발생 시 해당 Lesson을 `manual_review_items`에 기록하고 다음 Lesson 처리를 계속한다.
- `lesson_brief_result_path`를 읽지 못하면 즉시 실패하고 오류를 출력한다.
