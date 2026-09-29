#!/usr/bin/env node
// Usage:
//   ATLASSIAN_SITE_URL=https://sfoodxproject.atlassian.net \
//   ATLASSIAN_USER_EMAIL=your-email@example.com \
//   ATLASSIAN_API_TOKEN=your-token \
//   node scripts/update-confluence-wiki-metadata.js

const ALLOWED_FIELDS = new Set([
  "docType", "audience", "status",
  "prerequisites", "next", "related",
  "lastReviewedAt", "reviewCycleDays", "keywords",
]);

const DOC_TYPES = new Set(["nav","guide","page","faq","policy","library","playbook","ops"]);
const AUDIENCES = new Set(["beginner","intermediate","advanced",""]);
const STATUSES  = new Set(["draft","published","archived"]);

const PAGES = [
  {
    pageId: "63045651", title: "[Guide] Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: [],
      next: ["63668231","87851100"],
      related: ["63733762","63995906","66846748","88211525","90636291","90669057","90406972","89161779","88834163","88834211"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["guide","index","navigation","ai agent","mcp","setup","workflow","app making","integration"],
    },
  },
  {
    pageId: "87851100", title: "[Guide] Tool Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651"],
      next: ["63995906","66846748","88211525"],
      related: ["90669057","90406972","87228417","70942776","70942735"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["tool","codex","claude code","gemini","anythingllm","chatgpt desktop","claude desktop","mcp"],
    },
  },
  {
    pageId: "63995906", title: "[Guide] Codex Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["87851100","71073834"],
      next: ["86048864","85950561","85917930","89161779"],
      related: ["63045651","90669057","90406972","88539222","64618497","64290887","63373351","63799379","63373371","63275091"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["codex","codex cli","mcp","skill","jira","playwright","browser","filesystem"],
    },
  },
  {
    pageId: "66846748", title: "[Guide] Claude Code Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["87851100","88211499"],
      next: ["66027572","66191384","66715705","66682913","89161779"],
      related: ["63045651","90669057","90406972","88539222","64618497","64290887"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["claude code","claude cli","mcp","jira","playwright","agent browser","skill","workflow"],
    },
  },
  {
    pageId: "88211525", title: "[Guide] Gemini Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["87851100","70418496"],
      next: ["89161779"],
      related: ["63045651","90669057","88539222","64618497","64290887"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["gemini","gemini cli","cli","setup","ai agent","workflow"],
    },
  },
  {
    pageId: "90636291", title: "[Guide] OS Setup Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651"],
      next: ["90669057","90406972"],
      related: ["70713377","88539222","72744962","73007106","70418464","72646657","72613890","72679445","86016021","86212679","86310913"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["os setup","windows","macos","linux","wsl","terminal","node","python","git","mcp"],
    },
  },
  {
    pageId: "90669057", title: "[Guide] Development Environment Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651","90636291"],
      next: ["90406972","89161779"],
      related: ["70484003","70254643","70483975","64618497","64290859","64290887","67928082","63209560","70778926","70320165"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["development environment","terminal","git","python","node.js","npm","npx","pnpm","chromium","github"],
    },
  },
  {
    pageId: "90406972", title: "[Guide] MCP Setup Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651","84345278","90669057"],
      next: ["85950505","83886508","84181346","84181326"],
      related: ["86048771","86048791","86048864","85917838","85917858","86016041","85950561","83919146","84967759","84738331","84705630"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["mcp","model context protocol","filesystem mcp","browser mcp","desktop control mcp","gmail","notion","google sheets","microsoft 365"],
    },
  },
  {
    pageId: "89161779", title: "[Guide] AI Agent Workflow Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651","90669057"],
      next: ["85917698","85950465","85917720","85917740","85950485","86016001","85917760"],
      related: ["90406972","87851100","63995906","66846748","88211525"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["ai agent","workflow","workspace","prompt","project analysis","safe edit","test","validation","github"],
    },
  },
  {
    pageId: "88834163", title: "[Guide] App Making Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651","89161779"],
      next: ["85196923","84967655","84640012","84640032","84345124","84181216","84345169","84705531","85196965","84672723","83886418","83886469"],
      related: ["90669057","87851100"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["app making","gpt","claude","vibe coding","prototype","implementation","test","deploy"],
    },
  },
  {
    pageId: "88834211", title: "[Guide] Integration Index",
    metadata: {
      docType: "nav", audience: "", status: "published",
      prerequisites: ["63045651","90406972"],
      next: ["83919146","84967759","84738331","84705630","70778926","70320165","87228417","67928124"],
      related: ["90669057","89161779"],
      lastReviewedAt: "2026-05-07", reviewCycleDays: 365,
      keywords: ["integration","microsoft 365","notion","google sheets","gmail","github","anythingllm","local rag","teams notification"],
    },
  },
];

