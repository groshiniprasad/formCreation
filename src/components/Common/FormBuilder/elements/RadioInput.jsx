import { Fragment } from "react";
import uuid from "react-uuid";
// Ant Design Components
import { Button, Divider, Tooltip, Switch, Card, Input, Form, Row, Col, Select, Radio } from "antd";
// Icons
import { DeleteOutlined, DragOutlined, CopyOutlined } from "@ant-design/icons";

// Form Elements
import { formEl } from "../constants";

const RadioInput = ({
  item,
  handleValue,
  deleteEl,
  handleRequired,
  handleElType,
  addOption,
  handleOptionValues,
  deleteOption,
  duplicateElement
}) => {

  // Create new option
  const createNewOption = (id) => {
    const data = {
      id: uuid(),
      value: "",
    };
    addOption(id, data);
  };

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
              placeholder="Radio Label"
              style={{ marginBottom: "8px" }}
            />
            <Radio.Group>
              {item.options?.map((opt, key) => (
                <Row key={opt.id} align="middle">
                  <Col flex="auto">
                    <Input
                      placeholder={`Radio Option ${key + 1}`}
                      defaultValue={opt?.value}
                      onBlur={(e) =>
                        handleOptionValues(item?.id, opt?.id, e.target.value)
                      }
                    />
                  </Col>
                  <Col>
                    <Tooltip title="Delete Option">
                      <Button
                        onClick={() => deleteOption(item.id, opt?.id)}
                        icon={<DeleteOutlined />}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              ))}
            </Radio.Group>
            <Button type="text" onClick={() => createNewOption(item.id)}>
              Add Option
            </Button>
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
            <Switch checked={item.required} onChange={() => handleRequired(item.id)} />
          </Form.Item>
        </Row>
      </Card>
    </Fragment>
  );
};

export default RadioInput;
