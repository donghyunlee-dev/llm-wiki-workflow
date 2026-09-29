# Office Map v2 Design Spec

## 변경 사항 요약

1. **우측 사이드바** — AgentProfilePanel → 2열 카드 그리드 (AgentSidebar)
2. **상세 정보** — 사이드 패널 표시 → 카드 클릭 시 팝업 모달 (AgentDetailModal 복원)
3. **오피스 맵 비주얼** — 단순 div → 실제 방처럼 보이는 UI (벽, 소품)

---

## Layout

```
┌─ Header ──────────────────────────────────────────────────────────────────┐
├──────────────────────────────────────────┬────────────────────────────────┤
│  OfficeMap (flex-1, 좁아도 OK)            │  AgentSidebar (w-96 = 384px)   │
│                                          │                                │
│  ┌──────────────────────────────────┐    │  [ Wiki 관리팀 ]               │
│  │🏢 Wiki 관리팀 사무실 ░░░░░░░░░░░│    │  ┌──────┐ ┌──────┐            │
│  │░░🖥️░░░░░░░░░░░░░░░░░░░░░🖥️░░░░░│    │  │  🔍  │ │  📊  │            │
│  │░░ 🔍💬  📊  ✍️  📝  🖊️  🎯 ░░░│    │  │ 하루  │ │ 가이  │            │
│  └──────────────────────────────────┘    │  │ Lv.3  │ │ Lv.2  │            │
│                                          │  └──────┘ └──────┘            │
│  ┌──────────────────────────────────┐    │                                │
│  │🔬 AI 검색 품질팀 사무실 ░░░░░░░│    │  [ AI 검색 품질팀 ]            │
│  │░░🖥️░░░░░░░░░░░░░░░░🖥️░░░░░░░░░│    │  ┌──────┐ ┌──────┐            │
│  │░░ 📡  🔬  ⚙️  ✏️ ░░░░░░░░░░░░│    │  │  📡  │ │  🔬  │            │
│  └──────────────────────────────────┘    │  └──────┘ └──────┘            │
│                                          │                                │
│  ┌──────────────────────────────────┐    │  (카드 클릭 → 팝업 모달)      │
│  │☕ 휴게실                         │    │                                │
│  │  🛋️         🪴                  │    │                                │
│  │     🎯  💤 (idle 에이전트들)     │    │                                │
│  └──────────────────────────────────┘    │                                │
└──────────────────────────────────────────┴────────────────────────────────┘
```

---

## 변경 컴포넌트 상세

### 1. OfficeRoom.tsx — 시각적 방 개선

**새 prop 추가:** `roomType: 'office' | 'breakroom'`

**오피스 방 스타일:**
- 테두리: `border-2 border-gray-600` (기존 `border border-gray-800`보다 굵고 선명)
- 배경: `bg-slate-950`
- 소품: 우상단 `🖥️ 💻` 이모지, 좌하단 `📁` 이모지 (절대 위치, pointer-events-none)
- 활성화(running): `border-yellow-500/70 room-active`

**휴게실 스타일:**
- 테두리: `border-2 border-amber-900/50`
- 배경: `bg-gray-950`
- 소품: `☕ 🛋️ 🪴` 이모지 (좌우 가장자리 배치)

**방 라벨 개선:**
- 기존: 작은 텍스트
- 변경: `absolute -top-3 left-4` 위치에 배경 있는 라벨 뱃지 (방 상단 선 위에 걸쳐진 효과)

---

### 2. AgentStatCard.tsx — 복원 (git history에서 회수)

기존 삭제된 버전 그대로 복원하되 **한 가지만 수정**:
- `w-40` 고정 너비 제거 → `w-full` (사이드바 2열 그리드에 맞게 자동 늘어남)

---

### 3. AgentDetailModal.tsx — 복원 (git history에서 회수)

이전과 동일한 2단 패널 모달. 수정 없음.

---

### 4. AgentSidebar.tsx — 신규 생성

```typescript
interface Props {
  routines: RoutineWithStatus[]
  onOpenModal: (agentId: string) => void
}
```

- 각 루틴을 부서 섹션으로 그룹핑
- 섹션 헤더: 부서명 + StatusBadge
- 카드: `grid grid-cols-2 gap-2 p-3`으로 AgentStatCard 배치
- 카드 클릭 → `onOpenModal(agent.id)` 호출

---

### 5. page.tsx — 배선 변경

- `selectedAgentId` state: 맵 오피스 스프라이트 강조용 + 모달용 공유
- `AgentProfilePanel` 제거
- `AgentSidebar` 연결 (`onOpenModal` → modal state set)
- `AgentDetailModal` 렌더링 (선택된 에이전트 정보 전달)
- 사이드바 너비: `w-72` → `w-96`

---

## 삭제

- `dashboard/components/AgentProfilePanel.tsx` — AgentSidebar로 대체

---

## File Map

| File | Action |
|---|---|
| `components/AgentStatCard.tsx` | RESTORE from git (+ w-full 수정) |
| `components/AgentDetailModal.tsx` | RESTORE from git (수정 없음) |
| `components/AgentSidebar.tsx` | CREATE |
| `components/OfficeRoom.tsx` | MODIFY (roomType + 비주얼) |
| `components/OfficeMap.tsx` | MODIFY (roomType 전달) |
| `app/page.tsx` | MODIFY (사이드바 교체, 모달 state) |
| `components/AgentProfilePanel.tsx` | DELETE |
