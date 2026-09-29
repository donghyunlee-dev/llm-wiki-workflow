# AI 교육 콘텐츠 관리자 Agent — 설계 (Lesson Curriculum Maintainer)

- 상태: 승인됨 (브레인스토밍 완료)
- 원 설계 입력: 사용자 제공 "AI 교육 콘텐츠 관리자 Agent 설계" 문서 (Lesson Player 연계 기준안)
- 화면 계약: `ai-lesson-player-development-design.md` (별도 프로젝트, 이 저장소 밖)

## 1. 범위

이 저장소(`SFOOD-LLM-WIKI-WORKFLOW`)는 **Confluence 콘텐츠(본문 + Content Property)만 생성**한다.

- 실제 Lesson Player(Scene 렌더링, Reveal 인터랙션, 반응형 Preview 등)와 Lesson Compiler(진짜 컴파일 검증)는 `ai-lesson-player-development-design.md`가 속한 별도 프로젝트에서 개발·운영한다.
- 이 저장소의 "self-check"는 실제 Compiler를 호출하지 않는다. 허용된 Scene Type/Layout/Motion enum, 콘텐츠 예산, H2-Scene Anchor 일치 여부를 **규칙 기반으로 자체 점검**하는 것으로, 원 설계 문서의 "Lesson Compiler Preview"를 이 저장소 안에서 흉내내는 대체 절차다.
- 원 설계 문서 전체(교육 목표, 교육 범위, Lesson 분할 기준, Scene Type/Layout/Motion 표, 콘텐츠 예산 표, 인터랙션 기준, 품질 평가 100점 배점 등)는 이 저장소의 콘텐츠 정책으로 그대로 채택한다. 이 설계 문서는 그 원 설계와 **이 저장소의 기존 아키텍처(policy.md, Approval Queue, 루틴 구조) 사이를 연결하는 결정 사항만** 다룬다.

## 2. docType / Content Property 정책 (적용 완료)

`skills/confluence-guide-maintainer/policy.md`에 이미 반영:

- `docType` 허용값: `guide`, `page`, `nav`, `lesson` (4종)
- `lesson`: `Lesson`(페이지 ID `183271425`) 하위 Course Index의 하위 Lesson 페이지 전용. 일반 Wiki 검색·추천·관련 문서 로직에서 **완전 제외** (nav와 유사하되 라우팅 전용도 아닌, 별도 학습 트랙)
- Course Index 페이지 자체는 `lesson`이 아니라 기존 `nav`를 사용 — Index 페이지 일관성 유지
- `lesson` 기본값: `audience: "beginner"`, `reviewCycleDays: 90` (guide/page와 동일)

## 3. 저장소 구조

기존 `confluence-guide-maintainer`와 완전히 분리된 새 스킬 폴더:

```
skills/lesson-curriculum-maintainer/
  ├── SKILL.md                    ← 스킬 정체성 + 핵심 원칙 (Wiki ≠ Core Course, 개선 우선 등)
  ├── policy.md                   ← 원 설계 문서의 교육 정책 전체를 이 저장소 형식으로 이관
  │                                  (Lesson 분할 기준, Scene Type/Layout/Motion 표, 콘텐츠 예산,
  │                                   나레이션 정책, 인터랙션 기준, 100점 품질 배점, 금지 행동)
  ├── course-targets.md           ← Lesson Root(183271425), Course Index ID, Lesson Approval Queue ID
  ├── agents/
  │   ├── charter-agent.md        ← Step 0: 교육과정 헌장
  │   ├── course-map-agent.md     ← Step 1: Chapter/Lesson 지도
  │   ├── lesson-brief-agent.md   ← Step 2: Lesson Brief
  │   ├── storyboard-writer-agent.md  ← Step 3: Storyboard + Confluence Draft
  │   ├── self-check-agent.md     ← Step 4: 규칙 기반 자체 점검 + 품질 점수
  │   └── signal-report-agent.md ← 매주: Wiki/검색 신호 수집·분류·개선 제안
  └── templates/
      ├── lesson-brief.md
      ├── scene-storyboard.md
      └── run-report.md
```

`routines/lesson-curriculum-maintenance.md` 신설 — `weekly-maintenance.md` 등과 동일한 문서 포맷.

## 4. 실행 흐름 (Step 게이트)

단일 루틴 안에서 매 실행마다 아래 순서로 진행하되, **이미 승인된 단계는 건너뛰고 다음 미승인 게이트에서 멈춘다.**

| Step | 담당 Agent | 산출물 | 게이트 |
|---|---|---|---|
| 0 | charter-agent | Course 헌장 초안 (기준 학습자 / 포함·제외 범위 / 수료 상태 / 완료 기준) | 사람 승인 필요 — 승인 전까지 이후 Step 진행 안 함 |
| 1 | course-map-agent | Chapter/Lesson 지도 (선행관계, 누락·중복·난이도 급상승 검사 포함) | 사람 승인 필요 |
| 2 | lesson-brief-agent | 승인된 지도의 미작성 Lesson별 Brief (Wiki 우선 검색 → 없으면 웹 검색) | 자동 진행 (구조 변경 아님) |
| 3 | storyboard-writer-agent | Scene Storyboard + Confluence Draft (본문 + `wiki.metadata`/`lesson.presentation`/`lesson.course`, 나레이션 포함, `status: draft`) | 자동 진행 |
| 4 | self-check-agent | 규칙 기반 자체 점검 + 100점 품질 점수 | 위반 0건 + 85점 이상만 `status: review`로 승격, 위반 있으면 `draft` 유지 + 사유 기록 |
| 5 | (공개) | — | `review` → `published` 전환은 **항상 사람 승인**. 이 루틴은 어떤 Step에서도 페이지 상태를 `published`로 바꾸지 않는다 |
| 매주 | signal-report-agent | Wiki/검색 신호 수집 → `NO_CHANGE`~`PROPOSE_ADVANCED_COURSE` 분류, run report | `IMPROVE_EXPLANATION`(기존 Lesson 문장·비유·시각화 개선)은 draft 갱신까지 자동. 신규 Lesson/구조변경 제안은 큐에 기록만 하고 자동 실행 안 함 |

