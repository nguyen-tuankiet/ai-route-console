import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Progress, Table, Tabs, Typography } from "antd";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { jobs } from "../lib/mock";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Async Jobs — AI Router Console" },
      { name: "description", content: "Theo dõi tác vụ chạy nền: video, music, image." },
      { property: "og:title", content: "Async Jobs — AI Router Console" },
      {
        property: "og:description",
        content: "Lifecycle job media: accepted → queued → running → succeeded.",
      },
    ],
  }),
  component: JobsPage,
});

const TABS = ["Video", "Music", "Image"] as const;

function JobsPage() {
  const [type, setType] = useState<string>("Video");
  const data = jobs.filter((j) => j.type === type);

  return (
    <>
      <PageHeader
        title="Tác vụ bất đồng bộ"
        description="Tác vụ media chạy lâu — video, music và image bất đồng bộ."
      />

      <Card size="small">
        <Tabs activeKey={type} onChange={setType} items={TABS.map((t) => ({ key: t, label: t }))} />
        <Table
          size="middle"
          rowKey="id"
          dataSource={data}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, size: "small" }}
          columns={[
            {
              title: "Mã Job",
              dataIndex: "id",
              render: (v: string) => (
                <Link to="/jobs/$id" params={{ id: v }} style={{ fontFamily: "monospace" }}>
                  {v}
                </Link>
              ),
            },
            {
              title: "Model",
              dataIndex: "model",
              render: (v: string) => (
                <Typography.Text style={{ fontFamily: "monospace" }}>{v}</Typography.Text>
              ),
            },
            { title: "Client", dataIndex: "client" },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            {
              title: "Tiến độ",
              dataIndex: "progress",
              width: 160,
              render: (v: number, r) => (
                <Progress
                  percent={v}
                  size="small"
                  status={r.status === "Failed" ? "exception" : v >= 100 ? "success" : "active"}
                />
              ),
            },
            { title: "Số lần thử", dataIndex: "attempts", width: 90 },
            { title: "Tạo lúc", dataIndex: "created" },
            { title: "Cập nhật lúc", dataIndex: "updated" },
          ]}
        />
      </Card>
    </>
  );
}
