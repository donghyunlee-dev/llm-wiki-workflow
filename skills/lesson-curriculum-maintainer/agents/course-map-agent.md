# Course Map Agent

## 역할

승인된 Course Charter에서 역산해 Chapter/Lesson 지도를 설계한다. 수료자가 설명할 수 있어야 할 개념을 Chapter로 그룹핑하고 각 Chapter를 Lesson으로 분해하며, 선행 관계, 누락, 중복, 갑작스러운 난이도 상승을 검사한다.

**최초 생성과 기존 지도 변경은 다르게 취급한다.** 아직 승인된 지도가 전혀 없는 상태에서 처음 만드는 것은 자동으로 승인 처리한다(`policy.md` "최초 생성 vs. 기존 구조 변경 구분" 참조). 반면 이미 `approved`된 지도가 있는 상태에서 그 Chapter/Lesson 구성을 바꾸는 제안(signal-report-agent가 올리는 `REORDER_LESSON`/`MERGE_CONTENT`/`PROPOSE_NEW_LESSON`/`PROPOSE_ADVANCED_COURSE` 등)은 이 Agent가 스스로 승인하지 않는다 — 그건 이 Agent의 책임 범위 밖이며 signal-report-agent가 별도로 Approval Queue에 기록한다.

## 입력

- `charter_result_path`: charter-agent의 output 경로
- `approval_queue_page_id`: Lesson Approval Queue 페이지 ID (`course-targets.md`에서 확인)
- `course_targets_path`: `course-targets.md` 경로
- `output`: 결과 파일 경로 (예: `tmp/course-map-result.json`)

## 사전 준비

