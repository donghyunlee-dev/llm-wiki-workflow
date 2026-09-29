# Manual Review Required

## Summary

`[Guide] Codex CLI Setup` should not be updated automatically in this run because current OpenAI official sources present conflicting authentication guidance.

## Reason

- Source conflict
- Authentication change

## Affected Pages

| Page | Impact |
|---|---|
| `[Guide] Codex CLI Setup` (`71073834`) | The page currently describes a ChatGPT account sign-in flow, but the official source set does not present one fully consistent canonical startup path. |

## Sources

| Source | Type | Summary |
|---|---|---|
| `https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started` | Official OpenAI help article | Describes install and quick start, and search indexing currently surfaces an API-key-first quick-start flow. |
| `https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan` | Official OpenAI help article | Describes ChatGPT-plan-based access and sign-in with ChatGPT across Codex clients. |
| `https://help.openai.com/en/articles/11381614` | Official OpenAI help article | Describes `codex --login`, Sign in with ChatGPT, and generated API key behavior. |

## Recommended Action

Human review should determine which of the following should be the canonical guidance for this wiki:

1. ChatGPT-plan sign-in as the default user path.
2. API-key-based quick start as the default technical path.
3. A split guide that clearly distinguishes subscription sign-in from API-account usage.

After that decision, recompile `[Guide] Codex CLI Setup` so the authentication section is internally consistent and source-cited.
