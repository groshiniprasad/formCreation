import { Fragment } from "react";
import { Card, Input } from "antd";

const Header = ({ title, description, setTitle, setDescription }) => {
  return (
    <Fragment>
      <div style={{ marginBottom: "16px" }}>
        <Card style={{ padding: "16px", borderTop: "8px solid #9C27B0" }}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form Title"
            name="title"
            style={{ marginBottom: "16px" }}
          />
          <Input.TextArea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Form Description"
            rows={2}
          />
        </Card>
      </div>
    </Fragment>
  );
};

export default Header;
