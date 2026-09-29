# 루틴: Lesson Curriculum Maintenance

- **루틴 ID**: `TBD (등록 후 기록)`
- **스케줄**: `0 12 * * 5` (UTC 12:00 = KST 21:00, 매주 금요일)
- **관리 링크**: TBD

## 루틴 프롬프트

```
You are the Lesson Curriculum Maintainer for the S-Food IT AX team's AI 기초교육(AI Fundamentals) Confluence content.

## Context

Repository: sfood-it-dev-ax-org/SFOOD-LLM-WIKI-WORKFLOW
Task: Execute the lesson curriculum maintenance workflow (Charter → Course Map → Lesson Brief → Storyboard → Self-check → Weekly Signal Report).

First, read `CLAUDE.md` for full project context and architecture. Then read `skills/lesson-curriculum-maintainer/SKILL.md` and `skills/lesson-curriculum-maintainer/policy.md` for the skill's identity, scope, and thresholds.

## Confluence Access

Atlassian Rovo MCP is connected. Use `mcp__claude_ai_Atlassian_Rovo__*` tools for ALL Confluence operations.

Atlassian Rovo MCP has NO Content Property read/write capability (confirmed against the full tool list — only page CRUD, search, and comments exist). All `wiki.metadata` / `lesson.presentation` / `lesson.course` Content Property reads and writes in this pipeline are performed by dedicated routine-level Bash/curl steps (Step 2.5, Step 3.5, Step 3.6, Step 4.5 below), the same pattern as weekly-maintenance.md's Step 4.5.

Credentials for these direct REST API calls (Content Properties only):
- `ATLASSIAN_SITE_URL`: https://sfoodxproject.atlassian.net
- `ATLASSIAN_USER_EMAIL` / `ATLASSIAN_API_TOKEN`: injected as cloud environment variables (configured in the routine's cloud environment settings). Local fallback: `.env.local`.

Each curl step below sources credentials the same way and prints a `SKIPPED` message (without failing the routine) if they are unavailable:
```bash
if [ -f .env.local ]; then set -a; source .env.local; set +a; fi
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ]; then
  echo "<STEP-NAME>_SKIPPED: ATLASSIAN credentials not available (check cloud environment variables)"
  exit 0
