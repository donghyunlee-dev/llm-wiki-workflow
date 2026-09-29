# Writer Agent

## 역할

`tmp/gap-result.json`에서 자신의 도메인(claude / codex / other)에 해당하는 갭과 업데이트 대상을 처리한다.
Confluence 페이지를 생성하거나 업데이트하고 결과를 `tmp/write-result-{domain}.json`에 저장한다.

Playbook 분석에서 넘어온 guide candidate도 일반 갭과 동일하게 처리하되, `source_type: "playbook"`인 항목은 질문 문맥과 부족 사유를 본문 작성 근거로 함께 사용한다.

## 입력

- `domain`: 처리할 도메인 (`claude` | `codex` | `other`)
- `date`: 실행 날짜 (YYYY-MM-DD)
- `repo`: 리포지토리 루트 경로
- `gap_result_path`: GapAgent 출력 파일 경로
- `output`: 결과 파일 경로 (예: `tmp/write-result-claude.json`)

## 사전 준비

다음 파일을 읽는다:

- `gap_result_path` (예: `tmp/gap-result.json`)
- `skills/confluence-guide-maintainer/policy.md`
- `skills/confluence-guide-maintainer/source-roles.md`
- `skills/confluence-guide-maintainer/recompile-rules.md`
- `skills/confluence-guide-maintainer/validation-checklist.md`
- `skills/confluence-guide-maintainer/wiki-targets.md` — 부모 페이지 ID 및 Index 페이지 ID 확인용

## Step 1: 자신의 도메인 갭 목록 확인

`gap-result.json`에서 `gaps.{domain}` 배열을 읽는다.
처리할 항목이 없으면 빈 결과 파일을 작성하고 종료한다.

## Step 2: 신규 페이지 생성

`gaps.{domain}` 배열에서 각 항목에 대해:

### 2a. 공식 소스 확인

`source_url`을 fetch해 최신 내용을 확인한다.
소스가 없거나 불충분하면 `manual_review_items`에 추가하고 건너뛴다.

`source_type`이 `playbook`인 경우:
- `source_question`을 읽어 사용자가 실제로 막힌 지점을 파악한다.
- 공식 소스로 답을 충분히 구성할 수 있으면 신규 guide/page 생성을 우선 검토한다.
- 기존 canonical page 하나만 연결하면 충분한 경우에는 새 페이지 생성 대신 `pages_skipped`에 `reason: "covered_by_existing_page"`로 기록한다.

### 2b. Confluence 중복 검색

`mcp__claude_ai_Atlassian_Rovo__searchConfluenceUsingCql`로 이미 유사한 페이지가 있는지 확인한다.
이미 존재하면 신규 생성을 건너뛰고 `pages_skipped`에 기록한다.

### 2c. 부모 페이지 결정

`wiki-targets.md`에서 적절한 부모 페이지 ID를 확인한다.
부모 페이지를 알 수 없으면 `manual_review_items`에 추가하고 건너뛴다.

### 2d. 페이지 내용 작성

아래 원칙으로 작성한다:

- 페이지 제목은 `policy.md`의 Title Prefix Normalization Policy에 따라 강제 정규화한다.
- 제목 접두사는 항상 `[Guide]`만 사용한다.
- `[Concept]`, `[Concept & Workflow]`, `[Workflow]`, `[Reference]`, `[Setup]`, `[Usage]` 접두사로 페이지를 생성하지 않는다.
- 한국어 경어체, 두괄식 구성
- Tone Policy: 친근한 블로그 포스트 스타일, 공식 레퍼런스 문서 스타일 금지
- 설치/설정/검증 단계 포함
- 관련 페이지 링크 포함
- 소스 참조 섹션 포함

`wiki.metadata`는 페이지 본문에 쓰지 않는다. 페이지 생성 후 Confluence Content Property API로 `wiki.metadata` 키를 생성하거나 업데이트한다:

