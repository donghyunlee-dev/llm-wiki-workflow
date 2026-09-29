# Lesson Curriculum Maintainer 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 교육용 Confluence 콘텐츠(Course/Lesson)를 생성·개선하는 `lesson-curriculum-maintainer` 스킬과 6종 에이전트, 신규 루틴을 저장소에 추가하고, Course Index / Lesson Approval Queue Confluence 페이지를 생성한다.

**Architecture:** `docs/superpowers/specs/2026-07-30-lesson-curriculum-agent-design.md`에 정의된 대로 — 기존 `skills/confluence-guide-maintainer`와 완전히 분리된 새 스킬 폴더, 단일 루틴 안에서 Step 게이트(Charter→Map→Brief→Storyboard→Self-check)로 진행하며 각 게이트는 Lesson Approval Queue 페이지의 승인 상태로 제어된다.

**Tech Stack:** Markdown 지시 문서 (Codex/Claude 에이전트가 읽어 실행), Confluence MCP (`mcp__claude_ai_Atlassian_Rovo__*`). 이 저장소에는 빌드/테스트 스텝이 없으므로, 아래 각 태스크의 "검증"은 자동화 테스트가 아니라 **작성된 문서가 설계 스펙의 필수 항목을 모두 포함하는지 확인하는 체크리스트**다.

---

## 사전 확인 사항 (모든 태스크의 근거)

- 승인된 설계: `docs/superpowers/specs/2026-07-30-lesson-curriculum-agent-design.md`
- 콘텐츠 정책 원문(그대로 채택하는 표·기준): 이번 대화에서 사용자가 제공한 "AI 교육 콘텐츠 관리자 Agent 설계" 원본 텍스트 — Lesson 분할 기준, Scene Type/Layout/Motion 표, 콘텐츠 예산 표, 인터랙션 기준, Lesson Brief/Storyboard YAML 스키마, 품질 평가 100점 배점, 변경 유형 분류표, 금지 행동 목록을 포함한다. 각 태스크에서 "원문 그대로 포함"이라고 표시된 표/목록은 이 원문에서 한 글자도 바꾸지 않고 옮긴다(단, 나레이션 관련 항목만 설계 스펙 5번 섹션의 수정을 반영).
- 기존 패턴 참고 파일: `skills/confluence-guide-maintainer/SKILL.md`, `skills/confluence-guide-maintainer/policy.md`, `skills/confluence-guide-maintainer/agents/writer-agent.md`, `routines/weekly-maintenance.md`

---

### Task 1: `skills/lesson-curriculum-maintainer/SKILL.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/SKILL.md`

- [ ] **Step 1: 기존 SKILL.md 구조 확인**

```bash
cat skills/confluence-guide-maintainer/SKILL.md
```

이 파일의 섹션 구성(스킬 정체성, 핵심 원칙, 다른 문서로의 포인터)을 그대로 따른다.

- [ ] **Step 2: SKILL.md 작성**

다음 내용을 포함해 작성한다:
- 스킬 정체성: "AI 기초교육 Confluence 콘텐츠를 설계·개선하는 교육과정 책임자 Agent 스킬. 콘텐츠 작성자가 아니라 교육과정 설계자·편집장·품질관리자."
- 핵심 원칙 5개 (원 설계 문서 "핵심 설계 요약" 중 아래 5개를 그대로 인용):
  1. 기초교육은 유한한 Core Course이며 Wiki와 동일하지 않다.
  2. Wiki에 새 내용이 생겨도 자동으로 교육과정에 추가하지 않는다.
  3. 신규 Lesson보다 기존 Lesson 개선을 우선한다.
  4. Course 구조 변경과 콘텐츠 공개에는 사람의 승인이 필요하다.
  5. 모든 Scene에는 화면 텍스트와 별도로 강사 나레이션이 있어야 한다 (원 설계 문서의 "강사 독립성" 원칙 대신 채택).
- 문서 맵: `policy.md`, `course-targets.md`, `agents/*.md`, `templates/*.md`에 대한 1줄 설명과 링크
- 실행 진입점: "이 스킬은 `routines/lesson-curriculum-maintenance.md`가 로드한다"

- [ ] **Step 3: 검증 — 필수 항목 포함 확인**

```bash
grep -c "Core Course" skills/lesson-curriculum-maintainer/SKILL.md
grep -c "나레이션" skills/lesson-curriculum-maintainer/SKILL.md
```

Expected: 둘 다 1 이상.

- [ ] **Step 4: Commit**

```bash
git add skills/lesson-curriculum-maintainer/SKILL.md
git commit -m "feat(lesson-skill): SKILL.md 초안 작성"
```

---

### Task 2: `skills/lesson-curriculum-maintainer/policy.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/policy.md`

- [ ] **Step 1: 섹션 목록 확정**

아래 섹션을 순서대로 포함한다 (원 설계 문서 원문을 그대로 옮기되, 표시된 곳만 나레이션 반영):

