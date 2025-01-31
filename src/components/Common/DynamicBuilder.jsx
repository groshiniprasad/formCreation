import React from 'react';
import { Form, Input, Card, Radio } from "antd";
import PropTypes from 'prop-types';

const { TextArea } = Input;

const DynamicForm = ({ form, onFinish, formInfo }) => {
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return <Input placeholder={field.value} />;
      case 'textarea':
        return <TextArea placeholder={field.value} />;
      case 'radio':
        return (
          <Radio.Group>
            {field.options.map((option) => (
              <Radio key={option.id} value={option.value}>
                {option.value}
              </Radio>
            ))}
          </Radio.Group>
        );
      default:
        return <Input placeholder={field.value} />;
    }
  };

  const renderFields = (fields) => (
    <>
      {fields?.map((field) => (
        <Card key={field.id} style={{ marginBottom: 6, padding: 0 }}>
          <Form.Item
            label={field.value}
            name={field.id}
            rules={[{ required: field.required, message: `${field.value} is required` }]}
            style={{ width: "100%" }}
          >
            {renderField(field)}
          </Form.Item>
        </Card>
      ))}
    </>
  );

  return (
    <Form
      form={form}
      name="dynamic_form"
      onFinish={onFinish}
      autoComplete="off"
    >
      {renderFields(formInfo?.data)}
    </Form>
  );
};

DynamicForm.propTypes = {
  form: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
  formInfo: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        required: PropTypes.bool,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
          })
        ),
      })
    ).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default DynamicForm;