import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { PlusOutlined, MoreOutlined, CloudServerOutlined, SearchOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { providers as initialProviders } from "../lib/mock";

export const Route = createFileRoute("/providers")({
  head: () => ({
    meta: [
      { title: "Providers — AI Router Console" },
      {
        name: "description",
        content: "Quản lý AI provider: OpenAI Compatible, Vertex AI, Native, OAuth.",
      },
      { property: "og:title", content: "Providers — AI Router Console" },
      { property: "og:description", content: "Danh sách và cấu hình các AI provider của gateway." },
    ],
  }),
  component: ProvidersPage,
});

/**
 * Mỗi loại provider cần thông tin kết nối khác nhau (Đặc tả kỹ thuật §4, bảng "Provider types"):
 *   openai_compatible → base_url + api_key
 *   vertex_ai         → GCP project + region (không phải base_url)
 *   custom_native      → base_url riêng của adapter
 *   oauth2            → authorization URL + token URL (không phải base_url)
 * `baseUrl`/`gcpProject`/`authUrl`/`tokenUrl` đều optional vì chỉ 1 nhóm áp dụng tùy `type`.
 */
type Provider = Omit<(typeof initialProviders)[number], "baseUrl"> & {
  baseUrl?: string;
  gcpProject?: string;
  region?: string;
  authUrl?: string;
  tokenUrl?: string;
};

const PROVIDER_TYPES = ["OpenAI Compatible", "Vertex AI", "Native", "OAuth"];

const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

/** Ô "Endpoint" trên bảng — hiển thị đúng field theo type, fallback baseUrl cho record cũ chưa tách field. */
function endpointOf(record: Provider): string {
  if (record.type === "Vertex AI" && record.gcpProject) {
    return `${record.gcpProject} · ${record.region ?? "—"}`;
  }
  if (record.type === "OAuth" && record.authUrl) {
    return record.authUrl;
  }
  return record.baseUrl ?? "—";
}

function ConnectionFields({ type }: { type: string | undefined }) {
  if (type === "Vertex AI") {
    return (
      <>
        <Form.Item
          name="gcpProject"
          label="GCP Project ID"
          rules={[{ required: true }]}
          tooltip="Vertex AI cần GCP project + region + service account, không dùng Base URL (Đặc tả §4)"
        >
          <Input placeholder="vd. my-company-ai-prod" />
        </Form.Item>
        <Form.Item name="region" label="Region" rules={[{ required: true }]}>
          <Input placeholder="vd. asia-southeast1" />
        </Form.Item>
      </>
    );
  }

  if (type === "OAuth") {
    return (
      <>
        <Form.Item
          name="authUrl"
          label="Authorization URL"
          rules={[{ required: true }]}
          tooltip="OAuth dùng authorization code + PKCE, không dùng Base URL (Đặc tả §4, §7)"
        >
          <Input placeholder="https://provider.example/oauth/authorize" />
        </Form.Item>
        <Form.Item name="tokenUrl" label="Token URL" rules={[{ required: true }]}>
          <Input placeholder="https://provider.example/oauth/token" />
        </Form.Item>
      </>
    );
  }

  // OpenAI Compatible / Native — cả hai cần base_url theo Đặc tả §4
  return (
    <Form.Item
      name="baseUrl"
      label="Base URL"
      rules={[{ required: true }]}
      tooltip="Phải nằm trong allowlist đã duyệt, không trỏ private endpoint (FR-CONFIG-002, NFR-SEC-003)"
    >
      <Input placeholder="https://api.example.internal/v1" />
    </Form.Item>
  );
}

function ProvidersPage() {
  const [providerList, setProviderList] = useState<Provider[]>(initialProviders);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [viewing, setViewing] = useState<Provider | null>(null);
  const [form] = Form.useForm();
  const selectedType = Form.useWatch("type", form);

  const data = providerList.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!typeFilter || p.type === typeFilter),
  );

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setFormOpen(true);
  };

  const openEdit = (record: Provider) => {
    setEditing(record);
    form.setFieldsValue(record);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const submitForm = () => {
    form.validateFields().then((values: Partial<Provider>) => {
      if (editing) {
        setProviderList((list) =>
          list.map((p) => (p.key === editing.key ? { ...p, ...values, updatedAt: nowStamp() } : p)),
        );
        message.success(`Đã cập nhật provider "${values.name}".`);
      } else {
        const newProvider: Provider = {
          key: `p_${Date.now()}`,
          name: values.name ?? "",
          type: values.type ?? "",
          ...(values.baseUrl ? { baseUrl: values.baseUrl } : {}),
          ...(values.gcpProject ? { gcpProject: values.gcpProject } : {}),
          ...(values.region ? { region: values.region } : {}),
          ...(values.authUrl ? { authUrl: values.authUrl } : {}),
          ...(values.tokenUrl ? { tokenUrl: values.tokenUrl } : {}),
          accounts: 0,
          models: 0,
          status: "Healthy",
          updatedAt: nowStamp(),
        };
        setProviderList((list) => [newProvider, ...list]);
        message.success(`Đã thêm provider "${values.name}".`);
      }
      closeForm();
    });
  };

  const disableProvider = (record: Provider) => {
    Modal.confirm({
      title: `Vô hiệu hóa "${record.name}"?`,
      content: "Provider bị vô hiệu hóa sẽ không được chọn trong route chain mới.",
      okText: "Vô hiệu hóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => {
        setProviderList((list) =>
          list.map((p) =>
            p.key === record.key ? { ...p, status: "Disabled", updatedAt: nowStamp() } : p,
          ),
        );
        message.success(`Đã vô hiệu hóa "${record.name}".`);
      },
    });
  };

  return (
    <>
      <PageHeader
        title="Nhà cung cấp"
        description="Các nhà cung cấp AI được gateway định tuyến tới."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm Nhà cung cấp
          </Button>
        }
      />
      <Card size="small">
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            allowClear
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Tìm nhà cung cấp"
            style={{ width: 260 }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            allowClear
            placeholder="Loại nhà cung cấp"
            style={{ width: 200 }}
            value={typeFilter}
            onChange={setTypeFilter}
            options={PROVIDER_TYPES.map((v) => ({ value: v, label: v }))}
          />
        </Space>
        <Table
          size="middle"
          rowKey="key"
          dataSource={data}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, size: "small" }}
          locale={{
            emptyText: (
              <Empty
                image={<CloudServerOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />}
                description={
                  <Space direction="vertical" size={4}>
                    <Typography.Text strong>Chưa có Nhà cung cấp</Typography.Text>
                    <Typography.Text type="secondary">
                      Thêm Nhà cung cấp đầu tiên để bắt đầu định tuyến request AI.
                    </Typography.Text>
                  </Space>
                }
              >
                <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
                  Thêm Nhà cung cấp
                </Button>
              </Empty>
            ),
          }}
          columns={[
            {
              title: "Tên Nhà cung cấp",
              dataIndex: "name",
              render: (v: string, record) => <a onClick={() => setViewing(record)}>{v}</a>,
            },
            { title: "Loại", dataIndex: "type" },
            {
              title: "Endpoint",
              render: (_, record) => (
                <Typography.Text style={{ fontSize: 12, fontFamily: "monospace" }}>
                  {endpointOf(record)}
                </Typography.Text>
              ),
            },
            { title: "Tài khoản", dataIndex: "accounts", width: 100 },
            { title: "Số Model", dataIndex: "models", width: 90 },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Cập nhật lúc", dataIndex: "updatedAt" },
            {
              title: "Thao tác",
              width: 70,
              fixed: "right",
              render: (_, record) => (
                <Dropdown
                  menu={{
                    items: [
                      { key: "v", label: "Xem" },
                      { key: "e", label: "Chỉnh sửa" },
                      {
                        key: "d",
                        label: "Vô hiệu hóa",
                        danger: true,
                        disabled: record.status === "Disabled",
                      },
                    ],
                    onClick: ({ key }) => {
                      if (key === "v") setViewing(record);
                      if (key === "e") openEdit(record);
                      if (key === "d") disableProvider(record);
                    },
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editing ? "Chỉnh sửa Nhà cung cấp" : "Thêm Nhà cung cấp"}
        open={formOpen}
        onCancel={closeForm}
        onOk={submitForm}
        okText={editing ? "Lưu thay đổi" : "Thêm"}
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Nhà cung cấp" rules={[{ required: true }]}>
            <Input placeholder="vd. OpenAI Compatible" />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn loại kết nối"
              options={PROVIDER_TYPES.map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        width={420}
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name}
        extra={viewing ? <StatusTag value={viewing.status} /> : null}
      >
        {viewing && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Loại">{viewing.type}</Descriptions.Item>
            {viewing.type === "Vertex AI" ? (
              <>
                <Descriptions.Item label="GCP Project ID">
                  <Typography.Text style={{ fontFamily: "monospace" }}>
                    {viewing.gcpProject ?? "—"}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Region">{viewing.region ?? "—"}</Descriptions.Item>
              </>
            ) : viewing.type === "OAuth" ? (
              <>
                <Descriptions.Item label="Authorization URL">
                  <Typography.Text style={{ fontFamily: "monospace" }}>
                    {viewing.authUrl ?? viewing.baseUrl ?? "—"}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label="Token URL">
                  <Typography.Text style={{ fontFamily: "monospace" }}>
                    {viewing.tokenUrl ?? "—"}
                  </Typography.Text>
                </Descriptions.Item>
              </>
            ) : (
              <Descriptions.Item label="Base URL">
                <Typography.Text style={{ fontFamily: "monospace" }}>
                  {viewing.baseUrl ?? "—"}
                </Typography.Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Tài khoản">{viewing.accounts}</Descriptions.Item>
            <Descriptions.Item label="Số Model">{viewing.models}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật lúc">{viewing.updatedAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </>
  );
}
