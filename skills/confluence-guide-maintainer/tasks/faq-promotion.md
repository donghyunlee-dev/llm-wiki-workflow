# FAQ Promotion Task

## Purpose

Promote repeated playbook questions into a Confluence FAQ page that answers the question faster than a general search result.

This FAQ is not a new official-documentation rewrite. It is a precomputed answer that combines existing canonical guide and install pages into a short, useful response.

## Trigger

Run this task when the following threshold is crossed (checked per 7-day rolling window):

| Condition | Action |
|-----------|--------|
| 동일 주제/키워드 클러스터가 Playbook에서 **2회 이상** 부족 판정 + 기존 canonical 페이지 조각을 합성하면 답 가능 | FAQ 후보(`faq_candidate`)로 분류 → 즉시 FAQ 페이지 생성 |
| 동일 주제/키워드 클러스터가 **3회 이상** 부족 판정 + 공식 소스 기반 신규 문서 필요 | Guide 후보(`guide_candidate`)로 분류 → weekly에서 Guide 생성 |

**주제 동일성 판단 기준:**
- 부족 키워드 중 2개 이상 겹치거나
- 질문의 핵심 명사(도구명·기능명·워크플로우명)가 동일하면 같은 주제로 간주한다.

**FAQ가 필요한 경우 (guide_candidate가 아닌 faq_candidate):**
- 이미 존재하는 canonical 페이지들을 조합하면 빠른 답 합성이 가능한데, 한 페이지에 모아두지 않아서 검색이 느린 경우
- "이 도구로 X를 하려면?" 형태의 반복 질문으로 짧은 직접 답변 페이지가 유용한 경우

**FAQ가 아닌 guide_candidate로 보낼 경우:**
- 공식 소스를 새로 조사해야 답 가능한 경우
- 기존 canonical 페이지가 없어서 새 문서를 써야 하는 경우

## Required Inputs

- Relevant FAQ page or FAQ Index page
- Relevant Playbook pages that contain the repeated question
- Canonical guide pages
- Canonical install or setup pages

## Required Order

1. Read the FAQ page or FAQ Index first.
2. Read the related Playbook pages.
3. Find the canonical guide and install pages that answer the question.
4. Synthesize the best short answer from those canonical pages.
5. Decide whether to update an existing FAQ page or create a new one.

## Decision Rules

- Prefer an existing FAQ page when the topic already exists.
- Create a new FAQ page only when no canonical FAQ page covers the question.
- Do not research a brand-new official-documentation topic just to create the FAQ.
- If the answer is still unclear after combining existing canonical pages, create a manual review item.

## Page Creation Rules

When creating or updating the FAQ page:

- **제목은 반드시 `[FAQ]`로 시작한다.** 예: `[FAQ] Claude Code를 설치하는 방법은?`
- `[Guide]` 또는 다른 접두사를 사용하지 않는다.
- Set `wiki.metadata`.
- Use `docType: "page"`. The workflow no longer uses a separate `faq` docType.
- Add the page to the relevant FAQ and parent Index pages.

## Page Structure

**반드시 `templates/faq-template.md`를 기준으로 페이지를 작성한다.**

아래는 각 섹션 작성 시 반드시 지켜야 할 원칙이다.

### 제목

독자가 실제로 검색할 법한 질문 문장을 그대로 제목으로 쓴다.
내부 분류 용어나 기능명 나열이 아니라, "내가 막혔을 때 검색창에 치는 말"이 제목이어야 한다.

예시:
- 좋음: `[FAQ] Claude Code에서 MCP 서버를 추가하려면 어떻게 하나요?`
- 나쁨: `[FAQ] MCP 서버 설정 방법`

### 한 줄 요약

제목 바로 아래에 핵심 답을 한 문장으로 작성한다. 독자가 제목과 이 문장만 읽어도 방향을 잡을 수 있어야 한다.

### 이런 상황이라면

독자가 이 질문을 하게 되는 상황을 공감하는 방식으로 설명한다. 요약이 아니라 독자가 자신의 상황과 이 페이지가 맞는지 확인하게 해주는 문장이다.

### 답변

다음 순서로 작성한다:
1. 왜 이렇게 되는지 / 어떤 개념인지 먼저 짚는다 (1~2문장)
2. 단계별 절차를 번호와 소제목으로 안내한다
3. 각 코드 블록 앞에 "이 명령어는 ~을 합니다" 한 줄 설명을 붙인다
4. 마지막에 확인 방법을 안내한다

요약하거나 나열하지 않는다. 독자가 처음 접하는 사람이라고 가정하고 설명한다.

### 자주 실수하는 부분

경고나 금지 사항이 아니라, "이렇게 하면 더 잘 됩니다" 스타일로 2~3개를 안내한다.
캐노니컬 페이지에서 공통적으로 언급되는 주의 사항만 포함한다.

### 다음에 읽으면 좋은 페이지

링크 목록이 아니라 표 형식으로 작성한다. 각 페이지가 왜 다음 단계인지 한 줄로 설명한다.
이 섹션이 비어 있으면 FAQ 페이지가 독립된 섬이 되므로 반드시 2개 이상 포함한다.

### 관련 질문

같은 맥락에서 파생되는 다른 FAQ나 관련 주제 페이지를 연결한다. 없으면 섹션을 생략한다.

### 출처

답변 근거가 된 캐노니컬 Confluence 페이지와 공식 소스 URL을 모두 나열한다.

## Output

The task should produce one of these outcomes:

- Updated FAQ page
- New FAQ page
- Manual review item

## Validation

- The answer is based on existing canonical pages.
- The FAQ page is reachable from an Index page.
- The metadata is complete.
- The page clearly improves answer speed and reuse.