### 승인 메커니즘

`Ops Log`(63111673) 하위에 **Lesson Approval Queue** 페이지 신설 (기존 weekly Approval Queue와 별개 — 판단 기준이 다름: Course 구조/Chapter/Lesson 추가·삭제·병합·순서변경·공개).

- 자동 실행 중에는 에이전트가 스스로 승인하지 않는다. 헌장/지도/구조변경 제안을 큐에 `status: pending`으로 기록하고 그 실행 회차는 이후 Step으로 진행하지 않는다.
- 사람의 승인은 실행 사이 언제든 큐 Confluence 페이지에서 상태를 `approved`로 바꾸는 것으로 이루어진다.
- 다음 실행(다음 금요일 자동 실행, 또는 대시보드 "▶ 실행" 수동 트리거)이 큐를 다시 읽어 `approved`면 다음 단계로 진행한다 — 기존 `weekly-maintenance`의 Approval Queue 처리 방식(Step 0.5)과 동일한 패턴.

## 5. 콘텐츠 정책 추가 사항

### 나레이션 (신규 — 원 설계 문서의 "강사 독립성" 원칙을 이 저장소 정책으로는 채택하지 않음)

원 설계 문서는 "화면에 보이는 내용만으로 이해되어야 하며 강의 대사는 선택적 발표 지원용"이라고 규정하지만, 이 저장소는 **Scene마다 강사가 말하듯 자연스러운 나레이션을 필수 요소로 작성**하는 것으로 대체한다.

- Scene마다 화면 표시 텍스트(제목/핵심 주장/시각자료)와 별도로 나레이션 Block을 둔다.
- 분량 제한 없음 — Scene마다 필요한 만큼 자유롭게 작성한다. 단, 화면 예산(제목 2줄, 본문 최대 3문단·140자, Bullet 5개 등)은 화면 표시 텍스트에만 적용되고 나레이션에는 적용하지 않는다.
- 문체: 소설책처럼 자연스럽게 흐르는 구어체 산문, 강사가 직접 설명하듯. 기존 Tone Policy(공문서체 금지, 말 걸듯 자연스럽게)를 그대로 따르되 훨씬 긴 호흡을 허용한다.
- 화면 표현: 유튜브 자막처럼 토글로 열어보는 스크롤형 패널. 이 UI 구현 자체는 Lesson Player(별도 프로젝트) 담당이며, 이 저장소의 Agent는 나레이션 **텍스트 내용**만 책임진다.
- `lesson.presentation`의 Scene 객체에 `narration` 필드를 추가한다 (원 설계 문서의 Storyboard YAML 스키마에 필드 추가).
- 품질 평가 100점 배점에 별도 항목을 추가하지 않고 기존 "이해 용이성"(20점) 항목에 포함해 평가한다.

### 그 외 채택 사항

원 설계 문서에 정의된 아래 항목은 수정 없이 그대로 채택한다:

- 교육 목표 / 교육 범위(포함·제외) / 학습자 시작 상태
- 콘텐츠 계층(Course/Chapter/Lesson/Scene/Block)과 Confluence-Player 매핑
- Lesson 분할·통합 기준
- Scene Type/Layout/Motion 허용 목록 및 화면 표현 선택 기준 표
- Scene 콘텐츠 예산 표 (나레이션 제외)
- 인터랙션 사용 기준 및 금지 항목
- Lesson Brief / Scene Storyboard YAML 스키마 (Storyboard에는 `narration` 필드 추가)
- 품질 평가 100점 배점 및 "무조건 비공개" 조건 목록 — 단 "Lesson Compiler Error"는 "self-check 규칙 위반"으로 대체
- 변경 유형 분류표(`NO_CHANGE` ~ `PROPOSE_ADVANCED_COURSE`), Core Course 보호 규칙, 권한과 승인 표, 금지 행동 목록

## 6. 에이전트 모델 / 스케줄

- `charter-agent`, `course-map-agent`, `lesson-brief-agent`, `storyboard-writer-agent`: `claude-sonnet-4-6` (설계·작문 판단 필요 — 기존 `writer-agent`/`synthesis-agent`와 동일 등급)
- `self-check-agent`: `claude-haiku-4-5-20251001` (규칙 기반 기계적 점검 — 기존 `harvest-agent`/`gap-agent`와 동일 등급)
- `signal-report-agent`: `claude-haiku-4-5-20251001` (신호 수집·분류)
- 스케줄: 금요일 21:00 KST = `0 12 * * 5` (UTC) — `weekly-maintenance`(매일 20:00 KST)와 겹치지 않는 시간대, 별도 루틴으로 등록

## 7. 미해결 항목 (구현 단계에서 확정)

- Course Index 페이지 ID: 최초 실행 시 생성 후 `course-targets.md`에 기록
- Lesson Approval Queue 페이지 ID: 최초 실행 시 Ops Log 하위 생성 후 `course-targets.md`에 기록
- 원 설계 문서의 "구현 단계" 중 "대표 Lesson 제작"(32개 기존 Slide 재분류, 기준본 확정)은 이 설계 범위 밖 — course-map-agent가 지도를 승인받은 뒤 실제 콘텐츠 제작 단계에서 별도로 진행
