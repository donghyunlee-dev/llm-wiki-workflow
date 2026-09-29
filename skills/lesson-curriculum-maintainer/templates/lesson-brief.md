# Lesson Brief 템플릿

이 파일은 새 Lesson Brief를 작성할 때 채워 넣는 빈 템플릿이다. 필드 이름과 구조는
`policy.md`의 "Lesson Brief 생성" 섹션(YAML 예시) 및
`agents/lesson-brief-agent.md` Step 5·6과 반드시 일치해야 한다.

이미 채워진 예시는 `policy.md`(`lessonId: context-window-basic`)를 참고할 것 —
여기서는 값 대신 각 필드의 의미만 주석으로 설명한다.

```yaml
# Course Map에서 그대로 가져오는 안정적인 식별자. 제목이 바뀌어도 변경하지 않는다.
lessonId:

# 학습자가 이 Lesson을 통해 답을 얻는 질문. Course Map에서 그대로 가져온다.
learnerQuestion:

# 수료자가 이 Lesson을 마쳤을 때 설명할 수 있어야 할 내용 한 줄.
learningGoal:

# 학습자가 이미 알고 있어야 할 개념을 서술한 문장 목록.
# (선행 lessonId를 그대로 나열하지 않고, 그 Lesson이 전달한 개념을 문장으로 바꿔 쓴다)
prerequisites:
  -

# 이 Lesson에서 다루는 핵심 개념 목록. Wiki/웹 검색으로 근거를 확인한 내용만 채운다.
keyConcepts:
  -

# 초보자가 흔히 갖는 오해 목록. 근거 없이 임의로 지어내지 않는다.
commonMisconceptions:
  -

# 회사 업무 맥락에 연결되는 예시 한 가지.
businessExample:

# 이 Lesson에서 사용할 비유·시각화 의도. (제안적 성격이므로 다른 필드보다 근거 요구가 느슨하다)
visualIntent:
  -

# Scene별 계획. 목적(purpose)을 먼저 정하고, policy.md "화면 표현 선택 기준" 표에서
# 그 목적에 맞는 type/layout/motion을 고른다. 표에 없는 값을 임의로 만들지 않는다.
scenePlan:
  - sceneId:
    purpose:
    type:      # policy.md "화면 표현 선택 기준" 표의 값만 사용
    layout:    # policy.md "화면 표현 선택 기준" 표의 값만 사용
    motion:    # policy.md "화면 표현 선택 기준" 표의 값만 사용
    reveal:    # 예: manual

# 학습 완료를 확인할 수 있는 질문 또는 기준 목록.
completionCheck:
  -

# 다음 Lesson으로 이어지는 이유.
nextLessonReason:

# Step 3(Wiki 검색)/Step 4(웹 검색)에서 찾은 관련 Wiki 페이지 목록.
# 후속 Agent(Storyboard 작성 등)가 참고할 수 있도록 기록한다.
relatedGuides:
  - pageId:
    title:
```
