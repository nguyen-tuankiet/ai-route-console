/** `arr[i % arr.length]` under `noUncheckedIndexedAccess` — the modulo guarantees an in-bounds index. */
function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length] as T;
}

export type Health = "Healthy" | "Degraded" | "Quota Exhausted" | "Disabled";

export const healthColor: Record<string, string> = {
  Healthy: "success",
  Degraded: "warning",
  "Quota Exhausted": "error",
  Disabled: "default",
  Standby: "processing",
};

export const kpis = [
  { key: "req", title: "Tổng số Request", value: 1284930, suffix: "", delta: 12.4 },
  { key: "succ", title: "Tỷ lệ thành công", value: 99.21, suffix: "%", delta: 0.3, precision: 2 },
  { key: "lat", title: "Latency trung bình", value: 842, suffix: "ms", delta: -6.1 },
  { key: "p95", title: "P95 Latency", value: 2130, suffix: "ms", delta: 3.8 },
  { key: "fb", title: "Tỷ lệ Fallback", value: 2.14, suffix: "%", delta: -0.9, precision: 2 },
  { key: "cost", title: "Chi phí ước tính", value: 4218.55, prefix: "$", delta: 8.2, precision: 2 },
];

export const providerHealth = [
  {
    key: "1",
    provider: "OpenAI Compatible",
    account: "openai-prod-01",
    region: "us-east-1",
    status: "Healthy",
    quota: 72,
    latency: 640,
    circuit: "Closed",
  },
  {
    key: "2",
    provider: "Vertex AI",
    account: "vertex-sg-01",
    region: "asia-southeast1",
    status: "Healthy",
    quota: 48,
    latency: 910,
    circuit: "Closed",
  },
  {
    key: "3",
    provider: "OpenAI Compatible",
    account: "openai-prod-02",
    region: "eu-west-1",
    status: "Degraded",
    quota: 91,
    latency: 2380,
    circuit: "Half-open",
  },
  {
    key: "4",
    provider: "Native Audio",
    account: "audio-stt-01",
    region: "us-west-2",
    status: "Quota Exhausted",
    quota: 100,
    latency: 1240,
    circuit: "Open",
  },
  {
    key: "5",
    provider: "Legacy Gateway",
    account: "legacy-01",
    region: "us-east-1",
    status: "Disabled",
    quota: 0,
    latency: 0,
    circuit: "Open",
  },
];

export const trendData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  requests: 3200 + Math.round(Math.sin(i / 3) * 900 + i * 55),
  failed: 40 + Math.round(Math.abs(Math.cos(i / 2)) * 35),
}));

export const recentActivity = Array.from({ length: 8 }, (_, i) => ({
  key: String(i),
  id: `req_9f2a${(1000 + i).toString(16)}`,
  alias: ["text/fast", "text/reasoning", "image/quality", "embedding/default"][i % 4],
  provider: ["OpenAI Compatible", "Vertex AI"][i % 2],
  attempts: (i % 3) + 1,
  result: i % 5 === 3 ? "Failed" : "Success",
  duration: 480 + i * 137,
  created: `2026-08-26 03:${String(10 - i).padStart(2, "0")}:22`,
}));

export const providers = [
  {
    key: "p1",
    name: "OpenAI Compatible",
    type: "OpenAI Compatible",
    baseUrl: "https://api.openai-compatible.internal/v1",
    accounts: 4,
    models: 12,
    status: "Healthy",
    updatedAt: "2026-08-25 18:04",
  },
  {
    key: "p2",
    name: "Vertex AI",
    type: "Vertex AI",
    baseUrl: "https://asia-southeast1-aiplatform.googleapis.com",
    accounts: 3,
    models: 9,
    status: "Healthy",
    updatedAt: "2026-08-24 09:41",
  },
  {
    key: "p3",
    name: "Native Audio",
    type: "Native",
    baseUrl: "https://audio.internal/v1",
    accounts: 2,
    models: 4,
    status: "Degraded",
    updatedAt: "2026-08-26 01:12",
  },
  {
    key: "p4",
    name: "Partner OAuth Gateway",
    type: "OAuth",
    baseUrl: "https://partner.example.com/api",
    accounts: 1,
    models: 2,
    status: "Disabled",
    updatedAt: "2026-08-20 15:30",
  },
];

