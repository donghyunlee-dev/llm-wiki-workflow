# Approval Queue Task

## Purpose

Manage a single Confluence Approval Queue page for items that cannot be auto-applied until an IT or policy approver explicitly allows them.

The queue must support:
- human approval in-place
- weekly reuse of approved items
- automatic cleanup of old completed/rejected rows
- continuous operation inside one page

## Queue Page

- Title: `[Ops] Weekly Approval Queue`
- **Confluence Page ID: `120520705`**
- Parent: `63111673` (Ops Log — [Ops] Knowledge Change Log)
- Operating model: one page only
- Template source: `templates/approval-queue-template.md`

Do not create a separate queue page per run.

## Required Page Sections

The page must contain these sections in order:

1. `## 사용 방법`
2. `## 상태 범례`
3. `## 활성 큐`
4. `## 자동 정리 규칙`
5. `## History`

## Page Template

When creating or normalizing the queue page, use `templates/approval-queue-template.md`.

## Queue Row Schema

Each active queue row should preserve:

- `id`
- `created_at`
- `source`
- `domain`
- `topic`
- `reason`
- `recommended_action`
- `status`
- `approver`
- `approved_at`
- `note`
- `source_page_id`
- `source_question`
- `source_url`

## Status Handling

- Blank status: newly created, not yet reviewed
- `pending`: explicitly under review
- `approved`: weekly may process it
- `rejected`: weekly must skip it
- `done`: weekly processed it successfully

Weekly must only execute rows with `status = approved`.

## Cleanup Rules

- Move `done` rows older than 7 days from `활성 큐` to `History`
- Move `rejected` rows older than 14 days from `활성 큐` to `History`
- Keep `pending` rows in `활성 큐`
- Keep blank-status rows in `활성 큐`
- Preserve notes when moving rows to `History`

## When To Add A Queue Row

Add a row instead of directly updating a guide when:

- the content says `IT 담당자 검토 후`
- org-specific approval is needed
- authentication, permissions, network, compliance, or policy boundaries must be confirmed
- the topic is technically documentable but operationally sensitive

Do not use the queue for:

- missing official sources
- direct source conflicts
- obvious duplicate pages
- missing parent/index path that cannot be resolved yet

Those stay as manual-review items.

## Weekly Integration

During weekly runs:

1. Read the queue page
2. Extract `approved` rows
3. Merge approved rows into the weekly work queue
4. Process them as create/update candidates
5. Mark successful rows `done`
6. Keep failed rows `approved` and append a short note
7. Compact old `done`/`rejected` rows into `History`