fi
```

## Execution Pipeline

Run today's date via Bash (`date +%Y-%m-%d`) and use it as `{TODAY}`. Create `tmp/` directory if it does not exist.

### Step -1 — Resolve targets and check Approval Queue gate

Run Bash to resolve the current target page IDs out of `skills/lesson-curriculum-maintainer/course-targets.md` into variables held in context for the rest of this run (do not pass the literal `<course-targets.md에서 확인>`-style placeholder to any agent — resolve the real value here, the same way `{TODAY}` is resolved once and reused):

```bash
COURSE_TARGETS=skills/lesson-curriculum-maintainer/course-targets.md
APPROVAL_QUEUE_PAGE_ID=$(awk -F'|' '/Lesson Approval Queue/ {gsub(/^ +| +$/,"",$3); print $3}' "$COURSE_TARGETS")
COURSE_INDEX_PAGE_ID=$(awk -F'|' '/AI 기초교육 Index/ {gsub(/^ +| +$/,"",$3); print $3}' "$COURSE_TARGETS")
echo "APPROVAL_QUEUE_PAGE_ID=$APPROVAL_QUEUE_PAGE_ID"
echo "COURSE_INDEX_PAGE_ID=$COURSE_INDEX_PAGE_ID"
```

Hold the resolved `{APPROVAL_QUEUE_PAGE_ID}` and `{COURSE_INDEX_PAGE_ID}` values in context and substitute them literally wherever this routine references them below (same convention as `{TODAY}` / `{REPO_ROOT}`).

If `{APPROVAL_QUEUE_PAGE_ID}` is `TBD`: do not spawn charter-agent or any other agent against a bogus ID. Write the run report `runs/{TODAY}-lesson-curriculum.md` noting "Lesson Approval Queue page not yet created (Task 9 pending)", then go directly to Step 6 (Commit and Push) and exit. Do not execute Step 0 through Step 4.5.

If `{APPROVAL_QUEUE_PAGE_ID}` is a real page ID, continue to Step 0.

### Step 0 — Charter

Spawn an Agent with:
- Prompt: read and use the full contents of `skills/lesson-curriculum-maintainer/agents/charter-agent.md`, appending: "date: {TODAY}, repo: {REPO_ROOT}, approval_queue_page_id: {APPROVAL_QUEUE_PAGE_ID}, output: tmp/charter-result.json"
- Model: claude-sonnet-4-6

Wait for completion. Read `tmp/charter-result.json` and check `decision`:
- `CHARTER_APPROVED` → continue to Step 1.
- `CHARTER_PENDING_APPROVAL` or `ERROR` → stop here. Write the run report (`runs/{TODAY}-lesson-curriculum.md`) noting the pending/blocked gate and the actual `decision` value, then go to Step 6 (Commit and Push) and exit. (Note: charter-agent auto-approves on first-ever creation per `policy.md` — `CHARTER_PENDING_APPROVAL` only occurs when a human has proposed a change to an already-approved charter.)

### Step 1 — Course Map

Spawn an Agent with:
- Prompt: read and use the full contents of `skills/lesson-curriculum-maintainer/agents/course-map-agent.md`, appending: "charter_result_path: tmp/charter-result.json, approval_queue_page_id: {APPROVAL_QUEUE_PAGE_ID}, course_targets_path: skills/lesson-curriculum-maintainer/course-targets.md, output: tmp/course-map-result.json"
- Model: claude-sonnet-4-6

Wait for completion. Read `tmp/course-map-result.json` and check `decision`:
- `MAP_APPROVED` → continue to Step 2.
- `SKIPPED_CHARTER_NOT_APPROVED`, `MAP_PENDING_APPROVAL`, or `ERROR` → stop here. Write the run report noting the pending/blocked gate and the actual `decision` value, then go to Step 6 (Commit and Push) and exit. (Note: course-map-agent auto-approves on first-ever creation per `policy.md` — `MAP_PENDING_APPROVAL` only occurs when a human/signal-report-agent has proposed a structural change to an already-approved map.)

### Step 2 — Lesson Brief

Spawn an Agent with:
- Prompt: read and use the full contents of `skills/lesson-curriculum-maintainer/agents/lesson-brief-agent.md`, appending: "course_map_result_path: tmp/course-map-result.json, output: tmp/lesson-brief-result.json"
- Model: claude-sonnet-4-6

Wait for completion. Verify `tmp/lesson-brief-result.json` was written.

### Step 2.5 — Fetch Current Course Index lesson.course

Content Property read/write has no MCP tool — this step fetches the Course Index's current `lesson.course` value via direct REST curl so storyboard-writer-agent (Step 3) can read it as plain JSON instead of calling a property-read API itself.

Run Bash:
```bash
if [ -f .env.local ]; then set -a; source .env.local; set +a; fi
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ]; then
  echo "LESSON_COURSE_FETCH_SKIPPED: ATLASSIAN credentials not available (check cloud environment variables)"
  echo "null" > tmp/current-lesson-course.json
  exit 0
fi

python3 - <<'PYEOF'
import json, subprocess, os, base64, re

email = os.environ["ATLASSIAN_USER_EMAIL"]
token = os.environ["ATLASSIAN_API_TOKEN"]
site  = "sfoodxproject.atlassian.net"
auth  = base64.b64encode(f"{email}:{token}".encode()).decode()

with open("skills/lesson-curriculum-maintainer/course-targets.md") as f:
    targets = f.read()
m = re.search(r"AI 기초교육 Index.*?\|\s*([^\|]+?)\s*\|", targets)
course_index_page_id = m.group(1).strip() if m else ""

value = None
if course_index_page_id and course_index_page_id != "TBD":
    # Confluence REST v2's single-property GET endpoint (/properties/{property-id}) expects
    # the numeric property id, NOT the key name — passing "lesson.course" as {property-id}
    # returns 400 INVALID_REQUEST_PARAMETER. List all properties and filter by key instead.
    result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}",
         f"https://{site}/wiki/api/v2/pages/{course_index_page_id}/properties",
         "-H", f"Authorization: Basic {auth}"],
        capture_output=True, text=True
    )
    *body_lines, status = result.stdout.rsplit("\n", 1)
    body = "\n".join(body_lines)
    status = status.strip()
    if status.startswith("2"):
        try:
            for prop in json.loads(body).get("results", []):
                if prop.get("key") == "lesson.course":
                    value = prop.get("value")
                    break
        except Exception:
            value = None
    print(f"  Course Index {course_index_page_id} lesson.course: HTTP {status}")
else:
    print("  Course Index page id not resolved (still TBD) — writing null")

with open("tmp/current-lesson-course.json", "w") as f:
    json.dump(value, f)
