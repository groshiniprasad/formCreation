import React, { useState } from 'react';
import { Modal, Form, Button } from 'antd';
import DynamicForm from '../Common/DynamicBuilder';

const sampleData = {
  data: [
    {
      id: "a05edc98-bd4e-d566-e048-6b6280ae548d",
      value: "Process Step",
      type: "text",
      required: false
    },
    {
      id: "1b4a0623-c938-d3d5-6664-7c86efe49ada",
      value: "Takes in Input",
      type: "radio",
      required: false,
      options: [
        { id: "57179886-89c6-0edc-6f7a-5ed73ae43de4", value: "fried" },
        { id: "b011c4b2-6105-7946-ddb9-b34841624581", value: "sss" },
        { id: "709d8aac-8a91-26dc-2812-38a1a464eeb3", value: "ddd" }
      ]
    },
    {
      id: "cc4e9fdc-3ab6-997c-f657-d17a635e400d",
      value: "Next step",
      type: "textarea",
      required: true
    }
  ],
  title: "Stage Form",
  description: ""
};

const DynamicFormModal = ({ isVisible, onClose, onSubmit, formInfo }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values) => {
    onSubmit(values);
    onClose();
  };
  const data = formInfo ? formInfo?.data : sampleData;

  return (
    <Modal
      title={formInfo?.title || "Form"}
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Submit"
    >
      <DynamicForm form={form} onFinish={handleFinish} formInfo={data} />
    </Modal>
  );
};

export default DynamicFormModal;