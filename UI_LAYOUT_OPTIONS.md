# UI 레이아웃 옵션 분석 (여러 개발 팀 대응)

## 문제 정의

### 현재 상황
```
┌─ 팀방 (2개: Wiki, 검색)     (각 방은 파이프라인 단계별 에이전트 표시)
├─ 팀방 (각 방에 4-6명 에이전트)
└─ 휴게실 (대기 중인 모든 에이전트)
```

### 새로운 요구사항
- 동적 개발 방 N개 추가 가능 (각 개발 방마다 M개 task agent)
- 기존 팀방과 동적 개발 방을 동시에 표시
- 화면 공간 제약 (1920×1080 기준)

### 핵심 결정 사항
1. **구조**: 기존 팀방 ↔ 동적 개발 방을 어떻게 구분할 것인가?
2. **배치**: 3개 이상의 팀방을 어디에 배치할 것인가?
3. **우선순위**: 실행 중인 방/개발 중인 방을 먼저 표시할 것인가?

---

## Option A: 세로 스택 레이아웃 (최소 수정)

### 구조
```
┌─────────────────────────────────────────┐
│ 🏢 에쓰푸드 AI HQ                        │
├─────────────────────────────────────────┤
│                                         │
│  팀방 (Wiki 관리팀)    팀방 (검색 품질팀) │
│  [pipe... 진행]        [idle]           │
│                                         │
├─────────────────────────────────────────┤
│  개발 방 (DevSession#1)                  │
│  [Task1 실행] [Task2 대기] [Task3 대기]  │
│                                         │
├─────────────────────────────────────────┤
│  개발 방 (DevSession#2)                  │
│  [Task1 대기] [Task2 대기]               │
│                                         │
├─────────────────────────────────────────┤
│  휴게실 (4 agents idle)                 │
│  [에이전트1] [에이전트2] ...            │
│                                         │
└─────────────────────────────────────────┘
```

### 구현
```tsx
// OfficeMap.tsx 수정
return (
  <div className="flex flex-col gap-4">
    {/* Section 1: 기존 Routine 팀방 (2열 고정) */}
    {staticRoutines.length > 0 && (
      <section>
        <h2 className="text-xs font-bold text-gray-500 mb-2 px-4">📋 상시 팀</h2>
        <div className="grid grid-cols-2 gap-3">
          {staticRoutines.map(r => <OfficeRoom />)}
        </div>
      </section>
    )}

    {/* Section 2: 동적 DevSession 개발 방 (1열 또는 2열) */}
    {dynamicDevSessions.length > 0 && (
      <section>
        <h2 className="text-xs font-bold text-blue-500 mb-2 px-4">💻 개발 팀</h2>
        <div className="space-y-3">
          {dynamicDevSessions.map(session => (
            <OfficeRoom 
              key={session.id}
              roomType="dev-session"  // 새로운 타입
              agents={session.tasks}
              ...
            />
          ))}
        </div>
      </section>
    )}

    {/* Section 3: 휴게실 (전체 너비) */}
    <OfficeRoom roomType="breakroom" agents={breakRoom} />
  </div>
)
```

### 장점
- ✅ 기존 코드 최소 수정
- ✅ 구분이 명확함 (상시팀 vs 개발팀)
- ✅ 개발 팀 개수가 증가해도 자동 스택
- ✅ 모바일 반응형 자연스러움

### 단점
- ❌ 세로 스크롤이 많아짐 (8+ 개발팀 시 답답함)
- ❌ 한눈에 전체를 보기 어려움

### 추천 상황
- 동시 개발팀이 1~3개 이하
- 대시보드를 "모니터링" 용도로 사용

---

## Option B: 탭 기반 레이아웃 (멀티 뷰)

