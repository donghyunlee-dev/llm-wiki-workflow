# 루틴: Playbook 분석 및 Wiki 승격 준비

- **루틴 ID**: `trig_018dn6jkaABXrxrkHpKhcriL`
- **권장 스케줄**: `0 10 * * *` (UTC 10:00 = KST 19:00, weekly보다 1시간 먼저)

## 목적

최근 Playbook 페이지에 쌓인 검색 결과 중:
- 기존 canonical page로 바로 해결 가능한 항목
- FAQ로 승격할 항목
- 새 guide/page 생성이 필요한 항목
- 안전/정책 검토가 필요한 항목

을 분류해 `weekly`가 재사용할 수 있는 정형 결과로 남깁니다.

## Prompt Rules 생성 원칙

> **핵심:** Prompt Rules는 AI의 **판단 오류 유형**을 교정하는 것이지, 콘텐츠 공백을 메우는 것이 아니다.

부족 결과는 원인이 다르다. 유형별로 처리를 달리해야 한다:

| 실패 유형 | 원인 | 올바른 처리 |
|----------|------|-----------|
| `CONTENT_GAP` | 위키에 해당 페이지 없음 | FAQ/Guide 생성 (Step 3~3.5) |
| `KEYWORD_MISS` | 페이지 있는데 검색어 불일치 | 키워드 확장 힌트 추가 |
| `RELEVANCE_MISS` | 페이지 있는데 AI가 관련 없는 페이지를 선택 | 행동 교정 규칙 추가 |
| `SYNTHESIS_FAILURE` | 페이지 있는데 AI가 내용을 충분히 활용 못함 | 행동 교정 규칙 추가 |
| `OVER_RECOMMENDATION` | 비교 질문이 아닌데 페이지를 4개+ 추천 | 행동 교정 규칙 추가 |

**전처리 — 충분도-답변 불일치 감지:**
유형 분류 전에 먼저 아래 조건을 확인한다:
- 충분도='충분' + 답변 요약에 부정 패턴 포함 ("없습니다", "I'm sorry", "페이지가 없습니다", "해당 정보가 없습니다", "찾을 수 없습니다", "문서가 없습니다")
  → 충분도 필드를 무시하고 추천 문서 수 기준으로 재분류:
    - 추천 문서 0개: `CONTENT_GAP`
    - 추천 문서 1개 이상: `RELEVANCE_MISS` (문서를 찾았으나 질문에 맞지 않아 "없다"고 답변)

**규칙 작성 기준:**
- 동일 유형 실패 **3회 이상**일 때만 해당 유형의 교정 규칙 1개를 작성한다.
- 규칙은 **영어 15단어 이내**의 짧은 지시문이어야 한다.
- 주제 특정 내용 금지 ("Jira 질문에는 X를 해라" → 불가, "복합 주제 질문에서 부분 일치 조합을 거부해라" → 가능).
- 최대 4개. 기존 규칙과 동일 유형이면 기존 규칙을 교체하고 새로 추가하지 않는다.
- `CONTENT_GAP` 유형은 절대 Prompt Rule로 쓰지 않는다 (콘텐츠 부재는 프롬프트로 해결 불가).

**키워드 힌트 기준:**
- 한국어 검색어가 반복적으로 영어 제목의 페이지를 찾지 못할 때만 추가한다.
- 자명한 기술 용어(hook, agent, skill 등 영어 원어가 통용)는 추가하지 않는다.
- 형식: `한국어 검색어 → 영문 키워드` (한 줄, 간결하게). 최대 8개.

## 필수 산출물

- `tmp/playbook-analysis.json`
- `runs/{TODAY}-playbook.md`

## `playbook-analysis` 스키마

```json
{
  "date": "YYYY-MM-DD",
  "source_playbook_pages": [
    {
      "page_id": "...",
      "title": "Playbook - YYYY-MM-DD"
    }
  ],
  "guide_candidates": [
    {
      "topic": "...",
      "domain": "claude|codex|other",
      "source_type": "playbook",
      "source_playbook_page_id": "...",
      "source_question": "...",
      "reason": "insufficient_answer|reusable_gap",
      "recommended_action": "create_guide|update_guide",
      "source_url": "...",
      "priority": "high|medium|low"
    }
  ],
  "faq_candidates": [
    {
      "topic": "...",
      "source_playbook_page_id": "...",
      "source_question": "...",
      "recommended_action": "create_faq|update_faq",
      "priority": "high|medium|low"
    }
  ],
  "manual_review_items": [
    {
      "topic": "...",
      "reason": "...",
      "recommended_action": "..."
    }
  ]
}
```

## 임계값 기준 (playbook 루틴이 직접 적용)

| 조건 | 분류 | 처리 주체 |
|------|------|---------|
| 동일 주제 부족 **2회 이상** + 기존 canonical 페이지 조각으로 합성 가능 | `faq_candidates` | playbook 루틴 → 즉시 FAQ 생성 |
| 동일 주제 부족 **3회 이상** + 공식 소스 기반 신규 문서 필요 | `guide_candidates` | weekly 루틴 → Guide 생성 |
| 보안·인증·결제 관련 or 소스 불명확 | `manual_review_items` | 수동 검토 |

**주제 동일성 판단:** 부족 키워드 2개 이상 겹치거나 질문의 핵심 명사(도구명·기능명)가 동일한 경우.

## weekly 연계 규칙

- `weekly`는 가장 최근 `playbook-analysis`의 `guide_candidates`를 `gap-result.json`에 병합한다.
- `faq_candidates`는 **playbook 루틴에서 직접 생성**한다. weekly는 guide/page 생성에 집중한다.
- `manual_review_items`는 `weekly` 런 리포트에도 승계한다.
