# Document Maintenance Policy

## Primary Policy

The agent maintains Confluence AI development guide documents as a structured, indexed, source-grounded wiki.

## docType Policy

페이지 생성 또는 metadata 설정 시 `docType`은 반드시 `guide`, `page`, `nav`, `lesson` 중 하나만 사용한다.
다른 값(`faq`, `policy`, `library`, `playbook`, `ops` 등)은 새로 설정하지 않는다.

| docType | 정의 | Wiki 검색 | Wiki 노출 | 추천/관련 |
|---------|------|----------|----------|---------|
| `guide` | 사용자가 목적을 가지고 따라가는 스토리형·종합형·단계형 문서 | 검색 가능 | 노출 | 추천 중심 |
| `page` | 실제 설치, 설정, 실행, 설명이 있는 단위 문서 | 검색 가능 | 노출 가능 | 보조 연결 |
| `nav` | 다른 문서로의 내비게이션 진입점 역할만 하는 Index 문서 | 검색 제외 | 노출 제외 | 라우팅 전용 |
| `lesson` | AI 기초교육 Course를 구성하는 개별 학습 단위 문서 (Lesson Player 전용) | 검색 제외 | 노출 제외 | 추천/관련 대상 아님 |

**`nav` 사용 기준:** Index 페이지(`wiki-targets.md`의 Confirmed Index Pages)에만 설정한다. 본문에 실질적인 콘텐츠 없이 링크 테이블만 있는 순수 탐색 페이지에 적용한다. 신규 Index 페이지 생성 시 반드시 `docType: "nav"`를 설정한다.

**`lesson` 사용 기준:** `Lesson`(페이지 ID 183271425) 하위 Course Index 페이지의 하위 Lesson 페이지에만 설정한다. 일반 Wiki 검색·추천·관련 문서 로직에서 완전히 제외한다 — Lesson 콘텐츠는 Wiki와 별개로 관리되는 독립된 학습 트랙이며 Lesson Player를 통해서만 접근한다. Course Index 페이지 자체는 `lesson`이 아니라 `nav`를 사용한다.

### Title Prefix Normalization Policy

Confluence에 생성하거나 업데이트하는 모든 유지관리 대상 문서 제목은 반드시 아래 규칙으로 정규화한다.

- 허용 제목 접두사는 `[Guide]`와 `[FAQ]` 두 가지뿐이다.
- `[Concept]`, `[Concept & Workflow]`, `[Workflow]`, `[Reference]`, `[Setup]`, `[Usage]` 같은 역할 접두사는 제목에 사용하지 않는다.
- 공식 소스나 갭 분석 결과가 concept/reference/workflow/setup 성격이어도 제목 접두사는 `[Guide]`로 강제 변환한다.
- 역할 구분은 제목 접두사가 아니라 `wiki.metadata.docType`으로 표현한다.
- 단일 주제 설명·설치·설정·명령어·레퍼런스 문서는 제목은 `[Guide] ...`로 만들고 `docType: "page"`를 설정한다.
- 여러 page를 엮는 스토리형·종합형·단계형 문서는 제목은 `[Guide] ...`로 만들고 `docType: "guide"`를 설정한다.
- FAQ Promotion으로 생성하는 FAQ 문서는 반드시 제목을 `[FAQ] ...`로 시작한다. `[Guide]` 접두사를 사용하지 않는다.
- 기존 페이지를 업데이트할 때 금지 접두사가 발견되면 같은 실행에서 `[Guide]` 제목으로 변경하고 관련 Index 링크도 함께 갱신한다. 단, `[FAQ]` 접두사는 변경하지 않는다.

### 페이지 생성 시 metadata 설정

페이지 생성 후 Confluence Content Properties API로 `wiki.metadata` 키에 아래 전체 JSON을 설정한다.
**필드를 생략하지 않는다.** 값이 없는 배열 필드는 `[]`로 설정한다.

**Content Properties API 접근이 불가능하거나 실패해도 페이지 생성 자체를 보류하지 않는다.** 페이지는 계획대로 생성하고, metadata 설정에 실패하면 그 사실을 run report의 Manual Review 항목에 페이지 ID와 함께 기록해 다음 실행에서 재시도한다. FAQ Promotion 등 다른 생성 경로와 동일하게, metadata 쓰기 가능 여부와 페이지 생성 여부는 별개로 판단한다.

```json
{
  "docType": "guide",
  "audience": "beginner",
  "status": "published",
  "prerequisites": [12345678],
  "next": [12345679],
  "related": [12345680],
  "lastReviewedAt": "YYYY-MM-DD",
  "reviewCycleDays": 90,
  "keywords": ["keyword1", "keyword2"]
}
```

### 필드별 설정 기준

| 필드 | 타입 | 허용값 | 설명 |
|------|------|--------|------|
| `docType` | string | `guide` `page` `lesson` | 위 docType 표 참조. 다른 값은 사용하지 않음 |
| `audience` | string | `beginner` `intermediate` `advanced` | 문서 대상 독자 수준 |
| `status` | string | `draft` `published` `archived` | 신규 페이지는 `published`. 미완성이면 `draft` |
| `prerequisites` | array | Confluence 페이지 ID 숫자 배열 | 이 문서를 읽기 전 선행 필요 페이지 ID. 없으면 `[]` |
| `next` | array | Confluence 페이지 ID 숫자 배열 | 이 문서 이후 이어서 볼 다음 단계 페이지 ID. 없으면 `[]` |
| `related` | array | Confluence 페이지 ID 숫자 배열 | 직접 연결은 아니지만 관련 있는 페이지 ID. 없으면 `[]` |
| `lastReviewedAt` | string | `YYYY-MM-DD` | 페이지 생성 시 오늘 날짜. 리컴파일·업데이트 시 갱신 |
| `reviewCycleDays` | number | 정수 | 정기 검토 주기. 아래 기본값 참조 |
| `keywords` | array | 문자열 배열 | 검색 키워드. 도구명·기능명·워크플로우명 포함 |