### 구조
```
┌─────────────────────────────────────┐
│ [🏢 상시팀] [💻 개발팀] [☕ 휴게실]   │
├─────────────────────────────────────┤
│                                     │
│ 탭: 상시팀 선택 시                    │
│  팀방 (Wiki 관리팀)   팀방 (검색팀)  │
│  [pipe... 진행]     [idle]         │
│                                     │
│ 탭: 개발팀 선택 시                    │
│  DevSession#1   DevSession#2       │
│  [실행중]       [대기]             │
│  DevSession#3   [빈공간]           │
│                                     │
│ 탭: 휴게실 선택 시                    │
│  [모든 idle 에이전트들]             │
│                                     │
└─────────────────────────────────────┘
```

### 구현
```tsx
'use client'
const [activeTab, setActiveTab] = useState<'static' | 'dev' | 'breakroom'>('static')

return (
  <div>
    {/* 탭 버튼 */}
    <div className="flex gap-2 px-6 py-3 border-b border-gray-800">
      <TabButton 
        active={activeTab === 'static'}
        onClick={() => setActiveTab('static')}
        label="🏢 상시팀"
        badge={staticRoutines.length}
      />
      <TabButton 
        active={activeTab === 'dev'}
        onClick={() => setActiveTab('dev')}
        label="💻 개발팀"
        badge={dynamicDevSessions.length}
        isHighlight={dynamicDevSessions.some(s => s.status === 'running')}
      />
      <TabButton 
        active={activeTab === 'breakroom'}
        onClick={() => setActiveTab('breakroom')}
        label="☕ 휴게실"
        badge={breakRoom.length}
      />
    </div>

    {/* 탭 콘텐츠 */}
    <div className="p-6">
      {activeTab === 'static' && (
        <div className="grid grid-cols-2 gap-3">
          {staticRoutines.map(r => <OfficeRoom />)}
        </div>
      )}

      {activeTab === 'dev' && (
        <div className="space-y-3">
          {dynamicDevSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              진행 중인 개발 세션이 없습니다.
            </div>
          ) : (
            dynamicDevSessions.map(session => (
              <OfficeRoom 
                key={session.id}
                roomType="dev-session"
                {...}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'breakroom' && (
        <OfficeRoom roomType="breakroom" agents={breakRoom} />
      )}
    </div>
  </div>
)
```

### 장점
- ✅ 화면 정리됨 (한 번에 한 섹션만)
- ✅ 동시 개발팀 무제한 지원
- ✅ 탭 뱃지로 상태 한눈에 파악
- ✅ 집중도 높음

### 단점
- ❌ 탭 전환이 필요함 (클릭)
- ❌ 동시 비교 불가능 (여러 팀 상태를 동시에 봐야 할 때)
- ❌ "지금 뭐하고 있어?" 파악이 느림

### 추천 상황
- 동시 개발팀이 3~5개 이상
- "한 팀에 집중"하는 모니터링 스타일

---

## Option C: 분할 뷰 + 스크롤 (최대 유연성)

### 구조
```
┌──────────────────────────────────────┐
│ 상시팀 (고정, 2열)     │ 개발팀 & 휴게실 (스크롤)
├──────────────────────┼─────────────────────────┐
│                      │                         │
│ Wiki팀  검색팀       │ DevSession#1            │
│ [pipe..] [idle]     │ [Task1] [Task2] [Task3] │
│                      │                         │
│                      ├─────────────────────────┤
│                      │ DevSession#2            │
│                      │ [Task1] [Task2]         │
│                      │                         │
│                      ├─────────────────────────┤
│                      │ 휴게실                  │
│                      │ [Agent1] [Agent2] ...  │
│                      │                         │
│                      └─────────────────────────┘
│                           (세로 스크롤)
│                      
└──────────────────────────────────────┘
```

