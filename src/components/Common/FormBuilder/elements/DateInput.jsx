import { Fragment } from "react";
// Ant Design Components
import { Input, Card, Form, Switch, Divider, Button, Tooltip, Row, Select, DatePicker } from "antd";
// Icons
import { DeleteOutlined, DragOutlined, CopyOutlined } from "@ant-design/icons";

// Form Elements
import { formEl } from "../constants";
const { Option } = Select;

const DateInput = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  handleDate,
  duplicateElement,
}) => {
  return (
    <Fragment>
      <Card style={{ padding: "16px" }}>
        <div style={{ textAlign: "center" }}>
          <DragOutlined style={{ transform: "rotate(-90deg)", cursor: "grab" }} />
        </div>
        <div>
          <Row gutter={[16, 16]} align="middle">
            <Row span={16}>
              <Input
                defaultValue={item.value}
                onBlur={(e) => handleValue(item.id, e)}
                placeholder="Date Label"
                style={{ marginBottom: "8px" }}
              />
              <DatePicker
                placeholder="Select Date"
                value={item?.date}
                onChange={(newDate) => handleDate(item.id, newDate)}
                style={{ width: "100%" }}
              />
            </Row>
            <Row span={8}>
              <Form.Item label="Type">
                <Select
                  value={item.type}
                  onChange={(value) => handleElType(item.id, value)}
                >
                  {formEl &&
                    formEl.map((el, key) => (
                      <Option key={key} value={el.value}>
                        {el.label}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Row>
          </Row>
        </div>
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

export default DateInput;
