import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type DragEvent } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Steps,
  Switch,
  Tag,
  Typography,
} from "antd";
import {
  ArrowRightOutlined,
  EditOutlined,
  SaveOutlined,
  UpOutlined,
  DownOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { models, modelTargets } from "../lib/mock";

export const Route = createFileRoute("/routing")({
  head: () => ({
    meta: [
      { title: "Chính sách định tuyến — AI Router Console" },
      {
        name: "description",
        content: "Route chain, retry, fallback và circuit breaker theo model alias.",
      },
      { property: "og:title", content: "Chính sách định tuyến — AI Router Console" },
      { property: "og:description", content: "Cấu hình hard filter, ranking, retry và fallback." },
    ],
  }),
  component: RoutingPage,
});

type Target = (typeof modelTargets)[number];

/** Cùng logic derive mock Target-theo-alias với models.$alias.tsx, để 2 trang khớp nhau. */
function targetsFor(alias: string): Target[] {
  const shift = models.findIndex((m) => m.alias === alias);
  return modelTargets.map((t, i) => ({
    ...t,
    key: `${alias}-${t.key}`,
    priority: ((i + shift) % modelTargets.length) + 1,
  }));
}

function RoutingPage() {
  const [alias, setAlias] = useState(models[0]?.alias ?? "text/fast");
  const [chain, setChain] = useState<Target[]>(() => targetsFor(alias));
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

  // Đổi alias → nạp lại đúng route chain của alias đó, bỏ mọi sắp xếp tay trước đó.
  useEffect(() => {
    setChain(targetsFor(alias));
  }, [alias]);

  const sorted = [...chain].sort((a, b) => a.priority - b.priority);

  /** Chuyển target ở vị trí `from` sang vị trí `to`, gán lại priority 1..N theo thứ tự mới. */
  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= sorted.length || to >= sorted.length) return;
    const next = [...sorted];
    const moved = next.splice(from, 1)[0];
    if (!moved) return;
    next.splice(to, 0, moved);
    setChain((list) =>
      list.map((t) => {
        const newIndex = next.findIndex((n) => n.key === t.key);
        return newIndex === -1 ? t : { ...t, priority: newIndex + 1 };
      }),
    );
  };

  const handleDrop = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex !== null) reorder(dragIndex, index);
    setDragIndex(null);
    setOverIndex(null);
  };

  const savePolicy = () => {
    form.validateFields().then(() => {
      message.success(`Đã lưu chính sách định tuyến cho ${alias}.`);
    });
  };

  return (
    <>
      <PageHeader
        title="Chính sách định tuyến"
        description="Route chain, retry/fallback và circuit breaker cho từng model alias."
        extra={
          <Select
            value={alias}
            style={{ width: 220 }}
            onChange={setAlias}
            options={models.map((m) => ({ value: m.alias, label: m.alias }))}
          />
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <Card
            title={`Route chain — ${alias}`}
            size="small"
            style={{ marginBottom: 16 }}
            extra={
              <Link to="/models/$alias" params={{ alias: alias.replace("/", "--") }}>
                <Button size="small" icon={<EditOutlined />}>
                  Sửa Target ở Model Detail
                </Button>
              </Link>
            }
          >
            <Typography.Paragraph type="secondary" style={{ fontSize: 12.5, marginBottom: 12 }}>
              Danh sách Target dưới đây được gán ở trang{" "}
              <Typography.Text strong>Model Detail</Typography.Text> của alias này (mục "Provider
              Target"). Kéo <HolderOutlined /> hoặc dùng mũi tên để đổi{" "}
              <Typography.Text strong>thứ tự ưu tiên</Typography.Text> — muốn thêm/bớt Target, bấm
              nút "Sửa Target ở Model Detail" phía trên.
            </Typography.Paragraph>
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              {sorted.map((t, i) => (
                <div key={t.key}>
                  <div
                    draggable
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setOverIndex(i);
                    }}
                    onDragLeave={() => setOverIndex((cur) => (cur === i ? null : cur))}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                    style={{
                      border: "1px solid",
                      borderColor: overIndex === i && dragIndex !== i ? "#1677ff" : "#e5e7eb",
                      borderRadius: 8,
                      padding: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#fff",
                      opacity: dragIndex === i ? 0.4 : 1,
                      transition: "border-color 0.15s, opacity 0.15s",
                    }}
                  >
                    <span style={{ cursor: "grab", color: "#bfbfbf", fontSize: 16 }}>
                      <HolderOutlined />
                    </span>
                    <Space direction="vertical" size={2} style={{ flex: 1, minWidth: 0 }}>
                      <Space size={8}>
                        <Tag color="blue">Priority {t.priority}</Tag>
                        <Typography.Text strong>{t.pool}</Typography.Text>
                      </Space>
                      <Typography.Text type="secondary" style={{ fontSize: 12.5 }}>
                        {t.provider} · model: {t.model} · latency {t.latency} ms
                      </Typography.Text>
                    </Space>
                    <Space size={4}>
                      <StatusTag value={t.status} />
                      <Button
                        size="small"
                        type="text"
                        icon={<UpOutlined />}
                        disabled={i === 0}
                        onClick={() => reorder(i, i - 1)}
                        title="Tăng ưu tiên"
                      />
                      <Button
                        size="small"
                        type="text"
                        icon={<DownOutlined />}
                        disabled={i === sorted.length - 1}
                        onClick={() => reorder(i, i + 1)}
                        title="Giảm ưu tiên"
                      />
                    </Space>
                  </div>
                  {i < sorted.length - 1 && (
                    <div style={{ textAlign: "center", color: "#bfbfbf", padding: "4px 0" }}>
                      <ArrowRightOutlined rotate={90} />
                    </div>
                  )}
                </div>
              ))}
            </Space>
          </Card>

          <Card title="Thứ tự xử lý" size="small">
            <Steps
              size="small"
              items={[
                { title: "Hard Filter", description: "Loại target thiếu capability/health/quota" },
                { title: "Ranking", description: "priority → cost → latency → fairness" },
                { title: "Retry", description: "Cùng target, backoff có jitter" },
                { title: "Fallback", description: "Chuyển sang target kế theo policy" },
                { title: "Circuit Breaker", description: "closed → open → half-open" },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} xl={9}>
          <Card title="Cấu hình Chính sách" size="small">
            <Form
              form={form}
              layout="vertical"
              size="middle"
              initialValues={{
                retryCount: 2,
                requestTimeout: 120,
                overallDeadline: 180,
                fallbackEnabled: true,
                maxCost: 0.05,
                budgetPolicy: "account",
                roundRobin: true,
                circuitThreshold: 50,
              }}
            >
              <Form.Item
                name="retryCount"
                label="Số lần Retry"
                tooltip="Số lần retry tối đa trên cùng một target"
              >
                <InputNumber min={0} max={5} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="requestTimeout" label="Timeout Request (giây)">
                <InputNumber min={1} max={600} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                name="overallDeadline"
                label="Deadline tổng (giây)"
                tooltip="Bao phủ toàn bộ attempts + retry + fallback"
              >
                <InputNumber min={1} max={900} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="fallbackEnabled" label="Bật Fallback" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="maxCost" label="Chi phí tối đa (USD / request)">
                <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item name="budgetPolicy" label="Chính sách Ngân sách">
                <Select
                  options={[
                    { value: "account", label: "Theo Provider Account" },
                    { value: "client", label: "Theo API Key / Client" },
                    { value: "global", label: "Toàn hệ thống" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="roundRobin"
                label="Round Robin (cùng priority)"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item name="circuitThreshold" label="Ngưỡng Circuit Breaker (% lỗi / 30s)">
                <InputNumber min={1} max={100} style={{ width: "100%" }} />
              </Form.Item>
              <Button type="primary" icon={<SaveOutlined />} block onClick={savePolicy}>
                Lưu chính sách
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