### 구현
```tsx
return (
  <div className="flex gap-4 h-full">
    {/* 왼쪽: 상시팀 (고정, 스크롤 없음) */}
    <div className="w-1/2 flex flex-col gap-3">
      <h2 className="text-xs font-bold text-gray-500">📋 상시팀</h2>
      <div className="grid grid-cols-2 gap-2">
        {staticRoutines.map(r => (
          <OfficeRoom key={r.id} size="compact" {...} />
        ))}
      </div>
    </div>

    {/* 오른쪽: 개발팀 + 휴게실 (스크롤 가능) */}
    <div className="w-1/2 overflow-y-auto flex flex-col gap-3">
      <h2 className="text-xs font-bold text-blue-500">💻 개발팀</h2>
      {dynamicDevSessions.length === 0 ? (
        <div className="text-gray-600 text-sm">개발 세션 없음</div>
      ) : (
        dynamicDevSessions.map(session => (
          <OfficeRoom 
            key={session.id}
            roomType="dev-session"
            size="compact"
            {...}
          />
        ))
      )}

      <h2 className="text-xs font-bold text-amber-500 mt-4">☕ 휴게실</h2>
      <OfficeRoom roomType="breakroom" agents={breakRoom} size="compact" />
    </div>
  </div>
)
```

### 장점
- ✅ 상시팀은 항상 보임 (안정성)
- ✅ 개발팀은 독립적으로 스크롤 (자유도)
- ✅ 동시 비교 가능
- ✅ 미니 레이아웃으로 여러 팀 한눈에

### 단점
- ❌ 구현이 가장 복잡함
- ❌ 좁은 화면(노트북)에서 답답할 수 있음
- ❌ 코드 수정량이 많음 (size prop 추가 등)

### 추천 상황
- 상시팀은 항상 모니터링 필요
- 동시 개발팀 3~10개
- 다중 모니터 환경

---

## Option D: 계층적 폴더 구조 (고급)

### 구조
```
┌─ 🏢 에쓰푸드 AI HQ
│  ├─ 📋 상시팀
│  │  ├─ Wiki 관리팀 [폴드/펼침]
│  │  │  ├─ 수확관 하루 (harvest)
│  │  │  ├─ 분석관 가이 (gap)
│  │  │  └─ ...
│  │  └─ AI 검색 품질팀 [폴드/펼침]
│  │     ├─ 수집관 큐 (collector)
│  │     └─ ...
│  │
│  ├─ 💻 개발팀 (2) [펼침]
│  │  ├─ DevSession#1 (3 tasks) [폴드/펼침]
│  │  │  ├─ Task1: 스키마 설계 [실행중]
│  │  │  ├─ Task2: 마이그레이션 [검증 중]
│  │  │  └─ Task3: 테스트 [대기]
│  │  └─ DevSession#2 (2 tasks) [폴드/펼침]
│  │     ├─ Task1: UI 개선 [대기]
│  │     └─ Task2: 캐싱 [대기]
│  │
│  └─ ☕ 휴게실 (4 agents) [펼침]
│     ├─ 에이전트1 [idle]
│     ├─ 에이전트2 [idle]
│     └─ ...
```

### 특징
- 각 팀/세션을 트리 구조로 표현
- 펼침/접기로 화면 공간 효율화
- 실행 중인 항목만 기본 펼침 상태

### 장점
- ✅ 무한 확장 가능 (10+ 팀도 관리)
- ✅ 정보 계층화 (원하는 수준만 봄)
- ✅ 마더보드 같은 느낌 (깊이감)

### 단점
- ❌ 구현이 매우 복잡함
- ❌ UX 러닝커브 있음
- ❌ 오버엔지니어링 가능성

### 추천 상황
- 동시 개발팀 10개 이상 (드물 것으로 예상)
- 매우 복잡한 파이프라인

---

## 비교표

| 항목 | 옵션A (세로) | 옵션B (탭) | 옵션C (분할) | 옵션D (트리) |
|------|----------|---------|----------|----------|
| 구현 난이도 | ⭐ 쉬움 | ⭐⭐ 중간 | ⭐⭐⭐ 어려움 | ⭐⭐⭐⭐ 매우어려움 |
| 스크롤 양 | 📈 많음 | 📊 적음 | 📉 보통 | 📉 보통 |
| 동시 비교 | ❌ 불가 | ❌ 불가 | ✅ 가능 | ✅ 가능 |
| 개발팀 제한 | 3개 추천 | 무제한 | 10개 추천 | 무제한 |
| 반응형 | ✅ 우수 | ⭐ 중간 | ❌ 어려움 | ⭐ 중간 |
| 코드 변경 | 최소 | 중간 | 중간~많음 | 많음 |