1. **교육 목표** — 원 설계 문서 "교육 목표" 전체 (수료자가 자신의 말로 설명할 수 있어야 하는 9개 항목 리스트 포함)
2. **교육 범위** — "포함 범위" / "제외 범위" 전체
3. **학습자의 시작 상태** — 원문 그대로
4. **콘텐츠 계층** — Course/Chapter/Lesson/Scene/Block 정의 표 + Confluence/Player 매핑 표
5. **Lesson 분할 기준** — 분리 조건 / 통합 조건 리스트 전체
6. **Lesson 콘텐츠 품질 기준**
   - Lesson Player 적합성 (원문)
   - **나레이션 정책 (신규 서브섹션, 아래 내용으로 "강사 독립성" 대체)**:
     - Scene마다 화면 표시 텍스트와 별도로 나레이션 Block을 둔다.
     - 분량 제한 없음 — Scene마다 필요한 만큼 자유롭게 작성한다.
     - 콘텐츠 예산(제목 2줄, 본문 최대 3문단·140자, Bullet 5개 등)은 나레이션에는 적용하지 않는다.
     - 문체: 강사가 말하듯 자연스럽게 흐르는 구어체 산문("소설책" 톤). 정의를 먼저 던지지 않고 상황·질문으로 시작한다.
     - 화면 표현(토글형 스크롤 자막 패널)은 Lesson Player(별도 프로젝트) 구현 사항이며 이 스킬은 텍스트만 책임진다.
     - `lesson.presentation`의 Scene 객체에 `narration` 필드를 추가한다.
   - 이해 중심 구성 표 (문제 인식~다음 연결 10단계, 원문)
   - 유튜브 수준의 설명력 (원문)
   - 시각 자료 선택 표 + 금지 표현 리스트 (원문)
   - Scene 콘텐츠 예산 표 (원문, 나레이션에는 미적용이라는 각주 추가)
   - 화면 표현 선택 기준 표 (학습 목적→Scene Type/Layout/Motion, 원문)
   - Motion 사용 기준 / 인터랙션 사용 기준 + 금지 항목 (원문)
7. **최초 실행 설계** — 교육과정 헌장 생성 / 교육과정 지도 생성 / Lesson Brief 생성(YAML 스키마) / 화면 Storyboard 생성(YAML 스키마, `narration` 필드 추가) / Confluence 문서 골격 / Confluence 본문 작성 규칙 / Confluence 속성 생성(Property 3종 표 + 필수 항목) / **Self-check 검증**(원문 "Compiler 검증" 절을 이름만 변경하고 "Lesson Compiler Preview 실행" → "self-check-agent 규칙 검증 실행"으로 치환) / 순차 제작
8. **지속 성장 설계** — 변화 입력 / 변화 해석 / 변경 유형 분류표 (원문)
9. **Core Course 보호 규칙** (원문)
10. **품질 평가** — 100점 배점 표(원문) + "무조건 비공개" 조건 목록(원문, "Lesson Compiler Error가 남아 있음" → "self-check 규칙 위반이 남아 있음"으로 치환)
11. **권한과 승인** — 자동 수행 가능 작업 / 사람 승인 필요 작업 표 (원문)
12. **금지 행동** (원문 그대로, "Lesson Compiler Error" 관련 항목만 self-check 용어로 치환)

- [ ] **Step 2: 파일 작성**

위 12개 섹션을 담아 `skills/lesson-curriculum-maintainer/policy.md`를 작성한다.

- [ ] **Step 3: 검증 — 필수 표/스키마 존재 확인**

```bash
grep -c "^| Course " skills/lesson-curriculum-maintainer/policy.md
grep -c "narration" skills/lesson-curriculum-maintainer/policy.md
grep -c "PROPOSE_ADVANCED_COURSE" skills/lesson-curriculum-maintainer/policy.md
grep -c "self-check" skills/lesson-curriculum-maintainer/policy.md
```

Expected: 4개 grep 모두 1 이상 (콘텐츠 계층 표, 나레이션 필드, 변경유형 분류표, self-check 용어 치환이 실제로 반영됐는지 확인).

- [ ] **Step 4: Commit**

```bash
git add skills/lesson-curriculum-maintainer/policy.md
git commit -m "feat(lesson-skill): policy.md 작성 — 교육 콘텐츠 정책 전체"
```

---

### Task 3: `skills/lesson-curriculum-maintainer/course-targets.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/course-targets.md`

- [ ] **Step 1: 파일 작성**

```markdown
# Lesson Course Targets

| 항목 | Page ID | 상태 |
|---|---|---|
| Lesson Root | 183271425 | 확정 (고정 Root, 제목 "Lesson") |
| AI 기초교육 Index (Course Index) | TBD | Task 9에서 생성 후 기록 |
| Lesson Approval Queue | TBD | Task 9에서 생성 후 기록 (Ops Log 63111673 하위) |

## Course Manifest

`courseId: ai-foundation` — 최초 Course. charter-agent 승인 후 course-map-agent가 Chapter/Lesson 목록을 이 파일 하단에 추가한다.

## 갱신 규칙

- Course Index / Lesson Approval Queue 페이지 ID는 생성 즉시 이 파일에 기록한다.
- Lesson 페이지가 생성될 때마다 `lessonId → page_id` 매핑을 추가한다 (course-map-agent, storyboard-writer-agent가 갱신).
```

