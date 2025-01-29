import { Menu } from "antd";
import PropTypes from "prop-types";
import { AppstoreOutlined, DatabaseOutlined } from "@ant-design/icons";


const HomeLayout = ({ children, activeMenuItem, onMenuSelect }) => {
  return (
    <>
      {/* Horizontal Menu */}
      <Menu
        mode="horizontal"
        selectedKeys={[activeMenuItem]}
        onClick={(e) => onMenuSelect(e.key)}
        style={{
          marginBottom: "16px",
          borderBottom: "1px solid #e8e8e8",
        }}
      >
        <Menu.Item  key="processManager" icon={<DatabaseOutlined />}>Process Management</Menu.Item>
        <Menu.Item key="features" icon={<AppstoreOutlined />} >Features</Menu.Item>
        <Menu.Item key="stats">Statistics</Menu.Item>
      </Menu>

      {/* Render dynamic content */}
      {children}
    </>
  );
};

HomeLayout.propTypes = {
  activeMenuItem: PropTypes.string.isRequired,
  onMenuSelect: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default HomeLayout;
