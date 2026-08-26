import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeploymentUnitOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { models as initialModels } from "../lib/mock";
import { CAPABILITY_INFO, MODALITY_LABEL } from "../lib/modelMeta";

export const Route = createFileRoute("/models/")({
  head: () => ({
    meta: [
      { title: "Model Registry — AI Router Console" },
      {
        name: "description",
        content: "Model alias, capability, modality và số lượng provider target.",
      },
      { property: "og:title", content: "Model Registry — AI Router Console" },
      { property: "og:description", content: "Danh sách model alias mà client có thể gọi tới." },
    ],
  }),
  component: ModelsPage,
});

type ModelItem = (typeof initialModels)[number];

function ModelsPage() {
  const [modelList, setModelList] = useState<ModelItem[]>(initialModels);
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form] = Form.useForm();
  const watchedCapability = Form.useWatch("capability", form);

  const data = modelList.filter((m) => m.alias.toLowerCase().includes(q.toLowerCase()));

  const openCreate = () => {
    form.resetFields();
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    form.resetFields();
  };

  const onCapabilityChange = (capability: string) => {
    const info = CAPABILITY_INFO[capability];
    if (info) {
      form.setFieldsValue({ input: info.defaultInput, output: info.defaultOutput });
    }
  };

  const submitForm = () => {
    form.validateFields().then((values) => {
      if (modelList.some((m) => m.alias === values.alias)) {
        message.error(`Model alias "${values.alias}" đã tồn tại.`);
        return;
      }
      const newModel: ModelItem = {
        alias: values.alias,
        capability: values.capability,
        input: values.input,
        output: values.output,
        streaming: !!values.streaming,
        structured: !!values.structured,
        targets: 0,
        status: "Active",
        context: values.context ?? 0,
      };
      setModelList((list) => [newModel, ...list]);
      message.success(`Đã tạo model alias "${values.alias}". Vào chi tiết để gán Provider Target.`);
      closeForm();
    });
  };

  return (
    <>
      <PageHeader
        title="Danh mục Model"
        description="Tên gọi ổn định mà service của bạn dùng để gọi AI — Router tự chọn provider thật đứng sau mỗi tên gọi này."
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Tạo Model Alias
          </Button>
        }
      />

      <Space style={{ marginBottom: 16 }}>
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          placeholder="Tìm model alias"
          style={{ width: 280 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Space>

      {data.length === 0 ? (
        <Card size="small">
          <Empty
            image={<DeploymentUnitOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />}
            description={
              <Space direction="vertical" size={4}>
                <Typography.Text strong>Chưa có Model</Typography.Text>
                <Typography.Text type="secondary">
                  Tạo Model Alias đầu tiên để client gọi được AI qua Router.
                </Typography.Text>
              </Space>
            }
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Tạo Model Alias
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {data.map((m) => {
            const info = CAPABILITY_INFO[m.capability];
            return (
              <Col key={m.alias} xs={24} sm={12} xl={8}>
                <Card size="small" hoverable style={{ height: "100%" }}>
                  <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space size={8}>
                      <span style={{ color: "#1677ff", fontSize: 16 }}>
                        {info?.icon ?? <DeploymentUnitOutlined />}
                      </span>
                      <Typography.Text
                        style={{ fontSize: 15, fontWeight: 600, fontFamily: "monospace" }}
                      >
                        {m.alias}
                      </Typography.Text>
                    </Space>
                    <StatusTag value={m.status} />
                  </Space>
                  <Typography.Paragraph
                    type="secondary"
                    style={{ fontSize: 12.5, marginTop: 6, marginBottom: 12 }}
                  >
                    {info?.short ?? m.capability}
                  </Typography.Paragraph>

                  <Space
                    direction="vertical"
                    size={6}
                    style={{
                      width: "100%",
                      fontSize: 12.5,
                      background: "#fafafa",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text type="secondary">Nhận vào</Typography.Text>
                      <Typography.Text>
                        {m.input.map((i) => MODALITY_LABEL[i] ?? i).join(", ")}
                      </Typography.Text>
                    </Space>
                    <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text type="secondary">Trả về</Typography.Text>
                      <Typography.Text>
                        {m.output.map((o) => MODALITY_LABEL[o] ?? o).join(", ")}
                      </Typography.Text>
                    </Space>
                    <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text type="secondary">Streaming</Typography.Text>
                      <Typography.Text>
                        {m.streaming ? (
                          <>
                            <ThunderboltOutlined /> Có
                          </>
                        ) : (
                          "Không"
                        )}
                      </Typography.Text>
                    </Space>
                    {m.context > 0 && (
                      <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                        <Typography.Text type="secondary">Context tối đa</Typography.Text>
                        <Typography.Text>{m.context.toLocaleString("en-US")} token</Typography.Text>
                      </Space>
                    )}
                  </Space>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid #f0f0f0",
                    }}
                  >
                    <Typography.Text type="secondary" style={{ fontSize: 12.5 }}>
                      {m.targets === 0
                        ? "Chưa gán provider nào"
                        : `Đang chạy qua ${m.targets} provider`}
                    </Typography.Text>
                    <Link
                      to="/models/$alias"
                      params={{ alias: m.alias.replace("/", "--") }}
                      style={{ fontSize: 12.5 }}
                    >
                      Xem chi tiết <ArrowRightOutlined style={{ fontSize: 10 }} />
                    </Link>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title="Tạo Model Alias"
        open={formOpen}
        onCancel={closeForm}
        onOk={submitForm}
        okText="Tạo"
        cancelText="Hủy"
        width={520}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="alias"
            label="Tên gọi (Alias)"
            rules={[
              {
                required: true,
                pattern: /^[a-z0-9-]+\/[a-z0-9-]+$/,
                message: "Định dạng: nhóm-tác-vụ/tên-ngắn, chỉ chữ thường/số/gạch ngang",
              },
            ]}
            extra="Đây là tên bạn tự đặt để service gọi tới, KHÔNG phải tên model thật của provider. Đặt theo mẫu {nhóm-tác-vụ}/{mô-tả-ngắn}, vd text/fast, image/quality, video/standard."
          >
            <Input placeholder="vd. text/fast" />
          </Form.Item>

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
                extra="Loại dữ liệu client được phép gửi lên."
              >
                <Select
                  mode="multiple"
                  placeholder="vd. Văn bản"
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
                extra="Loại dữ liệu model sẽ trả về cho client."
              >
                <Select
                  mode="multiple"
                  placeholder="vd. Văn bản"
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
            extra="Số token tối đa model đọc được trong 1 lần gọi (prompt + lịch sử) — tra trong tài liệu của provider, vd trang model của OpenAI/Google ghi rõ con số này."
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="vd. 128000" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="streaming"
                label="Trả kết quả dần dần (Streaming)"
                valuePropName="checked"
                extra="Bật nếu model có thể gõ chữ dần thay vì đợi xong mới trả 1 lần. Chỉ áp dụng cho sinh văn bản."
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="structured"
                label="Ép output theo JSON (Structured Output)"
                valuePropName="checked"
                extra="Bật nếu model hỗ trợ trả đúng định dạng JSON theo schema thay vì văn bản tự do."
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}
