import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  InputNumber,
  message,
  Modal,
  Result,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { EditOutlined, SwapOutlined } from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { models, modelTargets } from "../lib/mock";
import { CAPABILITY_INFO, MODALITY_LABEL } from "../lib/modelMeta";

export const Route = createFileRoute("/models/$alias")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.alias.replace("--", "/")} — Model Detail — AI Router Console` },
      {
        name: "description",
        content: "Cấu hình capability, modality và provider target của model alias.",
      },
    ],
  }),
  component: ModelDetailPage,
});

type ModelItem = (typeof models)[number];

function ModelDetailPage() {
  const { alias: rawAlias } = Route.useParams();
  const alias = rawAlias.replace("--", "/");
  const initial = models.find((m) => m.alias === alias);

  const [model, setModel] = useState<ModelItem | undefined>(initial);
  const [editOpen, setEditOpen] = useState(false);
  const [form] = Form.useForm();
  const watchedCapability = Form.useWatch("capability", form);

  if (!model) {
    return (
      <Result
        status="404"
        title="Không tìm thấy Model"
        subTitle={`Không có model alias "${alias}" trong danh mục.`}
        extra={
          <Link to="/models">
            <Button type="primary">Về Danh mục Model</Button>
          </Link>
        }
      />
    );
  }

  const openEdit = () => {
    form.setFieldsValue(model);
    setEditOpen(true);
  };

  const closeEdit = () => setEditOpen(false);

  const onCapabilityChange = (capability: string) => {
    const info = CAPABILITY_INFO[capability];
    if (info) {
      form.setFieldsValue({ input: info.defaultInput, output: info.defaultOutput });
    }
  };

  const submitEdit = () => {
    form.validateFields().then((values) => {
      setModel((prev) => (prev ? { ...prev, ...values } : prev));
      message.success(`Đã cập nhật model alias "${model.alias}".`);
      closeEdit();
    });
  };

  // Mock: reuse the shared target pool, shifted per-alias so each model looks distinct.
  const shift = models.findIndex((m) => m.alias === alias);
  const targets = modelTargets.map((t, i) => ({
    ...t,
    key: `${alias}-${t.key}`,
    priority: ((i + shift) % modelTargets.length) + 1,
  }));

  return (
    <>
      <PageHeader
        title={model.alias}
        description="Chi tiết capability, modality và provider target đứng sau alias này."
        extra={
          <Space>
            <StatusTag value={model.status} />
            <Button icon={<EditOutlined />} onClick={openEdit}>
              Chỉnh sửa
            </Button>
          </Space>
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="Thông tin chung" size="small">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Alias">
                <Typography.Text style={{ fontFamily: "monospace" }}>{model.alias}</Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Model này dùng để làm gì?">
                <Space direction="vertical" size={0}>
                  <Typography.Text>{model.capability}</Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {CAPABILITY_INFO[model.capability]?.short}
                  </Typography.Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Nhận vào">
                <Space size={4} wrap>
                  {model.input.map((i) => (
                    <Tag key={i}>{MODALITY_LABEL[i] ?? i}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trả về">
                <Space size={4} wrap>
                  {model.output.map((o) => (
                    <Tag key={o}>{MODALITY_LABEL[o] ?? o}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Giới hạn Context">
                {model.context ? `${model.context.toLocaleString("en-US")} token` : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Trả kết quả dần dần (Streaming)">
                <Switch checked={model.streaming} disabled size="small" />
              </Descriptions.Item>
              <Descriptions.Item label="Ép output theo JSON">
                <Switch checked={model.structured} disabled size="small" />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            title="Target Provider"
            size="small"
            extra={
              <Link to="/routing">
                <Button size="small" icon={<SwapOutlined />}>
                  Đổi thứ tự ưu tiên
                </Button>
              </Link>
            }
          >
            <Typography.Paragraph type="secondary" style={{ fontSize: 12.5, marginBottom: 12 }}>
              Đây là danh sách Target đang gán cho alias này. Muốn đổi{" "}
              <Typography.Text strong>thứ tự ưu tiên</Typography.Text> (Target nào Router thử
              trước), sang trang <Typography.Text strong>Chính sách định tuyến</Typography.Text>.
            </Typography.Paragraph>
            <Table
              size="small"
              rowKey="key"
              dataSource={[...targets].sort((a, b) => a.priority - b.priority)}
              pagination={false}
              columns={[
                { title: "Priority", dataIndex: "priority", width: 80 },
                { title: "Nhà cung cấp", dataIndex: "provider" },
                { title: "Account Pool", dataIndex: "pool" },
                { title: "Provider Model", dataIndex: "model" },
                { title: "Chi phí ước tính", dataIndex: "cost" },
                { title: "Độ trễ gần đây", dataIndex: "latency", render: (v: number) => `${v} ms` },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  render: (v: string) => <StatusTag value={v} />,
                },
                {
                  title: "Bật",
                  dataIndex: "enabled",
                  render: (v: boolean) => <Switch checked={v} size="small" />,
                },
              ]}
            />
          </Card>

          <Alert
            style={{ marginTop: 16 }}
            type="info"
            showIcon
            message="Thứ tự route chain"
            description="Router thực hiện Hard Filter (capability/health/quota) trước, sau đó mới Ranking theo priority → estimated cost → recent latency → fairness. Xem chi tiết ở Chính sách định tuyến."
          />
        </Col>
      </Row>

      <Modal
        title={`Chỉnh sửa ${model.alias}`}
        open={editOpen}
        onCancel={closeEdit}
        onOk={submitEdit}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        width={520}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Alias là định danh cố định"
            description="Không đổi tên alias sau khi client đã tích hợp — service gọi theo đúng tên này. Muốn dùng tên khác, hãy tạo alias mới thay vì sửa cái đang chạy."
          />

          <Form.Item
            name="capability"
            label="Model này dùng để làm gì?"
            rules={[{ required: true, message: "Chọn một tác vụ" }]}
            extra={
              watchedCapability
                ? CAPABILITY_INFO[watchedCapability]?.short
                : "Chọn đúng 1 tác vụ — quyết định luôn model chấp nhận input gì, trả output gì."
            }
          >
            <Select
              placeholder="Chọn tác vụ"
              onChange={onCapabilityChange}
              options={Object.entries(CAPABILITY_INFO).map(([value, info]) => ({
                value,
                label: (
                  <Space size={8}>
                    {info.icon}
                    {value}
                  </Space>
                ),
              }))}
              optionRender={(option) => {
                const info = CAPABILITY_INFO[option.value as string];
                return (
                  <Space direction="vertical" size={0} style={{ padding: "2px 0" }}>
                    <Space size={8}>
                      {info?.icon}
                      <Typography.Text strong>{option.value as string}</Typography.Text>
                    </Space>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {info?.short}
                    </Typography.Text>
                  </Space>
                );
              }}
            />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="input"
                label="Nhận vào (đầu vào)"
                rules={[{ required: true, message: "Chọn ít nhất 1 loại dữ liệu đầu vào" }]}
              >
                <Select
                  mode="multiple"
                  options={Object.entries(MODALITY_LABEL).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="output"
                label="Trả về (đầu ra)"
                rules={[{ required: true, message: "Chọn ít nhất 1 loại dữ liệu đầu ra" }]}
              >
                <Select
                  mode="multiple"
                  options={Object.entries(MODALITY_LABEL).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="context"
            label="Giới hạn Context (số token)"
            extra="Tra trong tài liệu của provider, vd trang model của OpenAI/Google ghi rõ con số này."
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="vd. 128000" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="streaming"
                label="Trả kết quả dần dần (Streaming)"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="structured" label="Ép output theo JSON" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
