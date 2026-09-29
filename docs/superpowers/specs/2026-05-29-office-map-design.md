# Office Map Design Spec

## Goal

현재 카드 그리드 레이아웃을 **2D 오피스 맵**으로 전환한다.  
에이전트가 상태에 따라 팀 사무실 또는 휴게실에 포지션되고, 작업 중 글로우·바운스·말풍선으로 생동감을 표현한다.

핵심 가치: 사용자가 화면을 보자마자 "지금 누가 일하고 있는지"를 직관적으로 인식.

---

## Layout

```
┌─ Header ─────────────────────────────────────────────────────────────────┐
├─────────────────────────────────────────────┬────────────────────────────┤
│                                             │                            │
│  ┌─────────────────────────────────────┐    │  [ AgentProfilePanel ]     │
│  │  📋 Wiki 관리팀 사무실              │    │                            │
│  │                                     │    │  (기본) HQ 현황 요약       │
│  │  🔍💬"작업 중..."  📊   ✍️   📝 🖊️  │    │  • Wiki팀 ● 실행중 6명    │
│  │  [glow+bounce]    [idle] [idle]     │    │  • AI팀 ○ 대기중 4명      │
│  └─────────────────────────────────────┘    │                            │
│                                             │  (에이전트 클릭 후)        │
│  ┌─────────────────────────────────────┐    │  🔍 수확관 하루            │
│  │  🔬 AI 검색 품질팀 사무실           │    │  ● 작업중  Lv.3            │
│  │                                     │    │  XP ████░  haiku 4.5       │
│  │  📡   🔬💬"작업 중..."   ⚙️  ✏️    │    │                            │
│  │  [idle] [glow+bounce]  [idle][idle] │    │  담당 업무                 │
│  └─────────────────────────────────────┘    │  • Index 순회              │
│                                             │  • 키워드 수집             │
│  ┌─────────────────────────────────────┐    │                            │
│  │  ☕ 휴게실                          │    │  자기소개                  │
│  │                                     │    │  "저는 Confluence..."      │
│  │    🎯  (idle-float 애니메이션)       │    │                            │
│  └─────────────────────────────────────┘    │  특기                      │
│                                             │  [검색] [분류] [정찰]      │
├─────────────────────────────────────────────┴────────────────────────────┤
│  Footer                                                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

**비율:** 맵 65% / 프로필 패널 35%  
**반응형:** 모바일은 맵→패널 세로 스택

---

## Agent Positioning

| 에이전트 상태 | 위치 |
|---|---|
| `idle` | 휴게실 (팀 무관) |
| `running` | 각 팀 사무실 |
| `completed` | 각 팀 사무실 (작업 완료 표시) |
| `error` | 각 팀 사무실 (에러 글로우) |

에이전트 슬롯은 팀 내 인덱스 순서로 고정 배치 (이동 애니메이션 없음).  
슬롯 좌표: 팀별 최대 6슬롯 사전 정의, 격자형 배치.

---

## Agent Sprite Animations

### running 상태
- **바운스:** `@keyframes working-bounce` — 이모지가 위아래 4px 반복 (1.2s infinite)
- **글로우 링:** 이모지 뒤에 에이전트 colorClass 색상 원형 후광 (`@keyframes glow-pulse`)
  - amber → `rgba(245, 158, 11, 0.6)`, blue → `rgba(59, 130, 246, 0.6)`, 등
- **말풍선:** "작업 중..." 텍스트, CSS 삼각형 꼬리, 이모지 위에 표시

### idle 상태
- **플로트:** `@keyframes idle-float` — 위아래 3px 천천히 (3s infinite, 에이전트마다 delay 다름)
- 글로우/말풍선 없음

### completed 상태
- idle-float + 초록 글로우 (glow-green, 기존 CSS 재사용)

### error 상태
- 이모지 흔들림 (`@keyframes error-shake`) + 빨간 글로우

---

## Components

### 신규: `dashboard/components/OfficeMap.tsx`
- Props: `{ routines: RoutineWithStatus[], selectedAgentId: string | null, onSelectAgent: (id: string | null) => void }`
- 3개 Room 렌더링: Wiki 관리팀 사무실, AI 검색 품질팀 사무실, 휴게실
- 에이전트 분류 로직:
  - `running | completed | error` → 각 팀 사무실
  - `idle` → 휴게실

### 신규: `dashboard/components/OfficeRoom.tsx`
- Props: `{ title: string, icon: string, agents: AgentInRoom[], selectedAgentId: string | null, onSelectAgent: ... isActive: boolean }`
- `isActive` true이면 방 테두리 glow (노란색)
- 내부에 AgentSprite 배치 (절대 좌표)

```typescript
// 슬롯 좌표 — 방 크기 기준 % 값, 최대 6슬롯
const SLOT_POSITIONS = [
  { left: '15%', top: '40%' },
  { left: '32%', top: '55%' },
  { left: '50%', top: '38%' },
  { left: '67%', top: '55%' },
  { left: '80%', top: '40%' },
  { left: '47%', top: '62%' },
]
```

### 신규: `dashboard/components/AgentSprite.tsx`
- Props: `{ agent: AgentCharacter, status: AgentStatus, slotIndex: number, isSelected: boolean, onClick: () => void }`
- `slotIndex`로 idle-float animation-delay 결정 (`slotIndex * 0.4s`)
- 말풍선: `status === 'running'` 일 때만 렌더링

### 신규: `dashboard/components/AgentProfilePanel.tsx`
- Props: `{ routines: RoutineWithStatus[], selectedAgentId: string | null, onClose: () => void }`
- 항상 표시 (toggle 없음)
- `selectedAgentId` null이면 HQ 현황 요약:
  - 각 루틴 이름 + 상태 배지 + 에이전트 수
  - "에이전트를 클릭하면 프로필을 볼 수 있습니다" 안내
- `selectedAgentId` 있으면 에이전트 프로필:
  - 이모지(4xl) + 이름 + 역할 + StatusBadge + XP 바 + 모델명
  - 담당 업무 목록 (tasks)
  - 자기소개 (bio ?? description)
  - 특기 태그 (skills)
  - X 버튼으로 선택 해제

### 수정: `dashboard/app/page.tsx`
- 2컬럼 레이아웃으로 교체
- `selectedAgentId` state 관리
- `OfficeMap` + `AgentProfilePanel` 렌더링
- `DepartmentFloor` 제거

### 수정: `dashboard/app/globals.css`
- 신규 keyframes 추가:
  - `working-bounce`
  - `idle-float`
  - `error-shake`
  - `glow-pulse-{color}` (colorClass별 10개)

### 제거: `dashboard/components/DepartmentFloor.tsx`
- OfficeMap으로 대체 (파일 삭제)

### 유지 (재사용): 
- `AgentDetailModal.tsx` → 제거 (AgentProfilePanel이 대체)
- `AgentStatCard.tsx` → 제거 (AgentSprite가 대체)
- `StatusBadge.tsx` → 유지
- `Header.tsx`, `Footer.tsx`, `MarkdownModal.tsx` → 유지

---

## Styling

- 방 배경: `bg-gray-900/60 border border-gray-800 rounded-2xl`
- 방 활성화(running): `border-yellow-600/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]`
- 방 제목: 좌상단 작은 텍스트 `text-xs text-gray-500 uppercase tracking-widest`
- 말풍선: `bg-gray-800 border border-gray-600 text-xs text-gray-200 rounded-lg px-2 py-1`
  - 꼬리: CSS `::after` 삼각형, 이모지 아래쪽 중앙
- 프로필 패널: `bg-gray-900/40 border-l border-gray-800` (맵과 구분선)
- 이모지 크기: `text-3xl` (스프라이트), 선택 시 `ring-2 ring-white/30 rounded-full`

---

## CSS Animations (globals.css 추가)

```css
@keyframes working-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}

@keyframes idle-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-3px); }
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-3px); }
  75%       { transform: translateX(3px); }
}

/* colorClass별 glow-pulse (10개) */
@keyframes glow-pulse-amber {
  0%, 100% { box-shadow: 0 0 8px 3px rgba(245,158,11,0.3); }
  50%       { box-shadow: 0 0 20px 6px rgba(245,158,11,0.7); }
}
/* blue, purple, green, indigo, red, cyan, teal, orange, pink — 동일 패턴 */
```