export const accounts = [
  {
    key: "a1",
    label: "openai-prod-01",
    provider: "OpenAI Compatible",
    credential: "API Key",
    region: "us-east-1",
    rpm: 6000,
    budget: 800,
    health: "Healthy",
    status: "Active",
    lastCheck: "2026-08-26 03:11",
  },
  {
    key: "a2",
    label: "openai-prod-02",
    provider: "OpenAI Compatible",
    credential: "API Key",
    region: "eu-west-1",
    rpm: 3000,
    budget: 400,
    health: "Degraded",
    status: "Active",
    lastCheck: "2026-08-26 03:10",
  },
  {
    key: "a3",
    label: "vertex-sg-01",
    provider: "Vertex AI",
    credential: "Service Account",
    region: "asia-southeast1",
    rpm: 2400,
    budget: 650,
    health: "Healthy",
    status: "Active",
    lastCheck: "2026-08-26 03:09",
  },
  {
    key: "a4",
    label: "audio-stt-01",
    provider: "Native Audio",
    credential: "API Key",
    region: "us-west-2",
    rpm: 1200,
    budget: 120,
    health: "Quota Exhausted",
    status: "Active",
    lastCheck: "2026-08-26 02:58",
  },
  {
    key: "a5",
    label: "partner-oauth-01",
    provider: "Partner OAuth Gateway",
    credential: "OAuth",
    region: "us-east-1",
    rpm: 600,
    budget: 60,
    health: "Degraded",
    status: "Reauth Required",
    lastCheck: "2026-08-25 22:41",
  },
];

export const models = [
  {
    alias: "text/fast",
    capability: "Text Generation",
    input: ["text"],
    output: ["text"],
    streaming: true,
    structured: true,
    targets: 3,
    status: "Active",
    context: 128000,
  },
  {
    alias: "text/reasoning",
    capability: "Text Generation",
    input: ["text", "image"],
    output: ["text"],
    streaming: true,
    structured: true,
    targets: 2,
    status: "Active",
    context: 200000,
  },
  {
    alias: "embedding/default",
    capability: "Embedding",
    input: ["text"],
    output: ["vector"],
    streaming: false,
    structured: false,
    targets: 2,
    status: "Active",
    context: 8192,
  },
  {
    alias: "image/quality",
    capability: "Image Generation",
    input: ["text"],
    output: ["image"],
    streaming: false,
    structured: false,
    targets: 2,
    status: "Active",
    context: 4096,
  },
  {
    alias: "video/standard",
    capability: "Video Generation",
    input: ["text", "image"],
    output: ["video"],
    streaming: false,
    structured: false,
    targets: 1,
    status: "Beta",
    context: 4096,
  },
  {
    alias: "audio/stt",
    capability: "Speech To Text",
    input: ["audio"],
    output: ["text"],
    streaming: true,
    structured: false,
    targets: 2,
    status: "Active",
    context: 0,
  },
];

export const modelTargets = [
  {
    key: "t1",
    priority: 1,
    provider: "OpenAI Compatible",
    pool: "openai-prod-pool",
    model: "gpt-compatible-fast",
    cost: "$0.15 / 1M",
    latency: 640,
    status: "Healthy",
    enabled: true,
  },
  {
    key: "t2",
    priority: 2,
    provider: "Vertex AI",
    pool: "vertex-sg-pool",
    model: "gemini-flash",
    cost: "$0.12 / 1M",
    latency: 910,
    status: "Healthy",
    enabled: true,
  },
  {
    key: "t3",
    priority: 3,
    provider: "OpenAI Compatible",
    pool: "openai-eu-pool",
    model: "fallback-mini",
    cost: "$0.08 / 1M",
    latency: 1480,
    status: "Standby",
    enabled: true,
  },
];

export const apiKeys = [
  {
    key: "k1",
    client: "internal-chat-service",
    prefix: "air_live_9fA2…",
    scopes: ["ai:read:models", "ai:invoke:text", "ai:invoke:embedding"],
    status: "Active",
    created: "2026-05-02",
    lastUsed: "2026-08-26 03:08",
    expires: "2027-05-02",
  },
  {
    key: "k2",
    client: "media-pipeline",
    prefix: "air_live_31Kc…",
    scopes: ["ai:invoke:image", "ai:invoke:video"],
    status: "Active",
    created: "2026-06-18",
    lastUsed: "2026-08-25 21:40",
    expires: "2026-12-18",
  },
  {
    key: "k3",
    client: "legacy-batch-job",
    prefix: "air_live_77Zx…",
    scopes: ["ai:read:models"],
    status: "Revoked",
    created: "2025-11-03",
    lastUsed: "2026-03-11 10:02",
    expires: "—",
  },
];

export const scopeOptions = [
  "ai:read:models",
  "ai:invoke:text",
  "ai:invoke:embedding",
  "ai:invoke:image",
  "ai:invoke:video",
  "ai:invoke:audio",
];

