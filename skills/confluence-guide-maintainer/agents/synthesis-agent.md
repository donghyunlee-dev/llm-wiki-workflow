# Synthesis Agent

## 역할

모든 Writer Agent의 결과를 취합해 아래 작업을 순서대로 실행한다:

1. Index 페이지 업데이트
2. Guide Synthesis (조건 충족 시)
3. `wiki-targets.md` 갭 로그 업데이트
4. 런 리포트 작성 (`runs/{TODAY}-weekly.md`)
5. Ops Log 업데이트

## 입력

- `date`: 실행 날짜 (YYYY-MM-DD)
- `repo`: 리포지토리 루트 경로
- `mode`: 실행 모드 (예: `weekly`)
- `write_results_dir`: Writer Agent 결과 파일 디렉토리 (예: `tmp/`)

## 사전 준비

다음 파일을 읽는다:

- `tmp/write-result-claude.json`
- `tmp/write-result-codex.json`
- `tmp/write-result-other.json`
- `tmp/gap-result.json`
- `skills/confluence-guide-maintainer/guide-synthesis-rules.md`
- `skills/confluence-guide-maintainer/indexing-rules.md`
- `skills/confluence-guide-maintainer/validation-checklist.md`
- `skills/confluence-guide-maintainer/wiki-targets.md`
- `skills/confluence-guide-maintainer/templates/run-report-template.md`

## Step 1: 결과 취합

세 개의 write-result 파일에서 아래 목록을 하나로 합친다:

- `all_pages_created`: 전체 생성 페이지 목록
- `all_pages_updated`: 전체 업데이트 페이지 목록
- `all_manual_review_items`: 전체 수동 검토 항목

## Step 2: Index 페이지 업데이트

`all_pages_created`의 각 페이지에 대해:

1. 해당 페이지의 `doc_type`과 `domain`을 기준으로 연결해야 할 Index 페이지를 `wiki-targets.md`에서 확인한다.
2. `mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 해당 Index 페이지를 읽는다.
3. 새로 생성된 페이지 링크가 없으면 `mcp__claude_ai_Atlassian_Rovo__updateConfluencePage`로 링크를 추가한다.
4. `indexing-rules.md`의 필수 링크 규칙을 따른다.

업데이트한 Index 페이지를 `index_pages_updated` 목록에 기록한다.

고아 페이지(어떤 Index에도 연결되지 않은 페이지) 발생 시 즉시 Index에 추가한다.

## Step 3: Guide Synthesis (weekly 모드만)

`mode`가 `weekly`인 경우에만 실행한다.

`guide-synthesis-rules.md`의 클러스터링 기준으로:

1. 연관된 `page` 타입 문서 그룹을 찾는다.
2. 해당 흐름을 커버하는 `guide` 타입 문서가 이미 있으면 건너뛴다.
3. 가장 가치 있는 후보 1개를 선택해 `guide` 페이지를 생성한다.
4. 생성된 guide 페이지를 관련 Index에 등록한다.
5. 나머지 후보는 `wiki-targets.md` 에이전트 발견 주제 로그에 `PENDING`으로 기록한다.

후보가 없으면 "Guide Synthesis: 조건 미충족, 생성 없음"으로 기록한다.

## Step 4: wiki-targets.md 업데이트

`wiki-targets.md`를 읽어 아래 항목을 업데이트한다:

### 4a. PENDING 항목 상태 변경

`gap-result.json`의 `pending_resolved` 목록의 항목들을 `wiki-targets.md` "에이전트 발견 주제" 로그에서 찾아:
- 이번에 생성됐으면 상태를 `CREATED`로, 페이지 ID를 함께 기록한다.
- 처리하지 못했으면 `PENDING` 상태를 유지한다.

### 4b. 신규 발견 갭 기록

`gap-result.json`의 `gaps` 중 이번에 생성하지 못한 항목을 `PENDING`으로 기록한다.

### 4c. Keyword 상태 업데이트

이번 실행에서 검색한 Discovery Keywords를 `SEARCHED` 상태로 변경한다.

### 4d. Keyword Harvest Log 업데이트

이번 실행 날짜와 처리 요약을 Keyword Harvest Log에 추가한다.

`wiki-targets.md`를 `Write` 도구로 업데이트한다.

## Step 5: Validation

`validation-checklist.md`의 체크리스트를 실행한다.

각 항목에 대해 PASS / FAIL / SKIP을 기록한다.

## Step 6: 런 리포트 작성

`templates/run-report-template.md`를 읽어 아래 내용으로 `runs/{date}-weekly.md`를 작성한다:

- **Execution mode**: `weekly`
- **Executed at**: `{date}`
- **Pages Read**: HarvestAgent가 읽은 Index 페이지 + Writer Agent가 읽은 페이지
- **Pages Updated**: `all_pages_updated` 목록
- **Pages Created**: `all_pages_created` 목록
- **Index Pages Updated**: `index_pages_updated` 목록
- **Guide Synthesis**: 생성 결과 또는 미충족 사유
- **Keyword Harvest**: 추가된 키워드 수 또는 "신규 키워드 없음"
- **Sources Used**: Writer Agent가 사용한 소스 URL 목록
- **Manual Review Required**: `all_manual_review_items` 목록
- **Validation Result**: Step 5 결과

`Write` 도구로 파일을 저장한다.

## Step 7: Ops Log 업데이트

`mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 Ops Log 페이지 (`63111673`)를 읽는다.

아래 형식의 항목을 맨 위에 추가한다:

```
## {date} — weekly

- 생성: {pages_created_count}개
- 업데이트: {pages_updated_count}개
- Index 업데이트: {index_pages_updated_count}개
- Manual Review: {manual_review_count}개
- 런 리포트: runs/{date}-weekly.md
```

`mcp__claude_ai_Atlassian_Rovo__updateConfluencePage`로 Ops Log를 업데이트한다.

## 완료 조건

- `runs/{date}-weekly.md`가 정상 작성됨
- Index 업데이트 완료
- `wiki-targets.md` 업데이트 완료
- Ops Log 업데이트 완료 (또는 MCP 오류 시 런 리포트에 기록)

## 오류 처리

- write-result 파일이 하나라도 없으면 해당 도메인을 "결과 없음"으로 처리하고 계속 진행한다.
- MCP 오류 시 해당 항목을 런 리포트의 Manual Review에 기록하고 계속 진행한다.
- `wiki-targets.md` 업데이트 실패 시 런 리포트에 오류를 기록하고 계속 진행한다.
