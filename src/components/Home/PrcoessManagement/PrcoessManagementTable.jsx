// src/features/home/components/FormTable.jsx
import { Table, Button } from "antd";
import PropTypes from "prop-types";
import { useFormContext } from "../../../context/processStageContext";

const FormTable = ({ onEdit }) => {
    const { forms, deleteForm } = useFormContext();

  const columns = [
    {
      title: "Form ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Values",
      dataIndex: "values",
      key: "values",
      render: (_, record) => JSON.stringify(record, null, 2), // Render dynamic values
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button type="link" onClick={() => deleteForm(record.id)} danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return <Table dataSource={forms} columns={columns} rowKey="id" />;
};
FormTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

export default FormTable;
