# Policy

## 교육 목표

기초교육을 모두 마친 직원은 다음 상태에 도달해야 한다.

> AI가 무엇이며 어떻게 답하고 작업하는지 이해하고, AI Agent에게 업무를 맡길 때 필요한 개념과 주의사항을 알고, 이후 업무개선 개발 실습을 시작할 준비가 되어 있다.

수료자는 최소한 다음 내용을 자신의 말로 설명할 수 있어야 한다.

- AI가 입력을 받아 결과를 만드는 기본 원리
- AI가 잘하는 일과 하지 못하는 일
- Chat, Model, Agent의 차이
- Prompt와 지침이 결과에 미치는 영향
- 파일, token(사용량), Context, Memory, Session의 관계
- Agent가 계획하고 도구를 사용해 작업하는 방식
- AI의 결과가 틀릴 수 있는 이유
- 결과를 검증하고 보안을 확인해야 하는 이유
- AI를 활용한 업무개선이 어떤 과정으로 진행되는지

## 교육 범위

### 포함 범위

- AI와 생성형 AI의 기본 개념
- AI가 답을 만드는 방식에 대한 초보자 수준의 설명
- AI의 능력, 한계 및 Hallucination
- Chat, Model, Agent, Tool의 관계
- AI에게 목적과 업무 기준을 전달하는 기본 원리
- Prompt, 지침, 파일 및 참고자료의 역할
- claude의 유료 등급 및 토큰 사용량의 관계
- Context Window, Memory, Session의 개념과 차이
- Agent의 계획, 실행, 권한 및 도구 사용 구조
- 긴 작업의 분리, 요약 및 인계 개념
- 결과의 사실성, 품질, 보안 및 사람의 책임
- 이후 업무개선 개발 실습과 연결되는 전체 흐름

### 제외 범위

- 실제 서비스 구현
- 프로그래밍 언어 및 Framework 교육
- 특정 프로젝트의 코드 작성
- DB, API 및 인프라의 상세 구현
- 배포 실습
- 자동화 Workflow의 실제 구축
- 제품별 모든 기능과 최신 소식
- 전문가를 위한 내부 구현 원리

제외된 내용은 이후 실습 과정, 심화 과정 또는 Wiki Guide에서 제공한다.

## 학습자의 시작 상태

기준 학습자는 다음과 같이 가정한다.

- 사내 일반 직원
- 개발 경험을 요구하지 않음
- AI를 사용해 보지 않았거나 단순한 Chat 경험만 있음
- Model, Agent, Prompt, Context 등의 용어를 정확히 구분하지 못함
- 업무개선 도구나 자동화 서비스를 직접 만든 경험이 없음

교육 콘텐츠는 이 학습자가 강사의 부연 설명 없이 혼자 읽고 이해할 수 있는 수준으로 작성한다.

## 콘텐츠 계층

| 단위 | 역할 | 기준 |
| --- | --- | --- |
| Course | 기초교육 전체 | 수료 상태 하나를 완성 |
| Chapter | 이해가 성장하는 큰 단계 | 동일한 학습 목적을 가진 Lesson 그룹 |
| Lesson | 하나의 학습 질문 | 하나의 핵심 이해와 완료 상태 |
| Scene | 설명의 한 장면 | 문제, 비유, 개념, 사례, 검증 등 |
| Block | 화면 표현 단위 | 문장, 도형, 표, Screenshot, 질문 등 |

기존 슬라이드 한 장을 Lesson 하나로 취급하지 않는다. 여러 슬라이드는 하나의 Lesson을 구성하는 Scene 또는 Block으로 재사용할 수 있다.

콘텐츠 계층은 Confluence와 Lesson Player에서 다음과 같이 연결한다.

| 교육 단위 | Confluence 표현 | Player 표현 |
| --- | --- | --- |
| Course | `Lesson` 하위 Course Index 페이지 | Course Map |
| Chapter | Course Manifest의 그룹 정보 | Course Map의 레슨 그룹 |
| Lesson | Course Index 하위 페이지 | 하나의 Lesson Player 실행 단위 |
| Scene | Lesson 본문의 H2 | 좌우로 전환되는 한 화면 |
| Block | 문단, 목록, 표, Panel, Image | Scene 내부 의미 컴포넌트 |

Confluence 제목이나 생성 순서는 학습 순서를 결정하지 않는다. Course Index의 Manifest가 레슨 순서를 결정한다.

## Lesson 분할 기준

하나의 Lesson은 다음 조건을 만족해야 한다.

- 핵심 질문이 하나이다.
- 학습자가 새롭게 이해해야 할 중심 개념이 명확하다.
- 핵심 개념은 원칙적으로 세 개를 넘지 않는다.
- 앞 Lesson에서 시작하여 다음 Lesson로 이어지는 위치가 명확하다.
- 강사의 추가 설명 없이 약 5~10분 안에 이해할 수 있다.
- 학습 완료 여부를 질문이나 설명으로 확인할 수 있다.

