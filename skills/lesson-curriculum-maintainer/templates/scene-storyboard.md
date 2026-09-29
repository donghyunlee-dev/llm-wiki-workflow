# Scene Storyboard 템플릿

이 파일은 새 Scene Storyboard를 작성할 때 채워 넣는 빈 템플릿이다. 필드 이름과 구조는
`policy.md`의 "화면 Storyboard 생성" 섹션(YAML 예시) 및
`agents/storyboard-writer-agent.md` Step 4·5와 반드시 일치해야 한다.

이미 채워진 예시는 `policy.md`(`sceneId: context-window-model`)를 참고할 것 —
여기서는 값 대신 각 필드의 의미만 주석으로 설명한다.

```yaml
# 이 Scene의 안정적인 식별자.
# Scene 콘텐츠 예산 초과로 분리할 경우, 분리로 생긴 각 Scene은 원본 sceneId에
# -cont-2, -cont-3처럼 순번을 붙인 새 고유 sceneId를 가진다.
# (예: context-window-model → context-window-model-cont-2)
sceneId:

# Confluence 본문 H2 제목과 문자 그대로 일치해야 하는 값 (URL 슬러그가 아니다).
anchor:

# 이 Scene 시작 시 학습자가 가진 (아직 불완전한) 상태.
learnerStateBefore:

# 이 Scene이 전달하는 단 하나의 핵심 주장.
learningClaim:

# 아래 세 필드(type/layout/motion)는 policy.md "화면 표현 선택 기준" 표에 있는 값만
# 사용하며, Lesson Brief의 scenePlan이 이미 지정한 값과 일치해야 한다
# (콘텐츠 예산 초과로 인한 Scene 분리 시에만 예외적으로 다른 값을 허용).
type:
layout:
motion:
reveal:

# Scene을 구성하는 화면 표시 블록 목록. policy.md "Scene 콘텐츠 예산"의 하드 제한을 지킨다.
blocks:
  - order: 1
    kind:            # 예: hook, explanation
    content:         # kind가 텍스트 성격일 때 사용
  - order: 2
    kind: visual
    visualKind:      # 시각자료 종류
    purpose:         # 이 시각자료가 learningClaim을 어떻게 뒷받침하는지

# 강사가 학습자에게 말하듯 자연스러운 구어체 산문. 분량 제한 없음.
# blocks(화면 표시 텍스트)와는 별도로 취급하며 하드 제한을 적용하지 않는다.
narration: |

# 학습자가 상호작용하는 방식.
interaction:
  kind:              # 예: step-reveal
  steps:
    -

# learnerStateBefore에서 분명한 변화가 있었음을 보여주는 증거.
completionEvidence:

# 다음 Scene/Lesson으로 자연스럽게 이어지는 문장.
transitionToNext:
```
