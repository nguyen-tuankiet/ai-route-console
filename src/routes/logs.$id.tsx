import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Result, Row, Statistic, Timeline, Typography } from "antd";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { getRequestDetail } from "../lib/mock";

export const Route = createFileRoute("/logs/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Request Detail — AI Router Console` },
      { name: "description", content: "Routing timeline chi tiết của một request." },
    ],
  }),
  component: RequestDetailPage,
});

const OUTCOME_COLOR: Record<string, string> = {
  success: "green",
  timeout: "orange",
  rate_limit: "orange",
  provider_5xx: "red",
};

function RequestDetailPage() {
  const { id } = Route.useParams();
  const detail = getRequestDetail(id);

  if (!detail) {
    return (
      <Result
        status="404"
        title="Không tìm thấy Request"
        subTitle={`Request ID "${id}" không tồn tại.`}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={detail.id}
        description="Chi tiết vòng đời request và các lần thử tới provider."
        extra={<StatusTag value={detail.result} />}
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={12} md={4}>
            <Statistic title="Client" value={detail.client} valueStyle={{ fontSize: 15 }} />
          </Col>
          <Col xs={12} md={4}>
            <Statistic
              title="Model Alias"
              value={detail.alias}
              valueStyle={{ fontSize: 15, fontFamily: "monospace" }}
            />
          </Col>
          <Col xs={12} md={4}>
            <Statistic title="Capability" value={detail.capability} valueStyle={{ fontSize: 15 }} />
          </Col>
          <Col xs={12} md={3}>
            <Statistic
              title="Tổng thời lượng"
              value={detail.duration}
              suffix="ms"
              valueStyle={{ fontSize: 15 }}
            />
          </Col>
          <Col xs={12} md={3}>
            <Statistic
              title="Token đầu vào"
              value={detail.inputTokens}
              valueStyle={{ fontSize: 15 }}
            />
          </Col>
          <Col xs={12} md={3}>
            <Statistic
              title="Token đầu ra"
              value={detail.outputTokens}
              valueStyle={{ fontSize: 15 }}
            />
          </Col>
          <Col xs={12} md={3}>
            <Statistic
              title="Chi phí ước tính"
              value={`$${detail.cost}`}
              valueStyle={{ fontSize: 15 }}
            />
          </Col>
        </Row>
      </Card>

      <Card title="Routing Timeline" size="small">
        <Timeline
          items={[
            { color: "blue", children: "Request bắt đầu" },
            ...detail.attempts.map((a) => ({
              color: OUTCOME_COLOR[a.outcome] ?? "gray",
              children: (
                <div key={a.attempt_no}>
                  <Typography.Text strong>Attempt {a.attempt_no}</Typography.Text>
                  <div style={{ fontSize: 13, color: "#595959" }}>Nhà cung cấp: {a.provider}</div>
                  <div style={{ fontSize: 13, color: "#595959" }}>
                    Kết quả: {a.outcome} · Thời lượng: {(a.duration / 1000).toFixed(1)}s
                  </div>
                </div>
              ),
            })),
            {
              color: detail.result === "Success" ? "green" : "red",
              children: detail.result === "Success" ? "Request hoàn tất" : "Request thất bại",
            },
          ]}
        />
      </Card>
    </>
  );
}
