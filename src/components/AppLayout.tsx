import { useState, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Layout,
  Menu,
  ConfigProvider,
  Input,
  Select,
  Badge,
  Avatar,
  Dropdown,
  Breadcrumb,
  Button,
  Typography,
  Space,
  theme,
} from "antd";
import {
  DashboardOutlined,
  CloudServerOutlined,
  TeamOutlined,
  DeploymentUnitOutlined,
  BranchesOutlined,
  KeyOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  ThunderboltOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  HeartOutlined,
  BellOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

export const navItems = [
  { key: "/", icon: <DashboardOutlined />, label: "Tổng quan" },
  { key: "/providers", icon: <CloudServerOutlined />, label: "Providers" },
  { key: "/accounts", icon: <TeamOutlined />, label: "Tài khoản Provider" },
  { key: "/models", icon: <DeploymentUnitOutlined />, label: "Models" },
  { key: "/routing", icon: <BranchesOutlined />, label: "Chính sách định tuyến" },
  { key: "/api-keys", icon: <KeyOutlined />, label: "API Keys" },
  { key: "/usage", icon: <BarChartOutlined />, label: "Usage & Analytics" },
  { key: "/logs", icon: <FileSearchOutlined />, label: "Request Logs" },
  { key: "/jobs", icon: <ThunderboltOutlined />, label: "Async Jobs" },
  { key: "/assets", icon: <PictureOutlined />, label: "Assets" },
  { key: "/audit", icon: <SafetyCertificateOutlined />, label: "Audit Logs" },
  { key: "/health", icon: <HeartOutlined />, label: "System Health" },
];

const labelOf = (path: string) =>
  navItems.find((n) => n.key === path)?.label ?? path.replace("/", "");

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = "/" + (pathname.split("/")[1] ?? "");
  const selected = navItems.some((n) => n.key === base) ? base : "/";
  const segments = pathname.split("/").filter(Boolean);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 6,
          colorBgLayout: "#fafafa",
          colorBorderSecondary: "#e5e7eb",
          fontSize: 14,
        },
        components: {
          Layout: { headerBg: "#ffffff", siderBg: "#ffffff", bodyBg: "#fafafa", headerHeight: 56 },
          Menu: { itemBorderRadius: 6, itemMarginInline: 8, activeBarWidth: 0 },
          Card: { boxShadowTertiary: "none" },
          Table: { headerBg: "#fafafa", headerColor: "#4b5563" },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={244}
          style={{
            borderRight: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "#1677ff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
                flex: "0 0 auto",
              }}
            >
              AR
            </div>
            {!collapsed && (
              <div style={{ lineHeight: 1.2, overflow: "hidden" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>AI Router</div>
                <div style={{ fontSize: 11, color: "#8c8c8c", whiteSpace: "nowrap" }}>
                  Unified Multimodal AI Gateway
                </div>
              </div>
            )}
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selected]}
            style={{ borderInlineEnd: "none", paddingTop: 8 }}
            items={navItems}
            onClick={({ key }) => navigate({ to: key })}
          />

          <div
            style={{
              marginTop: "auto",
              borderTop: "1px solid #e5e7eb",
              padding: 12,
              position: "sticky",
              bottom: 0,
              background: "#fff",
            }}
          >
            <Space align="center" style={{ marginBottom: 8 }}>
              <Avatar size={32} style={{ background: "#1677ff" }}>
                A
              </Avatar>
              {!collapsed && (
                <div style={{ lineHeight: 1.25 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Admin</div>
                  <div style={{ fontSize: 11, color: "#8c8c8c" }}>admin@corp.io</div>
                </div>
              )}
            </Space>
            <Menu
              mode="inline"
              selectable={false}
              style={{ borderInlineEnd: "none" }}
              items={[
                { key: "settings", icon: <SettingOutlined />, label: "Cài đặt" },
                { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
              ]}
            />
          </div>
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0 16px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((c) => !c)}
            />
            <Breadcrumb
              items={[
                { title: <Link to="/">AI Router</Link> },
                ...(segments.length ? [{ title: labelOf(base) }] : [{ title: "Tổng quan" }]),
                ...(segments.length > 1 ? [{ title: segments[1] }] : []),
              ]}
            />
            <div style={{ flex: 1 }} />
            <Input
              allowClear
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Tìm kiếm request, model, provider…"
              style={{ width: 280 }}
            />
            <Select
              defaultValue="production"
              style={{ width: 150 }}
              options={[
                { value: "development", label: "Development" },
                { value: "staging", label: "Staging" },
                { value: "production", label: "Production" },
              ]}
            />
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown
              menu={{
                items: [
                  { key: "p", label: "Hồ sơ" },
                  { key: "s", icon: <SettingOutlined />, label: "Cài đặt" },
                  { type: "divider" },
                  { key: "o", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
                ],
              }}
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar size={30} style={{ background: "#1677ff" }}>
                  A
                </Avatar>
              </Space>
            </Dropdown>
          </Header>
          <Content style={{ padding: 24 }}>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export function PageHeader({
  title,
  description,
  extra,
}: {
  title: string;
  description?: string;
  extra?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 24,
        flexWrap: "wrap",
      }}
    >
      <div>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {description && (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {description}
          </Typography.Text>
        )}
      </div>
      <Space wrap>{extra}</Space>
    </div>
  );
}
