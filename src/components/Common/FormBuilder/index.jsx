import { Fragment, useState } from "react";
import uuid from "react-uuid";
import Nestable from "react-nestable";
import { Button, Row, Col, Tooltip, Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

// Form Elements
import {
  TextFieldInput,
  TextArea,
  NumberInput,
  RadioInput,
  DateInput,
  TimeInput,
  DropDownInput
} from "./elements";
import Layout from "./elements/layout";
import { formEl } from "./constants.js";

// Components
import Header from "./Header";

const FormBuilder = ({ onDataChange }) => {
  const initVal = formEl[0]?.value;

  // State
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState("text");

  const items = data;

  // Function to add new element
  const addElement = () => {
    const newElement = {
      id: uuid(),
      value: null,
      type: formData,
      required: false,
    };
    setData((prevState) => [...prevState, newElement]);
    setFormData(initVal);
  };

  // Function to delete element
  const deleteEl = (id) => {
    setData((prevState) => prevState.filter((val) => val.id !== id));
  };

  // Function to duplicate element
  const duplicateElement = (elId, elType) => {
    let elIdx = data.findIndex((el) => el.id === elId);
    let newEl = {
      id: uuid(),
      value: null,
      type: elType,
      required: false,
    };
    let newArr = [...data.slice(0, elIdx + 1), newEl, ...data.slice(elIdx + 1)];
    setData(newArr);
  };

  // Function to handle sorting of elements
  const handleOnChangeSort = ({ items }) => {
    setData(items);
  };

  // Function to Handle Input Values
  const handleValue = (id, value) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === id ? { ...el, value } : el
      )
    );
  };

  // Function to Handle Required
  const handleRequired = (id) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === id ? { ...el, required: !el.required } : el
      )
    );
  };

  // Function to Handle Element Type
  const handleElType = (id, type) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === id ? { ...el, type } : el
      )
    );
  };

  // Function to Handle Options
  const addOption = (id, newOption) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === id ? { ...el, options: [...(el.options || []), newOption] } : el
      )
    );
  };

  // Function to Handle Date
  const handleDate = (id, dateVal) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === id ? { ...el, date: dateVal } : el
      )
    );
  };

  // Function to Handle Time
  const handleTime = (id, timeVal) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === id ? { ...el, time: timeVal } : el
      )
    );
  };

  // Function to Change Option Values
  const handleOptionValues = (elId, optionId, optionVal) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === elId
          ? {
              ...el,
              options: el.options?.map((opt) =>
                opt.id === optionId ? { ...opt, value: optionVal } : opt
              ),
            }
          : el
      )
    );
  };

  // Function to Delete Option
  const deleteOption = (elId, optionId) => {
    setData((prevState) =>
      prevState.map((el) =>
        el.id === elId
          ? { ...el, options: el.options?.filter((opt) => opt.id !== optionId) }
          : el
      )
    );
  };

  // Render form elements
  const renderElements = ({ item }) => {
    switch (item.type) {
      case "text":
        return <TextFieldInput {...{ item, handleValue, deleteEl, handleRequired, handleElType, duplicateElement }} />;
      case "textarea":
        return <TextArea {...{ item, handleValue, deleteEl, handleRequired, handleElType, duplicateElement }} />;
      case "number":
        return <NumberInput {...{ item, handleValue, deleteEl, handleRequired, handleElType, duplicateElement }} />;
      case "radio":
        return <RadioInput {...{ item, handleValue, deleteEl, handleRequired, handleElType, addOption, handleOptionValues, deleteOption, duplicateElement }} />;
      case "date":
        return <DateInput {...{ item, handleValue, deleteEl, handleRequired, handleElType, handleDate, duplicateElement }} />;
      case "time":
        return <TimeInput {...{ item, handleValue, deleteEl, handleRequired, handleElType, handleTime, duplicateElement }} />;
      case "dropdown":
        return <DropDownInput {...{ item, handleValue, deleteEl, handleRequired, handleElType, addOption, handleOptionValues, deleteOption, duplicateElement }} />;
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log("Submitting Form Data:", data);
    onDataChange({  data, title, description }); // Send data to the parent only once on submit
    setData([]); // Clear form data
    setDescription(""); // Clear description
  };

  return (
    <Fragment>
    
        
        <Tooltip title="Add Element">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusCircleOutlined />}
            onClick={addElement}
            style={{ position: "absolute", right: 10 }}
          />
        </Tooltip>
        <Row  justify="center">
          <Col span={24}>
            <Header {...{ title, setTitle, description, setDescription }} />
            <Nestable items={items} renderItem={renderElements} maxDepth={1} onChange={handleOnChangeSort} />
          </Col>
          <Button 
            type="primary" 
            onClick={handleSubmit} 
            style={{ marginTop: "16px", width: "100%" }}>
            Submit Form
          </Button>
        </Row>
       
      </Fragment>
  );
};

export default FormBuilder;
