# Validation Checklist

Before finishing a run, verify:

## Page Validation

- The target guide page exists or was created under the correct parent page.
- The page title follows the wiki naming convention: it starts with `[Guide]`.
- The page title does not start with `[Concept]`, `[Concept & Workflow]`, `[Workflow]`, `[Reference]`, `[Setup]`, or `[Usage]`.
- The page has a clear purpose.
- The page content is source-grounded.
- The page has source references.
- The page has related pages when relevant, and they are rendered as plain bullet links or native Confluence links, not raw HTML.
- The page body does not contain visible `wiki.metadata`, `## wiki.metadata`, or JSON metadata blocks.
- The page does not expose secrets or private values.
- The page does not contain unsupported claims.

## Metadata Validation

페이지 생성 또는 업데이트 후 `wiki.metadata` content property가 아래 조건을 충족하는지 확인한다.

- `docType` 이 설정되었고 `guide` 또는 `page` 중 하나인가?
- `audience` 가 설정되었는가?
- `status` 가 `published`, `draft`, `archived` 중 하나인가?
- `prerequisites`, `next`, `related` 가 Confluence 페이지 ID 숫자 배열인가? (빈 배열 `[]` 허용)
- `keywords` 가 문자열 배열인가? (빈 배열 `[]` 허용)
- `lastReviewedAt` 이 오늘 날짜(YYYY-MM-DD)로 설정되었는가?
- `reviewCycleDays` 가 숫자로 설정되었는가?
- 9개 필드 중 누락된 필드가 없는가?

기존 페이지를 업데이트할 때 `wiki.metadata`가 없거나 일부 필드가 누락된 경우, 이번 업데이트에서 전체 JSON을 완성해서 재설정한다.

## Index Validation

- The page is reachable from at least one Index page.
- Related Index pages were updated.
- Index entry has use case.
- Index entry has keywords.
- Duplicate Index entries were not created.
- No orphan page was created.

## Change Validation

- Change type was classified.
- Decision was recorded.
- Sources were recorded.
- Manual review items were recorded when required.

## Page Split Validation

리컴파일 중 섹션을 제거했다면 아래를 반드시 확인한다:

- 제거한 섹션마다 신규 페이지를 생성했거나, 해당 섹션이 빈 내용이었음을 확인했는가?
- 신규 페이지가 관련 Index에 등록되었는가?
- 원본 페이지에서 신규 페이지로의 링크가 추가되었는가?
- 런 리포트 "Pages Created"에 분리된 페이지가 기록되었는가?

섹션을 제거했는데 새 페이지가 없다면, 런 리포트를 완성하기 전에 해당 섹션 내용으로 새 페이지를 생성한다.

## Report Validation

- Run report was written.
- Updated pages are listed.
- Created pages are listed.
- Index updates are listed.
- Manual review items are listed.
- Validation result is included.
