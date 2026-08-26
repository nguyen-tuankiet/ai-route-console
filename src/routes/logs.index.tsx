import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Input, Select, Space, Switch, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { requestLogs } from "../lib/mock";

export const Route = createFileRoute("/logs/")({
  head: () => ({
    meta: [
      { title: "Request Logs — AI Router Console" },
      {
        name: "description",
        content: "Theo dõi request AI: status, attempts, fallback và duration.",
      },
      { property: "og:title", content: "Request Logs — AI Router Console" },
      {
        property: "og:description",
        content: "Tìm kiếm và lọc request theo status, provider, model, client.",
      },
    ],
  }),
  component: LogsPage,
});

function LogsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [provider, setProvider] = useState<string | undefined>();
  const [model, setModel] = useState<string | undefined>();
  const [client, setClient] = useState<string | undefined>();
  const [fallbackOnly, setFallbackOnly] = useState(false);

  const data = requestLogs.filter(
    (r) =>
      r.id.toLowerCase().includes(q.toLowerCase()) &&
      (!status || r.status === status) &&
      (!provider || r.provider === provider) &&
      (!model || r.alias === model) &&
      (!client || r.client === client) &&
      (!fallbackOnly || r.fallback),
  );

  return (
    <>
      <PageHeader title="Nhật ký Request" description="Nhật ký toàn bộ request AI đi qua Router." />

      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm theo mã Request"
            style={{ width: 240 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 130 }}
            value={status}
            onChange={setStatus}
            options={["Success", "Failed"].map((v) => ({ value: v, label: v }))}
          />
          <Select
            allowClear
            placeholder="Nhà cung cấp"
            style={{ width: 170 }}
            value={provider}
            onChange={setProvider}
            options={["OpenAI Compatible", "Vertex AI", "Native Audio"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
          <Select
            allowClear
            placeholder="Model Alias"
            style={{ width: 170 }}
            value={model}
            onChange={setModel}
            options={["text/fast", "image/quality", "embedding/default", "audio/stt"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
          <Select
            allowClear
            placeholder="Client"
            style={{ width: 190 }}
            value={client}
            onChange={setClient}
            options={["internal-chat-service", "media-pipeline", "search-indexer"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
          <Space size={6}>
            <Switch size="small" checked={fallbackOnly} onChange={setFallbackOnly} />
            <Typography.Text style={{ fontSize: 13 }}>Chỉ Fallback</Typography.Text>
          </Space>
        </Space>

        <Table
          size="middle"
          rowKey="id"
          dataSource={data}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, size: "small" }}
          columns={[
            {
              title: "Mã Request",
              dataIndex: "id",
              render: (v: string) => (
                <Link to="/logs/$id" params={{ id: v }} style={{ fontFamily: "monospace" }}>
                  {v}
                </Link>
              ),
            },
            { title: "Client", dataIndex: "client" },
            {
              title: "Model Alias",
              dataIndex: "alias",
              render: (v: string) => (
                <Typography.Text style={{ fontFamily: "monospace" }}>{v}</Typography.Text>
              ),
            },
            { title: "Nhà cung cấp", dataIndex: "provider" },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Số lần thử", dataIndex: "attempts", width: 90 },
            {
              title: "Fallback",
              dataIndex: "fallback",
              width: 90,
              render: (v: boolean) =>
                v ? (
                  <StatusTag value="Standby" />
                ) : (
                  <Typography.Text type="secondary">—</Typography.Text>
                ),
            },
            { title: "Thời lượng", dataIndex: "duration", render: (v: number) => `${v} ms` },
            { title: "Thời gian tạo", dataIndex: "created" },
          ]}
        />
      </Card>
    </>
  );
}
