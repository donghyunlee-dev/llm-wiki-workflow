# Dashboard v1.1 Redesign Spec

## Goal

SFOOD Agent HQ 대시보드를 6가지 문제 해결과 함께 완전히 재설계한다:
- Git 동기화 오류 수정
- Markdown 렌더링 (노션 스타일)
- RPG 스탯 카드형 캐릭터 표현
- 2개 부서 (루틴 2개) 분리 표시
- 헤더 + 푸터 회사 레이아웃
- Playwright 시각적 QA 테스트

## Architecture

### Layout

```
┌─────────────────────────────────────────────┐
│ Header: [🏢 SFOOD] Agent Headquarters  [🔄] [시각] │
├─────────────────────────────────────────────┤
│                                             │
│  🗂️ Wiki 관리팀          (루틴 1, 6명)       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Stat Card│ │ Stat Card│ │ Stat Card│    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Stat Card│ │ Stat Card│ │ Stat Card│    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                    [📋 최근 리포트]            │
│                                             │
│  🤖 AI 검색 품질팀       (루틴 2, 4명)       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Stat Card│ │ Stat Card│ │ Stat Card│    │
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌──────────┐                              │
│  │ Stat Card│                              │
│  └──────────┘                              │
│                    [📋 최근 리포트]            │
│                                             │
├─────────────────────────────────────────────┤
│ Footer: SFOOD IT AX팀 · 2개 부서 · 10명 · v1.1 │
└─────────────────────────────────────────────┘
```

### RPG Stat Card

```
┌─────────────────────┐
│ ●(status glow)      │
│ [🔍 job SVG icon]   │
│ 수확관 하루           │
│ 키워드 수확 정찰관    │
│ ████████░░ XP 12    │
│ Lv.3  Haiku 4.5     │
│ [상태 배지]           │
└─────────────────────┘
```

- 상단 status ring: 색상 glow (완료=초록, 실행중=노랑 pulse, 대기=회색, 오류=빨강)
- job icon: SVG (🔍검색/📊분석/✍️작가/🎯사령관 계열)
- XP bar: 실행 횟수 기반 (최대 20회 = 만렙)
- Level = floor(runCount / 3) + 1, 최대 10
- 모델명 표시 (Haiku/Sonnet/Opus)
- 상태 배지: 대기중/⚡실행중/✓완료/✕오류 (Korean)

### Data Model

**agents-config.json** — 2개 루틴:

루틴 1 (기존): `trig_01E5Ktiv4jfrzVDqv4RKM8qp`
- department: "Wiki 관리팀"
- runReportPrefix: ["weekly", "wiki-weekly"]
- 6명: 수확관 하루, 분석관 가이, 작가 클로드, 작가 코덱스, 작가 아더, 사령관 신스

루틴 2 (신규): `trig_018dn6jkaABXrxrkHpKhcriL`
- name: "Playbook 분석 및 AI 프롬프트 자동 개선"
- department: "AI 검색 품질팀"
- cronExpression: "0 11 * * *"
- lastFiredAt: "2026-05-28T11:05:22Z" (run reports 없음, 이 필드로 상태 파생)
- 4명: 수집관(Sonnet), 패턴분석관(Sonnet), 규칙생성관(Sonnet), 편집관(Sonnet)

### Markdown Rendering

- `RunReportModal` → `MarkdownModal`로 교체
- `marked` 라이브러리 (이미 설치됨) 로 MD → HTML 변환
- `@tailwindcss/typography` (prose class) 로 Notion 스타일 렌더링
- `dangerouslySetInnerHTML` 사용 (신뢰된 내부 파일만 렌더링)

### Git Sync Fix

`dashboard/app/api/sync/route.ts`:
- 기존: `git pull --ff-only` (diverging branch 오류)
- 수정: `git fetch origin && git merge origin/main` (병합 전략)
- 실패 시 오류 메시지 한국어로 반환

## Components (신규/변경)

| Component | 상태 | 역할 |
|---|---|---|
| `Header.tsx` | NEW | 회사명 + 동기화 버튼 + 현재 시각 |
| `Footer.tsx` | NEW | 부서 수, 에이전트 수, 버전, 날짜 |
| `AgentStatCard.tsx` | NEW | RPG 스탯 카드 (status ring + icon + XP) |
| `DepartmentFloor.tsx` | NEW | 부서 섹션 + 에이전트 그리드 + 리포트 버튼 |
| `MarkdownModal.tsx` | NEW | marked + prose 렌더링 모달 |
| `AgentCard.tsx` | DEPRECATED | AgentStatCard로 교체 |
| `DepartmentSection.tsx` | DEPRECATED | DepartmentFloor로 교체 |
| `app/page.tsx` | UPDATE | 2개 DepartmentFloor 렌더링 |
| `app/layout.tsx` | UPDATE | Header + Footer 포함 |
| `app/globals.css` | UPDATE | RPG 카드 CSS 추가 |
| `data/agents-config.json` | UPDATE | 2번째 루틴 추가 |
| `api/sync/route.ts` | FIX | git pull 방식 수정 |

## Playwright Tests

- `dashboard/tests/playwright.config.ts` — baseURL http://localhost:3737, 스크린샷 저장 경로
- `dashboard/tests/dashboard.spec.ts`:
  - 홈 페이지 로드 + 전체 스크린샷
  - Header/Footer 존재 확인
  - 2개 부서 표시 확인
  - 에이전트 카드 10개 확인
  - 리포트 버튼 클릭 → 모달 렌더링 확인 + 스크린샷

## Success Criteria

1. Git sync 버튼 클릭 시 오류 없이 동기화
2. 리포트 모달이 Notion 스타일 HTML로 렌더링 (raw MD 없음)
3. 헤더 + 푸터 레이아웃 존재
4. 2개 부서가 각각 분리된 섹션으로 표시
5. 각 에이전트가 RPG 스탯 카드로 표시 (status ring + XP bar)
6. Playwright 스크린샷 전부 캡처 완료
7. `npm run build` TypeScript 0 오류
