import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateMetadata,
  makeAuth,
  processPage,
} from "./update-confluence-wiki-metadata.js";

const VALID_METADATA = {
  docType: "reference",
  visibility: "public",
  audience: "beginner",
  status: "published",
  prerequisites: [],
  next: [],
  related: [],
  owner: "platform-team",
  lastReviewedAt: "2026-05-07",
  reviewCycleDays: 90,
  keywords: [],
};

// ── validateMetadata ──────────────────────────────────────────────────────────

test("validateMetadata - 정상 메타데이터 통과", () => {
  assert.doesNotThrow(() => validateMetadata(VALID_METADATA));
});

test("validateMetadata - 허용되지 않은 필드 throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, parent: "123" }),
    /허용되지 않은 필드: "parent"/,
  );
});

test("validateMetadata - children 필드 throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, children: [] }),
    /허용되지 않은 필드: "children"/,
  );
});

test("validateMetadata - 잘못된 docType throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, docType: "unknown" }),
    /잘못된 docType/,
  );
});

test("validateMetadata - 잘못된 visibility throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, visibility: "secret" }),
    /잘못된 visibility/,
  );
});

test("validateMetadata - 잘못된 audience throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, audience: "expert" }),
    /잘못된 audience/,
  );
});

test("validateMetadata - 잘못된 status throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, status: "active" }),
    /잘못된 status/,
  );
});

test("validateMetadata - prerequisites가 string이면 throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, prerequisites: "63045651" }),
    /"prerequisites" 필드는 배열이어야 합니다/,
  );
});

test("validateMetadata - keywords가 null이면 throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, keywords: null }),
    /"keywords" 필드는 배열이어야 합니다/,
  );
});

test("validateMetadata - lastReviewedAt 형식 오류 throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, lastReviewedAt: "07-05-2026" }),
    /lastReviewedAt 형식 오류/,
  );
});

test("validateMetadata - reviewCycleDays가 string이면 throw", () => {
  assert.throws(
    () => validateMetadata({ ...VALID_METADATA, reviewCycleDays: "90" }),
    /reviewCycleDays는 number여야 합니다/,
  );
});

// ── makeAuth ──────────────────────────────────────────────────────────────────

test("makeAuth - baseUrl과 Basic 헤더 생성", () => {
  const { baseUrl, auth } = makeAuth("https://example.atlassian.net", "user@example.com", "token123");
  assert.equal(baseUrl, "https://example.atlassian.net/wiki/api/v2");
  const expected = "Basic " + Buffer.from("user@example.com:token123").toString("base64");
  assert.equal(auth, expected);
});

// ── processPage (fetch mock) ──────────────────────────────────────────────────

function mockFetch(responses) {
  let call = 0;
  return async (url, opts) => {
    const resp = responses[call++];
    if (!resp) throw new Error(`예상치 못한 fetch 호출: ${url}`);
    return {
      ok: resp.ok ?? true,
      status: resp.status ?? 200,
      json: async () => resp.json,
      text: async () => resp.text ?? JSON.stringify(resp.json ?? {}),
    };
  };
}

test("processPage - property 없음 → POST 호출 → created 반환", async () => {
  const capturedRequests = [];
  let getCount = 0;
  globalThis.fetch = async (url, opts) => {
    capturedRequests.push({ url, opts });
    const isGet = !opts?.method || opts.method === "GET";
    if (isGet) {
      getCount++;
      // 첫 번째 GET → 없음, 두 번째 GET(verify) → 있음
      if (getCount === 1) {
        return { ok: true, status: 200, json: async () => ({ results: [] }), text: async () => "" };
      }
      return {
        ok: true, status: 200,
        json: async () => ({
          results: [{ key: "wiki.metadata", id: "prop1", version: { number: 1 }, value: VALID_METADATA }],
        }),
        text: async () => "",
      };
    }
    // POST → 성공
    return { ok: true, status: 200, json: async () => ({}), text: async () => "" };
  };

  const page = { pageId: "99999999", title: "[Test] Page", metadata: VALID_METADATA };
  const result = await processPage("https://base/wiki/api/v2", "Basic xxx", page);

  assert.equal(result.status, "created");
  assert.equal(result.pageId, "99999999");

  const postCall = capturedRequests.find((r) => r.opts?.method === "POST");
  assert.ok(postCall, "POST가 호출되어야 한다");
  const body = JSON.parse(postCall.opts.body);
  assert.equal(body.key, "wiki.metadata");
});

test("processPage - property 있음 → PUT 호출, version+1 → updated 반환", async () => {
  const capturedRequests = [];
  let getCount = 0;
  globalThis.fetch = async (url, opts) => {
    capturedRequests.push({ url, opts });
    const isGet = !opts.method || opts.method === "GET";
    if (isGet) {
      getCount++;
      return {
        ok: true, status: 200,
        json: async () => ({
          results: [{ key: "wiki.metadata", id: "prop-abc", version: { number: 3 }, value: VALID_METADATA }],
        }),
        text: async () => "",
      };
    }
    // PUT → 성공
    return { ok: true, status: 200, json: async () => ({}), text: async () => "" };
  };

  const page = { pageId: "77777777", title: "[Test] Page2", metadata: VALID_METADATA };
  const result = await processPage("https://base/wiki/api/v2", "Basic xxx", page);

  assert.equal(result.status, "updated");

  const putCall = capturedRequests.find((r) => r.opts?.method === "PUT");
  assert.ok(putCall, "PUT이 호출되어야 한다");
  const body = JSON.parse(putCall.opts.body);
  assert.equal(body.version.number, 4, "version은 기존 3 + 1 = 4여야 한다");
  assert.ok(putCall.url.includes("prop-abc"), "URL에 propertyId가 포함되어야 한다");
});

test("processPage - GET 404 → failed 반환", async () => {
  globalThis.fetch = async () => ({
    ok: false, status: 404,
    json: async () => ({}),
    text: async () => "Not Found",
  });

  const page = { pageId: "00000000", title: "[Test] Missing", metadata: VALID_METADATA };
  const result = await processPage("https://base/wiki/api/v2", "Basic xxx", page);

  assert.equal(result.status, "failed");
  assert.ok(result.reason.includes("404"), `reason에 404가 포함되어야 함: ${result.reason}`);
});

test("processPage - POST 실패 → failed 반환", async () => {
  let getCount = 0;
  globalThis.fetch = async (url, opts) => {
    if (!opts.method || opts.method === "GET") {
      getCount++;
      return { ok: true, status: 200, json: async () => ({ results: [] }), text: async () => "" };
    }
    return { ok: false, status: 403, json: async () => ({}), text: async () => "Forbidden" };
  };

  const page = { pageId: "11111111", title: "[Test] Forbidden", metadata: VALID_METADATA };
  const result = await processPage("https://base/wiki/api/v2", "Basic xxx", page);

  assert.equal(result.status, "failed");
  assert.ok(result.reason.includes("403"), `reason에 403이 포함되어야 함: ${result.reason}`);
});