PYEOF
```

### Step 3 — Storyboard

Spawn an Agent with:
- Prompt: read and use the full contents of `skills/lesson-curriculum-maintainer/agents/storyboard-writer-agent.md`, appending: "lesson_brief_result_path: tmp/lesson-brief-result.json, course_targets_path: skills/lesson-curriculum-maintainer/course-targets.md, current_lesson_course_path: tmp/current-lesson-course.json, output: tmp/storyboard-result.json"
- Model: claude-sonnet-4-6

Wait for completion. Verify `tmp/storyboard-result.json` was written.

### Step 3.5 — Set Lesson Content Properties

Content Property write has no MCP tool — this step POSTs the payload objects that storyboard-writer-agent already computed (Step 3's `output`) via direct REST curl, verbatim, without reconstructing anything.

Run Bash:
```bash
if [ -f .env.local ]; then set -a; source .env.local; set +a; fi
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ]; then
  echo "LESSON_PROPERTIES_SKIPPED: ATLASSIAN credentials not available (check cloud environment variables)"
  exit 0
fi

python3 - <<'PYEOF'
import json, subprocess, os, base64, re

email = os.environ["ATLASSIAN_USER_EMAIL"]
token = os.environ["ATLASSIAN_API_TOKEN"]
site  = "sfoodxproject.atlassian.net"
auth  = base64.b64encode(f"{email}:{token}".encode()).decode()

def post_property(page_id, key, value):
    # Confluence REST v2 POST /properties creates a NEW property and returns 409 CONFLICT
    # if the key already exists on this page (e.g. re-running this step, or lesson.course
    # which Task 9 already initialized on the Course Index). On 409, fall back to PUT
    # against the existing property's numeric id with version.number incremented by 1 —
    # PUT requires that numeric id, not the key name, so list properties first to find it.
    payload = json.dumps({"key": key, "value": value})
    result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}",
         "-X", "POST",
         f"https://{site}/wiki/api/v2/pages/{page_id}/properties",
         "-H", f"Authorization: Basic {auth}",
         "-H", "Content-Type: application/json",
         "-d", payload],
        capture_output=True, text=True
    )
    *_, status = result.stdout.rsplit("\n", 1)
    status = status.strip()
    if status.startswith("2"):
        print(f"  page {page_id} [{key}]: HTTP {status} OK (created)")
        return True
    if status != "409":
        print(f"  page {page_id} [{key}]: HTTP {status} FAILED")
        return False

    list_result = subprocess.run(
        ["curl", "-s", f"https://{site}/wiki/api/v2/pages/{page_id}/properties",
         "-H", f"Authorization: Basic {auth}"],
        capture_output=True, text=True
    )
    try:
        props = json.loads(list_result.stdout).get("results", [])
    except Exception:
        props = []
    existing = next((p for p in props if p.get("key") == key), None)
    if not existing:
        print(f"  page {page_id} [{key}]: 409 but existing property not found via list — FAILED")
        return False

    next_version = existing["version"]["number"] + 1
    put_payload = json.dumps({"key": key, "value": value, "version": {"number": next_version, "message": "auto-update"}})
    put_result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}",
         "-X", "PUT",
         f"https://{site}/wiki/api/v2/pages/{page_id}/properties/{existing['id']}",
         "-H", f"Authorization: Basic {auth}",
         "-H", "Content-Type: application/json",
         "-d", put_payload],
        capture_output=True, text=True
    )
    *_, put_status = put_result.stdout.rsplit("\n", 1)
    put_status = put_status.strip()
    ok = put_status.startswith("2")
    print(f"  page {page_id} [{key}]: HTTP {put_status} {'OK' if ok else 'FAILED'} (updated via PUT, v{next_version})")
    return ok

with open("tmp/storyboard-result.json") as f:
    data = json.load(f)

pages_created_by_id = {
    p["page_id"]: p for p in data.get("pages_created", []) if p.get("page_id")
}

for this_run in data.get("pages_created_this_run", []):
    page_id = this_run.get("page_id", "")
    if not page_id:
        continue
    page = pages_created_by_id.get(page_id, this_run)
    if "wiki_metadata" in page:
        post_property(page_id, "wiki.metadata", page["wiki_metadata"])
    if "lesson_presentation" in page:
        post_property(page_id, "lesson.presentation", page["lesson_presentation"])

