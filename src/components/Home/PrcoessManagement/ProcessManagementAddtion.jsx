import { useMemo, useCallback, useContext } from "react";
import { Form, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FormComponent from "../../Common/DynamicBuilder";
import {ProcessContext } from "../../../context/processStageContext";

const formInfo = {
  formListName: "process_steps",
  listStages: ["failureMode", "effects", "causes", "controls", "actions"],
  mainForm: "process",
};

const AddPrcessManagement = () => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const { updateProcessValues } = useContext(ProcessContext);


  const handleSubmit = useCallback(
    (values) => {
      updateProcessValues(values[formInfo.formListName]);
      form.resetFields();
    },
    [form, updateProcessValues]
  );

  const memoizedForm = useMemo(
    () => <FormComponent form={form} onFinish={handleSubmit} formInfo={formInfo} />,
    [form, handleSubmit]
  );

  const handleOpenModal = () => {
    modal.confirm({
      title: "Stage Management Form",
      content: memoizedForm,
      okText: "Submit",
      cancelText: "Cancel",
      onOk: () => form.submit(),
      closable: true,
      className: "custom-modal",
      style: { maxWidth: "1200px", minWidth: "600px" },
    });
  };

  return (
    
    <div style={{ textAlign: "right", marginTop: 20 }}>
      <Button type="primary" onClick={handleOpenModal} icon={<PlusOutlined />}>
        Add Process
      </Button>
      {contextHolder}
      <p>
      </p>
    </div>
  );
};

export default AddPrcessManagement;