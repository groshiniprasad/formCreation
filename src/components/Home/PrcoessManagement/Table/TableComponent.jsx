import React, { useContext, useState, useMemo } from "react";
import { Table, Card, Button, Modal  } from "antd";
import { ProcessContext } from "../../../../context/processStageContext";
import DynamicFormModal from "../../DynamicFormModal";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { handleExportFullTable, downloadExcelFile } from "./TableUtils";
import { columnsDefined, generateColumns } from "./TableColumns";

const TableComponent = () => {
  const { processValues, updateTableData } = useContext(ProcessContext);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  const data = useMemo(() => processValues.length ? processValues : [], [processValues]);
  const addProcessData   = useMemo(() =>  processValues.length ? processValues : {}, [processValues]);
  const columns = useMemo(() => generateColumns(data), [data]); // Dynamically generate columns


  const showFormModal = () => setIsFormModalVisible(true);

  const handleFormSubmit = (values) => {
    updateTableData([...processValues, values]);
    setIsFormModalVisible(false);
  };

  return (
    <Card
      title="Process Failure Analysis"
      style={{ marginTop: 20 }}
      extra={
        <>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => handleExportFullTable(data, setExcelData, setIsExcelModalOpen)}>
            Generate Excel
          </Button>
          <Button onClick={showFormModal}>Add Process Types</Button>
        </>
      }
    >
      <Table dataSource={data} columns={columnsDefined} pagination={{ pageSize: 5 }} />

      {/* Add Process Form Modal */}
      <DynamicFormModal isVisible={isFormModalVisible} onClose={() => setIsFormModalVisible(false)} onSubmit={handleFormSubmit} formInfo={addProcessData} />

      {/* Excel Preview Modal */}
      {isExcelModalOpen && (
        <Modal
          title="Excel File Preview"
          open={isExcelModalOpen}
          onCancel={() => setIsExcelModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsExcelModalOpen(false)}>Cancel</Button>,
            <Button key="download" type="primary" onClick={() => downloadExcelFile(excelData, setIsExcelModalOpen)}>Download Excel</Button>,
          ]}
          width={800}
        >
          <HotTable
            data={excelData.map(Object.values)}
            colHeaders={Object.keys(excelData[0])}
            rowHeaders={true}
            width="100%"
            height="300"
            stretchH="all"
            licenseKey="non-commercial-and-evaluation"
            contextMenu={true}
          />
        </Modal>
      )}
    </Card>
  );
};

export default TableComponent;
