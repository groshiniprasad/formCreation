import { Fragment } from "react";
// Ant Design Components
import { Input, Card, Form, Switch, Divider, Button, Tooltip, Row, Col, Select } from "antd";
import TextArea from "antd/es/input/TextArea"; // Correct TextArea import
// Icons
import { DeleteOutlined, DragOutlined, CopyOutlined } from "@ant-design/icons";

// Form Elements
import { formEl } from "../constants";

const TextAreaInput = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  duplicateElement,
}) => {
  return (
    <Fragment>
      <Card style={{ padding: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <DragOutlined style={{ transform: "rotate(-90deg)", cursor: "grab" }} />
        </div>
        <Row gutter={[16, 16]} align="middle">
          <Col span={16}>
            <Input
              defaultValue={item.value}
              onBlur={(e) => handleValue(item.id, e.target.value)}
              placeholder="Textarea Label"
              style={{ marginBottom: "8px" }}
            />
            <TextArea
              placeholder="Enter text..."
              rows={3}
            />
          </Col>
          <Col span={8}>
            <Form.Item label="Type">
              <Select
                value={item.type}
                onChange={(value) => handleElType(item.id, value)}
              >
                {formEl.map((el, key) => (
                  <Select.Option key={key} value={el.value}>
                    {el.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Row align="middle">
          <Tooltip title="Delete Element">
            <Button onClick={() => deleteEl(item.id)} icon={<DeleteOutlined />} />
          </Tooltip>
          <Tooltip title="Duplicate Element">
            <Button onClick={() => duplicateElement(item.id, item.type)} icon={<CopyOutlined />} />
          </Tooltip>
          <Form.Item label="Required" style={{ marginLeft: "16px" }}>
            <Switch
              checked={item.required}
              onChange={() => handleRequired(item.id)}
            />
          </Form.Item>
        </Row>
      </Card>
    </Fragment>
  );
};

export default TextAreaInput;