다음 조건에 해당하면 별도 Lesson으로 분리한다.

- 학습자의 질문이 달라진다.
- 새로운 선행지식이 필요하다.
- 개념 설명에서 설치 또는 실행 방법으로 목적이 바뀐다.
- 독립적으로 검색할 가능성이 높은 핵심 주제이다.
- 한 Lesson 안에서 초급과 심화 내용이 섞인다.
- 설명이 길어져 핵심 메시지가 흐려진다.

다음 조건에 해당하면 기존 Lesson에 통합한다.

- 같은 학습 질문을 더 잘 설명하는 사례이다.
- 기존 개념의 오해를 바로잡는 내용이다.
- 동일한 이해를 돕는 새로운 비유나 시각 자료이다.
- 별도 Lesson으로 학습할 독립적인 완료 상태가 없다.

## 과정 설계 원칙

### 완결된 학습 스토리

기초교육은 기능 목록이 아니라 학습자의 이해가 성장하는 하나의 이야기로 구성한다.

학습 흐름은 다음 질문에 순서대로 답해야 한다.

- AI가 업무에 왜 등장했는가
- AI는 무엇이며 어떻게 답하는가
- AI는 무엇을 잘하고 어디에서 실패하는가
- Chat에서 Agent로 무엇이 달라지는가
- 사람은 AI에게 업무 기준을 어떻게 전달하는가
- AI는 어떤 정보와 자료를 사용해 작업하는가
- Agent는 어떻게 계획하고 도구를 사용해 실행하는가
- 긴 작업은 어떻게 이어지고 분리되는가
- 결과는 왜 틀릴 수 있으며 어떻게 검증하는가
- 사람이 AI와 안전하게 일하는 전체 구조는 무엇인가
- 이후 업무개선 개발 실습에서는 무엇을 하게 되는가

제품명과 기능명은 이 흐름을 설명하는 데 필요한 사례로 사용한다. 특정 제품의 메뉴 구조가 교육과정의 골격이 되어서는 안 된다.

### 선행 관계

모든 Lesson은 앞선 Lesson에서 습득한 개념을 기반으로 다음 이해를 만든다.

- 아직 설명하지 않은 용어를 전제로 사용하지 않는다.
- 선행 개념이 필요한 내용은 해당 개념 뒤에 배치한다.
- Lesson 순서를 변경할 때는 이후 Lesson에 미치는 영향을 함께 분석한다.
- 중간 Lesson을 생략해도 다음 Lesson을 이해할 수 있다면 두 Lesson의 경계가 적절한지 재검토한다.

### 유한한 Core Course

기초교육 과정은 무한히 확장하지 않는다.

- Core Course는 명확한 시작과 종료 지점을 가진다.
- 신규 정보의 기본 저장 위치는 Wiki이다.
- 기존 Lesson 개선을 신규 Lesson 추가보다 우선한다.
- 새로운 Lesson은 기초교육 수료에 반드시 필요한 학습 공백이 있을 때만 제안한다.
- 과정 구조 변경은 사람의 승인 없이 적용하지 않는다.

## Lesson 콘텐츠 품질 기준

### Lesson Player 적합성

Lesson은 내용이 정확할 뿐 아니라 실제 화면에서 읽히는 형태로 작성되어야 한다.

- 세로 문서를 작성한 뒤 화면에서 자동으로 잘라 내는 방식을 사용하지 않는다.
- Agent가 원고 단계부터 Scene 단위로 설명 호흡을 설계한다.
- Scene 하나에는 하나의 질문 또는 하나의 핵심 주장만 둔다.
- Scene의 제목, 본문, 시각 자료, Reveal 순서가 하나의 설명을 완성해야 한다.
- 화면에 표시되지 않는 강의 대사로 부족한 설명을 보충하지 않는다(단, 이는 화면 표시 텍스트가 그 자체로 자기 완결적이어야 한다는 뜻이며, Scene마다 별도로 요구되는 "나레이션 정책"과는 별개다 — 나레이션은 화면 콘텐츠의 빈틈을 메우는 용도가 아니라 추가 설명·톤을 더하는 용도다).
- Scene 이동 후 다음 내용을 이해하는 데 필요한 정보는 화면에 남기거나 다음 Scene에서 다시 연결한다.
- 한 Scene의 정보가 많으면 글자 크기를 줄이거나 내부 Scroll을 만들지 않고 Scene을 분리한다.
- 사용자의 `NEXT` 입력이 다음 설명 요소를 공개할지 다음 Scene으로 이동할지를 Storyboard에 명시한다.
- 시각 효과가 제거되어도 의미와 학습 순서가 유지되어야 한다.

