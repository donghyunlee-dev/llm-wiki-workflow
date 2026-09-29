# Subagent-Driven Development 스킬과 대시보드 통합 분석

## 1. 현재 대시보드 구조

### 1.1 데이터 아키텍처

```
dashboard/
├── app/
│   ├── page.tsx                          # 메인 페이지 (Client Component)
│   └── api/
│       ├── dashboard/route.ts            # 전체 대시보드 데이터 조회
│       ├── routines/run                  # 루틴 실행
│       └── sync/                         # 설정 동기화
├── components/
│   ├── OfficeMap.tsx                     # 팀방 + 휴게실 레이아웃
│   ├── OfficeRoom.tsx                    # 각 방(팀방/휴게실) 렌더링
│   ├── AgentSprite.tsx                   # 에이전트 아바타 + 상태
│   └── ...
├── types/index.ts                        # 타입 정의
├── data/agents-config.json               # 정적 에이전트/루틴 설정
└── lib/
    ├── routines.ts                       # agents-config.json 파싱
    ├── runs.ts                           # 실행 리포트 조회
    └── status.ts                         # 상태 파생
```

### 1.2 데이터 흐름

**에이전트 상태 감지 메커니즘:**

```
tmp/
├── running-{prefix}.lock                 # {"pid": 12345, ...}
└── step-{prefix}.json                    # {"step": 2, ...}
```

- `running-{prefix}.lock` 존재 → 해당 Routine 실행 중
- `step-{prefix}.json` 있고 step=N → 현재 N번 파이프라인 스텝 진행 중
- OfficeMap에서: step N의 에이전트만 팀방에 표시, 나머지는 휴게실

### 1.3 에이전트 시각화

**OfficeRoom.tsx의 WorkstationDesk:**

```tsx
// 각 에이전트마다:
- Speech Bubble: tasks 배열을 순환 표시 (3.5초 간격, 애니메이션)
- Avatar: emoji + status dot (idle/running/completed/error)
- Name badge: agent.name
```

현재 구현에서 각 에이전트의 `tasks` 배열이 말풍선으로 시각화됨:
```json
"tasks": [
  "Confluence Index 페이지 전체 순회",
  "최신 AI 도구 키워드 수집",
  "갱신 필요 페이지 식별",
  ...
]
```

---

## 2. Subagent-Driven Development 스킬 분석

### 2.1 실행 흐름

```
User: 스킬 실행
  ↓
[Read Plan File]
  ↓
[Extract All Tasks with Full Text]
  ↓
[Create TodoWrite with All Tasks]
  ↓
Per Task Loop:
  ├─ Dispatch Implementer Subagent
  │  ├─ Questions? → Answer + Re-dispatch
  │  └─ DONE → Spec Review
  ├─ Dispatch Spec Reviewer Subagent
  │  ├─ Issues? → Implementer Fixes + Re-review
  │  └─ OK → Code Quality Review
  ├─ Dispatch Code Quality Reviewer Subagent
  │  ├─ Issues? → Implementer Fixes + Re-review
  │  └─ OK → Mark Task Complete
  └─ [Next Task]
  ↓
[Final Code Review for Entire Implementation]
  ↓
[Use finishing-a-development-branch]
```

### 2.2 주요 특징

- **독립적 태스크**: 각 task마다 fresh subagent 생성
- **2단계 리뷰**: 명세 준수 → 코드 품질
- **비반복 실행**: "계속할까?" 없이 자동 진행
- **상태 보고**: "DONE", "DONE_WITH_CONCERNS", "NEEDS_CONTEXT", "BLOCKED"

---

## 3. 통합 시나리오 & 요구사항

### 3.1 사용자가 원하는 동작

```
User: subagent-driven-development 스킬 실행
  ↓
[대시보드에서]
  1. "개발 방" room 동적 생성
  2. Task agent들 추가 (각 task마다 하나)
  3. 진행 상황을 실시간으로 말풍선 표시
     - Task1: "Implementing task 1..." → "✅ Task 1 Complete"
     - Task2: "Spec review in progress..." → "✅ Spec approved"
     - ...
  ↓
User는 웹에서 시각화된 진행 상황을 보며 실시간 모니터링
```

### 3.2 필요한 구현 요소

#### A. 동적 Room 추가
- **현재**: agents-config.json (정적)
- **필요**: 임시 room 정보 저장 & 조회
  - 방안1: `tmp/dev-session-{sessionId}.json` (권장)
  - 방안2: 메모리 기반 (재시작 시 소실 위험)

#### B. Task Agent 생성
- **TodoWrite 태스크** → **Agent 변환**
  - Task 제목: "Implement database schema"
  - Agent: `{id: "task-1", name: "Task 1: 스키마", emoji: "📋", ...}`

#### C. 실시간 진행 상황 업데이트
- **상태 저장**: `tmp/dev-session-{sessionId}.json`
  ```json
  {
    "sessionId": "abc123",
    "department": "개발 방",
    "tasks": [
      {
        "id": "task-1",
        "title": "Implement database schema",
        "status": "running",
        "currentStep": "implementation",  // "implementation" | "spec-review" | "code-review"
        "message": "Implementing task 1..."
      }
    ],
    "createdAt": "2026-06-02T10:00:00Z",
    "updatedAt": "2026-06-02T10:05:00Z"
  }
  ```

