import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Timeline,
  Typography,
} from "antd";
import { PlusOutlined, SafetyOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { accounts as initialAccounts, providers } from "../lib/mock";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Tài khoản Provider — AI Router Console" },
      {
        name: "description",
        content: "Quản lý credential pool, quota, health và circuit breaker.",
      },
      { property: "og:title", content: "Tài khoản Provider — AI Router Console" },
      {
        property: "og:description",
        content: "Quota, health history và circuit breaker theo account.",
      },
    ],
  }),
  component: AccountsPage,
});

type Account = (typeof initialAccounts)[number];

const CREDENTIAL_TYPES = ["API Key", "Service Account", "OAuth"];

function AccountsPage() {
  const [accountList, setAccountList] = useState<Account[]>(initialAccounts);
  const [current, setCurrent] = useState<Account | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm();

  const kpi = [
    {
      title: "Tài khoản hoạt động",
      value: accountList.filter((a) => a.status === "Active").length,
      color: "#52c41a",
    },
    {
      title: "Suy giảm",
      value: accountList.filter((a) => a.health === "Degraded").length,
      color: "#faad14",
    },
    {
      title: "Hết hạn mức",
      value: accountList.filter((a) => a.health === "Quota Exhausted").length,
      color: "#ff4d4f",
    },
    {
      title: "Cần xác thực lại",
      value: accountList.filter((a) => a.status === "Reauth Required").length,
      color: "#faad14",
    },
  ];

  const openCreate = () => {
    form.resetFields();
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    form.resetFields();
  };

  const submitForm = () => {
    form.validateFields().then((values) => {
      const newAccount: Account = {
        key: `a_${Date.now()}`,
        label: values.label,
        provider: values.provider,
        credential: values.credential,
        region: values.region,
        rpm: values.rpm,
        budget: values.budget,
        health: "Healthy",
        status: "Active",
        lastCheck: new Date().toISOString().slice(0, 16).replace("T", " "),
      };
      setAccountList((list) => [newAccount, ...list]);
      message.success(
        `Đã thêm tài khoản "${values.label}". Router sẽ chạy connection test trước khi đưa vào route chain.`,
      );
      closeForm();
    });
  };

  return (
    <>
      <PageHeader
        title="Tài khoản Provider"
        description="Credential pool được gateway sử dụng để gọi tới provider."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
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
          rowKey="key"
          dataSource={accountList}
          scroll={{ x: 1300 }}
          pagination={{ pageSize: 10, size: "small" }}
          onRow={(record) => ({ onClick: () => setCurrent(record), style: { cursor: "pointer" } })}
          columns={[
            { title: "Tên Tài khoản", dataIndex: "label", render: (v: string) => <a>{v}</a> },
            { title: "Nhà cung cấp", dataIndex: "provider" },
            { title: "Loại Credential", dataIndex: "credential" },
            { title: "Khu vực", dataIndex: "region" },
            { title: "Giới hạn RPM", dataIndex: "rpm" },
            { title: "Ngân sách/ngày", dataIndex: "budget", render: (v: number) => `$${v}` },
            {
              title: "Sức khỏe",
              dataIndex: "health",
              render: (v: string) => <StatusTag value={v} />,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Kiểm tra gần nhất", dataIndex: "lastCheck" },
            {
              title: "Thao tác",
              width: 90,
              fixed: "right",
              render: () => <a>Chi tiết</a>,
            },
          ]}
        />
      </Card>

      <Modal
        title="Thêm Tài khoản Provider"
        open={formOpen}
        onCancel={closeForm}
        onOk={submitForm}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="label" label="Tên Tài khoản" rules={[{ required: true }]}>
            <Input placeholder="vd. openai-prod-03" />
          </Form.Item>
          <Form.Item name="provider" label="Nhà cung cấp" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn nhà cung cấp"
              options={providers.map((p) => ({ value: p.name, label: p.name }))}
            />
          </Form.Item>
          <Form.Item name="credential" label="Loại Credential" rules={[{ required: true }]}>
            <Select
              placeholder="Chọn loại credential"
              options={CREDENTIAL_TYPES.map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
          <Form.Item name="region" label="Khu vực" rules={[{ required: true }]}>
            <Input placeholder="vd. asia-southeast1" />
          </Form.Item>
          <Form.Item name="rpm" label="Giới hạn RPM" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: "100%" }} placeholder="vd. 3000" />
          </Form.Item>
          <Form.Item name="budget" label="Ngân sách / ngày (USD)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="vd. 400" />
          </Form.Item>
          <Form.Item
            name="secret"
            label="API Key / Credential"
            tooltip="Giá trị này được gửi thẳng vào secret manager (Vault) để lưu — Router chỉ giữ lại một reference, không hiển thị hay ghi log giá trị thật sau khi lưu (FR-CONFIG-004, FR-PROV-003)"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Dán API key hoặc service account key tại đây" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        width={520}
        open={!!current}
        onClose={() => setCurrent(null)}
        title={current?.label}
        extra={current ? <StatusTag value={current.health} /> : null}
      >
        {current && (
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            <div>
              <Typography.Title level={5}>Thông tin Tài khoản</Typography.Title>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Tên">{current.label}</Descriptions.Item>
                <Descriptions.Item label="Nhà cung cấp">{current.provider}</Descriptions.Item>
                <Descriptions.Item label="Khu vực">{current.region}</Descriptions.Item>
                <Descriptions.Item label="Loại Credential">{current.credential}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">2026-04-12 09:20</Descriptions.Item>
              </Descriptions>
            </div>

            <div>
              <Typography.Title level={5}>Hạn mức</Typography.Title>
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <div>
                  <Typography.Text type="secondary">Request mỗi phút</Typography.Text>
                  <Progress percent={68} />
                </div>
                <div>
                  <Typography.Text type="secondary">Ngân sách hàng ngày</Typography.Text>
                  <Progress percent={41} strokeColor="#52c41a" />
                </div>
                <div>
                  <Typography.Text type="secondary">Mức sử dụng Token</Typography.Text>
                  <Progress percent={87} status="active" strokeColor="#faad14" />
                </div>
              </Space>
            </div>

            <div>
              <Typography.Title level={5}>Lịch sử Sức khỏe</Typography.Title>
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
