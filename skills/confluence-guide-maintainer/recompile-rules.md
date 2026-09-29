# Recompile Rules

## Recompile Definition

Recompile means rewriting an existing guide into a coherent current version using verified source information.

It is not an append-only update.

## When to Recompile

Recompile when:

- The page has outdated instructions mixed with current instructions.
- Setup flow has changed.
- Authentication flow has changed.
- Tool names or commands changed.
- The guide no longer matches current usage.
- The document structure makes the answer hard for humans or AI agents to use.

## Recompile Goals

A recompiled guide should:

- Preserve the original page purpose.
- Remove outdated content.
- Keep only current and verified instructions.
- Improve navigation and section flow.
- Include prerequisites.
- Include setup steps.
- Include verification steps.
- Include troubleshooting.
- Include related pages as a plain bullet list of direct Confluence links.
- Never use raw HTML tags or pasted anchor markup for related pages.
- Include source references.

## Page Scope Enforcement

**페이지 제목이 범위를 정의한다.**

페이지 제목을 기준으로 이 페이지에 들어갈 내용과 들어가지 말아야 할 내용을 판단한다.

| 제목 패턴 | 포함해야 할 내용 | 포함하면 안 되는 내용 |
|----------|----------------|-------------------|
| `*CLI Setup` / `*설치` | 설치 전 요구사항, OS별 설치 방법, 패키지 매니저별 설치 옵션, 설치 확인, 설치 오류 해결 | 도구 사용법, 명령어 목록, 개념 설명, 고급 워크플로우 |
| `*사용법` / `*Usage` | 명령어, 옵션, 실행 예시 | 설치 절차, 개념 배경 |
| `*개념` / `*Overview` | 개념 설명, 배경, 왜 쓰는가 | 상세 설치 절차, 명령어 레퍼런스 |

리컴파일 전에 기존 페이지 내용을 제목과 대조하여 범위를 벗어난 섹션을 모두 식별한다.

## Setup Page Depth Rule

제목에 "Setup", "설치", "Install"이 포함된 페이지는 아래 항목을 충실히 다룬다.

**필수 섹션:**
- 사전 요구사항 (OS, 런타임, 권한 등)
- OS별 설치 방법 (macOS / Windows / Linux 각각)
- 패키지 매니저별 설치 옵션 (npm, brew, winget, apt 등 해당하는 것 모두)
- 설치 확인 명령어 및 예상 출력
- 자주 발생하는 설치 오류와 해결 방법 (공식 문서 + 검색으로 최대한 수집)

오류 해결 섹션은 단순 나열이 아니라, 오류 메시지 → 원인 → 해결 순서로 작성한다.

## Auto Page Split Rule

리컴파일 중 범위를 벗어난 내용이 발견되면 자동으로 별도 페이지로 분리한다.

**자동 분리 기준 (모두 해당하면 무조건 분리):**
- 해당 섹션의 제목이 원본 페이지 제목과 다른 주제를 나타낸다. (예: "CLI Setup" 페이지에 "Subagent 사용법" 섹션)
- 동일한 내용의 Confluence 페이지가 이미 존재하지 않는다.

내용의 분량이 적더라도 제목과 맞지 않으면 분리한다. 분리 후 내용이 짧은 경우 공식 소스에서 내용을 보완하여 채운다.

**분리 절차 (생략 불가):**
1. 범위 초과 섹션을 원본 페이지에서 제거한다.
2. 제거한 내용을 공식 소스로 보강하여 새 페이지를 생성한다.
   - 새 페이지 제목: 섹션 주제를 반영한 명확한 이름 (예: `[Guide] Claude Code Subagent 사용법`)
   - 부모 페이지: 원본 페이지와 동일한 부모 또는 가장 관련 있는 Index 하위
3. 원본 페이지의 "관련 페이지" 섹션에 새 페이지 링크를 추가한다.
4. 관련 Index 페이지에 새 페이지를 등록한다.
5. 런 리포트 "Pages Created" 항목에 분리 사유와 새 페이지 정보를 반드시 기록한다.

**분리를 생략해서는 안 된다.** 내용을 제거만 하고 새 페이지를 만들지 않으면 정보가 소실된다.

## Recompile Constraints

Do not:

- Add unsupported steps.
- Invent commands.
- Keep outdated content unless clearly marked as legacy.
- Add a separate "new update" section when the entire flow should be rewritten.
- Delete important context without recording it in the run report.

## Manual Review Required

Manual review is required if:

- Recompile would remove large sections with no clear replacement source.
- Recompile would change the intended audience.
- Recompile would merge multiple pages.
- Source conflict exists.
- Split target page already has a likely duplicate in Confluence and deduplication is unclear.