- [ ] **Step 2: 검증**

```bash
grep -c "183271425" skills/lesson-curriculum-maintainer/course-targets.md
```

Expected: 1 이상.

- [ ] **Step 3: Commit**

```bash
git add skills/lesson-curriculum-maintainer/course-targets.md
git commit -m "feat(lesson-skill): course-targets.md 초기 생성"
```

---

### Task 4: `agents/charter-agent.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/agents/charter-agent.md`

- [ ] **Step 1: 파일 작성**

다음 구조로 작성한다 (`writer-agent.md`의 "역할/입력/사전 준비/Step/완료 조건/오류 처리" 포맷을 따름):

```markdown
# Charter Agent

## 역할

교육과정 헌장(Course Charter)을 생성하거나 검증한다. Course Charter는 기준 학습자, 학습자의 시작 상태, 기초교육 수료 상태, 포함·제외 범위, 전체 학습 스토리, Lesson 완성 기준, 수료 이해도 평가 기준을 정의한다.

이 Agent는 헌장을 스스로 승인하지 않는다. 초안을 Lesson Approval Queue에 `status: pending`으로 기록하고 종료한다.

## 입력

- `date`: 실행 날짜 (YYYY-MM-DD)
- `repo`: 리포지토리 루트 경로
- `approval_queue_page_id`: Lesson Approval Queue 페이지 ID (`course-targets.md`에서 확인)
- `output`: 결과 파일 경로 (예: `tmp/charter-result.json`)

## 사전 준비

다음 파일을 읽는다:
- `skills/lesson-curriculum-maintainer/policy.md` (교육 목표, 교육 범위, 학습자 시작 상태 섹션)
- `skills/lesson-curriculum-maintainer/course-targets.md`
- Lesson Approval Queue 페이지 (`mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 현재 상태 확인)

## Step 1: 기존 헌장 확인

Lesson Approval Queue 페이지에서 `type: charter`인 항목을 찾는다.

- `status: approved`인 헌장이 있으면: 그 내용을 `output`에 기록하고 종료 (`decision: CHARTER_APPROVED`).
- `status: pending`인 헌장이 있으면: 새로 만들지 않고 대기 상태를 `output`에 기록하고 종료 (`decision: CHARTER_PENDING_APPROVAL`).
- 헌장이 전혀 없으면 Step 2로 진행한다.

## Step 2: 헌장 초안 생성

`policy.md`의 "교육 목표", "교육 범위", "학습자의 시작 상태"를 근거로 아래 항목을 작성한다:

- 기준 학습자
- 학습자의 시작 상태
- 기초교육 수료 상태 (한 문장)
- 포함 범위 / 제외 범위
- 전체 학습 스토리 (11개 질문의 순서, policy.md "과정 설계 원칙 > 완결된 학습 스토리" 참조)
- Lesson 완성 기준 (policy.md "Lesson 분할 기준" 참조)
- 수료 이해도 평가 기준

## Step 3: Approval Queue에 기록

`mcp__claude_ai_Atlassian_Rovo__createConfluencePage` 또는 `updateConfluencePage`로 Lesson Approval Queue 페이지에 아래 행을 추가한다:

| 항목 | 값 |
|---|---|
| type | charter |
| status | pending |
| courseId | ai-foundation |
| 제출일 | {date} |
| 내용 | Step 2에서 생성한 헌장 전체 |

## Step 4: 결과 파일 작성

```json
{
  "date": "YYYY-MM-DD",
  "decision": "CHARTER_DRAFTED|CHARTER_PENDING_APPROVAL|CHARTER_APPROVED",
  "charter": { "targetLearner": "...", "startState": "...", "graduationState": "...", "scopeIncluded": [], "scopeExcluded": [], "storyQuestions": [], "lessonCompletionCriteria": "...", "assessmentCriteria": "..." }
}
```

## 완료 조건

- `output` 파일이 유효한 JSON으로 작성됨
- `decision`이 세 값 중 하나로 명시됨

## 중요 제약

- 헌장을 스스로 `approved`로 바꾸지 않는다.
- `CHARTER_PENDING_APPROVAL` 또는 `CHARTER_DRAFTED` 상태에서는 루틴의 이후 Step(course-map-agent 이하)이 실행되지 않도록 `decision` 값을 정확히 반환해야 한다.

## 오류 처리

