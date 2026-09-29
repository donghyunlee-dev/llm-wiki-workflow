# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is a **Codex agent workspace** for maintaining AI development guide pages in Confluence. It is not a traditional application — there is no build step or test suite. The "code" is structured agent instructions and workflow definitions that a Codex agent executes to read/write Confluence pages.

## Running the Workflow

```bash
# Weekly maintenance (verify + update all active guide pages)
./wiki-update.sh weekly

# Update guides for a specific tool
./wiki-update.sh tool <name>        # e.g., tool claude, tool codex, tool gemini

# Audit Index pages for missing links, duplicates, orphans
./wiki-update.sh index audit

# Search for new AI development tools to document
./wiki-update.sh discover ai-dev-tools

# Recompile a specific Confluence page by ID
./wiki-update.sh recompile page <page-id>

# Synthesize guide-type documents from existing page-type documents
./wiki-update.sh guide-synthesis
```

`wiki-update.sh` wraps Codex. It requires Codex to be installed and a Confluence MCP connection to be configured. The agent reads `AGENTS.md` on startup, then loads the `confluence-guide-maintainer` skill.

## Architecture

### Execution Path

```
wiki-update.sh
  └─ Codex agent (reads AGENTS.md for role scope)
       └─ skills/confluence-guide-maintainer/
            ├─ SKILL.md                ← skill identity + core principle
            ├─ commands.md             ← maps CLI args to execution modes
            ├─ workflow.md             ← execution loop (Keyword Harvest → Gap Analysis → Create → Guide Synthesis → ...)
            ├─ policy.md               ← docType 정의, metadata 스키마, update/recompile/create/escalate 기준
            ├─ source-roles.md         ← source trust hierarchy (official docs > community posts)
            ├─ indexing-rules.md       ← Index page structure and mandatory link rules
            ├─ recompile-rules.md      ← when to rewrite vs. append, page scope enforcement
            ├─ guide-synthesis-rules.md← page 타입 문서에서 guide 타입 문서 자동 생성 규칙
            ├─ validation-checklist.md ← pre-delivery checks including metadata validation
            ├─ wiki-targets.md         ← confirmed page IDs, discovery keywords, keyword harvest log
            └─ templates/              ← run-report, guide, index-entry, manual-review
```

Run reports are written to `runs/YYYY-MM-DD-<description>.md` after every execution.

### Lesson Curriculum Maintainer (교육 콘텐츠)

`skills/lesson-curriculum-maintainer/`는 `confluence-guide-maintainer`와 완전히 분리된 스킬로, AI 기초교육 Course/Lesson Confluence 콘텐츠를 담당한다. `routines/lesson-curriculum-maintenance.md`가 매주 금요일 실행하며, Course 구조 변경과 Draft 공개는 `Lesson Approval Queue` 페이지를 통한 사람 승인이 필요하다. 상세 정책은 `skills/lesson-curriculum-maintainer/policy.md`, 상세 설계는 `docs/superpowers/specs/2026-07-30-lesson-curriculum-agent-design.md` 참조.

### Key Design Principles

**Index-first navigation** — The agent must discover all pages by traversing Index pages, never by direct page ID lookup alone. Every guide page must be reachable from at least one Index page (no orphans).

**Source grounding** — Every content change must cite an official or trusted source. The trust hierarchy is defined in `source-roles.md` (official docs > GitHub repo > release notes > official blog > package registry > community).

**Recompile over append** — When a page's structure is stale, rewrite it coherently rather than adding "As of [date]…" sections. See `recompile-rules.md`.

**Conservative automation** — Minor content updates and command changes are applied automatically. Security/auth changes, billing information, source conflicts, and large structural removals require a manual review item in the run report.

### Confluence Page Inventory

Confirmed Index page IDs are maintained in `skills/confluence-guide-maintainer/wiki-targets.md`:

| Index | Page ID |
|-------|---------|
| Root Index | 63045651 |
| Tool Index | 87851100 |
| Codex Index | 63995906 |
| Claude Code Index | 66846748 |
| Gemini Index | 88211525 |
| Ops Log | 63111673 |
| Lesson Root | 183271425 |

> Course Index / Lesson Approval Queue 페이지 ID는 아직 해당 페이지가 존재하지 않아(Task 9 pending) `skills/lesson-curriculum-maintainer/course-targets.md`가 현재의 source of truth이다.

### Language Convention

Company-facing documentation is written in **formal Korean**. Technical terms, tool names, CLI commands, and code blocks remain in English.

## Modifying the Workflow

- To change what the agent does: edit `skills/confluence-guide-maintainer/workflow.md`
- To change update/recompile/creation thresholds: edit `policy.md`
- To change guide synthesis clustering logic: edit `guide-synthesis-rules.md`
- To add or remove target pages / keywords: edit `wiki-targets.md`
- To change report or page structure: edit files under `templates/`
- Codex workspace settings (approval behavior, doc size limits): `.codex/config.toml`
