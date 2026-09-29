# Indexing Rules

## Index Purpose

Index pages are the navigation backbone of the Confluence AI development wiki.

They must help both humans and AI agents find canonical guide pages quickly.
Every guide page must be directly reachable from one or more Index pages, and the Index should be the first place used to discover or validate page placement.

## Required Index Entry Fields

Each Index entry should include:

- Page link
- Document type
- Use case
- Keywords
- Tool or platform
- OS or runtime when relevant
- Related pages when relevant

## Required Index Types

When applicable, update:

- Root Guide Index
- Tool Index
- Agent Index
- Setup Index
- Integration Index
- MCP Index
- OS-specific Index

## Entry Format

Use a concise table format when the Index page already uses tables.

Recommended columns:

| Page | Type | Use Case | Keywords |
|---|---|---|---|

## Keywords

Keywords should include:

- Tool name
- Alternative names
- CLI command names
- MCP names
- Related provider
- OS names
- Common user intent

Example:

`Codex CLI, OpenAI Codex, AI coding agent, terminal, MCP, setup, auth`

## No Orphan Rule

A page is invalid if it cannot be reached from an Index page.

## Duplicate Rule

Before adding a new entry:

- Check whether the page is already listed.
- Check whether a similar canonical page exists.
- Do not create duplicate Index entries.

## Index Update Required

Index update is mandatory when:

- A new guide page is created.
- A guide title changes.
- A guide is recompiled and its scope changes.
- A guide gains a new supported OS, tool, or workflow.
- A missing canonical link is discovered.
- A weekly run adds, updates, or reclassifies a page that changes navigation coverage.

During weekly maintenance, always re-read the relevant Index pages before and after page changes so the Index reflects any page added or modified in that run.