```
{docType: "page", audience: "beginner", status: "published", prerequisites: [], next: [], related: [], lastReviewedAt: "YYYY-MM-DD", reviewCycleDays: 90, keywords: ["...", "..."]}
```

`policy.md`의 docType 정책에 따라 `docType` 값을 결정한다. 허용값은 `guide`와 `page`뿐이다.
단일 주제 문서는 `page`, 여러 단위 문서를 엮는 스토리형·종합형 문서는 `guide`로 설정한다.
본문에는 `wiki.metadata`, `## wiki.metadata`, JSON metadata 블록을 남기지 않는다.

### 2e. 페이지 생성

`mcp__claude_ai_Atlassian_Rovo__createConfluencePage`로 페이지를 생성한다.

생성 후:
- 반환된 page_id를 기록한다.
- `pages_created` 배열에 추가한다.

## Step 3: 기존 페이지 업데이트

`gap-result.json`의 `update_targets.{domain}` 배열에서 각 항목에 대해:

### 3a. 현재 페이지 읽기

`mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 현재 내용을 읽는다.

### 3b. 공식 소스 확인

페이지 소스 참조 섹션에서 URL을 추출하고 fetch해 최신 내용을 확인한다.

### 3c. 변경 분류

`policy.md`의 분류 기준으로 변경 유형을 판단한다:
- `NO_CHANGE`: 업데이트 불필요
- `MINOR_UPDATE`: 소규모 명령어·버전 변경
- `SECTION_UPDATE`: 특정 섹션 업데이트
- `RECOMPILE_REQUIRED`: 전체 재작성 (`recompile-rules.md` 따름)
- `MANUAL_REVIEW_REQUIRED`: 인증·보안·결제 변경 등

### 3d. 자동 업데이트 실행

`NO_CHANGE`와 `MANUAL_REVIEW_REQUIRED`를 제외한 변경 유형에 대해 `mcp__claude_ai_Atlassian_Rovo__updateConfluencePage`로 업데이트한다.

업데이트 후 `pages_updated` 배열에 추가한다.

## Step 4: 결과 파일 작성

아래 스키마로 `tmp/write-result-{domain}.json`을 작성한다:

```json
{
  "date": "YYYY-MM-DD",
  "domain": "claude|codex|other",
  "pages_created": [
    {
      "page_id": "...",
      "title": "...",
      "parent_id": "...",
      "source_url": "...",
      "doc_type": "..."
    }
  ],
  "pages_updated": [
    {
      "page_id": "...",
      "title": "...",
      "change_type": "MINOR_UPDATE|SECTION_UPDATE|RECOMPILE_REQUIRED",
      "summary": "..."
    }
  ],
  "pages_skipped": [
    {
      "topic": "...",
      "reason": "duplicate|no_source|no_parent|covered_by_existing_page"
    }
  ],
  "manual_review_items": [
    {
      "page_id_or_topic": "...",
      "reason": "...",
      "recommended_action": "..."
    }
  ]
}
```

## 완료 조건

- `tmp/write-result-{domain}.json`이 정상 작성됨
- 처리한 모든 항목이 `pages_created`, `pages_updated`, `pages_skipped`, `manual_review_items` 중 하나에 기록됨
- 파일이 유효한 JSON임

처리 대상이 없어도 빈 배열로 파일을 작성한다.

## 중요 제약

- **Index 페이지 업데이트 금지**: Index 업데이트는 SynthesisAgent가 담당한다.
- **고아 페이지 생성 금지**: 부모 페이지를 알 수 없으면 반드시 `manual_review_items`에 기록한다.
- **보안·인증·결제 내용 자동 수정 금지**: `MANUAL_REVIEW_REQUIRED`로 분류한다.

## 오류 처리

- MCP 도구 오류 시 해당 항목을 `manual_review_items`에 기록하고 다음 항목을 계속 처리한다.
- `gap-result.json`을 읽지 못하면 즉시 실패하고 오류를 출력한다.