- MCP 도구 오류 시 오류 내용을 `output`에 `decision: ERROR`로 기록하고 종료한다.
```

- [ ] **Step 2: 검증**

```bash
grep -c "CHARTER_PENDING_APPROVAL" skills/lesson-curriculum-maintainer/agents/charter-agent.md
```

Expected: 1 이상 (게이트 로직이 명시됐는지 확인).

- [ ] **Step 3: Commit**

```bash
git add skills/lesson-curriculum-maintainer/agents/charter-agent.md
git commit -m "feat(lesson-skill): charter-agent 작성"
```

---

### Task 5: `agents/course-map-agent.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/agents/course-map-agent.md`

- [ ] **Step 1: 파일 작성**

`charter-agent.md`와 동일한 포맷(역할/입력/사전 준비/Step/완료 조건/제약/오류 처리)으로 작성하되 다음 내용을 포함한다:

- **역할**: 승인된 Course Charter에서 역산해 Chapter/Lesson 지도를 설계한다. 선행 관계, 누락, 중복, 갑작스러운 난이도 상승을 검사한다. 지도 자체도 헌장과 마찬가지로 사람 승인이 필요하므로 스스로 승인하지 않는다.
- **입력**: `charter_result_path`(Task 4의 output), `approval_queue_page_id`, `course_targets_path`
- **Step 1 — 헌장 게이트 확인**: `charter_result_path`의 `decision`이 `CHARTER_APPROVED`가 아니면 즉시 종료하고 `decision: SKIPPED_CHARTER_NOT_APPROVED`를 기록한다.
- **Step 2 — 기존 지도 확인**: Approval Queue에서 `type: course-map`을 찾는다. `approved`면 그 지도를 그대로 사용해 Step 4(lesson-brief-agent용 입력 파일 작성)로 진행. `pending`이면 대기 종료.
- **Step 3 — 지도 초안 생성**: 수료자가 설명할 수 있어야 할 개념(헌장의 학습 스토리 11개 질문 기준)을 Chapter로 그룹핑하고, 각 Chapter를 하나 이상의 Lesson으로 분해한다. 각 Lesson에 대해 `lessonId`, `chapter`, `order`, `learnerQuestion`(한 줄), `prerequisites`(선행 lessonId 배열)를 부여한다. `policy.md`의 "Lesson 분할 기준"에 따라 경계를 검사한다.
- **Step 4 — Approval Queue에 기록**: `type: course-map, status: pending`으로 지도 전체(JSON)를 큐 페이지에 추가한다.
- **Step 5 — 결과 파일**: `tmp/course-map-result.json`에 `decision`(`MAP_PENDING_APPROVAL|MAP_APPROVED|SKIPPED_CHARTER_NOT_APPROVED`)과 승인된 경우 `lessons: [{lessonId, chapter, order, learnerQuestion, prerequisites}]` 배열을 기록한다.
- **완료 조건**: 승인되지 않은 지도로 lesson-brief-agent 입력을 만들지 않는다.

- [ ] **Step 2: 검증**

```bash
grep -c "SKIPPED_CHARTER_NOT_APPROVED" skills/lesson-curriculum-maintainer/agents/course-map-agent.md
```

Expected: 1 이상.

- [ ] **Step 3: Commit**

```bash
git add skills/lesson-curriculum-maintainer/agents/course-map-agent.md
git commit -m "feat(lesson-skill): course-map-agent 작성"
```

---

### Task 6: `agents/lesson-brief-agent.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/agents/lesson-brief-agent.md`

- [ ] **Step 1: 파일 작성**

다음 내용 포함:

- **역할**: 승인된 Course Map의 Lesson 중 아직 Brief가 없는 항목에 대해 Lesson Brief를 작성한다. 구조 변경이 아니므로 사람 승인 없이 자동 진행한다.
- **입력**: `course_map_result_path`, `output`
- **Step 1 — 게이트 확인**: `decision`이 `MAP_APPROVED`가 아니면 종료.
- **Step 2 — Wiki 우선 검색**: 각 Lesson의 `learnerQuestion`으로 `mcp__claude_ai_Atlassian_Rovo__searchConfluenceUsingCql`을 실행해 관련 Wiki Guide/Page를 찾는다. 검색 결과를 `relatedGuides`로 기록한다 (검색 로그 자체가 Wiki 성장의 신호가 된다 — `policy.md` "AI Wiki" 정의 참조).
- **Step 3 — 부족 시 웹 검색**: Wiki에 근거가 없으면 `WebSearch`로 공식 출처를 찾는다. 출처가 없으면 `manual_review_items`에 기록하고 건너뛴다.
- **Step 4 — Brief 작성**: `policy.md`의 Lesson Brief YAML 스키마(`lessonId`, `learnerQuestion`, `learningGoal`, `prerequisites`, `keyConcepts`, `commonMisconceptions`, `businessExample`, `visualIntent`, `scenePlan`, `completionCheck`, `nextLessonReason`)를 채운다.
- **Step 5 — 결과 파일**: `tmp/lesson-brief-result.json`에 `briefs: [...]`, `manual_review_items: [...]` 기록.
- **완료 조건**: Course Map의 모든 미작성 Lesson이 `briefs` 또는 `manual_review_items` 중 하나에 존재.

- [ ] **Step 2: 검증**

```bash
grep -c "learnerQuestion" skills/lesson-curriculum-maintainer/agents/lesson-brief-agent.md
grep -c "searchConfluenceUsingCql" skills/lesson-curriculum-maintainer/agents/lesson-brief-agent.md
```

Expected: 둘 다 1 이상.

- [ ] **Step 3: Commit**

```bash
git add skills/lesson-curriculum-maintainer/agents/lesson-brief-agent.md
git commit -m "feat(lesson-skill): lesson-brief-agent 작성"
```

---

### Task 7: `agents/storyboard-writer-agent.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/agents/storyboard-writer-agent.md`

- [ ] **Step 1: 파일 작성**

다음 내용 포함:

- **역할**: Lesson Brief를 받아 Scene Storyboard를 설계하고, Confluence Lesson 페이지 Draft(본문 + `wiki.metadata` + `lesson.presentation`)를 작성한다. Course Index 페이지가 없으면 먼저 생성(`docType: nav`)한다.
- **입력**: `lesson_brief_result_path`, `course_targets_path`, `output`
- **Step 1 — 부모 페이지 확인**: `course-targets.md`에서 Course Index ID를 확인한다. 없으면 `manual_review_items`에 기록하고 건너뛴다 (Course Index 생성은 Task 9에서 1회 수행하는 관리자 작업이며 이 Agent가 임의로 만들지 않는다).
- **Step 2 — Scene Storyboard 작성**: 각 Brief의 `scenePlan` 항목마다 `policy.md`의 Storyboard YAML 스키마(`sceneId`, `anchor`, `learnerStateBefore`, `learningClaim`, `type`, `layout`, `motion`, `reveal`, `blocks`, `interaction`, `completionEvidence`, `transitionToNext`, **`narration`**)를 채운다. `type`/`layout`/`motion`은 `policy.md`의 "화면 표현 선택 기준" 표에 있는 값만 사용한다.
- **Step 3 — 콘텐츠 예산 검증**: `policy.md`의 Scene 콘텐츠 예산 표(하드 제한)를 화면 표시 텍스트에 적용한다. 초과 시 Scene을 분리한다. `narration`에는 예산을 적용하지 않는다.
- **Step 4 — Confluence 본문 작성**: H1=Lesson 제목, H2=Scene(Anchor와 일치), 나레이션은 별도 Block으로 포함. `policy.md` "Confluence 본문 작성" 규칙을 따른다.
- **Step 5 — 페이지 생성**: `mcp__claude_ai_Atlassian_Rovo__createConfluencePage`로 `status: draft` 페이지를 Course Index 하위에 생성. `wiki.metadata`(docType: lesson, 필수 항목 전체)와 `lesson.presentation`(scenes 배열, 각 Scene에 narration 포함) Content Property를 설정한다.
- **Step 6 — 결과 파일**: `tmp/storyboard-result.json`에 `pages_created: [{page_id, lessonId, title}]`, `manual_review_items: []` 기록.

- [ ] **Step 2: 검증**

```bash
grep -c "narration" skills/lesson-curriculum-maintainer/agents/storyboard-writer-agent.md
grep -c "docType: lesson" skills/lesson-curriculum-maintainer/agents/storyboard-writer-agent.md
```

Expected: 둘 다 1 이상.

- [ ] **Step 3: Commit**

```bash
git add skills/lesson-curriculum-maintainer/agents/storyboard-writer-agent.md
git commit -m "feat(lesson-skill): storyboard-writer-agent 작성"
```

---

### Task 8: `agents/self-check-agent.md`, `agents/signal-report-agent.md` 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/agents/self-check-agent.md`
- Create: `skills/lesson-curriculum-maintainer/agents/signal-report-agent.md`

