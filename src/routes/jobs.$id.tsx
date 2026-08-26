import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Progress, Result, Row, Statistic, Steps, Typography } from "antd";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { getJobDetail } from "../lib/mock";

export const Route = createFileRoute("/jobs/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Job Detail — AI Router Console` },
      { name: "description", content: "Lifecycle chi tiết của một async job." },
    ],
  }),
  component: JobDetailPage,
});

const TERMINAL_FAILURE = new Set(["Failed", "Cancelled", "Expired"]);

function JobDetailPage() {
  const { id } = Route.useParams();
  const job = getJobDetail(id);

  if (!job) {
    return (
      <Result status="404" title="Không tìm thấy Job" subTitle={`Mã Job "${id}" không tồn tại.`} />
    );
  }

  const isFailure = TERMINAL_FAILURE.has(job.status);

  return (
    <>
      <PageHeader
        title={job.id}
        description={`${job.type} job — model ${job.model}`}
        extra={<StatusTag value={job.status} />}
      />

      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={12} md={4}>
            <Statistic title="Loại" value={job.type} valueStyle={{ fontSize: 15 }} />
          </Col>
          <Col xs={12} md={5}>
            <Statistic
              title="Model"
              value={job.model}
              valueStyle={{ fontSize: 15, fontFamily: "monospace" }}
            />
          </Col>
          <Col xs={12} md={5}>
            <Statistic title="Client" value={job.client} valueStyle={{ fontSize: 15 }} />
          </Col>
          <Col xs={12} md={4}>
            <Statistic title="Số lần thử" value={job.attempts} valueStyle={{ fontSize: 15 }} />
          </Col>
          <Col xs={12} md={3}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Tiến độ
            </Typography.Text>
            <Progress
              percent={job.progress}
              size="small"
              status={isFailure ? "exception" : job.progress >= 100 ? "success" : "active"}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 8 }}>
          <Col xs={12} md={4}>
            <Statistic title="Tạo lúc" value={job.created} valueStyle={{ fontSize: 13 }} />
          </Col>
          <Col xs={12} md={4}>
            <Statistic title="Cập nhật lúc" value={job.updated} valueStyle={{ fontSize: 13 }} />
          </Col>
        </Row>
      </Card>

      <Card title="Vòng đời" size="small">
        <Steps
          size="small"
          status={isFailure ? "error" : job.status === "Succeeded" ? "finish" : "process"}
          current={job.timeline.length - 1}
          items={job.timeline.map((t) => ({
            title: t.stage,
            description: t.at,
          }))}
        />
      </Card>
    </>
  );
}