### 나레이션 정책

원 설계 문서는 "화면에 보이는 내용만으로 이해되어야 하며 강의 대사는 선택적 발표 지원용"이라고 규정하지만, 이 스킬은 Scene마다 강사가 말하듯 자연스러운 나레이션을 필수 요소로 작성하는 것으로 대체한다.

- Scene마다 화면 표시 텍스트(제목/핵심 주장/시각자료)와 별도로 나레이션 Block을 둔다.
- 분량 제한 없음 — Scene마다 필요한 만큼 자유롭게 작성한다. 단, 아래 "Scene 콘텐츠 예산" 표는 화면 표시 텍스트에만 적용되고 나레이션에는 적용하지 않는다.
- 문체: 강사가 말하듯 자연스럽게 흐르는 구어체 산문("소설책" 톤). 정의를 먼저 던지지 않고 상황·질문으로 시작한다.
- 화면 표현(토글형 스크롤 자막 패널)은 Lesson Player(별도 프로젝트) 구현 사항이며 이 스킬은 텍스트만 책임진다.
- `lesson.presentation`의 Scene 객체에 `narration` 필드를 추가한다.

### 이해 중심 구성

모든 Lesson은 다음 학습 흐름을 기본으로 한다.

| 단계 | 목적 |
| --- | --- |
| 문제 인식 | 학습자가 겪을 수 있는 실제 상황 제시 |
| 학습 약속 | 읽은 후 이해할 내용을 명확히 안내 |
| 쉬운 설명 | 일상 또는 업무 비유로 직관 형성 |
| 정확한 개념 | 공식 용어, 범위 및 한계 설명 |
| 시각화 | 관계, 순서, 차이를 도형과 구조로 표현 |
| 업무 사례 | 실제 업무에서 나타나는 상황 연결 |
| 오해 교정 | 초보자가 자주 잘못 이해하는 내용 설명 |
| 이해 확인 | 자신의 말로 설명하거나 상황을 판단 |
| 핵심 정리 | 반드시 기억할 판단만 정리 |
| 다음 연결 | 다음 Lesson이 필요한 이유 안내 |

모든 Lesson을 동일한 카드 Template으로 반복하지 않는다. 학습 흐름은 일관되게 유지하되 시각 표현은 주제에 맞게 선택한다.

### 유튜브 수준의 설명력

인기 있는 초보자 대상 교육 영상처럼 다음 특성을 갖춰야 한다.

- 정의보다 사용자가 경험하는 문제로 시작한다.
- 중요한 결론을 초반에 알려준다.
- 전문용어보다 비유와 실제 사례를 먼저 사용한다.
- 하나의 개념을 여러 얕은 사례가 아니라 하나의 대표 사례로 깊게 설명한다.
- 잘못된 방식과 개선된 방식을 비교한다.
- 학습자가 예상할 질문을 콘텐츠 안에서 먼저 답한다.
- 내용이 자연스럽게 다음 장면으로 이어진다.
- 시각 자료가 장식이 아니라 정보를 전달한다.

### 시각 자료 선택

| 전달 목적 | 권장 표현 |
| --- | --- |
| 작동 순서 | 흐름도 또는 단계 변화 |
| 포함 관계 | 계층 구조 |
| 개념 차이 | 비교표 또는 전후 비교 |
| 선택 기준 | 조건별 분기 |
| 제품 사용 위치 | 실제 Screenshot과 강조 표시 |
| 추상 개념 | 일관된 비유 Illustration |
| 정상 여부 | 정상·비정상 결과 비교 |

다음 표현은 사용하지 않는다.

- 내용과 관련 없는 장식 이미지
- 의미 없이 반복되는 카드
- 글을 이미지 안에 길게 넣는 방식
- 모든 개념을 한 화면에 압축한 복잡한 Infographic
- 주제와 관계없이 동일한 Layout을 반복하는 방식

### Scene 콘텐츠 예산

Agent는 Scene을 작성할 때 다음 예산을 지켜야 한다.

| 항목 | 권장 | 하드 제한 |
| --- | ---: | ---: |
| Scene 제목 | 한 줄 | 두 줄 |
| 핵심 주장 | 1개 | 1개 |
| 본문 문단 | 1~2개 | 3개 |
| 문단 길이 | 45~90자 | 140자 |
| Bullet | 3개 | 5개 |
| 핵심 개념 | 1~2개 | 3개 |
| 주요 시각 자료 | 1개 | 1개 |
| 보조 시각 자료 | 0~1개 | 2개 |
| Reveal 단계 | 2~4개 | 6개 |
| 비교표 | 2~4열 | 5열 |

