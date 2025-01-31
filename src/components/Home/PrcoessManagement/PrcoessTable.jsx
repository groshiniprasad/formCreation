import React, { useContext, useMemo, useState, useCallback } from "react";
import { Table, Card, Tag, Tooltip, Button, Modal } from "antd";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { ProcessContext } from "../../../context/processStageContext";
import DynamicFormModal from "../DynamicFormModal";

const TableComponent = () => {
  const { processValues } = useContext(ProcessContext);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  const data = useMemo(() => processValues.length
    ? processValues
    : [
        {
          process: "Sample Process",
          failureMode: ["Mode1", "Mode2"],
          effects: ["Effect1", "Effect2"],
          causes: ["Cause1", "Cause2", "Cause3"],
          controls: [
            { type: "Control1", value: "Control1" },
            { type: "Control2", value: "Control2" },
          ],
          actions: ["Action1", "Action2"],
        },
        {
          process: "Another Process",
          failureMode: ["ModeA", "ModeB"],
          effects: ["EffectA"],
          causes: ["CauseA", "CauseB"],
          controls: [
            { type: "ControlA", value: "ControlA" },
            { type: "ControlB", value: "ControlB" },
            { type: "RadioButton", value: "RadioButton" },
          ],
          actions: ["ActionA"],
        },
      ], [processValues]);

  const handleExportFullTable = useCallback(() => {
    let mergeRanges = [];

    let rows = [];
    let rowStart = 1;

    data.forEach((item) => {
      const maxRows = Math.max(
        item.failureMode.length || 1,
        item.effects.length || 1,
        item.causes.length || 1,
        item.controls.length || 1,
        item.actions.length || 1
      );

      for (let i = 0; i < maxRows; i++) {
        rows.push([
          i === 0 ? item.process : "", // Merge Process Step
          item.failureMode[i] || "",
          item.effects[i] || "",
          item.causes[i] || "",
          item.controls[i] || "",
          item.actions[i] || "",
        ]);
      }

      if (maxRows > 1) {
        mergeRanges.push([rowStart + 1, rowStart + maxRows]);
      }
      rowStart += maxRows;
    });

    setExcelData(rows);
    setIsExcelModalOpen(true); // Open Modal with Data Preview
  }, [data]);

  const downloadExcelFile = useCallback(() => {
    if (!excelData.length) return;

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Process Data");

    XLSX.writeFile(workbook, "Process_Failure_Analysis.xlsx");
    setIsExcelModalOpen(false); // Close modal after download
  }, [excelData]);

  const columns = useMemo(() => [
    { title: "Process", dataIndex: "process", key: "process" },
    {
      title: "Failure Mode",
      dataIndex: "failureMode",
      key: "failureMode",
      render: (items) => (items?.length ? items.join(", ") : "-"),
    },
    {
      title: "Effects",
      dataIndex: "effects",
      key: "effects",
      render: (items) => (
        <>
          {items?.map((item, index) => (
            <Tag color="blue" key={index}>
              {item}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Causes",
      dataIndex: "causes",
      key: "causes",
      render: (items) => (
        <Tooltip title={items?.join(", ")}>
          {items?.slice(0, 2).join(", ")}
          {items?.length > 2 ? "..." : ""}
        </Tooltip>
      ),
    },
    {
      title: "Controls",
      dataIndex: "controls",
      key: "controls",
      render: (items) => (
        <>
          {items?.map((item, index) => (
            <Tag color="green" key={index}>
              {item.type}: {item.value}
            </Tag>
          ))}
        </>
      ),
    },
  ], []);

  const showFormModal = () => {
    setIsFormModalVisible(true);
  };

  const updateTableData = (values) => {
    // Implement the logic to update the table data with the new values
    console.log("Updating table data with values:", values);
  };


  const handleFormSubmit = (values) => {
    updateTableData(values);
  };

  return (
    <Card
      title="Process Failure Analysis"
      style={{ marginTop: 20 }}
      extra={
        <>
         
          <Button type="primary" style={{ marginRight: 10 }} onClick={handleExportFullTable}>
            Generate Excel
          </Button>
          <Button onClick={showFormModal}>Add Process Types</Button>
        </>
      }
    >
      <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
        {/* Modal with Dynamic Form */}
        <DynamicFormModal
        isVisible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        onSubmit={handleFormSubmit}
        formInfo={processValues ? processValues[0] : []}

      />

      {/*  Modal with Handsontable Excel Grid Before Download */}
      <Modal
        title="Excel File Preview"
        open={isExcelModalOpen}
        onCancel={() => setIsExcelModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsExcelModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="download" type="primary" onClick={downloadExcelFile}>
            Download Excel
          </Button>,
        ]}
        width={800}
      >
        {excelData.length > 0 ? (
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
        ) : (
          <p>No Excel Data Available</p>
        )}
      </Modal>
    </Card>
  );
};

export default TableComponent;
