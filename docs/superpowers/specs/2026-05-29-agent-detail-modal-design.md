# Agent Detail Modal Design Spec

## Goal

에이전트 카드를 클릭하면 해당 에이전트가 정확히 어떤 작업을 하는지 볼 수 있는 모달 팝업을 추가한다.

핵심 가치: 에이전트 이름만으로는 알 수 없는 **구체적인 담당 업무**를 한눈에 확인.

## Layout

2단 패널 모달 (max-w-2xl):

```
┌──────────────────────────────────────────────────[✕]─┐
│                                                       │
│  ┌─────────────────┐   ┌─────────────────────────┐   │
│  │                 │   │  담당 업무  (메인)         │   │
│  │    🔍 (7xl)     │   │  • Confluence 순회        │   │
│  │                 │   │  • 최신 키워드 수집        │   │
│  │  수확관 하루     │   │  • 갱신 대상 식별          │   │
│  │  키워드 수확관   │   │  • 수확 결과 저장          │   │
│  │                 │   │                           │   │
│  │  ● 대기중       │   │  자기소개  (서브)          │   │
│  │  Lv.3 ████░░   │   │  "저는 Confluence를..."   │   │
│  │  haiku 4.5      │   │                           │   │
│  │  XP 6/20        │   │  특기  (서브)             │   │
│  │                 │   │  [검색] [분류] [패턴인식]  │   │
│  └─────────────────┘   └─────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

## Data Changes

### agents-config.json — 각 에이전트에 3개 필드 추가

```json
{
  "bio": "2-3문장 한국어 자기소개",
  "skills": ["태그1", "태그2", "태그3"],
  "tasks": ["구체적인 업무1", "구체적인 업무2", "구체적인 업무3"]
}
```

필드는 선택(optional) — 없으면 해당 섹션 숨김.

### 10개 에이전트 내용 (agents-config.json에 추가)

**수확관 하루 (harvest)**
- bio: "저는 Confluence 전체를 순찰하며 가이드 업데이트가 필요한 페이지와 누락된 키워드를 찾아냅니다. 빠른 처리 속도가 강점인 정찰 전문가입니다."
- skills: ["검색", "분류", "정찰"]
- tasks: ["Confluence Index 페이지 전체 순회", "최신 AI 도구 키워드 수집", "갱신 필요 페이지 식별", "수확 결과를 harvest-result.json으로 저장"]

**분석관 가이 (gap)**
- bio: "수확된 데이터를 분석하여 무엇이 부족한지 파악합니다. 현재 위키 상태와 이상적인 상태 사이의 갭을 정량화하는 것이 제 역할입니다."
- skills: ["데이터 분석", "갭 탐지", "우선순위 판단"]
- tasks: ["수확 결과 파일 분석", "누락된 가이드 목록 도출", "업데이트 필요 페이지 우선순위 결정", "갭 분석 결과를 gap-result.json으로 저장"]

**작가 클로드 (writer-claude)**
- bio: "Claude 관련 가이드를 전문으로 작성합니다. Claude Code, API, 프롬프트 기법 등 Claude 생태계 전반을 다룹니다."
- skills: ["문서 작성", "Claude 전문", "가이드 구성"]
- tasks: ["Claude Code 기능 가이드 작성", "Claude API 사용법 업데이트", "프롬프트 엔지니어링 가이드 작성", "Confluence 페이지 직접 게시"]

**작가 코덱스 (writer-codex)**
- bio: "Codex 및 OpenAI 계열 도구 가이드 전문 작성관입니다. Codex CLI, GPT API 관련 문서를 최신 상태로 유지합니다."
- skills: ["문서 작성", "Codex 전문", "API 문서화"]
- tasks: ["Codex CLI 가이드 작성 및 업데이트", "OpenAI API 사용 가이드 작성", "Codex 관련 Confluence 페이지 게시"]

**작가 아더 (writer-other)**
- bio: "Claude와 Codex 외 모든 AI 도구를 담당합니다. Gemini, Cursor, Copilot 등 빠르게 변화하는 AI 생태계를 폭넓게 커버합니다."
- skills: ["문서 작성", "다양한 AI 도구", "시장 리서치"]
- tasks: ["Gemini, Cursor 등 기타 AI 도구 가이드 작성", "신규 AI 도구 페이지 생성", "기타 도메인 Confluence 페이지 게시"]

**사령관 신스 (synthesis)**
- bio: "모든 작성 결과물을 검수하고 종합하여 최종 보고서를 만듭니다. Index 페이지 링크 정합성 확인과 전체 품질 보증이 임무입니다."
- skills: ["종합 분석", "품질 검증", "보고서 작성"]
- tasks: ["3명 작가 결과물 취합 및 검토", "Index 페이지 링크 업데이트", "Validation 체크리스트 실행", "주간 실행 보고서 작성 및 커밋"]

**수집관 큐 (collector)**
- bio: "Playbook 데이터와 사용자 쿼리 패턴을 수집합니다. AI 검색 품질 개선의 첫 단계로 원시 데이터를 확보하는 역할입니다."
- skills: ["데이터 수집", "쿼리 분석", "패턴 탐지"]
- tasks: ["Playbook 데이터 수집", "사용자 쿼리 패턴 추출", "수집 결과 구조화 저장"]

**패턴분석관 파이 (pattern-analyst)**
- bio: "수집된 데이터에서 검색 품질 저하 패턴을 분석합니다. 어떤 유형의 쿼리가 부정확한 결과를 내는지 규명하는 것이 전문입니다."
- skills: ["패턴 분석", "통계 처리", "원인 규명"]
- tasks: ["수집 데이터 패턴 분석", "검색 품질 저하 원인 유형 분류", "개선 우선순위 도출"]

**규칙생성관 루이 (rule-generator)**
- bio: "분석 결과를 바탕으로 AI 프롬프트 개선 규칙을 생성합니다. 데이터에서 도출된 인사이트를 실행 가능한 규칙으로 변환하는 것이 역할입니다."
- skills: ["규칙 생성", "프롬프트 설계", "추상화"]
- tasks: ["패턴 분석 결과 기반 규칙 도출", "프롬프트 개선 규칙 문서화", "규칙 적용 가이드라인 작성"]

**편집관 에디 (editor)**
- bio: "생성된 규칙을 실제 AI 프롬프트에 적용하여 최종 편집합니다. 이론에서 실제 결과물로 이어지는 마지막 단계를 담당합니다."
- skills: ["프롬프트 편집", "품질 검증", "최종 검수"]
- tasks: ["규칙 기반 프롬프트 수정", "편집 결과 품질 검증", "최종 프롬프트 저장 및 배포"]

## Components

### 신규: `dashboard/components/AgentDetailModal.tsx`
- Props: `{ agent: (AgentCharacter & { bio?: string; skills?: string[]; tasks?: string[] }) | null, status: AgentStatus, runCount: number, onClose: () => void }`
- 2단 패널 레이아웃
- 배경 클릭 + ESC 키로 닫기
- tasks 없으면 담당 업무 섹션 숨김

### 수정: `dashboard/types/index.ts`
- `AgentCharacter`에 `bio?: string`, `skills?: string[]`, `tasks?: string[]` 추가

### 수정: `dashboard/components/AgentStatCard.tsx`
- `onClick` prop 추가 (`() => void`)
- 카드에 `cursor-pointer` + hover 스타일 강조

### 수정: `dashboard/components/DepartmentFloor.tsx`
- `selectedAgent` + `selectedAgentMeta` state 관리
- `AgentDetailModal` 렌더링

## Styling

- 왼쪽 패널: 현재 AgentStatCard와 동일한 다크 배경 (`bg-gray-900/80`)
- 오른쪽 패널: 섹션 구분선 (`border-b border-gray-800`)
- tasks 아이템: `•` 불릿 + `text-gray-200` (가장 밝게 — 메인 콘텐츠)
- bio 텍스트: `text-gray-400` (서브)
- skills 태그: `bg-gray-800 text-gray-300 rounded-full px-2 py-0.5 text-xs`
- 모달 크기: `max-w-2xl` (640px), `max-h-[80vh]`
