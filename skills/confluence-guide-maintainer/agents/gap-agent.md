# Gap Agent

## 역할

`tmp/harvest-result.json`(기존 위키 현황), `tmp/playbook-analysis.json`(Playbook 분석 결과), `wiki-targets.md`(Discovery Keywords)를 비교해
현재 위키에 없는 콘텐츠 갭을 식별하고 도메인별로 분류한다.
결과를 `tmp/gap-result.json`에 저장한다.

## 입력

- `date`: 실행 날짜 (YYYY-MM-DD)
- `repo`: 리포지토리 루트 경로
- `harvest_result_path`: HarvestAgent 출력 파일 경로
- `playbook_analysis_path`: Playbook 분석 결과 파일 경로 (기본값: `tmp/playbook-analysis.json`)
- `output`: 결과 파일 경로 (기본값: `tmp/gap-result.json`)

## 사전 준비

다음 파일을 읽는다:

- `harvest_result_path` (예: `tmp/harvest-result.json`)
- `playbook_analysis_path` (예: `tmp/playbook-analysis.json`) — 파일이 없으면 weekly 런을 중단하지 말고 "missing" 상태로 처리한다.
- `skills/confluence-guide-maintainer/wiki-targets.md` — Discovery Keywords, PENDING 항목, 범위 기준
- `skills/confluence-guide-maintainer/policy.md` — 자동 생성 조건

## Step 0: Playbook 분석 결과 반영

`playbook_analysis_path`가 존재하면 `guide_candidates` 배열을 읽는다.

각 후보에 대해:
- `recommended_action`이 `create_guide` 또는 `update_guide`인 항목만 weekly gap 입력으로 사용한다.
- `manual_review_required` 또는 `safety_sensitive`가 표시된 항목은 `manual_review_items`로 넘긴다.
- `source_playbook_page_id`, `source_question`, `reason`, `priority`를 보존한다.
- 도메인별 `gaps`에 추가하되 `reason`은 `playbook_insufficient_answer` 또는 `playbook_reusable_gap`처럼 구체적으로 기록한다.

`playbook_analysis_path`가 없으면 실행을 중단하지 않는다. 대신 `coverage_summary`에 "playbook analysis missing"을 반영할 수 있도록 내부 상태로 기록한다.

## Step 1: PENDING 항목 우선 처리

`wiki-targets.md`의 "에이전트 발견 주제" 로그에서 상태가 `PENDING`인 항목을 확인한다.

각 PENDING 항목에 대해:
- 공식 소스가 여전히 유효한지 웹으로 확인한다.
- 유효하면 `gap-result.json`의 해당 도메인 갭 목록에 `priority: high`로 추가한다.
- 유효하지 않으면 `manual_review_items`에 추가한다.

## Step 2: Discovery Keywords 처리

`wiki-targets.md`의 Discovery Keywords에서 상태가 `PENDING`이거나 상태가 없는 항목을 읽는다.

각 키워드에 대해:

1. 이미 `harvest-result.json`의 `all_pages`에 해당 키워드를 제목으로 가진 페이지가 있으면 건너뛴다.
2. 아래 패턴으로 웹 검색해 공식 문서를 확인한다:
   - `site:docs.anthropic.com <keyword>`
   - `site:github.com/openai/codex <keyword>`
   - `site:github.com/google-gemini/gemini-cli <keyword>`
3. 공식 문서가 존재하면 해당 키워드를 갭으로 분류한다.
4. 공식 문서가 없거나 빈약하면 건너뛴다.

한 번의 실행에서 모든 키워드를 처리하기 어려우면 priority가 높은 것 부터 처리한다.

## Step 3: 기존 페이지 업데이트 필요 여부 평가

`harvest-result.json`의 `all_pages` 중 `review_overdue: true`인 페이지 목록을 추출한다.

각 페이지에 대해:
- 페이지 title로 도메인(claude/codex/other)을 판단한다.
- `update_targets` 목록에 추가한다.

## Step 4: 도메인 분류

발견한 갭과 업데이트 대상을 아래 기준으로 분류한다:

| 도메인 | 기준 |
|--------|------|
| claude | Claude Code, Claude CLI, Anthropic API, claude.ai, MCP 관련 |
| codex | OpenAI Codex, ChatGPT CLI, OpenAI API 관련 |
| other | Gemini CLI, Google AI, AnythingLLM, 기타 AI 도구 |

## Step 5: 결과 파일 작성

아래 스키마로 `tmp/gap-result.json`을 작성한다:

```json
{
  "date": "YYYY-MM-DD",
  "pending_resolved": [
    {
      "topic": "...",
      "source_url": "...",
      "domain": "claude|codex|other",
      "priority": "high"
    }
  ],
  "gaps": {
    "claude": [
      {
        "keyword": "...",
        "topic": "...",
        "source_type": "keyword|playbook",
        "source_playbook_page_id": "...",
        "source_question": "...",
        "source_url": "...",
        "priority": "high|medium|low",
        "reason": "..."
      }
    ],
    "codex": [],
    "other": []
  },
  "update_targets": {
    "claude": [
      {
        "page_id": "...",
        "title": "...",
        "last_reviewed_at": "...",
        "reason": "review_overdue"
      }
    ],
    "codex": [],
    "other": []
  },
  "manual_review_items": [
    {
      "topic": "...",
      "reason": "...",
      "recommended_action": "..."
    }
  ],
  "coverage_summary": "갭 X개 발견, PENDING Y개 처리, 업데이트 필요 Z개, playbook candidate N개 반영"
}
```

## 완료 조건

- `tmp/gap-result.json`이 정상 작성됨
- `coverage_summary` 필드가 포함됨
- 파일이 유효한 JSON임

갭이 없는 경우에도 빈 배열(`[]`)과 "커버리지 평가 완료, 갭 없음" 메시지로 파일을 작성한다.

## 오류 처리

- `harvest-result.json`을 읽지 못하면 즉시 실패하고 오류를 출력한다.
- 웹 검색이 일부 실패하면 해당 키워드를 건너뛰고 계속 진행한다.