- [ ] **Step 1: self-check-agent.md 작성**

다음 내용 포함:

- **역할**: 실제 Lesson Compiler는 이 저장소 밖에 있으므로, 생성된 Lesson Draft를 규칙 기반으로 자체 점검하고 `policy.md`의 100점 배점 루브릭으로 품질 점수를 산정한다.
- **입력**: `storyboard_result_path`, `output`
- **Step 1 — 페이지 재조회**: 각 `pages_created` 항목을 `getConfluencePage` + Content Property API로 다시 읽는다.
- **Step 2 — 규칙 검증** (하나라도 위반 시 `blockers`에 기록):
  - H2 제목과 `lesson.presentation`의 Scene `anchor`가 1:1로 일치하는가
  - 모든 Scene의 `type`/`layout`/`motion`이 `policy.md` 허용 목록 안에 있는가
  - 화면 표시 텍스트가 콘텐츠 예산 하드 제한을 넘지 않는가
  - 모든 Scene에 `narration` 필드가 비어있지 않게 채워져 있는가
  - 출처(`sources`)가 존재하는가
  - `policy.md` "무조건 비공개" 조건 목록에 해당하는 항목이 있는가
- **Step 3 — 품질 점수 산정**: `policy.md` 100점 배점 표의 7개 영역에 점수를 매긴다.
- **Step 4 — 상태 갱신**: `blockers`가 비어 있고 점수가 85점 이상이면 `updateConfluencePage`(또는 Content Property만 갱신)로 `wiki.metadata.status`를 `review`로 바꾼다. 그 외에는 `draft` 유지.
- **Step 5 — 결과 파일**: `tmp/self-check-result.json`에 `page_id`별 `{score, blockers, statusAfter}` 기록.
- **중요 제약**: 이 Agent는 절대 `status`를 `published`로 바꾸지 않는다.