---

## 권장 선택

### 🎯 **추천: Option A + 옵션B 하이브리드**

```tsx
// 1단계: 옵션 A로 시작 (구현 간단, 빠름)
// - 개발팀이 3개 이하일 동안은 세로 스택

// 2단계: 개발팀이 3개 이상이 되면 옵션 B로 마이그레이션
// - 탭 추가
// - 기존 컴포넌트 재사용

// 결과: 점진적 확장, 기존 코드 보호
```

### 구현 로드맵

**Phase 1 (현재):** Option A 구현
```tsx
✅ 상시팀 (기존, 2열)
✅ 개발팀 (새로운, 1열 스택)
✅ 휴게실 (기존)
```

**Phase 2 (개발팀 3개 이상 필요 시):** 탭으로 마이그레이션
```tsx
✅ 상시팀 탭 (2열)
✅ 개발팀 탭 (1~2열)
✅ 휴게실 탭
```

**Phase 3 (미래):** 필요시 Option C로 업그레이드

---

## 기존 에이전트 보호 전략

### 현재 문제
```
OfficeMap → agents-config.json만 읽음
↓
동적 개발 방을 추가하려면?
```

### 해결책: 라우팅 분리

```tsx
// API: /api/dashboard
→ staticRoutines: agents-config.json 읽음
→ dynamicDevSessions: tmp/dev-session-*.json 읽음
→ breakRoom: 둘 다의 idle 에이전트

// OfficeMap
→ groupByType(staticRoutines, dynamicDevSessions)
→ 각 타입별로 렌더링 (OfficeRoom은 동일)
```

### 구현
```tsx
// lib/routines.ts
export function getRoutines() {
  return JSON.parse(fs.readFileSync('data/agents-config.json', 'utf-8'))
}

// lib/dev-sessions.ts (새로 추가)
export function getDevSessions() {
  const sessionFiles = glob.sync('tmp/dev-session-*.json')
  return sessionFiles.map(f => JSON.parse(fs.readFileSync(f, 'utf-8')))
}

// types/index.ts
export interface DevSession {
  id: string           // sessionId (uuid)
  name: string        // "개발 방: DevSession#1"
  department: string  // "개발"
  roomType: 'dev-session'
  agents: AgentCharacter[]  // Task agent들
  status: AgentStatus
  createdAt: string
  updatedAt: string
}

// app/api/dashboard/route.ts
export async function GET() {
  const staticRoutines = getRoutines()
  const devSessions = getDevSessions()
  
  const allRoutines = [...staticRoutines, ...devSessions]
  // 나머지는 동일
}

// components/OfficeMap.tsx
export default function OfficeMap({ routines }) {
  const staticRoutines = routines.filter(r => !r.roomType?.includes('dev'))
  const devSessions = routines.filter(r => r.roomType === 'dev-session')
  
  return (
    <div className="flex flex-col gap-4">
      {/* 상시팀 - 기존 로직 */}
      {staticRoutines.length > 0 && (
        <section>
          <div className="grid grid-cols-2 gap-3">
            {staticRoutines.map(...)}
          </div>
        </section>
      )}
      
      {/* 개발팀 - 새로운 섹션 */}
      {devSessions.length > 0 && (
        <section>
          <div className="space-y-3">
            {devSessions.map(...)}
          </div>
        </section>
      )}
    </div>
  )
}
```

---

## 요약

| 구분 | 방의 구조 | 기존 에이전트 보호 |
|------|---------|-----------------|
| 현재 상태 | 고정 Routine (2개 팀) | agents-config.json |
| 필요한 변화 | 동적 DevSession 추가 | 파일 기반 분리 (임시 JSON) |
| 레이아웃 | Option A 추천 시작 | Routine + DevSession 병합 |
| 확장 | 3개+ 팀 필요시 탭화 | 같은 구조, 뷰만 변경 |

