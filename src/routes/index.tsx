import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactElement, type ReactNode } from "react";
import { Card, Col, Row, Statistic, Table, Progress, Space, Typography, Select } from "antd";
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { PageHeader } from "../components/AppLayout";
import { StatusTag } from "../components/StatusTag";
import {
  DateRangeFilter,
  defaultDateRange,
  type DateRangeValue,
} from "../components/DateRangeFilter";
import { TablePagination } from "../components/TablePagination";
import {
  kpis,
  providerHealth,
  trendData,
  recentActivity,
  costTrend,
  fallbackRateTrend,
  latencyTrend,
  providerDistribution,
  successFailedTrend,
  tokenUsageTrend,
  usageRows,
} from "../lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tổng quan — AI Router Console" },
      {
        name: "description",
        content:
          "KPI request, provider health, xu hướng traffic, usage & analytics và hoạt động định tuyến gần đây.",
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

const PIE_COLORS = ["#1677ff", "#52c41a", "#faad14", "#ff4d4f", "#722ed1"];
const CHART_HEIGHT = 300;

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card title={title} size="small" style={{ height: "100%" }}>
      <div style={{ height: CHART_HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%">
          {children as ReactElement}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange());
  const [provider, setProvider] = useState<string | undefined>();
  const [model, setModel] = useState<string | undefined>();
  const [client, setClient] = useState<string | undefined>();

  const [recentPage, setRecentPage] = useState(1);
  const [recentPageSize, setRecentPageSize] = useState(10);
  const [usagePage, setUsagePage] = useState(1);
  const [usagePageSize, setUsagePageSize] = useState(10);

  const filteredUsageRows = useMemo(
    () =>
      usageRows.filter((r) => {
        const d = dayjs(r.date, "YYYY-MM-DD");
        return (
          !d.isBefore(dateRange.range[0], "day") &&
          !d.isAfter(dateRange.range[1], "day") &&
          (!provider || r.provider === provider) &&
          (!model || r.model === model) &&
          (!client || r.client === client)
        );
      }),
    [dateRange, provider, model, client],
  );

  const recentRows = recentActivity.slice(
    (recentPage - 1) * recentPageSize,
    recentPage * recentPageSize,
  );
  const usageTableRows = filteredUsageRows.slice(
    (usagePage - 1) * usagePageSize,
    usagePage * usagePageSize,
  );

  return (
    <>
      <PageHeader
        title="Tổng quan"
        description="Định tuyến AI và usage analytics — lọc chung theo khoảng thời gian, nhà cung cấp, model và client bên dưới."
        extra={
          <Space wrap size={12}>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <Select
              allowClear
              placeholder="Nhà cung cấp"
              style={{ width: 170 }}
              value={provider}
              onChange={setProvider}
              options={["OpenAI Compatible", "Vertex AI"].map((v) => ({ value: v, label: v }))}
            />
            <Select
              allowClear
              placeholder="Model Alias"
              style={{ width: 170 }}
              value={model}
              onChange={setModel}
              options={["text/fast", "image/quality", "embedding/default"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
            <Select
              allowClear
              placeholder="Client"
              style={{ width: 170 }}
              value={client}
              onChange={setClient}
              options={["internal-chat-service", "media-pipeline", "search-indexer"].map((v) => ({
                value: v,
                label: v,
              }))}
            />
          </Space>
        }
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
                {...(k.precision !== undefined ? { precision: k.precision } : {})}
                {...(k.prefix ? { prefix: k.prefix } : {})}
                {...(k.suffix ? { suffix: k.suffix } : {})}
                valueStyle={{ fontSize: 24, fontWeight: 600 }}
              />

              <Typography.Text type={k.delta >= 0 ? "success" : "danger"} style={{ fontSize: 12 }}>
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

      {/* Request & nhà cung cấp — chart request trend luôn cùng độ cao với table health bên phải */}
      <Row gutter={[16, 16]} align="stretch" style={{ marginTop: 16 }}>
        <Col xs={24} xl={14}>
          <Card title="Xu hướng Request" size="small" style={{ height: "100%" }}>
            <div style={{ height: CHART_HEIGHT }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8c8c8c" }}
                    tickLine={false}
                    axisLine={false}
                  />
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
          <Card title="Tình trạng Nhà cung cấp" size="small" style={{ height: "100%" }}>
            <Table
              size="small"
              pagination={false}
              scroll={{ y: CHART_HEIGHT - 40 }}
              dataSource={providerHealth}
              columns={[
                { title: "Nhà cung cấp", dataIndex: "provider" },
                { title: "Tài khoản", dataIndex: "account" },
                { title: "Khu vực", dataIndex: "region" },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  render: (v: string) => <StatusTag value={v} />,
                },
                {
                  title: "Hạn mức",
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
                { title: "Độ trễ", dataIndex: "latency", render: (v: number) => `${v} ms` },
                {
                  title: "Circuit Breaker",
                  dataIndex: "circuit",
                  render: (v: string) => <StatusTag value={v} />,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Kết quả & độ tin cậy của request */}
      <Row gutter={[16, 16]} align="stretch" style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <ChartCard title="Thành công / Thất bại">
            <AreaChart
              data={successFailedTrend}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} axisLine={false} />
              <RTooltip />
              <Area
                type="monotone"
                dataKey="success"
                stackId="1"
                stroke="#52c41a"
                fill="#52c41a33"
              />
              <Area
                type="monotone"
                dataKey="failed"
                stackId="1"
                stroke="#ff4d4f"
                fill="#ff4d4f33"
              />
            </AreaChart>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard title="Tỷ lệ Fallback">
            <BarChart data={fallbackRateTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} axisLine={false} />
              <RTooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="rate" fill="#faad14" />
            </BarChart>
          </ChartCard>
        </Col>
      </Row>

      {/* Phân bổ và hiệu năng theo nhà cung cấp */}
      <Row gutter={[16, 16]} align="stretch" style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <ChartCard title="Phân bổ theo Nhà cung cấp">
            <PieChart>
              <Pie
                data={providerDistribution}
                dataKey="value"
                nameKey="type"
                innerRadius={50}
                outerRadius={80}
              >
                {providerDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <RTooltip />
            </PieChart>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard title="Độ trễ trung bình">
            <LineChart data={latencyTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} axisLine={false} />
              <RTooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#1677ff"
                strokeWidth={2}
                dot={false}
                name="Trung bình"
              />
              <Line
                type="monotone"
                dataKey="p95"
                stroke="#faad14"
                strokeWidth={2}
                dot={false}
                name="P95"
              />
            </LineChart>
          </ChartCard>
        </Col>
      </Row>

      {/* Chi phí vận hành */}
      <Row gutter={[16, 16]} align="stretch" style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <ChartCard title="Chi phí ước tính">
            <AreaChart data={costTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} axisLine={false} />
              <RTooltip formatter={(v: number) => `$${v}`} />
              <Area type="monotone" dataKey="cost" stroke="#722ed1" fill="#722ed133" />
            </AreaChart>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard title="Mức sử dụng Token">
            <BarChart data={tokenUsageTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8c8c8c" }} tickLine={false} axisLine={false} />
              <RTooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="input" stackId="t" fill="#1677ff" name="Token đầu vào" />
              <Bar dataKey="output" stackId="t" fill="#95c9ff" name="Token đầu ra" />
            </BarChart>
          </ChartCard>
        </Col>
      </Row>

      <Card title="Hoạt động Định tuyến Gần đây" size="small" style={{ marginTop: 16 }}>
        <Table
          size="small"
          rowKey="key"
          dataSource={recentRows}
          scroll={{ x: 900 }}
          pagination={false}
          columns={[
            {
              title: "Mã Request",
              dataIndex: "id",
              render: (v: string) => (
                <Link to="/logs/$id" params={{ id: v }} style={{ fontFamily: "monospace" }}>
                  {v}
                </Link>
              ),
            },
            { title: "Model Alias", dataIndex: "alias" },
            { title: "Nhà cung cấp", dataIndex: "provider" },
            { title: "Số lần thử", dataIndex: "attempts", width: 90 },
            {
              title: "Kết quả",
              dataIndex: "result",
              render: (v: string) => <StatusTag value={v} />,
            },
            { title: "Thời lượng", dataIndex: "duration", render: (v: number) => `${v} ms` },
            { title: "Thời gian tạo", dataIndex: "created" },
          ]}
        />
        <TablePagination
          page={recentPage}
          pageSize={recentPageSize}
          total={recentActivity.length}
          onPageChange={setRecentPage}
          onPageSizeChange={setRecentPageSize}
        />
      </Card>

      <Card title="Bảng Sử dụng" size="small" style={{ marginTop: 16 }}>
        <Table
          size="small"
          rowKey="key"
          dataSource={usageTableRows}
          scroll={{ x: 1000 }}
          pagination={false}
          columns={[
            { title: "Ngày", dataIndex: "date" },
            { title: "Client", dataIndex: "client" },
            {
              title: "Model",
              dataIndex: "model",
              render: (v: string) => (
                <Typography.Text style={{ fontFamily: "monospace" }}>{v}</Typography.Text>
              ),
            },
            { title: "Nhà cung cấp", dataIndex: "provider" },
            {
              title: "Token đầu vào",
              dataIndex: "input",
              render: (v: number) => v.toLocaleString("en-US"),
            },
            {
              title: "Token đầu ra",
              dataIndex: "output",
              render: (v: number) => v.toLocaleString("en-US"),
            },
            {
              title: "Tổng Token",
              render: (_, r) => (r.input + r.output).toLocaleString("en-US"),
            },
            {
              title: "Số Request",
              dataIndex: "requests",
              render: (v: number) => v.toLocaleString("en-US"),
            },
            { title: "Chi phí", dataIndex: "cost", render: (v: string) => `$${v}` },
          ]}
        />
        <TablePagination
          page={usagePage}
          pageSize={usagePageSize}
          total={filteredUsageRows.length}
          onPageChange={setUsagePage}
          onPageSizeChange={setUsagePageSize}
        />
      </Card>
    </>
  );
}