- [ ] **Step 2: signal-report-agent.md 작성**

다음 내용 포함:

- **역할**: 매주 실행 시 Wiki/검색 신호를 수집해 `policy.md`의 변경 유형 분류표(`NO_CHANGE`~`PROPOSE_ADVANCED_COURSE`)로 분류하고 run report를 작성한다.
- **입력**: `date`, `repo`, `output`
- **Step 1 — 신호 수집**: `runs/` 디렉터리의 최근 `auto-search`/`playbook` run report에서 검색 실패·반복 질문·신규 Wiki Guide 목록을 추출한다.
- **Step 2 — 변화 해석**: `policy.md` "변화 해석" 순서(수료 필수 여부 → 기존 Lesson 정확성 영향 → Guide 연결로 충분한지 → 기존 Lesson 개선 가능 여부 → 신규 Lesson 필요 여부 → 심화 과정 해당 여부)로 각 신호를 판단한다.
- **Step 3 — 처리**:
  - `IMPROVE_EXPLANATION`: 해당 Lesson 페이지를 `updateConfluencePage`로 직접 갱신(자동 진행, 구조 변경 아님).
  - `PROPOSE_NEW_LESSON` / `REORDER_LESSON` / `MERGE_CONTENT` / `PROPOSE_ADVANCED_COURSE`: Lesson Approval Queue에 `status: pending`으로 제안만 기록.
  - `NO_CHANGE` / `LINK_GUIDE`: run report에만 기록.
- **Step 4 — 결과 파일**: `runs/{date}-lesson-curriculum.md` 작성 (Task 10에서 만드는 템플릿 사용).

- [ ] **Step 3: 검증**

```bash
grep -c "published" skills/lesson-curriculum-maintainer/agents/self-check-agent.md
grep -c "IMPROVE_EXPLANATION" skills/lesson-curriculum-maintainer/agents/signal-report-agent.md
```

Expected: 둘 다 1 이상 (self-check가 published 금지를 명시하는지, signal-report가 자동 갱신 조건을 명시하는지 확인).

- [ ] **Step 4: Commit**

```bash
git add skills/lesson-curriculum-maintainer/agents/self-check-agent.md skills/lesson-curriculum-maintainer/agents/signal-report-agent.md
git commit -m "feat(lesson-skill): self-check-agent, signal-report-agent 작성"
```

---

### Task 9: Course Index / Lesson Approval Queue Confluence 페이지 생성

이 태스크는 실제 프로덕션 Confluence에 페이지를 생성하는 **되돌리기 번거로운 실제 액션**이다. 실행 직전에 사용자에게 페이지 제목·부모·docType을 다시 한번 확인받은 뒤 진행한다.

**Files:**
- Modify: `skills/lesson-curriculum-maintainer/course-targets.md`

- [ ] **Step 1: Course Index 페이지 생성**

`mcp__claude_ai_Atlassian_Rovo__createConfluencePage` 호출:
- `parentId`: `183271425` (Lesson Root)
- `title`: `AI 기초교육 Index`
- 본문: Course 소개 1~2문단 + Lesson 목록 링크 테이블(현재는 빈 테이블 — course-map-agent가 이후 채움)

생성 후 반환된 `page_id`를 기록한다.

- [ ] **Step 2: Course Index에 속성 설정**

Content Properties API로 두 속성을 설정한다:
- `wiki.metadata`: `{docType: "nav", audience: "beginner", status: "published", prerequisites: [], next: [], related: [], lastReviewedAt: "{today}", reviewCycleDays: 90, keywords: ["AI 기초교육", "Lesson"]}`
- `lesson.course`: `{schemaVersion: 1, courseId: "ai-foundation", title: "AI 기초교육", audience: "beginner", status: "draft", version: 1, lessonIds: [], completionRule: "all_lessons_reviewed", updatedAt: "{today}"}`

- [ ] **Step 3: Lesson Approval Queue 페이지 생성**

`createConfluencePage` 호출:
- `parentId`: `63111673` (Ops Log)
- `title`: `Lesson Approval Queue`
- 본문: 승인 대기 항목 표(빈 표, 컬럼: type / courseId or lessonId / status / 제출일 / 내용 요약) + History 섹션(빈 상태)

