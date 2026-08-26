import { Tag } from "antd";

const MAP: Record<string, string> = {
  Healthy: "success",
  Active: "success",
  Success: "success",
  Succeeded: "success",
  Enabled: "success",
  Closed: "success",
  Degraded: "warning",
  Standby: "processing",
  "Half-open": "warning",
  Warning: "warning",
  Queued: "default",
  Accepted: "default",
  Dispatching: "processing",
  Running: "processing",
  Processing: "processing",
  Beta: "processing",
  Open: "error",
  Failed: "error",
  Denied: "error",
  Error: "error",
  Revoked: "error",
  "Quota Exhausted": "error",
  "Reauth Required": "warning",
  Cancelled: "default",
  Expired: "default",
  Disabled: "default",
};

export function StatusTag({ value }: { value: string }) {
  return (
    <Tag color={MAP[value] ?? "default"} style={{ marginInlineEnd: 0 }}>
      {value}
    </Tag>
  );
}
