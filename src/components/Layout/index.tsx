import { App, Layout, Menu, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";

import "../../styles/layout.scss";

const { Header, Content } = Layout;

const navigationItems = [
  {
    key: "/",
    label: <Link to="/">Products</Link>,
  },
  {
    key: "/promotions",
    label: <Link to="/promotions">Promotions</Link>,
  },
];

export function AppLayout() {
  const location = useLocation();
  const selectedKey = location.pathname.startsWith("/promotions") ? "/promotions" : "/";

  return (
    <App>
      <Layout className="app-layout">
        <Header className="app-header">
          <Typography.Title className="app-header__logo" level={4} style={{ color: '#ffffff', margin: 0 }}>
            ModaCo Admin
        </Typography.Title>
          <nav className="app-header__nav" aria-label="Primary navigation">
            <Menu
              className="app-header__menu"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              items={navigationItems}
              theme="dark"
            />
          </nav>
        </Header>
        <Content className="app-content">
          <div className="app-content__inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </App>
  );
}
