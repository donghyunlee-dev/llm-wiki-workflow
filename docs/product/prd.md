# 작업 요청: Confluence REST API로 `wiki.metadata` Content Property 업데이트

## 목표

Confluence의 Guide Index 페이지들에 대해 본문을 수정하지 말고, Confluence REST API를 사용해서 `wiki.metadata` Content Property를 생성하거나 업데이트한다.

현재 일부 페이지 본문 하단에 `## wiki.metadata` JSON 블록이 들어가 있을 수 있지만, 이것은 임시 표기일 뿐이다. 최종 기준은 Confluence Content Property의 key가 `wiki.metadata`인 데이터다.

즉, 아래 구조가 되어야 한다.

```text
Confluence Page
 ├─ body.storage        문서 본문
 ├─ parentId/ancestors  페이지 계층 정보
 └─ properties
     └─ wiki.metadata   정식 메타데이터
반드시 지켜야 할 원칙
페이지 본문은 수정하지 않는다.
페이지 이동도 하지 않는다.
Confluence Content Property만 생성/수정한다.
property key는 반드시 wiki.metadata로 한다.
child, children, parent, parents 같은 비정식 필드는 넣지 않는다.
정식 필드만 사용한다.
기존 property가 있으면 업데이트하고, 없으면 생성한다.
API 실패 시 페이지별로 실패 원인을 로그에 남긴다.
모든 작업은 idempotent 하게 작성한다. 같은 스크립트를 여러 번 실행해도 결과가 중복되면 안 된다.
참고 API

Confluence Cloud REST API v2의 Content Properties API를 사용한다.

공식 API 그룹은 다음이다.

GET /wiki/api/v2/pages/{page-id}/properties
POST /wiki/api/v2/pages/{page-id}/properties
GET /wiki/api/v2/pages/{page-id}/properties/{property-id}
PUT /wiki/api/v2/pages/{page-id}/properties/{property-id}

Atlassian 공식 문서 기준으로 page content property 생성은 POST /pages/{page-id}/properties, 수정은 PUT /pages/{page-id}/properties/{property-id}를 사용한다. 생성/수정에는 페이지 업데이트 권한과 write:page:confluence 권한이 필요하다.

인증 정보

환경 변수로 처리한다.

ATLASSIAN_SITE_URL=https://sfoodxproject.atlassian.net
ATLASSIAN_USER_EMAIL=...
ATLASSIAN_API_TOKEN=...

Basic Auth를 사용한다.

Authorization: Basic base64(email:apiToken)

API base URL은 다음 형식이다.

${ATLASSIAN_SITE_URL}/wiki/api/v2
업데이트 대상 페이지

다음 11개 Index 페이지에 대해 wiki.metadata Content Property를 설정한다.

[
  {
    "pageId": "63045651",
    "title": "[Guide] Index"
  },
  {
    "pageId": "87851100",
    "title": "[Guide] Tool Index"
  },
  {
    "pageId": "63995906",
    "title": "[Guide] Codex Index"
  },
  {
    "pageId": "66846748",
    "title": "[Guide] Claude Code Index"
  },
  {
    "pageId": "88211525",
    "title": "[Guide] Gemini Index"
  },
  {
    "pageId": "90636291",
    "title": "[Guide] OS Setup Index"
  },
  {
    "pageId": "90669057",
    "title": "[Guide] Development Environment Index"
  },
  {
    "pageId": "90406972",
    "title": "[Guide] MCP Setup Index"
  },
  {
    "pageId": "89161779",
    "title": "[Guide] AI Agent Workflow Index"
  },
  {
    "pageId": "88834163",
    "title": "[Guide] App Making Index"
  },
  {
    "pageId": "88834211",
    "title": "[Guide] Integration Index"
  }
]
wiki.metadata 스키마

정식 필드는 아래만 사용한다.

{
  "docType": "overview | concept | tutorial | howto | reference | troubleshooting | example | ops",
  "visibility": "public | internal",
  "audience": "beginner | intermediate | advanced",
  "status": "draft | reviewed | published",
  "prerequisites": ["Confluence page ID"],
  "next": ["Confluence page ID"],
  "related": ["Confluence page ID"],
  "owner": "platform-team",
  "lastReviewedAt": "YYYY-MM-DD",
  "reviewCycleDays": 90,
  "keywords": ["search keyword"]
}

주의:

prerequisites, next, related는 반드시 문자열 배열이다.
pageId는 숫자가 아니라 문자열로 저장한다.
lastReviewedAt은 오늘 날짜 기준으로 설정한다.
owner는 일단 platform-team으로 통일한다.
reviewCycleDays는 90으로 통일한다.
각 페이지별 metadata 값
[Guide] Index / 63045651
{
  "docType": "overview",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": [],
  "next": ["63668231", "87851100"],
  "related": ["63733762", "63995906", "66846748", "88211525", "90636291", "90669057", "90406972", "89161779", "88834163", "88834211"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["guide", "index", "navigation", "ai agent", "mcp", "setup", "workflow", "app making", "integration"]
}
[Guide] Tool Index / 87851100
{
  "docType": "reference",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": ["63045651"],
  "next": ["63995906", "66846748", "88211525"],
  "related": ["90669057", "90406972", "87228417", "70942776", "70942735"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["tool", "codex", "claude code", "gemini", "anythingllm", "chatgpt desktop", "claude desktop", "mcp"]
}
[Guide] Codex Index / 63995906
{
  "docType": "reference",
  "visibility": "public",
  "audience": "intermediate",
  "status": "published",
  "prerequisites": ["87851100", "71073834"],
  "next": ["86048864", "85950561", "85917930", "89161779"],
  "related": ["63045651", "90669057", "90406972", "88539222", "64618497", "64290887", "63373351", "63799379", "63373371", "63275091"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["codex", "codex cli", "mcp", "skill", "jira", "playwright", "browser", "filesystem"]
}
[Guide] Claude Code Index / 66846748
{
  "docType": "reference",
  "visibility": "public",
  "audience": "intermediate",
  "status": "published",
  "prerequisites": ["87851100", "88211499"],
  "next": ["66027572", "66191384", "66715705", "66682913", "89161779"],
  "related": ["63045651", "90669057", "90406972", "88539222", "64618497", "64290887"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["claude code", "claude cli", "mcp", "jira", "playwright", "agent browser", "skill", "workflow"]
}
[Guide] Gemini Index / 88211525
{
  "docType": "reference",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": ["87851100", "70418496"],
  "next": ["89161779"],
  "related": ["63045651", "90669057", "88539222", "64618497", "64290887"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["gemini", "gemini cli", "cli", "setup", "ai agent", "workflow"]
}
[Guide] OS Setup Index / 90636291
{
  "docType": "reference",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": ["63045651"],
  "next": ["90669057", "90406972"],
  "related": ["70713377", "88539222", "72744962", "73007106", "70418464", "72646657", "72613890", "72679445", "86016021", "86212679", "86310913"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["os setup", "windows", "macos", "linux", "wsl", "terminal", "node", "python", "git", "mcp"]
}
[Guide] Development Environment Index / 90669057
{
  "docType": "reference",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": ["63045651", "90636291"],
  "next": ["90406972", "89161779"],
  "related": ["70484003", "70254643", "70483975", "64618497", "64290859", "64290887", "67928082", "63209560", "70778926", "70320165"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["development environment", "terminal", "git", "python", "node.js", "npm", "npx", "pnpm", "chromium", "github"]
}
[Guide] MCP Setup Index / 90406972
{
  "docType": "reference",
  "visibility": "public",
  "audience": "intermediate",
  "status": "published",
  "prerequisites": ["63045651", "84345278", "90669057"],
  "next": ["85950505", "83886508", "84181346", "84181326"],
  "related": ["86048771", "86048791", "86048864", "85917838", "85917858", "86016041", "85950561", "83919146", "84967759", "84738331", "84705630"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["mcp", "model context protocol", "filesystem mcp", "browser mcp", "desktop control mcp", "gmail", "notion", "google sheets", "microsoft 365"]
}
[Guide] AI Agent Workflow Index / 89161779
{
  "docType": "reference",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": ["63045651", "90669057"],
  "next": ["85917698", "85950465", "85917720", "85917740", "85950485", "86016001", "85917760"],
  "related": ["90406972", "87851100", "63995906", "66846748", "88211525"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["ai agent", "workflow", "workspace", "prompt", "project analysis", "safe edit", "test", "validation", "github"]
}
[Guide] App Making Index / 88834163
{
  "docType": "reference",
  "visibility": "public",
  "audience": "beginner",
  "status": "published",
  "prerequisites": ["63045651", "89161779"],
  "next": ["85196923", "84967655", "84640012", "84640032", "84345124", "84181216", "84345169", "84705531", "85196965", "84672723", "83886418", "83886469"],
  "related": ["90669057", "87851100"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["app making", "gpt", "claude", "vibe coding", "prototype", "implementation", "test", "deploy"]
}
[Guide] Integration Index / 88834211
{
  "docType": "reference",
  "visibility": "public",
  "audience": "intermediate",
  "status": "published",
  "prerequisites": ["63045651", "90406972"],
  "next": ["83919146", "84967759", "84738331", "84705630", "70778926", "70320165", "87228417", "67928124"],
  "related": ["90669057", "89161779"],
  "owner": "platform-team",
  "lastReviewedAt": "2026-05-07",
  "reviewCycleDays": 90,
  "keywords": ["integration", "microsoft 365", "notion", "google sheets", "gmail", "github", "anythingllm", "local rag", "teams notification"]
}
구현 요구사항
스크립트 위치

프로젝트 루트에 다음 파일을 만든다.

scripts/update-confluence-wiki-metadata.js

Node.js 20 이상 기준으로 작성한다.

외부 라이브러리는 가능하면 사용하지 말고, Node.js 기본 fetch를 사용한다.
필요하면 .env 처리는 사용하지 말고 환경 변수는 실행 환경에서 주입한다고 가정한다.

처리 흐름

각 page에 대해 다음 순서로 처리한다.

환경 변수 검증
GET /wiki/api/v2/pages/{pageId}/properties?key=wiki.metadata
응답의 results에서 key가 wiki.metadata인 property 확인
없으면 POST /wiki/api/v2/pages/{pageId}/properties
있으면 PUT /wiki/api/v2/pages/{pageId}/properties/{propertyId}
PUT 시 version number는 기존 property version number + 1로 설정
처리 결과를 콘솔에 출력
전체 성공/실패 요약 출력
GET 예시
GET /wiki/api/v2/pages/{pageId}/properties?key=wiki.metadata
Accept: application/json
Authorization: Basic ...
POST body 예시
{
  "key": "wiki.metadata",
  "value": {
    "docType": "reference",
    "visibility": "public",
    "audience": "beginner",
    "status": "published",
    "prerequisites": [],
    "next": [],
    "related": [],
    "owner": "platform-team",
    "lastReviewedAt": "2026-05-07",
    "reviewCycleDays": 90,
    "keywords": []
  }
}
PUT body 예시
{
  "key": "wiki.metadata",
  "value": {
    "docType": "reference",
    "visibility": "public",
    "audience": "beginner",
    "status": "published",
    "prerequisites": [],
    "next": [],
    "related": [],
    "owner": "platform-team",
    "lastReviewedAt": "2026-05-07",
    "reviewCycleDays": 90,
    "keywords": []
  },
  "version": {
    "number": 2,
    "message": "Update wiki.metadata"
  }
}
검증 요구사항

업데이트 후 각 페이지에 대해 다시 조회해서 다음을 확인한다.

GET /wiki/api/v2/pages/{pageId}/properties?key=wiki.metadata

검증 기준:

results.length >= 1
results[0].key === "wiki.metadata"
results[0].value가 존재해야 한다.
value의 필드가 정식 필드만 포함해야 한다.
prerequisites, next, related, keywords는 배열이어야 한다.
lastReviewedAt은 YYYY-MM-DD 형식이어야 한다.
reviewCycleDays는 number여야 한다.
정식 필드 검증 함수 작성

다음 필드 외에는 허용하지 않는다.

const ALLOWED_FIELDS = new Set([
  "docType",
  "visibility",
  "audience",
  "status",
  "prerequisites",
  "next",
  "related",
  "owner",
  "lastReviewedAt",
  "reviewCycleDays",
  "keywords",
]);

허용되지 않은 필드가 있으면 API 호출 전에 에러를 발생시킨다.

enum 검증
const DOC_TYPES = new Set([
  "overview",
  "concept",
  "tutorial",
  "howto",
  "reference",
  "troubleshooting",
  "example",
  "ops",
]);

const VISIBILITIES = new Set(["public", "internal"]);
const AUDIENCES = new Set(["beginner", "intermediate", "advanced"]);
const STATUSES = new Set(["draft", "reviewed", "published"]);
출력 형식

성공 시:

[OK] 63045651 [Guide] Index - updated property wiki.metadata

생성 시:

[OK] 63045651 [Guide] Index - created property wiki.metadata

실패 시:

[FAIL] 63045651 [Guide] Index - 401 Unauthorized

마지막 요약:

Summary
- total: 11
- created: 3
- updated: 8
- failed: 0
테스트 요구사항

가능하면 먼저 테스트를 작성한다.

테스트 대상:

metadata validation
disallow unknown field
enum validation
PUT version number 계산
create/update 분기 로직
API 실패 시 실패 결과 기록

테스트 프레임워크는 Node.js 기본 node:test를 사용한다.

파일 구조 예시:

scripts/
  update-confluence-wiki-metadata.js
  update-confluence-wiki-metadata.test.js

테스트에서는 실제 Confluence API를 호출하지 말고, fetch mock을 사용한다.

완료 기준

다음 조건을 만족하면 완료다.

11개 Index 페이지 모두 wiki.metadata Content Property가 생성 또는 업데이트됨
모든 metadata는 정식 필드만 포함함
child, children, parent, parents 필드는 없음
API 실행 결과 요약이 출력됨
실패한 페이지가 있으면 pageId, title, HTTP status, response body 일부가 출력됨
테스트가 통과함
README 또는 실행 방법이 주석으로 포함됨
실행 예시
ATLASSIAN_SITE_URL=https://sfoodxproject.atlassian.net \
ATLASSIAN_USER_EMAIL=your-email@example.com \
ATLASSIAN_API_TOKEN=your-token \
node scripts/update-confluence-wiki-metadata.js
주의사항
Confluence 페이지 본문은 수정하지 않는다.
기존 본문 하단에 있는 ## wiki.metadata 블록은 이번 작업 대상이 아니다.
이번 작업은 Content Property만 다룬다.
API Token, 이메일, 사이트 URL은 코드에 하드코딩하지 않는다.
실패해도 다음 페이지 처리는 계속 진행한다.
단, metadata validation 실패는 코드 버그이므로 API 호출 전에 즉시 중단해도 된다.

핵심은 **본문 업데이트가 아니라 `/wiki/api/v2/pages/{pageId}/properties`를 사용해 `wiki.metadata` Content Property를 upsert**하는 작업으로 지시하는 것입니다.
::contentReference[oaicite:1]{index=1}
