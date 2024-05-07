import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, ReactNode } from "react";

const { Header, Content, Sider } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("");

  useEffect(() => {
    setSelectedKey(router.pathname);
  }, [router.pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">لوحة التحكم</Menu.Item>
          <Menu.Item key="2">الإعدادات</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderLeft: 0 }}
            direction="rtl"
          >
            <Menu.Item key="/" icon={<UserOutlined />}>
              <Link href="/">كاميرات المراقبة</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/cars" icon={<NotificationOutlined />}>
              <Link href="/dashboard/cars">رفع البلاغات</Link>
            </Menu.Item>
            <Menu.Item key="/dashboard/analytics" icon={<LaptopOutlined />}>
              <Link href="/dashboard/analytics">رصد المركبات</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