export const requestLogs = Array.from({ length: 24 }, (_, i) => ({
  key: String(i),
  id: `req_${(0x9f2a0000 + i * 7919).toString(16)}`,
  client: ["internal-chat-service", "media-pipeline", "search-indexer"][i % 3],
  alias: ["text/fast", "image/quality", "embedding/default", "audio/stt"][i % 4],
  provider: ["OpenAI Compatible", "Vertex AI", "Native Audio"][i % 3],
  status: i % 7 === 5 ? "Failed" : "Success",
  attempts: (i % 3) + 1,
  fallback: i % 4 === 1,
  duration: 420 + i * 93,
  created: `2026-08-26 0${i % 4}:${String(59 - i).padStart(2, "0")}:11`,
  capability: ["Text Generation", "Image Generation", "Embedding", "Speech To Text"][i % 4],
  inputTokens: 400 + i * 13,
  outputTokens: 120 + i * 7,
  cost: (0.0012 * (i + 1)).toFixed(4),
}));

export const jobs = Array.from({ length: 18 }, (_, i) => ({
  key: String(i),
  id: `job_${(0x51a0 + i * 37).toString(16)}`,
  type: pick(["Video", "Music", "Image"] as const, i),
  model: pick(["video/standard", "audio/music", "image/quality"], i),
  client: pick(["media-pipeline", "studio-app"], i),
  status: pick(
    [
      "Running",
      "Succeeded",
      "Queued",
      "Failed",
      "Accepted",
      "Dispatching",
      "Cancelled",
      "Expired",
    ] as const,
    i,
  ),
  progress: pick([62, 100, 0, 34, 5, 12, 48, 80], i),
  attempts: (i % 2) + 1,
  created: `2026-08-26 0${i % 3}:12:0${i % 9}`,
  updated: `2026-08-26 0${(i % 3) + 1}:44:1${i % 9}`,
}));

export const assets = Array.from({ length: 12 }, (_, i) => ({
  key: String(i),
  id: `asset_${(0xa10 + i * 11).toString(16)}`,
  type: pick(["Image", "Video", "Audio"] as const, i),
  mime: pick(["image/png", "video/mp4", "audio/mpeg"], i),
  size: `${(0.6 + i * 0.42).toFixed(1)} MB`,
  created: `2026-08-2${(i % 6) + 1} 11:0${i % 9}`,
  expires: `2026-09-2${(i % 6) + 1}`,
  client: pick(["media-pipeline", "studio-app"], i),
}));

export const auditLogs = Array.from({ length: 14 }, (_, i) => ({
  key: String(i),
  actor: ["admin@corp.io", "devops@corp.io", "ai-eng@corp.io"][i % 3],
  action: [
    "Created Provider",
    "Updated Provider",
    "Created Model",
    "Updated Routing Policy",
    "Revoked API Key",
    "Disabled Provider Account",
  ][i % 6],
  resource: [
    "provider:openai",
    "model:text/fast",
    "apikey:air_live_77Zx…",
    "account:openai-prod-02",
  ][i % 4],
  result: i % 9 === 4 ? "Denied" : "Success",
  ip: `10.24.${i % 5}.${20 + i}`,
  timestamp: `2026-08-2${(i % 6) + 1} 14:${String(59 - i).padStart(2, "0")}:03`,
}));

export const systemComponents = [
  { name: "PostgreSQL", status: "Healthy", rt: 4, uptime: "99.99%", last: "10s ago" },
  { name: "Redis", status: "Healthy", rt: 1, uptime: "99.98%", last: "10s ago" },
  { name: "Vault", status: "Healthy", rt: 12, uptime: "99.95%", last: "12s ago" },
  { name: "Object Storage", status: "Degraded", rt: 148, uptime: "99.41%", last: "8s ago" },
  { name: "Router API", status: "Healthy", rt: 22, uptime: "99.99%", last: "5s ago" },
  { name: "Worker", status: "Healthy", rt: 31, uptime: "99.93%", last: "6s ago" },
];

export const usageRows = Array.from({ length: 16 }, (_, i) => ({
  key: String(i),
  date: `2026-08-${String(26 - (i % 14)).padStart(2, "0")}`,
  client: ["internal-chat-service", "media-pipeline", "search-indexer"][i % 3],
  model: ["text/fast", "image/quality", "embedding/default"][i % 3],
  provider: ["OpenAI Compatible", "Vertex AI"][i % 2],
  input: 120000 + i * 4300,
  output: 40000 + i * 1900,
  requests: 8200 + i * 240,
  cost: (120.4 + i * 13.7).toFixed(2),
}));