하드 제한을 넘으면 다음 순서로 다시 설계한다.

- 핵심 주장과 보충 설명을 구분한다.
- 보충 설명을 관련 Wiki Guide 또는 Reference로 이동한다.
- 서로 다른 질문과 인과 단계를 별도 Scene으로 분리한다.
- 분리된 Scene 사이에 이전 내용과 다음 내용의 연결 문장을 둔다.
- 분리 후 Lesson의 예상 학습시간과 Scene 수를 다시 평가한다.

Agent는 작은 글자, 내부 세로 Scroll, 과밀한 Infographic으로 콘텐츠 예산 문제를 해결해서는 안 된다.

*나레이션에는 이 예산을 적용하지 않는다. 위 "나레이션 정책" 참조.*

### 화면 표현 선택 기준

Agent는 먼저 학습 목적을 결정하고 그다음 Layout과 Motion을 선택한다.

| 학습 목적 | Scene Type | 기본 Layout | 기본 Motion |
| --- | --- | --- | --- |
| 익숙한 문제로 궁금증 형성 | `hook` | `focus`, `visual-split` | `fade`, `step-reveal` |
| 핵심 구조를 머릿속에 형성 | `mental-model` | `horizontal-flow`, `full-visual` | `path-draw`, `morph` |
| 하나의 개념을 설명 | `concept` | `visual-split` | `step-reveal` |
| 순서와 작동 원리를 설명 | `process` | `horizontal-flow`, `timeline` | `path-draw`, `stagger` |
| 비슷한 개념을 구분 | `comparison` | `side-by-side`, `grid` | `highlight` |
| 실제 상황에 연결 | `example` | `visual-split`, `screenshot-hotspot` | `zoom-focus` |
| 제품 화면의 위치를 설명 | `screenshot` | `full-visual`, `screenshot-hotspot` | `zoom-focus` |
| 초보자의 오해를 교정 | `misconception` | `side-by-side` | `morph`, `highlight` |
| 이해 여부를 확인 | `knowledge-check` | `focus`, `grid` | `feedback` |
| 기억 구조를 정리 | `summary` | `horizontal-flow`, `grid` | `stagger` |
| 다음 Lesson의 필요성 제시 | `closing` | `focus` | `fade` |

Agent는 표에 정의되지 않은 Scene Type, Layout 및 Motion을 임의로 만들지 않는다. 새로운 표현이 필요하면 콘텐츠 안에 임의 CSS나 Script를 넣지 않고 Player 기능 변경안으로 별도 제안한다.

### Motion 사용 기준

- Motion은 등장 순서, 인과, 변화, 비교 또는 관심 위치를 설명해야 한다.
- 단순 장식을 위한 반복 움직임은 사용하지 않는다.
- 하나의 Scene에서 주된 Motion 목적은 하나만 사용한다.
- `Reveal`은 학습자가 설명을 따라갈 수 있게 순서를 나눌 때 사용한다.
- 중요한 설명을 Hover에만 숨기지 않는다.
- `prefers-reduced-motion`에서 Motion이 사라져도 같은 내용을 이해할 수 있어야 한다.
- 자동으로 다음 Scene으로 넘어가는 설정은 만들지 않는다.
- 확대나 이동 효과는 멀미나 집중 저하를 일으키지 않는 수준으로 지정한다.

### 인터랙션 사용 기준

Agent는 인터랙션을 많이 넣는 것이 아니라 학습자가 직접 확인할 가치가 있을 때만 사용한다.

| 인터랙션 | 사용 조건 |
| --- | --- |
| 단계별 Reveal | 설명 순서를 한꺼번에 보면 인과가 흐려질 때 |
| Hover·Focus 강조 | 여러 요소 중 현재 설명 대상을 연결할 때 |
| Process Flow | 입력, 처리, 결과의 이동을 설명할 때 |
| Comparison 연동 강조 | 같은 비교 축의 차이를 동시에 확인할 때 |
| Screenshot Hotspot | 실제 화면에서 위치를 찾는 것이 학습 목표일 때 |
| Knowledge Check | 학습자가 개념을 자기 판단으로 구분해야 할 때 |

다음 항목은 금지한다.

- 마우스를 움직여야만 핵심 설명을 읽을 수 있는 구성
- 의미 없이 반응하는 장식 요소
- Scene 이동과 충돌하는 Drag
- 정답을 맞히지 못하면 다음으로 갈 수 없는 강제 진행
- 한 Scene에 여러 종류의 복잡한 인터랙션을 결합하는 방식

## 최초 실행 설계

콘텐츠가 없는 상태에서 Agent는 즉시 Lesson 본문을 작성하지 않는다.

### 교육과정 헌장 생성

Agent는 먼저 다음 내용을 정의한다.

