# Confluence Guide Maintainer Skill

## Purpose

This skill defines how Codex should maintain Confluence-based AI development guide documents.

The agent must update existing guides, create missing guides, and maintain Index pages so that both humans and AI agents can discover the correct canonical documentation.

## Core Principle

The Confluence wiki is an indexed knowledge system.
Every guide page in this project must be organized and discovered through Index pages, and Index pages must contain direct links to the canonical pages they expose.

Therefore:

- Index-first navigation is mandatory.
- Canonical page detection is mandatory.
- Index-linked page discovery is mandatory.
- Index update is mandatory after page creation or meaningful update.
- Recompile is preferred over appending disconnected updates.
- All generated or updated content must be source-grounded.

## Required Workflow

Follow the workflow in:

`workflow.md`

Supplemental task files:

- `tasks/playbook-expansion.md`
- `tasks/faq-promotion.md`
- `tasks/approval-queue.md`

## Supported Commands

Use the command definitions in:

`commands.md`

## Policy

Follow the document maintenance policy in:

`policy.md`

## Source Rules

Use the source priority and trust rules in:

`source-roles.md`

## Indexing Rules

Follow:

`indexing-rules.md`

## Recompile Rules

Follow:

`recompile-rules.md`

## Guide Synthesis Rules

Follow:

`guide-synthesis-rules.md`

## Validation

Before finishing any run, execute the checklist in:

`validation-checklist.md`

## Post-Run Log

When the shared Ops log page is available, append a concise post-run entry to:

`[Ops] Knowledge Change Log` (`63111673`)

The entry should summarize:

- Execution mode
- Pages updated or created
- Index pages updated
- Any notable source or structure changes
- A short note that the run report was written

## Templates

Use templates from:

`templates/`

## Tool Expectations

The agent may use:

- Confluence MCP tools
- Web search
- Local file read/write
- Shell only when needed for local workflow operations

## Confluence Operating Rules

When working in Confluence:

- Read the relevant Index page first.
- Follow links from the Index to canonical pages.
- Search Confluence only if Index navigation is insufficient.
- Treat the Index page as the authoritative navigation map for page discovery and scope selection.
- Re-read the root Guide Index and any related Index pages during weekly runs so newly added or modified pages are not missed.
- Prefer updating the canonical page over creating a new page.
- Create a new page only when no canonical page exists.
- Always update the related Index pages.
- Keep all guide pages directly linked from at least one Index page.
- Always record source references.
- Always write a run report.

## Manual Review Conditions

Stop automatic modification and create a manual review report when:

- Official sources conflict.
- Only unofficial sources are available.
- Authentication, security, billing, or compliance behavior changed significantly.
- The page may need deletion, merge, or major restructuring.
- Required Index page cannot be found.
- MCP tool access is unavailable or returns inconsistent data.