lesson_course_update = data.get("lesson_course_update")
if lesson_course_update:
    with open("skills/lesson-curriculum-maintainer/course-targets.md") as f:
        targets = f.read()
    m = re.search(r"AI 기초교육 Index.*?\|\s*([^\|]+?)\s*\|", targets)
    course_index_page_id = m.group(1).strip() if m else ""
    if course_index_page_id and course_index_page_id != "TBD":
        post_property(course_index_page_id, "lesson.course", lesson_course_update)
    else:
        print("  lesson.course update SKIPPED: Course Index page id not resolved")
PYEOF
```

Step 3.5의 Bash 출력 전체(SKIPPED 또는 페이지별 HTTP 결과)를 `runs/{TODAY}-lesson-curriculum.md`에 `- Lesson Properties (Step 3.5): ...` 항목으로 기록한다. SKIPPED 또는 FAILED가 있으면 WARN으로 표기한다.

### Step 3.6 — Fetch Lesson Properties for Self-check

Content Property read has no MCP tool — this step fetches the `wiki.metadata`/`lesson.presentation` that Step 3.5 just wrote via direct REST curl, so self-check-agent (Step 4) can verify against actual stored values instead of calling a property-read API itself.

Run Bash:
```bash
if [ -f .env.local ]; then set -a; source .env.local; set +a; fi
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ]; then
  echo "LESSON_PROPERTIES_FETCH_SKIPPED: ATLASSIAN credentials not available (check cloud environment variables)"
  echo "{}" > tmp/lesson-properties.json
  exit 0
fi

python3 - <<'PYEOF'
import json, subprocess, os, base64

email = os.environ["ATLASSIAN_USER_EMAIL"]
token = os.environ["ATLASSIAN_API_TOKEN"]
site  = "sfoodxproject.atlassian.net"
auth  = base64.b64encode(f"{email}:{token}".encode()).decode()

def get_all_properties(page_id):
    # Confluence REST v2's single-property GET endpoint (/properties/{property-id}) expects
    # the numeric property id, NOT the key name — list all properties and filter by key instead.
    result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}",
         f"https://{site}/wiki/api/v2/pages/{page_id}/properties",
         "-H", f"Authorization: Basic {auth}"],
        capture_output=True, text=True
    )
    *body_lines, status = result.stdout.rsplit("\n", 1)
    body = "\n".join(body_lines)
    status = status.strip()
    values_by_key = {}
    if status.startswith("2"):
        try:
            for prop in json.loads(body).get("results", []):
                values_by_key[prop.get("key")] = prop.get("value")
        except Exception:
            pass
    return values_by_key

with open("tmp/storyboard-result.json") as f:
    data = json.load(f)

properties = {}
for page in data.get("pages_created", []):
    page_id = page.get("page_id", "")
    if not page_id:
        continue
    values_by_key = get_all_properties(page_id)
    properties[page_id] = {
        "wiki.metadata": values_by_key.get("wiki.metadata"),
        "lesson.presentation": values_by_key.get("lesson.presentation"),
    }
    print(f"  fetched properties for page {page_id}")

with open("tmp/lesson-properties.json", "w") as f:
    json.dump(properties, f)
PYEOF
```

### Step 4 — Self-check

Spawn an Agent with:
- Prompt: read and use the full contents of `skills/lesson-curriculum-maintainer/agents/self-check-agent.md`, appending: "storyboard_result_path: tmp/storyboard-result.json, lesson_properties_path: tmp/lesson-properties.json, output: tmp/self-check-result.json"
- Model: claude-haiku-4-5-20251001

Wait for completion. Verify `tmp/self-check-result.json` was written.

### Step 4.5 — Apply Self-check Status Updates

Content Property write has no MCP tool — this step reads self-check-agent's `statusAfter` decision (Step 4's `output`) and POSTs the status change via direct REST curl. self-check-agent itself never writes the status.

Run Bash:
```bash
if [ -f .env.local ]; then set -a; source .env.local; set +a; fi
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ]; then
  echo "STATUS_UPDATE_SKIPPED: ATLASSIAN credentials not available (check cloud environment variables)"
  exit 0
fi

python3 - <<'PYEOF'
import json, subprocess, os, base64, copy

email = os.environ["ATLASSIAN_USER_EMAIL"]
token = os.environ["ATLASSIAN_API_TOKEN"]
site  = "sfoodxproject.atlassian.net"
auth  = base64.b64encode(f"{email}:{token}".encode()).decode()

with open("tmp/storyboard-result.json") as f:
    storyboard = json.load(f)