- 기준 학습자
- 학습자의 시작 상태
- 기초교육 수료 상태
- 포함 범위와 제외 범위
- 전체 학습 스토리
- Chapter와 Lesson의 선행 관계
- Lesson 완성 기준
- 수료 이해도 평가 기준

### 교육과정 지도 생성

Agent는 수료 상태에서 역산하여 필요한 이해를 도출한다.

- 수료자가 설명할 수 있어야 할 개념을 정리한다.
- 개념 사이의 선행 관계를 연결한다.
- 하나의 질문과 완료 상태를 기준으로 Lesson을 나눈다.
- Lesson을 이해가 성장하는 순서로 배열한다.
- 누락, 중복, 갑작스러운 난이도 상승을 검사한다.

### Lesson Brief 생성

각 Lesson을 작성하기 전에 다음 Brief를 생성한다.

```yaml
lessonId: context-window-basic
learnerQuestion: AI는 왜 앞에서 말한 내용을 놓치는가
learningGoal: Context Window의 역할과 한계를 설명할 수 있다
prerequisites:
  - AI는 입력과 현재 정보를 사용해 답을 만든다
keyConcepts:
  - Context Window
  - 대화 축약
commonMisconceptions:
  - 같은 대화의 모든 내용을 동일하게 기억한다
businessExample: 장기간 진행한 기획 문서 작성
visualIntent:
  - 제한된 화이트보드 비유
scenePlan:
  - sceneId: context-problem
    purpose: 앞에서 말한 내용을 놓친 경험으로 질문을 만든다
    type: hook
    layout: visual-split
    motion: step-reveal
    reveal: manual
  - sceneId: context-window-model
    purpose: 제한된 입력 공간이라는 핵심 구조를 이해한다
    type: mental-model
    layout: horizontal-flow
    motion: path-draw
    reveal: manual
completionCheck:
  - Memory와 Context Window의 차이를 설명한다
nextLessonReason: 긴 작업을 Session으로 분리하는 방법을 이해하기 위해
```

Lesson Brief의 `scenePlan`은 선택 항목이 아니다. Scene의 학습 목적을 먼저 작성하고, 그 목적에 맞는 허용된 `type`, `layout`, `motion`, `reveal`을 선택한다.

### 화면 Storyboard 생성

Agent는 Lesson 본문을 작성하기 전에 각 Scene의 화면 Storyboard를 생성한다.

```yaml
sceneId: context-window-model
anchor: 컨텍스트-창이란
learnerStateBefore: AI가 같은 대화의 모든 내용을 계속 기억한다고 생각한다
learningClaim: AI가 답변에 사용할 수 있는 정보의 양에는 한계가 있다
type: mental-model
layout: horizontal-flow
motion: path-draw
reveal: manual
blocks:
  - order: 1
    kind: hook
    content: 한 번에 참고할 수 있는 정보에는 범위가 있다
  - order: 2
    kind: visual
    visualKind: context-window
    purpose: 지침, 대화, 파일, 새 요청이 하나의 제한된 공간을 사용함을 표현
  - order: 3
    kind: explanation
    content: 새 정보가 계속 들어오면 앞선 정보가 현재 답변에서 제외될 수 있다
narration: |
  (강사가 학습자에게 말하듯 자연스럽게 설명하는 산문. 분량 제한 없음.)
interaction:
  kind: step-reveal
  steps:
    - 지침과 이전 대화 표시
    - 파일과 새 요청 추가
    - 한계를 넘은 이전 정보 약화
completionEvidence: 학습자가 Context Window를 저장소가 아닌 현재 참고 범위로 설명한다
transitionToNext: 따라서 긴 작업에서는 정보를 나누고 요약하는 방법이 필요하다
```

Storyboard 검증 기준:

- `learnerStateBefore`와 `completionEvidence` 사이에 분명한 변화가 있다.
- `learningClaim`은 하나다.
- 모든 Block은 `learningClaim`을 설명하는 역할을 가진다.
- 시각 자료의 `purpose`가 장식이 아닌 정보 전달로 정의되어 있다.
- Reveal 순서가 말의 순서와 일치한다.
- 다음 Scene으로 이동해야 하는 이유가 있다.
- 콘텐츠 예산을 지킨다.

### Confluence 문서 골격 생성

Agent가 사용하는 기본 계층은 다음과 같다.

```text
Lesson
└── AI 기초교육 Index
    ├── Lesson Page
    ├── Lesson Page
    └── Lesson Page
```

- 기존 `Lesson` 페이지를 교육 트리의 고정 Root로 사용한다.
- `AI 기초교육 Index`를 Course 페이지로 생성하거나 기존 페이지를 갱신한다.
- Lesson 페이지는 Course Index의 하위 페이지로 생성한다.
- Draft 페이지도 같은 계층에 만들 수 있지만 `status: draft`로 표시해 학습자 화면에서 제외한다.
- Agent 내부 지침, 검토 보고서, 실행 로그를 공개 Lesson 하위 콘텐츠로 만들지 않는다.
- 별도 DB를 사용하지 않는다.

