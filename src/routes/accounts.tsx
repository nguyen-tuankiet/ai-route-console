import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Timeline,
  Typography,
} from "antd";
import { PlusOutlined, SafetyOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { accounts } from "../lib/mock";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Tài khoản Provider — AI Router Console" },
      { name: "description", content: "Quản lý credential pool, quota, health và circuit breaker." },
      { property: "og:title", content: "Tài khoản Provider — AI Router Console" },
      { property: "og:description", content: "Quota, health history và circuit breaker theo account." },
    ],
  }),
  component: AccountsPage,
});

type Account = (typeof accounts)[number];

function AccountsPage() {
  const [current, setCurrent] = useState<Account | null>(null);

  const kpi = [
    { title: "Active Accounts", value: 4, color: "#52c41a" },
    { title: "Degraded", value: 2, color: "#faad14" },
    { title: "Quota Exhausted", value: 1, color: "#ff4d4f" },
    { title: "Reauth Required", value: 1, color: "#faad14" },
  ];

  return (
    <>
      <PageHeader
        title="Tài khoản Provider"
        description="Credential pool được gateway sử dụng để gọi tới provider."
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm Account
          </Button>
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {kpi.map((k) => (
          <Col key={k.title} xs={12} lg={6}>
            <Card size="small">
              <Statistic
                title={k.title}
                value={k.value}
                valueStyle={{ color: k.color, fontSize: 24, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card size="small">
        <Table
          size="middle"
          dataSource={accounts}
          scroll={{ x: 1300 }}
          pagination={{ pageSize: 10, size: "small" }}
          onRow={(record) => ({ onClick: () => setCurrent(record), style: { cursor: "pointer" } })}
          columns={[
            { title: "Account Label", dataIndex: "label", render: (v: string) => <a>{v}</a> },
            { title: "Provider", dataIndex: "provider" },
            { title: "Credential Type", dataIndex: "credential" },
            { title: "Region", dataIndex: "region" },
            { title: "RPM Limit", dataIndex: "rpm" },
            { title: "Daily Budget", dataIndex: "budget", render: (v: number) => `$${v}` },
            { title: "Health", dataIndex: "health", render: (v: string) => <StatusTag value={v} /> },
            { title: "Status", dataIndex: "status", render: (v: string) => <StatusTag value={v} /> },
            { title: "Last Health Check", dataIndex: "lastCheck" },
            {
              title: "Actions",
              width: 90,
              fixed: "right",
              render: () => <a>Chi tiết</a>,
            },
          ]}
        />
      </Card>

      <Drawer
        width={520}
        open={!!current}
        onClose={() => setCurrent(null)}
        title={current?.label}
        extra={current ? <StatusTag value={current.health} /> : null}
      >
        {current && (
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <Alert
              type="info"
              showIcon
              icon={<SafetyOutlined />}
              message="Credential được lưu trong Vault và không bao giờ hiển thị tại đây."
            />

            <div>
              <Typography.Title level={5}>Thông tin Account</Typography.Title>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Label">{current.label}</Descriptions.Item>
                <Descriptions.Item label="Provider">{current.provider}</Descriptions.Item>
                <Descriptions.Item label="Region">{current.region}</Descriptions.Item>
                <Descriptions.Item label="Credential Type">{current.credential}</Descriptions.Item>
                <Descriptions.Item label="Created At">2026-04-12 09:20</Descriptions.Item>
              </Descriptions>
            </div>

            <div>
              <Typography.Title level={5}>Quota</Typography.Title>
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <div>
                  <Typography.Text type="secondary">Requests per minute</Typography.Text>
                  <Progress percent={68} />
                </div>
                <div>
                  <Typography.Text type="secondary">Daily budget</Typography.Text>
                  <Progress percent={41} strokeColor="#52c41a" />
                </div>
                <div>
                  <Typography.Text type="secondary">Token usage</Typography.Text>
                  <Progress percent={87} status="active" strokeColor="#faad14" />
                </div>
              </Space>
            </div>

            <div>
              <Typography.Title level={5}>Health History</Typography.Title>
              <Timeline
                items={[
                  { color: "green", children: "03:11 — Health check OK (642 ms)" },
                  { color: "orange", children: "02:44 — Latency tăng bất thường (2.3s)" },
                  { color: "red", children: "02:31 — 3 lỗi 429 liên tiếp" },
                  { color: "green", children: "02:10 — Health check OK (610 ms)" },
                ]}
              />
            </div>

            <div>
              <Typography.Title level={5}>Circuit Breaker</Typography.Title>
              <Space>
                <StatusTag value="Closed" />
                <Typography.Text type="secondary">
                  Ngưỡng lỗi 50% / 30s · Half-open sau 60s
                </Typography.Text>
              </Space>
            </div>
          </Space>
        )}
      </Drawer>
    </>
  );
}
