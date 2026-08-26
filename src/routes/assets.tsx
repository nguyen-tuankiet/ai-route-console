import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Button, Card, Col, Empty, Row, Select, Space, Statistic, Tag, Typography } from "antd";
import {
  FileImageOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { PageHeader } from "../components/AppLayout";
import { assets } from "../lib/mock";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Assets — AI Router Console" },
      { name: "description", content: "File/media được provider sinh ra: image, audio, video." },
      { property: "og:title", content: "Assets — AI Router Console" },
      { property: "og:description", content: "Quản lý asset và signed URL hết hạn." },
    ],
  }),
  component: AssetsPage,
});

const TYPE_META: Record<string, { icon: ReactNode; color: string; label: string }> = {
  Image: { icon: <FileImageOutlined />, color: "blue", label: "Ảnh" },
  Video: { icon: <VideoCameraOutlined />, color: "purple", label: "Video" },
  Audio: { icon: <SoundOutlined />, color: "green", label: "Audio" },
};

function AssetsPage() {
  const [type, setType] = useState<string | undefined>();
  const [client, setClient] = useState<string | undefined>();

  const data = assets.filter((a) => (!type || a.type === type) && (!client || a.client === client));

  const countOf = (t: string) => assets.filter((a) => a.type === t).length;

  return (
    <>
      <PageHeader
        title="Asset"
        description="File ảnh/video/audio mà AI đã tạo ra xong — Router tải về lưu lại và cấp link tải có thời hạn thay vì đưa thẳng link gốc của provider. Mỗi Asset là kết quả của đúng 1 lần gọi AI (thường là 1 Async Job)."
        extra={
          <Space wrap>
            <Select
              allowClear
              placeholder="Loại"
              style={{ width: 130 }}
              value={type}
              onChange={setType}
              options={Object.entries(TYPE_META).map(([value, m]) => ({ value, label: m.label }))}
            />
            <Select
              allowClear
              placeholder="Client"
              style={{ width: 170 }}
              value={client}
              onChange={setClient}
              options={["media-pipeline", "studio-app"].map((v) => ({ value: v, label: v }))}
            />
          </Space>
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="Tổng Asset" value={assets.length} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Ảnh"
              value={countOf("Image")}
              valueStyle={{ color: "#1677ff" }}
              prefix={<FileImageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Video"
              value={countOf("Video")}
              valueStyle={{ color: "#722ed1" }}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Audio"
              value={countOf("Audio")}
              valueStyle={{ color: "#52c41a" }}
              prefix={<SoundOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {data.length === 0 ? (
        <Card size="small">
          <Empty
            image={<PictureOutlined style={{ fontSize: 40, color: "#bfbfbf" }} />}
            description="Không có asset khớp bộ lọc."
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {data.map((a) => {
            const meta = TYPE_META[a.type];
            return (
              <Col key={a.key} xs={24} sm={12} lg={8} xl={6}>
                <Card size="small" style={{ height: "100%" }}>
                  <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
                    <Space size={8}>
                      <span style={{ color: "#1677ff", fontSize: 16 }}>{meta?.icon}</span>
                      <Typography.Text style={{ fontSize: 13, fontFamily: "monospace" }}>
                        {a.id}
                      </Typography.Text>
                    </Space>
                    <Tag color={meta?.color ?? "default"}>{meta?.label ?? a.type}</Tag>
                  </Space>

                  <Space
                    direction="vertical"
                    size={6}
                    style={{
                      width: "100%",
                      fontSize: 12.5,
                      marginTop: 10,
                      background: "#fafafa",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                      padding: "8px 10px",
                    }}
                  >
                    <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text type="secondary">Định dạng</Typography.Text>
                      <Typography.Text>
                        {a.mime} · {a.size}
                      </Typography.Text>
                    </Space>
                    <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text type="secondary">Client</Typography.Text>
                      <Typography.Text>{a.client}</Typography.Text>
                    </Space>
                    <Space size={6} style={{ width: "100%", justifyContent: "space-between" }}>
                      <Typography.Text type="secondary">Tạo lúc</Typography.Text>
                      <Typography.Text>{a.created}</Typography.Text>
                    </Space>
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
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined /> Hết hạn {a.expires}
                    </Typography.Text>
                    <Button size="small" icon={<DownloadOutlined />}>
                      Tải xuống
                    </Button>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
}
