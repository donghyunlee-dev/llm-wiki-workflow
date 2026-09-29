# Wiki Maintainer Commands

## `$wiki-update weekly`

Run the weekly AI development guide maintenance workflow.

### Behavior

- Read the configured root Guide Index.
- Read any related secondary Index pages before selecting targets.
- Read Playbook and FAQ pages as routine targets; run playbook expansion and FAQ promotion when their trigger conditions are met.
- Read the latest structured `playbook-analysis` result and merge safe guide candidates into the weekly gap-processing queue before writer execution.
- Identify target guide pages from the Index.
- **Discover missing pages**: compare the topic scope in `wiki-targets.md` against existing Confluence pages; auto-create pages that meet the policy criteria in `policy.md`.
- Check official sources for each target (existing and newly discovered).
- Compare latest source information with existing Confluence pages.
- Classify changes.
- Update pages when safe.
- Recompile pages when needed and safe.
- Create new pages automatically when official docs exist and topic is in scope.
- Create manual review reports for uncertain cases.
- Update related Index pages.
- Re-check the root Guide Index and related Index pages before completing the run so newly added or modified pages are not missed.
- Write a run report.

## `$wiki-update playbook`

Run only the playbook expansion routine. This uses the same Codex-wrapped workflow entry point and does not require a separate Claude agent process.

### Behavior

- Read the relevant Playbook page first.
- Read the related Playbook, FAQ, and guide Index pages.
- Search Confluence for an existing canonical guide or install page.
- Search official documentation for unsupported or incomplete answers.
- Write a structured `playbook-analysis` result that weekly mode can reuse as input for guide creation.
- Update an existing canonical page or create a new one when safe.
- Set `wiki.metadata` on every created or updated page.
- Update all related Index pages.
- Write a run report.
- Do not run Keyword Harvest, Gap Analysis, or Guide Synthesis unless explicitly needed by the playbook task.

## Supplemental Routine: Playbook and FAQ

These task files define recurring maintenance work that may run as part of weekly mode:

- `tasks/playbook-expansion.md`
- `tasks/faq-promotion.md`
- `tasks/approval-queue.md`

Playbook expansion turns weak or incomplete playbook answers into canonical guide or setup pages.
FAQ promotion turns repeated playbook questions into short FAQ pages based on existing canonical pages.
Playbook mode must also emit a structured analysis artifact so weekly mode can continue any safe guide-creation work without re-parsing the same Playbook rows from scratch.
Approval Queue keeps IT/policy approval items on a single Confluence page so weekly mode can resume them after a human marks them `approved`.

## `$wiki-update tool <tool-name>`

Update only the guide pages related to the given tool.

### Examples

- `$wiki-update tool codex`
- `$wiki-update tool claude`
- `$wiki-update tool gemini`
- `$wiki-update tool mcp`
- `$wiki-update tool anythingllm`

## `$wiki-discover ai-dev-tools`

Search for newly relevant AI development tools.

### Behavior

- Search official and trusted sources.
- Identify tools that require setup or usage guide pages.
- Check existing Confluence Index pages for duplicates.
- Propose new guide pages.
- Do not create new pages automatically unless explicitly instructed.
- Write a manual review report.

## `$wiki-index audit`

Audit Index pages.

### Behavior

- Read configured Index pages.
- Check for missing links, duplicate links, weak keywords, and orphan guide pages.
- Fix safe Index-only issues.
- Report uncertain cases.

## `$wiki-recompile page <page-id>`

Recompile a specific Confluence guide page.

### Behavior

- Read the target page.
- Identify source references.
- Check latest official sources.
- Rebuild the page into a coherent current guide.
- Update related Index pages.
- Write a run report.

## `$wiki-update guide-synthesis`

기존 `page` 타입 문서들을 분석해 `guide` 타입 문서를 생성한다.
전체 weekly 워크플로우를 실행하지 않고 Guide Synthesis 단계만 실행한다.

### Behavior

- Read the configured root Guide Index and related secondary Index pages.
- Collect all `page` type documents reachable from the Index pages.
- Apply `guide-synthesis-rules.md` clustering criteria to identify guide candidates.
- Evaluate candidates by priority (beginner access, story completeness, page count, wiki purpose fit).
- Create **at most 1 guide page** in this run.
- Record remaining candidates as `PENDING` in the Agent-Discovered Topics log in `wiki-targets.md`.
- Set `wiki.metadata` for the created guide per `policy.md`.
- Update related Index pages.
- Write a run report.

### 실행하지 않는 단계

- Keyword Harvest — 실행 안 함
- Gap Analysis — 실행 안 함
- Update Existing Guide — 실행 안 함

## Default Behavior

If the user gives a natural language command related to maintaining AI development guides, map it to the closest command above.

If the command is ambiguous, choose the safest read/report-only mode.