function validateMetadata(value) {
  for (const key of Object.keys(value)) {
    if (!ALLOWED_FIELDS.has(key)) {
      throw new Error(`허용되지 않은 필드: "${key}"`);
    }
  }
  if (!DOC_TYPES.has(value.docType))  throw new Error(`잘못된 docType: "${value.docType}"`);
  if (!AUDIENCES.has(value.audience)) throw new Error(`잘못된 audience: "${value.audience}"`);
  if (!STATUSES.has(value.status))    throw new Error(`잘못된 status: "${value.status}"`);

  for (const field of ["prerequisites", "next", "related", "keywords"]) {
    if (!Array.isArray(value[field])) throw new Error(`"${field}" 필드는 배열이어야 합니다`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.lastReviewedAt)) {
    throw new Error(`lastReviewedAt 형식 오류: "${value.lastReviewedAt}"`);
  }
  if (typeof value.reviewCycleDays !== "number") {
    throw new Error(`reviewCycleDays는 number여야 합니다`);
  }
}

function makeAuth(siteUrl, email, token) {
  const encoded = Buffer.from(`${email}:${token}`).toString("base64");
  return { baseUrl: `${siteUrl}/wiki/api/v2`, auth: `Basic ${encoded}` };
}

async function getProperty(baseUrl, auth, pageId) {
  const res = await fetch(`${baseUrl}/pages/${pageId}/properties?key=wiki.metadata`, {
    headers: { Authorization: auth, Accept: "application/json" },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${pageId} ${res.status} ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data.results ?? []).find((p) => p.key === "wiki.metadata") ?? null;
}

async function createProperty(baseUrl, auth, pageId, value) {
  const res = await fetch(`${baseUrl}/pages/${pageId}/properties`, {
    method: "POST",
    headers: { Authorization: auth, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ key: "wiki.metadata", value }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST ${pageId} ${res.status} ${body.slice(0, 200)}`);
  }
}

async function updateProperty(baseUrl, auth, pageId, propertyId, currentVersion, value) {
  const res = await fetch(`${baseUrl}/pages/${pageId}/properties/${propertyId}`, {
    method: "PUT",
    headers: { Authorization: auth, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      key: "wiki.metadata",
      value,
      version: { number: currentVersion + 1, message: "Update wiki.metadata" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PUT ${pageId} ${res.status} ${body.slice(0, 200)}`);
  }
}

async function verifyProperty(baseUrl, auth, pageId, expectedValue) {
  const prop = await getProperty(baseUrl, auth, pageId);
  if (!prop) throw new Error("검증 실패: property 없음");
  if (prop.key !== "wiki.metadata") throw new Error("검증 실패: key 불일치");
  if (!prop.value) throw new Error("검증 실패: value 없음");

  for (const key of Object.keys(prop.value)) {
    if (!ALLOWED_FIELDS.has(key)) throw new Error(`검증 실패: 허용되지 않은 필드 "${key}"`);
  }
  for (const field of ["prerequisites", "next", "related", "keywords"]) {
    if (!Array.isArray(prop.value[field])) throw new Error(`검증 실패: "${field}" 배열 아님`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(prop.value.lastReviewedAt)) {
    throw new Error(`검증 실패: lastReviewedAt 형식 오류`);
  }
  if (typeof prop.value.reviewCycleDays !== "number") {
    throw new Error("검증 실패: reviewCycleDays number 아님");
  }
}

async function processPage(baseUrl, auth, page) {
  const { pageId, title, metadata } = page;
  try {
    const existing = await getProperty(baseUrl, auth, pageId);
    if (existing) {
      await updateProperty(baseUrl, auth, pageId, existing.id, existing.version.number, metadata);
      await verifyProperty(baseUrl, auth, pageId, metadata);
      return { status: "updated", pageId, title };
    } else {
      await createProperty(baseUrl, auth, pageId, metadata);
      await verifyProperty(baseUrl, auth, pageId, metadata);
      return { status: "created", pageId, title };
    }
  } catch (err) {
    return { status: "failed", pageId, title, reason: err.message };
  }
}

async function main() {
  const siteUrl = process.env.ATLASSIAN_SITE_URL;
  const email   = process.env.ATLASSIAN_USER_EMAIL;
  const token   = process.env.ATLASSIAN_API_TOKEN;

  if (!siteUrl || !email || !token) {
    console.error("오류: ATLASSIAN_SITE_URL, ATLASSIAN_USER_EMAIL, ATLASSIAN_API_TOKEN 환경 변수가 필요합니다.");
    process.exit(1);
  }

  for (const page of PAGES) {
    try {
      validateMetadata(page.metadata);
    } catch (err) {
      console.error(`[CONFIG ERROR] ${page.pageId} ${page.title} - ${err.message}`);
      process.exit(1);
    }
  }

  const { baseUrl, auth } = makeAuth(siteUrl, email, token);
  const results = [];

  for (const page of PAGES) {
    const result = await processPage(baseUrl, auth, page);
    results.push(result);

    if (result.status === "failed") {
      console.log(`[FAIL] ${result.pageId} ${result.title} - ${result.reason}`);
    } else {
      console.log(`[OK] ${result.pageId} ${result.title} - ${result.status} property wiki.metadata`);
    }
  }

  const created = results.filter((r) => r.status === "created").length;
  const updated = results.filter((r) => r.status === "updated").length;
  const failed  = results.filter((r) => r.status === "failed").length;

  console.log("\nSummary");
  console.log(`- total: ${results.length}`);
  console.log(`- created: ${created}`);
  console.log(`- updated: ${updated}`);
  console.log(`- failed: ${failed}`);
}

export { validateMetadata, makeAuth, getProperty, createProperty, updateProperty, verifyProperty, processPage, PAGES };

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