### Confluence 본문 작성

Agent는 Confluence 편집 화면에서도 이해 가능한 본문을 작성한다.

- H1은 Lesson 제목으로 한 번만 사용한다.
- H2 하나를 Player의 Scene 하나로 사용한다.
- H3는 Scene 내부의 보조 구분으로만 사용한다.
- Blockquote는 질문이나 Hook에 사용한다.
- Numbered List는 순서나 Process에 사용한다.
- Table은 비교에 사용한다.
- Info Panel은 보충 설명에 사용한다.
- Warning Panel은 주의 또는 오해 교정에 사용한다.
- Image와 Media에는 학습 목적에 맞는 대체 텍스트를 작성한다.
- Expand는 선택적 상세 설명에만 사용하고 핵심 설명을 숨기지 않는다.

지원하지 않는 임의 HTML, Script, iframe, 과도한 중첩 목록과 표는 생성하지 않는다.

### Confluence 속성 생성

Agent는 본문과 함께 다음 속성을 생성한다.

| Property | 대상 | 역할 |
| --- | --- | --- |
| `lesson.course` | Course Index | 과정 정보와 레슨 순서 |
| `wiki.metadata` | Lesson Page | ID, 상태, 순서, 목표, 선수 관계 |
| `lesson.presentation` | Lesson Page | Scene Anchor, Type, Layout, Motion, Reveal |

`lesson.course` 필수 항목:

- `schemaVersion`
- `courseId`
- `title`
- `audience`
- `status`
- `version`
- `lessonIds`
- `completionRule`
- `updatedAt`

`wiki.metadata` 필수 항목:

- `schemaVersion`
- `docType: lesson`
- `courseId`
- `lessonId`
- `chapter`
- `order`
- `status`
- `version`
- `audience`
- `estimatedMinutes`
- `prerequisites`
- `learningObjectives`

`lesson.presentation` 필수 항목:

- `schemaVersion`
- `lessonId`
- `theme`
- 모든 H2와 연결되는 `scenes`
- Scene별 `sceneId`, `anchor`, `type`, `layout`, `motion`, `reveal`, `narration`

ID는 제목과 분리하여 안정적으로 유지한다. 제목을 수정해도 `courseId`, `lessonId`, `sceneId`를 임의로 변경하지 않는다.

### Self-check 검증

Agent는 Confluence 페이지를 작성한 뒤 게시 전에 self-check-agent 규칙 검증을 실행한다.

검증 순서:

- Confluence 본문과 속성을 다시 읽는다.
- H2와 Scene Anchor의 연결을 확인한다.
- ADF가 의미 Block으로 변환되는지 확인한다.
- Scene Type, Layout 및 Motion Enum을 확인한다.
- 콘텐츠 예산을 확인한다.
- 이미지 대체 텍스트와 출처를 확인한다.
- 이전·다음 Lesson과 Course Manifest 연결을 확인한다.
- Desktop, Large Monitor, Tablet 및 Mobile Preview를 확인한다.
- Keyboard 탐색과 Reduced Motion 상태를 확인한다.

self-check 규칙 위반이 하나라도 있으면 게시를 차단한다. `Warning`은 사유와 처리 결정을 Draft 보고서에 기록한다.

### 순차 제작

Agent는 Lesson을 임의 순서로 병렬 생성하지 않는다.

- 선행 Lesson부터 작성한다.
- 완성된 Lesson의 용어와 설명을 다음 Lesson의 입력으로 사용한다.
- 각 Chapter가 끝날 때 전체 흐름과 중복을 재검토한다.
- Course 초안이 완성되면 처음부터 끝까지 하나의 이야기로 읽히는지 다시 평가한다.
- 각 Lesson은 본문 작성 전에 Brief와 Storyboard를 확정한다.
- 앞 Lesson에서 사용한 개념의 이름, 색상, 도형 및 비유를 다음 Lesson에서도 일관되게 사용한다.
- 각 Lesson 작성 후 self-check-agent 규칙 검증을 통과시킨 뒤 다음 Lesson로 이동한다.

## 지속 성장 설계

### 변화 입력

Agent는 다음 신호를 주기적으로 수집한다.

- 검색 결과가 없었던 질문
- 반복적으로 검색된 질문
- Lesson을 읽은 후 이어서 검색한 질문
- 신규 Wiki Guide
- 변경된 공식 문서
- 새로운 AI 제품, Model 또는 기능
- 오래된 Screenshot과 제품 설명
- 이해 확인에서 자주 틀린 항목
- 사용자의 이해하기 어렵다는 Feedback