#### D. 대시보드 API 확장
- `GET /api/dashboard` → 임시 room도 포함해서 반환
- `POST /api/dev-session` → 개발 세션 생성
- `PATCH /api/dev-session/{sessionId}` → 진행 상황 업데이트
- `GET /api/dev-session/{sessionId}` → 세션 상태 조회

#### E. OfficeMap 수정
- agents-config.json의 Routine에만 한정 → **동적 Routine 지원**
  ```tsx
  // Before: routines는 정적
  // After: routines는 정적 + 동적 임시 room 병합
  const allRoutines = [...staticRoutines, ...dynamicDevSessions]
  ```

---

## 4. 연동 가능성 평가

### ✅ 가능한 이유

1. **API 기반 설계**
   - 대시보드는 `/api/dashboard`에서 데이터를 폴링
   - 새로운 API 엔드포인트 추가 가능

2. **파일 시스템 기반 상태 관리**
   - 기존: `running-{prefix}.lock`, `step-{prefix}.json`
   - 확장 가능: `tmp/dev-session-{sessionId}.json`

3. **React 동적 렌더링**
   - OfficeMap은 `routines` prop을 순회하며 rendering
   - Routine 목록을 동적으로 추가하면 자동 렌더링

4. **대시보드 폴링 메커니즘**
   - 이미 5초 주기 폴링 구현됨 (실행 중일 때)
   - 추가 폴링 없이 기존 메커니즘 재사용 가능

### ⚠️ 고려사항

1. **세션 관리**
   - 개발 방이 여러 개 동시 실행 가능한가?
   - 세션 ID를 어떻게 생성/추적할 것인가?

2. **메모리 누수**
   - 완료된 개발 세션은 언제 정리할 것인가?
   - 자동 클린업 또는 수동 삭제 필요

3. **실시간 업데이트 정확성**
   - 스킬이 대시보드 API를 호출해야 함
   - 또는 스킬이 JSON 파일만 쓰고 대시보드가 폴링

---

## 5. 구현 전략 제안

### Phase 1: 핵심 기반 (1-2시간)
1. **대시보드 API 확장**
   - `POST /api/dev-session` 생성
   - `PATCH /api/dev-session/{sessionId}` 업데이트
   - `GET /api/dashboard` 수정 (임시 room 포함)

2. **상태 저장 메커니즘**
   - `tmp/dev-session-{sessionId}.json` 포맷 정의
   - 세션 생성/업데이트/삭제 함수

3. **OfficeMap 수정**
   - 동적 Routine 지원 (임시 room도 같은 구조로 처리)

### Phase 2: 스킬 후킹 (2-3시간)
1. **subagent-driven-development 스킬 분석**
   - 어느 지점에서 상태 업데이트를 호출할지
   - Implementer 시작 → Spec review 진행 → Code review 진행 → 완료

2. **스킬 수정**
   - Task 시작 시: `/api/dev-session` POST
   - Task 진행 시: `/api/dev-session/{sessionId}` PATCH
   - Task 완료 시: status 업데이트

3. **에러 처리**
   - API 호출 실패 시 폴백
   - 대시보드 미실행 시에도 정상 동작

### Phase 3: UI 개선 (1시간)
1. **시각적 강조**
   - 개발 방을 다른 색상/테두리로 표시
   - Task agent를 팀원과 구별

2. **상세 정보 표시**
   - 클릭 시 현재 리뷰 단계, 문제사항 등 표시
   - 리포트 링크 제공

---

## 6. 기술적 실행 체크리스트

### 대시보드 수정
- [ ] `types/index.ts` 업데이트 (DevSession 타입 추가)
- [ ] `lib/dev-sessions.ts` 작성 (CRUD 함수)
- [ ] `app/api/dev-session/route.ts` 작성
- [ ] `app/api/dashboard/route.ts` 수정 (임시 room 병합)
- [ ] `components/OfficeMap.tsx` 수정 (동적 room 지원)

### Skill 수정
- [ ] subagent-driven-development SKILL.md 분석
- [ ] Task 추출 후 API 호출 로직 추가
- [ ] 각 Subagent 디스패치 후 상태 업데이트

### 테스트
- [ ] 개발 방 동적 생성 확인
- [ ] Task agent 표시 확인
- [ ] 진행 상황 실시간 업데이트 확인
- [ ] 완료 후 정리 확인

---

## 7. 위험 요소 & 완화 방안

| 위험 | 완화 방안 |
|------|---------|
| API 호출 실패 시 스킬 중단 | 실패해도 계속 진행, 로그만 남김 |
| 웹페이지를 열지 않으면 업데이트 안 됨 | 대시보드 없어도 스킬 정상 동작 (옵션) |
| 여러 개발 방 동시 실행 | sessionId로 격리, 각 방 독립 관리 |
| 좀비 세션 정리 | 1시간 미활동 후 자동 삭제 또는 사용자 수동 삭제 |

---

## 8. 결론

**가능성: 높음 (80%+)**

기존 대시보드 아키텍처가 충분히 유연하고, 필요한 모든 기반이 갖춰져 있음.

- 정적 agents-config.json과 동적 임시 room을 병합하는 방식으로 최소 수정
- 스킬에서 API 호출 추가
- 총 4-6시간의 개발 예상

**다음 단계: 프로토타입 또는 상세 설계 진행**