- [ ] **Step 4: `course-targets.md` 갱신**

`skills/lesson-curriculum-maintainer/course-targets.md`의 표에서 두 "TBD"를 실제 `page_id`로 교체한다.

- [ ] **Step 5: 검증**

```bash
grep -c "TBD" skills/lesson-curriculum-maintainer/course-targets.md
```

Expected: 0 (모든 TBD가 실제 ID로 교체됨).

- [ ] **Step 6: Commit**

```bash
git add skills/lesson-curriculum-maintainer/course-targets.md
git commit -m "chore(lesson-skill): Course Index / Lesson Approval Queue 페이지 ID 반영"
```

---

### Task 10: 템플릿 3종 작성

**Files:**
- Create: `skills/lesson-curriculum-maintainer/templates/lesson-brief.md`
- Create: `skills/lesson-curriculum-maintainer/templates/scene-storyboard.md`
- Create: `skills/lesson-curriculum-maintainer/templates/run-report.md`

- [ ] **Step 1: `templates/lesson-brief.md`**

`policy.md`의 Lesson Brief YAML 스키마를 빈 템플릿 형태(주석으로 각 필드 설명)로 작성한다 — `lesson-brief-agent.md`가 채워야 할 필드 이름과 타입을 그대로 복사한다.

- [ ] **Step 2: `templates/scene-storyboard.md`**

`policy.md`의 Scene Storyboard YAML 스키마를 빈 템플릿으로 작성한다 (`narration` 필드 포함).

- [ ] **Step 3: `templates/run-report.md`**

```markdown
# Lesson Curriculum Run Report — {date}

## Step 실행 결과

| Step | Agent | 상태 | 비고 |
|---|---|---|---|
| 0 Charter | charter-agent | | |
| 1 Course Map | course-map-agent | | |
| 2 Lesson Brief | lesson-brief-agent | | |
| 3 Storyboard | storyboard-writer-agent | | |
| 4 Self-check | self-check-agent | | |
| Weekly Signal | signal-report-agent | | |

## 신규 생성 페이지

## 갱신된 페이지

## Approval Queue 신규 제안

## Manual Review Items
```

- [ ] **Step 4: 검증**

```bash
ls skills/lesson-curriculum-maintainer/templates/
```

Expected: `lesson-brief.md`, `scene-storyboard.md`, `run-report.md` 3개 파일 모두 존재.

- [ ] **Step 5: Commit**

```bash
git add skills/lesson-curriculum-maintainer/templates/
git commit -m "feat(lesson-skill): 템플릿 3종 작성"
```

---

### Task 11: `routines/lesson-curriculum-maintenance.md` 작성

**Files:**
- Create: `routines/lesson-curriculum-maintenance.md`

- [ ] **Step 1: 기존 routines 문서 포맷 확인**

```bash
cat routines/weekly-maintenance.md
```

`# 루틴: ...`, `루틴 ID`, `스케줄`, `루틴 프롬프트` 코드블록, `변경 이력` 표 구조를 그대로 따른다. (루틴 ID는 실제로 스케줄 등록 도구에서 발급되므로 이 태스크에서는 `TBD (등록 후 기록)`로 남긴다.)

- [ ] **Step 2: 파일 작성**