### 변화 해석

변화는 콘텐츠 생성 명령이 아니라 교육과정 점검 신호로 처리한다.

Agent는 다음 순서로 판단한다.

- 기초교육 수료에 필요한 내용인가
- 기존 Lesson의 정확성에 영향을 주는가
- 기존 설명의 부족함을 보여주는가
- 관련 Guide 연결만으로 충분한가
- 기존 Lesson을 개선할 수 있는가
- 독립된 신규 Lesson이 반드시 필요한가
- 기초교육이 아니라 심화 과정에 해당하는가

### 변경 유형

| 변경 유형 | 적용 조건 |
| --- | --- |
| `NO_CHANGE` | 교육과정과 무관하거나 Wiki만으로 충분 |
| `LINK_GUIDE` | 기존 Lesson에 상세 참고자료 연결 필요 |
| `IMPROVE_EXPLANATION` | 비유, 사례, 시각화 또는 문장 개선 필요 |
| `UPDATE_FACT` | 오래되거나 틀린 사실 수정 필요 |
| `MERGE_CONTENT` | 중복 Lesson 또는 설명 통합 필요 |
| `REORDER_LESSON` | 선행 관계 또는 이야기 흐름에 문제 존재 |
| `PROPOSE_NEW_LESSON` | 기존 Lesson으로 해결할 수 없는 기초 학습 공백 |
| `PROPOSE_ADVANCED_COURSE` | 기초 범위를 벗어난 독립적인 심화 주제 |

Agent의 기본 선택은 `NO_CHANGE` 또는 기존 Lesson 개선이다.

## Core Course 보호 규칙

다음 정보는 자동으로 Core Course에 추가하지 않는다.

- 일회성 최신 소식
- 특정 제품의 세부 기능
- 제품별 모든 설치 옵션
- 개발자를 위한 전문 기술
- 검색 횟수가 적은 개별 질문
- 기존 Guide로 해결되는 문제
- 업무개선 실습 단계에서 배울 구현 내용

신규 Lesson은 다음 조건을 모두 충족할 때만 제안한다.

- 기초교육 수료자가 반드시 알아야 한다.
- 기존 Lesson에 자연스럽게 통합할 수 없다.
- 독립적인 학습 질문과 완료 기준이 있다.
- 선행 Lesson과 다음 Lesson이 명확하다.
- 전체 학습시간 증가가 정당하다.
- Course의 시작과 종료 스토리를 깨지 않는다.

**최초 생성 vs. 기존 구조 변경 구분:** 아직 승인된 Charter/Course Map이 없는 상태에서 처음 만드는 것은 "생성"이며 자동으로 진행한다. 이미 승인되어 운영 중인 Course의 목표·범위·Chapter 구성·Lesson 목록을 사후에 바꾸는 것은 "구조 변경"이며 사람의 승인을 받아야 한다. 신규 Lesson도, 이미 승인된 Course Map에 포함된 계획을 실제로 만드는 것이면 자동 생성 대상이고, 승인된 Map에 없던 Lesson을 새로 추가·삭제·병합·순서 변경하는 것만 구조 변경으로 취급한다.

## 품질 평가

100점 기준으로 평가하며 85점 이상이고 self-check 규칙 위반이 없으면 자동으로 `published` 상태로 전환한다. 이 100점 배점과 self-check 게이트는 승인된 Course Map 범위 안에서 storyboard-writer-agent가 새로 만든 Lesson Draft에만 적용된다. 기존 Lesson 개선(`IMPROVE_EXPLANATION`/`UPDATE_FACT`)은 signal-report-agent가 이 self-check 게이트를 거치지 않고 직접 페이지를 갱신하며 이미 `published`였던 상태를 유지한다 — 이 경우 별도의 100점 재평가는 이루어지지 않는다.

| 평가 영역 | 배점 | 평가 기준 |
| --- | ---: | --- |
| 이해 용이성 | 20 | 강사의 설명 없이 초보자가 이해 가능한가 |
| 사실 정확성 | 15 | 공식 자료 및 현재 제품 기준과 일치하는가 |
| 학습 흐름 | 15 | 앞뒤 Lesson과 자연스럽게 연결되는가 |
| 사례 설명력 | 10 | 실제 업무 상황으로 개념을 이해시킬 수 있는가 |
| 시각 전달력 | 15 | 시각 자료가 관계와 원리를 효과적으로 전달하는가 |
| 화면 적합성 | 15 | Scene 예산, Layout, Reveal 및 가독성 기준을 지키는가 |
| 기초 범위 적합성 | 10 | 실습이나 심화 내용으로 불필요하게 확대되지 않는가 |

다음 중 하나라도 해당하면 점수와 관계없이 공개하지 않는다.

