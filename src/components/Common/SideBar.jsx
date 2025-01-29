import { Menu } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";

const Sidebar = () => {
  return (
    <div style={{ width: 200, height: "100vh", position: "fixed",  backgroundColor: "#f0f2f5" }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<SettingOutlined />}>
          <Link to="/settings">Settings</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Sidebar;
