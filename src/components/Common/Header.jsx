import { Layout } from "antd";

const { Header } = Layout;

const MyHeader = () => (
  <Header
    style={{
      backgroundColor: "#fff",
      padding: 16,
      fontSize: "18px",
      borderBottom: "1px solid #e8e8e8",
    }}
  >
    App Header
  </Header>
);

export default MyHeader;