wiki_metadata_by_page = {
    p["page_id"]: p["wiki_metadata"]
    for p in storyboard.get("pages_created", [])
    if p.get("page_id") and "wiki_metadata" in p
}

with open("tmp/self-check-result.json") as f:
    self_check = json.load(f)

for entry in self_check.get("results", []):
    page_id = entry.get("page_id", "")
    if entry.get("statusAfter") != "published" or not page_id:
        continue
    base = wiki_metadata_by_page.get(page_id)
    if not base:
        print(f"  page {page_id}: SKIPPED (no wiki_metadata baseline found)")
        continue
    updated = copy.deepcopy(base)
    updated["status"] = "published"

    # This property was already created by Step 3.5 moments earlier in this same run, so
    # POST would return 409 CONFLICT here every time — this is always an UPDATE. List
    # properties to find the current numeric id + version, then PUT with version+1.
    list_result = subprocess.run(
        ["curl", "-s", f"https://{site}/wiki/api/v2/pages/{page_id}/properties",
         "-H", f"Authorization: Basic {auth}"],
        capture_output=True, text=True
    )
    try:
        props = json.loads(list_result.stdout).get("results", [])
    except Exception:
        props = []
    existing = next((p for p in props if p.get("key") == "wiki.metadata"), None)
    if not existing:
        print(f"  page {page_id}: SKIPPED (wiki.metadata property not found on page)")
        continue

    next_version = existing["version"]["number"] + 1
    payload = json.dumps({"key": "wiki.metadata", "value": updated, "version": {"number": next_version, "message": "self-check: published"}})
    result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}",
         "-X", "PUT",
         f"https://{site}/wiki/api/v2/pages/{page_id}/properties/{existing['id']}",
         "-H", f"Authorization: Basic {auth}",
         "-H", "Content-Type: application/json",
         "-d", payload],
        capture_output=True, text=True
    )
    *_, status = result.stdout.rsplit("\n", 1)
    status = status.strip()
    ok = status.startswith("2")
    print(f"  page {page_id} [wiki.metadata → published]: HTTP {status} {'OK' if ok else 'FAILED'} (v{next_version})")
PYEOF
```

Step 4.5의 Bash 출력 전체를 `runs/{TODAY}-lesson-curriculum.md`에 `- Status Updates (Step 4.5): ...` 항목으로 기록한다. SKIPPED 또는 FAILED가 있으면 WARN으로 표기한다.

### Step 5 — Weekly Signal Report

Spawn an Agent with:
- Prompt: read and use the full contents of `skills/lesson-curriculum-maintainer/agents/signal-report-agent.md`, appending: "date: {TODAY}, repo: {REPO_ROOT}, output: runs/{TODAY}-lesson-curriculum.md"
- Model: claude-haiku-4-5-20251001

Wait for completion. Verify `runs/{TODAY}-lesson-curriculum.md` was written.

## Step 6 — Commit and Push Results

Run Bash:
```bash
git add runs/{TODAY}-lesson-curriculum.md skills/lesson-curriculum-maintainer/course-targets.md
git commit -m "chore: lesson curriculum maintenance run {TODAY}" || true
git push origin HEAD
```
```

## 변경 이력

| 날짜 | 변경 내용 |
|---|---|
| 2026-07-30 | 실제 실행 중 발견한 Confluence REST v2 API 버그 2건 수정 — (1) 단일 속성 GET(`/properties/{property-id}`)은 key 이름이 아니라 숫자 id를 요구함(400 오류) → 목록 조회 후 key로 필터링하도록 Step 2.5/3.6 수정. (2) 이미 존재하는 key에 POST하면 409 CONFLICT 발생 → Step 3.5/4.5에 POST 실패 시 목록에서 기존 id·version을 찾아 PUT으로 갱신하는 upsert 로직 추가 |
| 2026-07-30 | Content Property MCP 도구 부재 문제 수정 — Step 2.5/3.5/3.6/4.5 curl REST 단계 추가(weekly-maintenance.md Step 4.5와 동일 패턴), storyboard-writer-agent/self-check-agent가 payload/decision만 계산하고 실제 쓰기는 루틴이 수행하도록 정리. Approval Queue `TBD` 상태를 Step -1의 결정적 Bash 체크로 처리하고 `<course-targets.md에서 확인>` placeholder를 `{APPROVAL_QUEUE_PAGE_ID}`/`{COURSE_INDEX_PAGE_ID}` 변수 해석으로 교체 |
| 2026-07-30 | 초기 루틴 생성 |