// ---------------------------------------------------------------------------
// Usage & Analytics — chart series (README §11)
// ---------------------------------------------------------------------------

export const successFailedTrend = trendData.map((d) => ({
  time: d.time,
  success: d.requests - d.failed,
  failed: d.failed,
}));

export const providerDistribution = [
  { type: "OpenAI Compatible", value: 52 },
  { type: "Vertex AI", value: 31 },
  { type: "Native Audio", value: 12 },
  { type: "Partner OAuth Gateway", value: 5 },
];

export const tokenUsageTrend = Array.from({ length: 14 }, (_, i) => ({
  date: `08-${String(13 + i).padStart(2, "0")}`,
  input: 900000 + i * 42000 + Math.round(Math.sin(i / 2) * 60000),
  output: 320000 + i * 15000 + Math.round(Math.cos(i / 2) * 20000),
}));

export const costTrend = Array.from({ length: 14 }, (_, i) => ({
  date: `08-${String(13 + i).padStart(2, "0")}`,
  cost: Number((180 + i * 21.4 + Math.sin(i / 3) * 30).toFixed(2)),
}));

export const latencyTrend = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  avg: 620 + Math.round(Math.sin(i / 4) * 180),
  p95: 1800 + Math.round(Math.cos(i / 3) * 420),
}));

export const fallbackRateTrend = Array.from({ length: 14 }, (_, i) => ({
  date: `08-${String(13 + i).padStart(2, "0")}`,
  rate: Number((1.4 + Math.abs(Math.sin(i / 2)) * 2.1).toFixed(2)),
}));

// ---------------------------------------------------------------------------
// Request Logs / Request Detail (README §12–13)
// ---------------------------------------------------------------------------

const REQUEST_PROVIDERS = ["OpenAI Compatible", "Vertex AI", "Native Audio"] as const;
const OUTCOMES = ["timeout", "rate_limit", "provider_5xx", "success"] as const;

/** Deterministic pseudo-hash so the same request id always renders the same attempt timeline. */
function seedOf(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}

export function getRequestDetail(id: string) {
  const seed = seedOf(id);
  const row = requestLogs.find((r) => r.id === id);
  const attemptCount = row?.attempts ?? (seed % 3) + 1;
  const finalSucceeded = row ? row.status === "Success" : seed % 7 !== 5;

  const attempts = Array.from({ length: attemptCount }, (_, i) => {
    const isLast = i === attemptCount - 1;
    const outcome = isLast && finalSucceeded ? "success" : pick(OUTCOMES, seed + i);
    const duration = 300 + ((seed >> (i + 1)) % 2200);
    return {
      attempt_no: i + 1,
      provider: pick(REQUEST_PROVIDERS, seed + i),
      outcome,
      duration,
    };
  });

  return {
    id,
    client: row?.client ?? "internal-chat-service",
    alias: row?.alias ?? "text/fast",
    capability: row?.capability ?? "Text Generation",
    result: finalSucceeded ? "Success" : "Failed",
    duration: row?.duration ?? attempts.reduce((s, a) => s + a.duration, 0),
    inputTokens: row?.inputTokens ?? 400 + (seed % 900),
    outputTokens: row?.outputTokens ?? 120 + (seed % 400),
    cost: row?.cost ?? (0.0008 * ((seed % 50) + 1)).toFixed(4),
    attempts,
  };
}

// ---------------------------------------------------------------------------
// Async Jobs — Job Detail (README §15)
// ---------------------------------------------------------------------------

const JOB_STAGES = ["Accepted", "Queued", "Dispatching", "Running", "Succeeded"] as const;
const JOB_FAIL_STAGES: Record<string, string> = {
  Failed: "Running",
  Cancelled: "Dispatching",
  Expired: "Queued",
};

export function getJobDetail(id: string) {
  const job = jobs.find((j) => j.id === id);
  if (!job) return null;

  const isTerminalFailure = job.status in JOB_FAIL_STAGES;
  const reachedStage = isTerminalFailure ? JOB_FAIL_STAGES[job.status] : job.status;
  const reachedIndex = JOB_STAGES.indexOf(reachedStage as (typeof JOB_STAGES)[number]);
  const cappedIndex = reachedIndex === -1 ? 0 : reachedIndex;

  const timeline: { stage: string; at: string }[] = JOB_STAGES.slice(0, cappedIndex + 1).map(
    (stage, i) => ({
      stage,
      at: `2026-08-26 0${i}:${String(12 + i * 7).padStart(2, "0")}:00`,
    }),
  );

  if (isTerminalFailure) {
    timeline.push({ stage: job.status, at: job.updated });
  }

  return { ...job, timeline };
}
