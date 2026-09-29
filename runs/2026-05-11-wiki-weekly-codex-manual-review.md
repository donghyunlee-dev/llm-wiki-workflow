# Manual Review Required

## Summary

`[Guide] Codex CLI Setup` should not be updated automatically in this run because the current OpenAI help articles still conflict on the canonical authentication flow.

## Reason

- Source conflict
- Authentication change

## Affected Pages

| Page | Impact |
|---|---|
| `[Guide] Codex CLI Setup` (`71073834`) | The page currently describes a ChatGPT-account-based flow, but the official OpenAI help articles surface both API-key-first and Sign in with ChatGPT startup paths. |

## Sources

| Source | Type | Summary |
|---|---|---|
| `https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started` | Official OpenAI help article | Describes install and a quick-start flow that currently surfaces API-key-first guidance. |
| `https://help.openai.com/en/articles/11369540/` | Official OpenAI help article | Describes Codex access through ChatGPT plans and sign-in with ChatGPT. |
| `https://help.openai.com/en/articles/11381614` | Official OpenAI help article | Describes `codex --login`, Sign in with ChatGPT, and generated API-key behavior. |

## Recommended Action

Human review should determine which of the following should be treated as the canonical setup path for the wiki:

1. API-key-first quick start.
2. ChatGPT sign-in as the primary path.
3. A split guide that clearly distinguishes plan-based sign-in from API-account usage.

After that decision, recompile `[Guide] Codex CLI Setup` so the authentication section is internally consistent and source-cited.
