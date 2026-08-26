import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, Descriptions, Drawer, Select, Space, Table, Typography } from "antd";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { auditLogs } from "../lib/mock";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — AI Router Console" },
      { name: "description", content: "Nhật ký hành động admin: actor, action, resource, result." },
      { property: "og:title", content: "Audit Logs — AI Router Console" },
      { property: "og:description", content: "Security audit cho mọi thay đổi cấu hình Router." },
    ],
  }),
  component: AuditPage,
});

type AuditRow = (typeof auditLogs)[number];

function AuditPage() {
  const [action, setAction] = useState<string | undefined>();
  const [result, setResult] = useState<string | undefined>();
  const [current, setCurrent] = useState<AuditRow | null>(null);

  const data = auditLogs.filter(
    (a) => (!action || a.action === action) && (!result || a.result === result),
  );
  const actions = [...new Set(auditLogs.map((a) => a.action))];

  return (
    <>
      <PageHeader
        title="Nhật ký kiểm toán"
        description="Nhật ký mọi hành động admin thực hiện trên cấu hình Router."
      />

      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Select
            allowClear
            placeholder="Hành động"
            style={{ width: 220 }}
            value={action}
            onChange={setAction}
            options={actions.map((v) => ({ value: v, label: v }))}
          />
          <Select
            allowClear
            placeholder="Kết quả"
            style={{ width: 140 }}
            value={result}
            onChange={setResult}
            options={["Success", "Denied"].map((v) => ({ value: v, label: v }))}
          />
        </Space>

        <Table
          size="middle"
          rowKey="key"
          dataSource={data}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 10, size: "small" }}
          onRow={(record) => ({ onClick: () => setCurrent(record), style: { cursor: "pointer" } })}
          columns={[
            { title: "Người thực hiện", dataIndex: "actor" },
            { title: "Hành động", dataIndex: "action" },
            {
              title: "Đối tượng",
              dataIndex: "resource",
              render: (v: string) => (
                <Typography.Text style={{ fontSize: 12, fontFamily: "monospace" }}>
                  {v}
                </Typography.Text>
              ),
            },
            {
              title: "Kết quả",
              dataIndex: "result",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Địa chỉ IP", dataIndex: "ip" },
            { title: "Thời gian", dataIndex: "timestamp" },
          ]}
        />
      </Card>

      <Drawer
        width={480}
        open={!!current}
        onClose={() => setCurrent(null)}
        title="Chi tiết Audit Log"
      >
        {current && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Người thực hiện">{current.actor}</Descriptions.Item>
            <Descriptions.Item label="Hành động">{current.action}</Descriptions.Item>
            <Descriptions.Item label="Đối tượng">
              <Typography.Text style={{ fontFamily: "monospace" }}>
                {current.resource}
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trước khi thay đổi">
              <Typography.Text type="secondary" italic>
                [đã redact — chỉ hiển thị field không nhạy cảm]
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Sau khi thay đổi">
              <Typography.Text type="secondary" italic>
                [đã redact — chỉ hiển thị field không nhạy cảm]
              </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Kết quả">
              <StatusTag value={current.result} />
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian">{current.timestamp}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
}
