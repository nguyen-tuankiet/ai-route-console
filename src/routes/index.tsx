import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, Col, Row, Statistic, Table, Progress, Space, Typography, Segmented } from "antd";
import {
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  BranchesOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import { kpis, providerHealth, trendData, recentActivity } from "../lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tổng quan — AI Router Console" },
      {
        name: "description",
        content: "KPI request, provider health, xu hướng traffic và hoạt động định tuyến gần đây.",
      },
      { property: "og:title", content: "Tổng quan — AI Router Console" },
      {
        property: "og:description",
        content: "KPI request, provider health và hoạt động định tuyến gần đây.",
      },
    ],
  }),
  component: Dashboard,
});

const icons = [
  <ApiOutlined />,
  <CheckCircleOutlined />,
  <ClockCircleOutlined />,
  <DashboardOutlined />,
  <BranchesOutlined />,
  <DollarOutlined />,
];

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Tổng quan"
        description="Tình trạng định tuyến AI trên môi trường Production trong 24 giờ qua."
        extra={<Segmented options={["24 giờ", "7 ngày", "30 ngày"]} defaultValue="24 giờ" />}
      />

      <Row gutter={[16, 16]}>
        {kpis.map((k, i) => (
          <Col key={k.key} xs={24} sm={12} lg={8} xxl={4}>
            <Card size="small" styles={{ body: { padding: 16 } }}>
              <Space size={8} style={{ color: "#8c8c8c", fontSize: 13 }}>
                {icons[i]}
                {k.title}
              </Space>
              <Statistic
                value={k.value}
                precision={k.precision}
                prefix={k.prefix}
                suffix={k.suffix}
                valueStyle={{ fontSize: 24, fontWeight: 600 }}
              />
              <Typography.Text
                type={k.delta >= 0 ? "success" : "danger"}
                style={{ fontSize: 12 }}
              >
                {k.delta >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(k.delta)}%
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {" "}
                  so với kỳ trước
                </Typography.Text>
              </Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} xl={14}>
          <Card title="Request Trend" size="small">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} axisLine={false} />
                  <RTooltip />
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#1677ff"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="failed"
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card title="Provider Health" size="small">
            <Table
              size="small"
              pagination={false}
              dataSource={providerHealth}
              scroll={{ x: 720 }}
              columns={[
                { title: "Provider", dataIndex: "provider" },
                { title: "Account", dataIndex: "account" },
                { title: "Region", dataIndex: "region" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (v: string) => <StatusTag value={v} />,
                },
                {
                  title: "Quota",
                  dataIndex: "quota",
                  width: 110,
                  render: (v: number) => (
                    <Progress
                      percent={v}
                      size="small"
                      status={v >= 100 ? "exception" : v > 85 ? "active" : "normal"}
                    />
                  ),
                },
                { title: "Latency", dataIndex: "latency", render: (v: number) => `${v} ms` },
                {
                  title: "Circuit",
                  dataIndex: "circuit",
                  render: (v: string) => <StatusTag value={v} />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Routing Activity" size="small" style={{ marginTop: 16 }}>
        <Table
          size="small"
          dataSource={recentActivity}
          scroll={{ x: 900 }}
          pagination={{ pageSize: 5, size: "small", showSizeChanger: false }}
          columns={[
            {
              title: "Request ID",
              dataIndex: "id",
              render: (v: string) => (
                <Link to="/logs/$id" params={{ id: v }} style={{ fontFamily: "monospace" }}>
                  {v}
                </Link>
              ),
            },
            { title: "Model Alias", dataIndex: "alias" },
            { title: "Provider", dataIndex: "provider" },
            { title: "Attempts", dataIndex: "attempts", width: 90 },
            {
              title: "Result",
              dataIndex: "result",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Duration", dataIndex: "duration", render: (v: number) => `${v} ms` },
            { title: "Created Time", dataIndex: "created" },
          ]}
        />
      </Card>
    </>
  );
}
