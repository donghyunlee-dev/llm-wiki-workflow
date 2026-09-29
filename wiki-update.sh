#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$script_dir
codex_bin=${CODEX_BIN:-codex}
home_dir=${HOME:-}

# Load .env.local if present (OPENAI_API_KEY 등 환경변수 로드)
env_file="$repo_root/.env.local"
if [ -f "$env_file" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$env_file"
  set +a
fi

if [ "$#" -eq 0 ]; then
  mode="weekly"
  set -- weekly
else
  mode="$*"
fi

# 실행 결과(runs/ 리포트 등)를 GitHub에 동기화한다.
# 수동 실행도 CCR 원격 실행과 동일하게 리포트를 항상 push한다.
push_reports() {
  today=$(date +%Y-%m-%d)
  cd "$repo_root"
  git add runs/ skills/confluence-guide-maintainer/wiki-targets.md tmp/playbook-analysis.json 2>/dev/null || true
  if git diff --cached --quiet; then
    echo "push_reports: 변경 사항 없음 — push 생략"
    return 0
  fi
  git commit -m "chore: ${mode} manual run ${today} (dashboard)" || return 0
  if ! git push origin HEAD; then
    echo "push_reports: push 실패 — rebase 후 재시도"
    git pull --rebase origin main && git push origin HEAD || echo "push_reports: 재시도 실패 (수동 확인 필요)" >&2
  fi
}

# auto-search: Codex 없이 Node.js 스크립트 직접 실행
if [ "$mode" = "auto-search" ]; then
  node "$repo_root/auto-search.mjs"
  push_reports
  exit 0
fi

if [ -n "${CODEX_HOME:-}" ]; then
  codex_home=$CODEX_HOME
elif [ -n "$home_dir" ] && [ -w "$home_dir" ]; then
  codex_home="$home_dir/.codex"
else
  codex_home="${TMPDIR:-/tmp}/codex-wiki-update"
fi

if [ ! -x "$codex_bin" ] && ! command -v "$codex_bin" >/dev/null 2>&1; then
  echo "error: codex not found: $codex_bin" >&2
  exit 1
fi

mkdir -p "$codex_home"
mkdir -p "$repo_root/tmp"

# 대시보드 step 추적: step 1 기록 (에이전트가 팀방으로 이동하도록)
step_file="$repo_root/tmp/step-${mode}.json"
printf '{"step":1}' > "$step_file"

prompt=$(cat <<EOF
Use the confluence-guide-maintainer skill.
Run the wiki-update $mode workflow.
Read AGENTS.md first, then follow skills/confluence-guide-maintainer/SKILL.md and skills/confluence-guide-maintainer/commands.md.
Write the required run report.
EOF
)

# exec 대신 일반 실행으로 변경하여 종료 시 step 파일 정리
if [ "$codex_home" = "${TMPDIR:-/tmp}/codex-wiki-update" ]; then
  env -u CODEX_THREAD_ID CODEX_HOME="$codex_home" HOME="$codex_home" \
    "$codex_bin" -a never exec --ephemeral -C "$repo_root" --sandbox workspace-write "$prompt"
else
  env -u CODEX_THREAD_ID CODEX_HOME="$codex_home" \
    "$codex_bin" -a never exec --ephemeral -C "$repo_root" --sandbox workspace-write "$prompt"
fi

rm -f "$step_file"
push_reports