- 공식 근거 없이 현재 제품 기능을 단정함
- 강사의 추가 설명이 없으면 이해할 수 없음
- 핵심 질문과 학습 완료 상태가 불명확함
- 기존 콘텐츠를 단순히 반복함
- 비유가 실제 개념을 왜곡함
- 앞에서 설명하지 않은 용어를 당연한 지식으로 사용함
- Wiki의 최신 소식을 그대로 교육 콘텐츠로 옮김
- 기초교육 범위를 넘어 구현 방법을 과도하게 포함함
- H2와 Scene Anchor가 일치하지 않음
- 허용되지 않은 Scene Type, Layout 또는 Motion을 사용함
- 핵심 내용을 Hover나 강의 대사에만 숨김
- Scene 콘텐츠 예산을 맞추기 위해 작은 글자나 내부 Scroll을 요구함
- 이미지 대체 텍스트 또는 필요한 출처가 없음
- Confluence 본문과 Presentation Property의 의미가 다름
- self-check 규칙 위반이 남아 있음

## 권한과 승인

Agent가 자동으로 수행할 수 있는 작업:

- Wiki 및 검색 신호 분석
- 중복과 관련성 분석
- Lesson 개선안 작성
- Lesson Brief, 원고 및 Storyboard Draft 작성
- 공식 출처와 최신성 검증
- 품질 점수 산정
- **아직 승인된 Charter/Course Map이 없을 때의 최초 Charter 생성, 최초 Course Map 생성**
- 승인된 Course Map 범위 안에 있는 신규 Lesson의 Course Index/Lesson Page `draft` 생성
- Confluence 본문과 Content Property의 Draft 작성
- self-check-agent 규칙 검증
- **self-check 통과(85점 이상 + 규칙 위반 0건) 시 해당 Lesson의 `draft` → `published` 자동 전환** (승인된 Course Map 범위 안에서 storyboard-writer-agent가 새로 만든 Lesson Draft에 한함)
- 기존 Lesson 개선(`IMPROVE_EXPLANATION`/`UPDATE_FACT`) — signal-report-agent가 self-check 게이트 없이 직접 갱신 (구조 변경이 아니므로 사람 승인도 불필요하지만, 100점 재평가 대상도 아니다)
- 기존 Published 페이지를 직접 덮어쓰지 않는 변경안 생성

사람의 승인이 필요한 작업 (이미 승인되어 운영 중인 Course 방향성을 바꾸거나 큰 폭으로 변경하는 경우만):

- 이미 승인된 Course 목표·기초교육 포함 범위 변경
- Chapter 추가 또는 삭제
- 이미 승인된 Course Map에 없던 Lesson의 추가, 삭제, 병합 또는 순서 변경
- 제품 선택 및 보안 관련 권고 변경
- Published Page의 본문 또는 Property 전체 교체(recompile 수준)
- Scene ID 삭제 또는 진행 상태 Reset
- 새로운 Scene Type, Layout, Motion 또는 UI Component 도입

## 금지 행동

Agent는 다음 행동을 해서는 안 된다.

- 검색 결과가 없다는 이유만으로 Lesson 생성
- Wiki 문서를 요약하여 교육 콘텐츠로 바로 게시
- 최신 소식을 Course에 자동 삽입
- 기존 Course 흐름을 분석하지 않고 메뉴 추가
- 제품 기능을 교육 목표로 설정
- 전문용어와 기능을 많이 소개하는 것을 품질 향상으로 판단
- 기존 Lesson을 보존한 채 유사 Lesson을 계속 추가
- 출처와 검증일 없이 최신 정보를 게시
- 강의 대사에 의존하는 짧은 Slide를 완성된 Lesson으로 판단 (화면 콘텐츠가 빈약한데 나레이션으로 때운 상태를 금지하는 것이며, 필수 항목인 "나레이션 정책" 자체를 금지하는 것이 아니다)
- 사람의 승인 없이 Core Course 구조 변경
- 자유 형식의 긴 문서를 작성하고 Player가 자동으로 해결할 것이라 가정
- 임의 HTML, CSS, JavaScript 또는 지원하지 않는 Embed 생성
- 허용 목록에 없는 Scene Type, Layout 또는 Motion 생성
- 한 Scene에 여러 핵심 개념과 인터랙션을 압축
- 콘텐츠가 많다는 이유로 작은 글자나 내부 세로 Scroll 사용
- Hover, Mouse 이동 또는 Animation에만 핵심 정보 배치
- 본문만 수정하고 `lesson.presentation`을 갱신하지 않음
- Property만 수정하고 사람이 읽는 Confluence 본문을 갱신하지 않음
- self-check 규칙 위반이 있는 Lesson을 검토 단계로 제출
