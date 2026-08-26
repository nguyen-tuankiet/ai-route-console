import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Card, Dropdown, Empty, Input, Select, Space, Table, Typography } from "antd";
import { PlusOutlined, MoreOutlined, CloudServerOutlined, SearchOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { providers } from "../lib/mock";

export const Route = createFileRoute("/providers")({
  head: () => ({
    meta: [
      { title: "Providers — AI Router Console" },
      { name: "description", content: "Quản lý AI provider: OpenAI Compatible, Vertex AI, Native, OAuth." },
      { property: "og:title", content: "Providers — AI Router Console" },
      { property: "og:description", content: "Danh sách và cấu hình các AI provider của gateway." },
    ],
  }),
  component: ProvidersPage,
});

function ProvidersPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState<string | undefined>(undefined);
  const data = providers.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!type || p.type === type),
  );

  return (
    <>
      <PageHeader
        title="Providers"
        description="Các nhà cung cấp AI được gateway định tuyến tới."
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm Provider
          </Button>
        }
      />
      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm provider"
            style={{ width: 260 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Loại provider"
            style={{ width: 200 }}
            value={type}
            onChange={setType}
            options={["OpenAI Compatible", "Vertex AI", "Native", "OAuth"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
        </Space>
        <Table
          size="middle"
          dataSource={data}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, size: "small" }}
          locale={{
            emptyText: (
              <Empty
                image={<CloudServerOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />}
                description={
                  <Space direction="vertical" size={4}>
                    <Typography.Text strong>Chưa có Provider</Typography.Text>
                    <Typography.Text type="secondary">
                      Thêm Provider đầu tiên để bắt đầu định tuyến request AI.
                    </Typography.Text>
                  </Space>
                }
              >
                <Button type="primary" icon={<PlusOutlined />}>
                  Thêm Provider
                </Button>
              </Empty>
            ),
          }}
          columns={[
            { title: "Tên Provider", dataIndex: "name", render: (v: string) => <a>{v}</a> },
            { title: "Loại", dataIndex: "type" },
            {
              title: "Base URL",
              dataIndex: "baseUrl",
              render: (v: string) => (
                <Typography.Text code style={{ fontSize: 12 }}>
                  {v}
                </Typography.Text>
              ),
            },
            { title: "Accounts", dataIndex: "accounts", width: 100 },
            { title: "Models", dataIndex: "models", width: 90 },
            {
              title: "Status",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Updated At", dataIndex: "updatedAt" },
            {
              title: "Actions",
              width: 70,
              fixed: "right",
              render: () => (
                <Dropdown
                  menu={{
                    items: [
                      { key: "v", label: "Xem" },
                      { key: "e", label: "Chỉnh sửa" },
                      { key: "d", label: "Disable", danger: true },
                    ],
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