```markdown
# 루틴: Lesson Curriculum Maintenance

- **루틴 ID**: `TBD (등록 후 기록)`
- **스케줄**: `0 12 * * 5` (UTC 12:00 = KST 21:00, 매주 금요일)

## 루틴 프롬프트

\`\`\`
You are the Lesson Curriculum Maintainer for the S-Food IT AX team's AI 기초교육 Confluence content.

## Context

Repository: sfood-it-dev-ax-org/SFOOD-LLM-WIKI-WORKFLOW
Task: Execute the weekly Lesson curriculum maintenance workflow.

First, read `CLAUDE.md` for project context. Then read `skills/lesson-curriculum-maintainer/SKILL.md` and `skills/lesson-curriculum-maintainer/policy.md`.

## Confluence Access

Atlassian Rovo MCP is connected. Use `mcp__claude_ai_Atlassian_Rovo__*` tools for ALL Confluence operations.

## Execution Pipeline

Run today's date via Bash (`date +%Y-%m-%d`) and use it as `{TODAY}`. Create `tmp/` directory if it does not exist.

### Step 0 — Charter
Spawn an Agent with the full contents of `skills/lesson-curriculum-maintainer/agents/charter-agent.md`, appending: "date: {TODAY}, repo: {REPO_ROOT}, approval_queue_page_id: <course-targets.md 참조>, output: tmp/charter-result.json"
- Model: claude-sonnet-4-6

Read `tmp/charter-result.json`. If `decision` is not `CHARTER_APPROVED`, stop here, write the run report noting the pending gate, commit, and exit.

### Step 1 — Course Map
Spawn an Agent with the full contents of `skills/lesson-curriculum-maintainer/agents/course-map-agent.md`, appending: "charter_result_path: tmp/charter-result.json, approval_queue_page_id: <...>, course_targets_path: skills/lesson-curriculum-maintainer/course-targets.md, output: tmp/course-map-result.json"
- Model: claude-sonnet-4-6

If `decision` is not `MAP_APPROVED`, stop here, write the run report, commit, and exit.

### Step 2 — Lesson Brief
Spawn an Agent with the full contents of `skills/lesson-curriculum-maintainer/agents/lesson-brief-agent.md`, appending: "course_map_result_path: tmp/course-map-result.json, output: tmp/lesson-brief-result.json"
- Model: claude-sonnet-4-6

### Step 3 — Storyboard + Draft
Spawn an Agent with the full contents of `skills/lesson-curriculum-maintainer/agents/storyboard-writer-agent.md`, appending: "lesson_brief_result_path: tmp/lesson-brief-result.json, course_targets_path: skills/lesson-curriculum-maintainer/course-targets.md, output: tmp/storyboard-result.json"
- Model: claude-sonnet-4-6

### Step 4 — Self-check
Spawn an Agent with the full contents of `skills/lesson-curriculum-maintainer/agents/self-check-agent.md`, appending: "storyboard_result_path: tmp/storyboard-result.json, output: tmp/self-check-result.json"
- Model: claude-haiku-4-5-20251001

### Step 5 — Weekly Signal Report
Spawn an Agent with the full contents of `skills/lesson-curriculum-maintainer/agents/signal-report-agent.md`, appending: "date: {TODAY}, repo: {REPO_ROOT}, output: runs/{TODAY}-lesson-curriculum.md"
- Model: claude-haiku-4-5-20251001

## Step 6 — Commit and Push

\`\`\`bash
git add runs/{TODAY}-lesson-curriculum.md skills/lesson-curriculum-maintainer/course-targets.md
git commit -m "chore: lesson curriculum maintenance run {TODAY}" || true
git push origin HEAD
\`\`\`
\`\`\`

## 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-30 | 초기 루틴 생성 |
```

- [ ] **Step 3: 검증**

```bash
grep -c "CHARTER_APPROVED" routines/lesson-curriculum-maintenance.md
grep -c "MAP_APPROVED" routines/lesson-curriculum-maintenance.md
```

Expected: 둘 다 1 이상 (게이트 체크가 루틴 프롬프트에 실제로 반영됐는지 확인).

- [ ] **Step 4: Commit**

```bash
git add routines/lesson-curriculum-maintenance.md
git commit -m "feat(lesson-skill): lesson-curriculum-maintenance 루틴 문서 작성"
```

---

### Task 12: CLAUDE.md에 새 스킬/루틴 반영

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: "Confluence Page Inventory" 표 아래에 Lesson 관련 행 추가**

기존 표에 아래 행을 추가한다:

```markdown
| Lesson Root | 183271425 |
```

(Course Index / Lesson Approval Queue ID는 `skills/lesson-curriculum-maintainer/course-targets.md`가 최신 출처임을 각주로 명시한다.)

- [ ] **Step 2: "Architecture" 섹션에 한 문단 추가**

`### Execution Path` 다음에 짧은 문단을 추가한다:

```markdown
### Lesson Curriculum Maintainer (교육 콘텐츠)

`skills/lesson-curriculum-maintainer/`는 `confluence-guide-maintainer`와 완전히 분리된 스킬로, AI 기초교육 Course/Lesson Confluence 콘텐츠를 담당한다. `routines/lesson-curriculum-maintenance.md`가 매주 금요일 실행하며, Course 구조 변경과 Draft 공개는 `Lesson Approval Queue` 페이지를 통한 사람 승인이 필요하다. 상세 정책은 `skills/lesson-curriculum-maintainer/policy.md`, 상세 설계는 `docs/superpowers/specs/2026-07-30-lesson-curriculum-agent-design.md` 참조.
```

- [ ] **Step 3: 검증**

```bash
grep -c "lesson-curriculum-maintainer" CLAUDE.md
```

Expected: 1 이상.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md에 lesson-curriculum-maintainer 스킬 반영"
```

---

## Self-Review 결과 (계획 작성자 확인용)

- **스펙 커버리지**: 설계 문서 섹션 1~7 모두 Task 1~11에 매핑됨 (섹션 7 "미해결 항목"의 Course Index/Approval Queue ID는 Task 9에서 해소).
- **누락 없음 확인**: 나레이션 필드는 Task 2(policy.md), Task 7(storyboard-writer-agent), Task 8(self-check-agent 검증 항목)에 일관되게 등장.
- **타입/이름 일관성**: `decision` 값(`CHARTER_APPROVED`, `MAP_APPROVED` 등), 파일 경로(`tmp/charter-result.json` 등)가 Task 4~5와 Task 11(루틴 프롬프트)에서 동일하게 사용됨을 확인.
