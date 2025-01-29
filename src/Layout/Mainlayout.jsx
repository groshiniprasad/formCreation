// src/layouts/MainLayout.jsx
import { Layout } from "antd";
import PropTypes from 'prop-types';
import Sidebar from "../components/Common/SideBar";
import Header from "../components/Common/Header";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Layout */}
      <Layout style={{ marginLeft: 200 }}>
        <Header />
        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
