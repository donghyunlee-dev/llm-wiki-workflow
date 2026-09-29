# Harvest Agent

## 역할

Confluence Index 페이지를 탐색해 현재 위키의 전체 페이지 목록과 메타데이터를 수집한다.
결과를 `tmp/harvest-result.json`에 저장한다.

## 입력

- `date`: 실행 날짜 (YYYY-MM-DD)
- `repo`: 리포지토리 루트 경로
- `output`: 결과 파일 경로 (기본값: `tmp/harvest-result.json`)

## 사전 준비

다음 파일을 읽는다:

- `skills/confluence-guide-maintainer/wiki-targets.md` — Index 페이지 ID 목록

## Step 1: Index 페이지 ID 읽기

`wiki-targets.md`의 "Confirmed Index Page IDs" 섹션에서 아래 페이지 ID를 확인한다:

| Index | Page ID |
|-------|---------|
| Root Index | 63045651 |
| Tool Index | 87851100 |
| Codex Index | 63995906 |
| Claude Code Index | 66846748 |
| Gemini Index | 88211525 |
| Ops Log | 63111673 |

## Step 2: Index 페이지 읽기

각 Index 페이지에 대해 `mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 내용을 읽는다.

또한 `mcp__claude_ai_Atlassian_Rovo__getConfluencePageDescendants`로 하위 페이지 목록을 수집한다.

## Step 3: 각 하위 페이지 메타데이터 수집

각 하위 페이지에 대해:

1. `mcp__claude_ai_Atlassian_Rovo__getConfluencePage`로 페이지 내용을 읽는다.
2. Confluence Content Property API에서 `wiki.metadata` property를 조회해 아래 필드를 추출한다. 페이지 본문에서 metadata 블록을 찾지 않는다:
   - `docType`: page / guide
   - `status`: published / draft / archived
   - `lastReviewedAt`: 날짜
   - `reviewCycleDays`: 숫자

페이지가 많아서 전부 읽기 어려울 경우, Index 페이지에서 링크로 나열된 페이지만 처리하고 나머지는 제목과 ID만 기록한다.

## Step 4: 결과 파일 작성

`tmp/` 디렉토리가 없으면 생성한다.

아래 스키마로 `tmp/harvest-result.json`을 작성한다:

```json
{
  "date": "YYYY-MM-DD",
  "index_pages": [
    {
      "page_id": "63045651",
      "title": "Root Index",
      "child_count": 0,
      "children": [
        {
          "page_id": "...",
          "title": "...",
          "doc_type": "page|guide|unknown",
          "status": "published|draft|archived|unknown",
          "last_reviewed_at": "YYYY-MM-DD|null",
          "review_cycle_days": 90
        }
      ]
    }
  ],
  "all_pages": [
    {
      "page_id": "...",
      "title": "...",
      "doc_type": "...",
      "status": "...",
      "last_reviewed_at": "...",
      "review_overdue": true
    }
  ],
  "summary": {
    "total_pages": 0,
    "overdue_pages": 0,
    "no_metadata_pages": 0
  }
}
```

`review_overdue`는 `lastReviewedAt + reviewCycleDays < today`일 때 `true`로 설정한다.

## 완료 조건

- `tmp/harvest-result.json`이 정상 작성됨
- `all_pages` 배열에 최소 1개 이상의 페이지가 포함됨
- 파일이 유효한 JSON임

## 오류 처리

- MCP 도구가 특정 페이지 읽기에 실패하면 해당 페이지를 `{"page_id": "...", "title": "읽기 실패", "doc_type": "unknown", "status": "unknown"}` 으로 기록하고 계속 진행한다.
- Index 페이지 자체를 읽지 못하면 `all_pages`에 해당 Index를 오류로 기록하고 계속 진행한다.
- 파일 작성 후 내용을 한 번 읽어 유효한 JSON인지 확인한다.
