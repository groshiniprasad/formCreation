import { useState, useCallback, useContext } from "react";
import {  Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FormComponent from "../Common/FormBuilder";
import { ProcessContext } from "../../context/processStageContext";


const GenericFormBuilder = () => {
  const { updateProcessValues } = useContext(ProcessContext);

  // Modal Visibility State
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle form submission
  const handleSubmit = useCallback(
    (values) => {
      console.log("Form Submitted:", values.title, values);
      updateProcessValues(values);
      setIsModalVisible(false); 
    },
    [ updateProcessValues]
  );

  return (
    <div style={{ textAlign: "right", marginTop: 20 }}>
      {/* Open Modal */}
      <Button 
        type="primary" 
        onClick={() => setIsModalVisible(true)} 
        icon={<PlusOutlined />} 
        aria-label="Create Generic Form"
      >
        Create Form 
      </Button>

      {/* Full-Sized Modal */}
      <Modal
        title="Genric Form Creation "
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000} // Adjust modal size
        className="custom-modal"
      >
        <FormComponent onDataChange={handleSubmit} />
      </Modal>
    </div>
  );
};

export default GenericFormBuilder;
