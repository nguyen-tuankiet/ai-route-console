import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Progress, Row, Space, Table, Typography } from "antd";
import { CheckCircleFilled, WarningFilled } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { providerHealth, systemComponents } from "../lib/mock";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "System Health — AI Router Console" },
      {
        name: "description",
        content: "Tình trạng hạ tầng: database, cache, vault, storage, worker.",
      },
      { property: "og:title", content: "System Health — AI Router Console" },
      {
        property: "og:description",
        content: "Provider health matrix và uptime các thành phần hệ thống.",
      },
    ],
  }),
  component: HealthPage,
});

function HealthPage() {
  return (
    <>
      <PageHeader
        title="Tình trạng hệ thống"
        description="Tình trạng hạ tầng và các thành phần lõi của Router."
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {systemComponents.map((c) => (
          <Col key={c.name} xs={24} sm={12} lg={8} xl={4}>
            <Card size="small">
              <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                <Typography.Text strong>{c.name}</Typography.Text>
                {c.status === "Healthy" ? (
                  <CheckCircleFilled style={{ color: "#52c41a" }} />
                ) : (
                  <WarningFilled style={{ color: "#faad14" }} />
                )}
              </Space>
              <div style={{ marginTop: 8 }}>
                <StatusTag value={c.status} />
              </div>
              <Space direction="vertical" size={2} style={{ marginTop: 8, width: "100%" }}>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Thời gian phản hồi: {c.rt} ms
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Thời gian hoạt động: {c.uptime}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Kiểm tra gần nhất: {c.last}
                </Typography.Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Ma trận Sức khỏe Provider" size="small">
        <Table
          size="middle"
          rowKey="key"
          dataSource={providerHealth}
          scroll={{ x: 900 }}
          pagination={false}
          columns={[
            { title: "Nhà cung cấp", dataIndex: "provider" },
            { title: "Tài khoản", dataIndex: "account" },
            {
              title: "Sức khỏe",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            {
              title: "Circuit Breaker",
              dataIndex: "circuit",
              render: (v: string) => <StatusTag value={v} />,
            },
            {
              title: "Hạn mức còn lại",
              dataIndex: "quota",
              width: 160,
              render: (v: number) => (
                <Progress
                  percent={100 - v}
                  size="small"
                  status={v >= 100 ? "exception" : v > 85 ? "active" : "normal"}
                />
              ),
            },
            { title: "Độ trễ trung bình", dataIndex: "latency", render: (v: number) => `${v} ms` },
            { title: "Kiểm tra gần nhất", render: () => "10 giây trước" },
          ]}
        />
      </Card>
    </>
  );
}
