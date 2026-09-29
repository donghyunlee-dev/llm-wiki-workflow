# Playbook Expansion Task

## Purpose

Turn weak or incomplete playbook answers into canonical Confluence guide pages or installation pages.

Playbook pages are the pages where a searched question and the drafted response are recorded. If the response is not enough to stand on its own, the missing part should be rebuilt into a proper guide page grounded in official documentation.

## Trigger

Run this task when a playbook page contains:

- An incomplete answer
- A vague or unsupported answer
- A response that needs official documentation to be trustworthy
- A case where the playbook is becoming a reusable guide instead of a one-off response

## Required Inputs

- Relevant Playbook page
- Relevant Playbook Index page
- Relevant FAQ Index page if the same topic may later be promoted
- Related guide or install pages already in Confluence

## Required Order

1. Read the Playbook page first.
2. Read the relevant Playbook and FAQ Index pages.
3. Search the Confluence space for existing canonical guide or install pages.
4. Search official documentation.
5. Decide whether to update an existing page or create a new one.

## Decision Rules

- If a canonical guide or install page already exists, update it instead of creating a duplicate.
- If the topic needs a new canonical page, create the page under the correct parent and Index path.
- If the answer depends on conflicting or unclear sources, stop and create a manual review item.
- Do not write unsupported claims into the page body.

## Page Creation Rules

When creating or updating the canonical page:

- Set `wiki.metadata`.
- Use the correct `docType` for the page role.
- Include source references.
- Add the page to the relevant Index pages immediately.
- Keep the page scope aligned with its title.

## Output

The task should produce one of these outcomes:

- Updated canonical guide page
- New canonical guide page
- Manual review item

**절대 생성 금지:**
- "Playbook Expansion 처리 결과 - YYYY-MM-DD" 형식이나 이와 유사한 작업 요약 페이지
- 접두사가 `[Guide]` 또는 `[Install]`이 아닌 임의 제목의 Confluence 페이지
- 런 요약·처리 결과·실행 보고 등의 목적으로 Confluence에 페이지를 생성하는 행위 (런 보고는 로컬 `runs/` 디렉토리에만 기록)

## Validation

- The source used is official whenever possible.
- The page is reachable from at least one Index page.
- The page metadata is complete.
- The page does not duplicate an existing canonical page.