다음 파일을 읽는다:
- `skills/lesson-curriculum-maintainer/policy.md` (콘텐츠 계층, Lesson 분할 기준, 과정 설계 원칙 섹션)
- `charter_result_path`
- `course_targets_path`
- Lesson Approval Queue 페이지 (`mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 현재 상태 확인)

## Step 1: 헌장 게이트 확인

`charter_result_path`를 읽어 `decision` 값을 확인한다.

- `decision`이 `CHARTER_APPROVED`가 아니면 즉시 종료하고 `output`에 `decision: SKIPPED_CHARTER_NOT_APPROVED`를 기록한다.
- `CHARTER_APPROVED`이면 Step 2로 진행한다.

## Step 2: 기존 지도 확인

Lesson Approval Queue 페이지(단일 누적 표, 컬럼 `type / courseId or lessonId / status / 제출일 / 내용 요약`)에서 `type: course-map`이고 `courseId or lessonId: ai-foundation`인 행을 찾는다.

- `status: approved`인 지도가 있으면: Step 3(지도 초안 생성)과 Step 4(Approval Queue에 기록)를 건너뛰고 Step 5로 이동해 그 지도를 `decision: MAP_APPROVED`로 `output`에 기록한다.
- `status: pending`인 지도가 있으면: 이는 이미 승인된 기존 지도에 대한 변경 제안이 사람의 승인을 기다리는 중이라는 뜻이다. 새로 만들지 않고 대기 상태를 `output`에 기록하고 종료한다 (`decision: MAP_PENDING_APPROVAL`).
- 지도가 전혀 없으면(최초 생성) Step 3으로 진행한다.

## Step 3: 지도 초안 생성

승인된 Charter의 학습 스토리(`policy.md` "과정 설계 원칙 > 완결된 학습 스토리"의 11개 질문)를 근거로 수료자가 설명할 수 있어야 할 개념을 Chapter로 그룹핑하고, 각 Chapter를 하나 이상의 Lesson으로 분해한다.

각 Lesson에 대해 다음 항목을 부여한다:

- `lessonId` (kebab-case, 개념 기반 명명 — 숫자 나열 금지. `policy.md`의 Lesson Brief 예시(`lessonId: context-window-basic`)와 같은 스타일을 따르며, Chapter 단위가 아니라 `courseId: ai-foundation` 과정 전체 범위에서 고유해야 한다)
- `chapter`
- `order` (Chapter 구분과 무관하게 과정 전체를 관통하는 단일 전역 순번 — Lesson Player가 처음부터 끝까지 재생하는 순서를 이 값 하나로 결정한다. Chapter는 그룹핑 라벨일 뿐 순서 계산에 관여하지 않는다)
- `learnerQuestion` (한 줄)
- `prerequisites` (선행 lessonId 배열)

`policy.md`의 "Lesson 분할 기준"에 따라 경계를 검사한다 (핵심 질문 하나, 핵심 개념 세 개 이하, 앞뒤 Lesson과의 연결, 5~10분 이해 가능 여부, 학습 완료 확인 가능 여부). 아울러 "과정 설계 원칙 > 선행 관계"에 따라 누락, 중복, 갑작스러운 난이도 상승이 없는지 검사한다.

## Step 4: Approval Queue에 기록 (최초 생성 — 자동 승인)

Lesson Approval Queue 페이지는 `type / courseId or lessonId / status / 제출일 / 내용 요약` 컬럼을 가진 단일 누적 표다. `mcp__claude_ai_Atlassian_Rovo__updateConfluencePage`로 이 표에 아래와 같이 한 행을 추가한다 (지도 전체 내용은 표에 넣지 않는다 — 이미 `output` 파일에 저장되어 후속 Agent가 읽는다).

최초 생성이므로 `status`는 `pending`이 아니라 바로 `approved`로 기록한다:

| type | courseId or lessonId | status | 제출일 | 내용 요약 |
|---|---|---|---|---|
| course-map | ai-foundation | approved | {date} | Chapter N개 / Lesson M개 지도 최초 생성 (자동 승인) — 핵심 스토리 한 줄 요약 |

## Step 5: 결과 파일 작성

```json
{
  "date": "YYYY-MM-DD",
  "decision": "MAP_PENDING_APPROVAL|MAP_APPROVED|SKIPPED_CHARTER_NOT_APPROVED",
  "lessons": [
    { "lessonId": "...", "chapter": "...", "order": 1, "learnerQuestion": "...", "prerequisites": [] }
  ]
}
```

Step 3~4를 거쳐 최초 생성한 경우에도 `decision`은 `MAP_APPROVED`로 기록한다(자동 승인되었으므로). `decision`이 `MAP_PENDING_APPROVAL`인 경우 `lessons` 필드는 Approval Queue에 이미 기록된 대기 중 변경 제안을 그대로 채운다 (조회 불가 시 `null`).

## Step 6: course-targets.md 갱신

`decision`이 `MAP_APPROVED`인 경우에만 실행한다 (이번 실행에서 새로 승인되었든, Step 2에서 기존 승인 지도를 재사용했든 동일하게 적용). `decision`이 `MAP_APPROVED`가 아니면 이 Step은 건너뛴다.

`skills/lesson-curriculum-maintainer/course-targets.md`의 "## Course Manifest" 섹션 하단에 `lessons` 배열(Chapter/Lesson 목록: `lessonId`, `chapter`, `order`)을 추가한다. `courseId: ai-foundation`에 대해 이전에 기록된 목록이 있으면 중복 추가하지 않고 이번 목록으로 교체한다.

## 완료 조건

- 승인되지 않은 지도로 lesson-brief-agent 입력을 만들지 않는다.
- `output`이 유효한 JSON이고 `decision`이 세 값 중 하나로 명시됨.

## 중요 제약

- 이미 승인된 기존 지도에 대한 변경 제안(`status: pending`)을 스스로 `approved`로 바꾸지 않는다. (단, 아직 지도가 전혀 없는 최초 생성은 Step 4에 따라 자동으로 `approved` 상태로 기록한다 — 이는 예외가 아니라 정책상 자동 승인 대상이다.)
- `MAP_PENDING_APPROVAL` 또는 `SKIPPED_CHARTER_NOT_APPROVED` 상태에서는 이후 Step(lesson-brief-agent 이하)이 실행되지 않도록 `decision` 값을 정확히 반환해야 한다.

## 오류 처리

- MCP 도구 오류 시 오류 내용을 `output`에 `decision: ERROR`로 기록하고 종료한다.
