import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { PlusOutlined, KeyOutlined, CopyOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { apiKeys as initialApiKeys, scopeOptions } from "../lib/mock";

export const Route = createFileRoute("/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — AI Router Console" },
      { name: "description", content: "Quản lý API key nội bộ: scope, expiration, revoke." },
      { property: "og:title", content: "API Keys — AI Router Console" },
      { property: "og:description", content: "Tạo và thu hồi API key cho service nội bộ." },
    ],
  }),
  component: ApiKeysPage,
});

type ApiKey = (typeof initialApiKeys)[number];

function ApiKeysPage() {
  const [keyList, setKeyList] = useState<ApiKey[]>(initialApiKeys);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const raw = `air_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
      const prefix = `${raw.slice(0, 13)}…`;
      const newKey: ApiKey = {
        key: `k_${Date.now()}`,
        client: values.client,
        prefix,
        scopes: values.scopes,
        status: "Active",
        created: new Date().toISOString().slice(0, 10),
        lastUsed: "—",
        expires: values.expires ? values.expires.format("YYYY-MM-DD") : "—",
      };
      setKeyList((list) => [newKey, ...list]);
      setCreatedKey(raw);
    });
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreatedKey(null);
    form.resetFields();
  };

  const revokeKey = (record: ApiKey) => {
    Modal.confirm({
      title: `Thu hồi API Key của "${record.client}"?`,
      content: "Key bị thu hồi sẽ mất quyền truy cập trong tối đa 60 giây (FR-AUTH-005).",
      okText: "Thu hồi",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => {
        setKeyList((list) =>
          list.map((k) => (k.key === record.key ? { ...k, status: "Revoked" } : k)),
        );
        message.success(`Đã thu hồi key của "${record.client}".`);
      },
    });
  };

  return (
    <>
      <PageHeader
        title="API Key"
        description="Router API key dùng bởi service nội bộ, mỗi key gắn scope cụ thể."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Tạo API Key
          </Button>
        }
      />

      <Card size="small">
        <Table
          size="middle"
          rowKey="key"
          dataSource={keyList}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, size: "small" }}
          locale={{
            emptyText: (
              <Space direction="vertical" size={4} style={{ padding: 24 }}>
                <KeyOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />
                <Typography.Text strong>Chưa có API Key</Typography.Text>
                <Typography.Text type="secondary">
                  Tạo API Key đầu tiên để service nội bộ gọi được Router.
                </Typography.Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
                  Tạo API Key
                </Button>
              </Space>
            ),
          }}
          columns={[
            {
              title: "Tên Client",
              dataIndex: "client",
              render: (v: string) => <Typography.Text strong>{v}</Typography.Text>,
            },
            {
              title: "Tiền tố Key",
              dataIndex: "prefix",
              width: 210,
              render: (v: string) => (
                <Space size={2} style={{ width: 190 }}>
                  <Input.Password
                    readOnly
                    variant="borderless"
                    size="small"
                    value={v}
                    style={{ fontFamily: "monospace", fontSize: 12, padding: 0 }}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    title="Copy tiền tố key"
                    onClick={() => {
                      navigator.clipboard?.writeText(v);
                      message.success("Đã copy vào clipboard.");
                    }}
                  />
                </Space>
              ),
            },
            {
              title: "Scope",
              dataIndex: "scopes",
              render: (v: string[]) => (
                <Space size={4} wrap>
                  {v.map((s) => (
                    <Tag key={s} style={{ margin: 0 }}>
                      {s}
                    </Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Ngày tạo", dataIndex: "created" },
            { title: "Lần dùng cuối", dataIndex: "lastUsed" },
            { title: "Hết hạn", dataIndex: "expires" },
            {
              title: "Thao tác",
              width: 100,
              fixed: "right",
              render: (_, record) =>
                record.status === "Revoked" ? (
                  <Typography.Text type="secondary">—</Typography.Text>
                ) : (
                  <a style={{ color: "#ff4d4f" }} onClick={() => revokeKey(record)}>
                    Thu hồi
                  </a>
                ),
            },
          ]}
        />
      </Card>

      <Modal
        title={createdKey ? "API Key đã được tạo" : "Tạo API Key"}
        open={createOpen}
        onCancel={closeCreate}
        footer={
          createdKey
            ? [
                <Button key="done" type="primary" onClick={closeCreate}>
                  Đã lưu key, đóng cửa sổ
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={closeCreate}>
                  Hủy
                </Button>,
                <Button key="create" type="primary" onClick={handleCreate}>
                  Tạo Key
                </Button>,
              ]
        }
      >
        {createdKey ? (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Alert
              type="warning"
              showIcon
              message="API Key chỉ được hiển thị một lần."
              description="Hãy lưu lại key trước khi đóng cửa sổ này. Không thể xem lại API Key sau khi đóng."
            />
            <Space.Compact style={{ width: "100%" }}>
              <Input readOnly value={createdKey} style={{ fontFamily: "monospace" }} />
              <Button
                icon={<CopyOutlined />}
                onClick={() => navigator.clipboard?.writeText(createdKey)}
              />
            </Space.Compact>
          </Space>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item name="client" label="Tên Client" rules={[{ required: true }]}>
              <Input placeholder="vd. billing-service" />
            </Form.Item>
            <Form.Item name="scopes" label="Scope" rules={[{ required: true }]}>
              <Select
                mode="multiple"
                placeholder="Chọn scope"
                options={scopeOptions.map((s) => ({ value: s, label: s }))}
              />
            </Form.Item>
            <Form.Item name="expires" label="Ngày hết hạn">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={2} placeholder="Mục đích sử dụng key này" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