### docType별 기본값

| docType | audience | reviewCycleDays |
|---------|----------|----------------|
| `guide` | `"beginner"` | `90` |
| `page` | `"beginner"` | `90` |
| `lesson` | `"beginner"` | `90` |

### docType 선택 기준 (이 위키에서 주로 쓰이는 유형)

| 상황 | 선택할 docType |
|------|-------------|
| 특정 도구 전체 사용 흐름을 다루는 종합 문서 | `guide` |
| 여러 단위 문서를 연결하는 단계형·스토리형 문서 | `guide` |
| 설치·설정·실행·개념·명령어·레퍼런스 등 단일 주제 단위 문서 | `page` |
| `Lesson` 하위 Course Index를 구성하는 개별 학습 단위 문서 (Lesson Player용) | `lesson` |

## Update Policy

Update an existing guide when:

- The guide is canonical.
- The latest official source confirms the change.
- The change improves accuracy or usability.
- The existing page structure can support the change.

## Recompile Policy

Recompile an existing guide when:

- The page has accumulated disconnected updates.
- The installation flow changed significantly.
- The authentication flow changed significantly but is safe and well sourced.
- The page structure no longer matches the current tool workflow.
- The guide mixes outdated and current instructions.

Prefer recompile over appending a "latest update" section.

## New Page Policy

### Auto-create (no explicit instruction needed)

Create a new page automatically when ALL of the following are true:

- The topic is listed in the "Topic Scope" section of `wiki-targets.md`, or clearly belongs to an in-scope tool.
- No canonical Confluence page already exists for the topic.
- Official documentation exists and is the primary source.
- The content can be translated and structured in Korean without ambiguity.
- A parent page and at least one Index page are known.

### Manual review required

Do not auto-create and instead file a manual review item when:

- The topic is not listed in scope and its relevance is uncertain.
- An existing page may cover the same topic under a different title.
- Source is not official documentation (community post, blog, unofficial guide).
- The topic involves authentication, security, billing, or compliance.

If a parent page ID or Index page ID is unknown, record the topic in the run report as a creation candidate and resolve it in the next run.

## Page Scope Policy

페이지 제목이 그 페이지의 계약이다. 제목이 정의한 범위만 다룬다.

- "CLI Setup" 페이지에 사용법, 명령어 목록, 개념 설명을 넣지 않는다.
- "개요" 페이지에 상세 설치 절차를 넣지 않는다.
- 리컴파일 또는 업데이트 중 범위를 벗어난 내용을 발견하면 `recompile-rules.md`의 Auto Page Split Rule에 따라 분리한다.
- 분리된 페이지는 반드시 관련 Index에 등록하고 원본 페이지에서 링크한다.

## Index Policy

Every guide page must be reachable from at least one Index page.

After creating or updating a page, update all relevant Index pages.

## Manual Review Policy

Manual review is required for:

- Security-sensitive content
- Authentication changes
- Billing and pricing
- Compliance or approval processes
- Conflicting sources
- Unofficial-only sources
- Deleting pages
- Merging pages
- Removing Index links
- Large structural changes without explicit instruction

## Safety Policy

Never write:

- API keys
- Access tokens
- Passwords
- Internal credentials
- Private endpoint secrets
- Personal data
- Unsupported claims
- Unverified installation steps

## Tone Policy

### 기본 방향

친절한 블로그 글처럼 쓴다. 선생님이 학생에게 처음 개념을 설명해주는 것처럼, 독자가 낯선 내용을 만나도 막히지 않게 배려하며 쓴다.

딱딱한 요약본이나 레퍼런스 문서처럼 쓰지 않는다. 독자가 "읽고 싶다"고 느끼는 글을 목표로 한다.

### 구체적인 글쓰기 기준

**도입부**: 이 문서가 왜 필요한지, 읽고 나면 무엇을 할 수 있는지 1~2문장으로 먼저 알려준다.

**설명 방식**:
- 개념을 소개할 때는 "왜 이게 필요한가"를 먼저 짚고, 그 다음에 "어떻게 쓰는가"로 넘어간다.
- 익숙하지 않은 용어는 처음 등장할 때 한 줄로 쉽게 풀어준다.
- 단계별 절차는 번호를 붙여 순서대로 안내한다.
- 코드 블록 앞에는 "이 명령어는 ~을 합니다" 같은 한 줄 설명을 붙인다.

**문체**:
- 한국어 문체는 격식체(~합니다, ~입니다)를 사용하되, 딱딱하지 않게 쓴다.
- 긴 문장보다 짧고 명확한 문장을 선호한다.
- 독자에게 말 걸듯 자연스럽게 쓴다. 예: "설치가 끝났다면, 이제 설정을 해볼게요."
- 과도한 명사 나열(설치 후 설정 완료 확인 필요)보다 동사 중심 문장을 쓴다.

**금지**:
- "본 문서는 ~에 대해 기술한다" 같은 공문서 문체
- 내용 없는 요약 나열 ("개요, 설치, 설정, 검증" 같은 목차만 있는 글)
- 과도한 마케팅 표현
- 근거 없는 주장

### 기술 용어

기술 용어, 도구 이름, CLI 명령어, 코드 블록은 영어 원문 그대로 사용한다.

### 기존 페이지 업데이트 시 톤 재정비

기존 페이지를 업데이트할 때 내용 변경과 함께 글 전체의 톤도 이 기준에 맞게 다시 정비한다.
내용이 최신이어도 톤이 딱딱하면 `TONE_REWRITE` 변경 유형으로 분류하고 재작성한다.
