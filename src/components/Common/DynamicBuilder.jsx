import { Form, Input, Button, Space, Card } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';

const DynamicForm = ({ form, onFinish, formInfo }) => {
  const renderSubFields = (fieldType, key, name, removeSub, addSub, subFields) => (
    <div
      style={{
        marginBottom: 12,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <strong>{fieldType.replace(/([A-Z])/g, " $1")}</strong>
      {subFields.map(({ key: subKey, name: subName, ...restSubField }) => (
        <Space
          key={`${key}-${fieldType}-${subKey}`}
          align="baseline"
          style={{ display: "flex", width: "100%" }}
        >
          <Form.Item
            {...restSubField}
            name={[subName]}
            rules={[{ required: true, message: "Required" }]}
            dependencies={[subName]}
            style={{ flex: 1 }}
          >
            <Input placeholder={`Enter ${fieldType}`} />
          </Form.Item>
          <MinusCircleOutlined
            onClick={() => removeSub(subName)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </Space>
      ))}
      <Button
        type="dashed"
        onClick={() => addSub()}
        icon={<PlusOutlined />}
      >
        Add {fieldType.replace(/([A-Z])/g, " $1")}
      </Button>
    </div>
  );

  const renderFields = (fields, add, remove) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <Card key={key} style={{ marginBottom: 16, padding: 10 }}>
          <Space
            align="baseline"
            style={{ display: "flex", width: "100%" }}
          >
            <Form.Item
              {...restField}
              name={[name, formInfo.mainForm]}
              rules={[{ required: true, message: "Required" }]}
              style={{ width: "100%" }}
            >
              <Input placeholder="Process / Process Step" />
            </Form.Item>
            {fields.length > 1 && (
              <MinusCircleOutlined
                onClick={() => remove(name)}
                style={{ color: "red", cursor: "pointer" }}
              />
            )}
          </Space>
          {formInfo.listStages.map((fieldType) => (
            <Form.List key={fieldType} name={[name, fieldType]}>
              {(subFields, { add: addSub, remove: removeSub }) =>
                renderSubFields(fieldType, key, name, removeSub, addSub, subFields)
              }
            </Form.List>
          ))}
        </Card>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          block
          icon={<PlusOutlined />}
        >
          Add Process Step
        </Button>
      </Form.Item>
    </>
  );

  return (
    <Form
      form={form}
      name="dynamic_form"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.List name={formInfo.formListName}>
        {(fields, { add, remove }) => renderFields(fields, add, remove)}
      </Form.List>
    </Form>
  );
};

DynamicForm.propTypes = {
  form: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
  formInfo: PropTypes.object.isRequired,
};

export default DynamicForm;