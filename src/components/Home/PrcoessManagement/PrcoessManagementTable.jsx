import React, { useContext, useState, useMemo } from "react";
import { Table, Card, Button, Modal, Tag, Tooltip } from "antd";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { ProcessContext } from "../../../context/processStageContext";

const sampleData = [
  {
    process: "Sample Process",
    failureMode: ["Mode1", "Mode2"],
    effects: ["Effect1", "Effect2"],
    causes: ["Cause1", "Cause2", "Cause3"],
    controls: ["Control1", "Control2"],
    actions: ["Action1", "Action2"],
  },
  {
    process: "Another Process",
    failureMode: ["ModeA", "ModeB"],
    effects: ["EffectA"],
    causes: ["CauseA", "CauseB"],
    controls: ["ControlA"],
    actions: ["ActionA"],
  },
];

const TableComponent = () => {
  const { processValues } = useContext(ProcessContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [excelBlob, setExcelBlob] = useState(null);

  let data = processValues.length ? processValues : sampleData;

  const columns = useMemo(() => [
    { title: "Process", dataIndex: "process", key: "process" },
    {
      title: "Failure Mode",
      dataIndex: "failureMode",
      key: "failureMode",
      render: (items) => (items?.length ? items.join(", ") : "-"), // Comma-Separated
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
      render: (items) => (items?.length ? items.join(", ") : "-"),
    },
    {
      title: "Actions",
      dataIndex: "columnActions",
      key: "columnActions",
      render: (actions, row) => (
        actions && (
          <Dropdown
            overlay={
              <Menu>
                {actions?.map(({ label, func }, index) => (
                  <Menu.Item key={index} onClick={() => func(row)}>
                    {label}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              Actions <DashOutlined />
            </Button>
          </Dropdown>
        )
      ),
    },
  ], []);

  const memoizedData = useMemo(() => data?.map((item, index) => ({
    key: index,
    ...item,
  })), [data]);


  const handleExportRow = () => {
    const formData = processValues.length ? processValues : sampleData;
    let rows = [];
    let mergeRanges = [];
    let rowStart = 1;

    formData.forEach((item) => {
      const maxRows = Math.max(
        item.failureMode?.length || 1,
        item.effects?.length || 1,
        item.causes?.length || 1,
        item.controls?.length || 1,
        item.actions?.length || 1
      );

      for (let i = 0; i < maxRows; i++) {
        rows.push([
          i === 0 ? item?.process ?? "" : "", 
          item?.failureMode?.[i] ?? "",
          item?.effects?.[i] ?? "",
          item?.causes?.[i] ?? "",
          item?.controls?.[i]?.value ?? "", 
          item?.actions?.[i] ?? "",
        ]);
      }

      if (maxRows > 1) {
        mergeRanges.push([rowStart + 1, rowStart + maxRows]);
      }
      rowStart += maxRows;
    });

    const ws = XLSX.utils.aoa_to_sheet([
      ["Process / Process Step", "Potential Failure Mode", "Potential Failure Effects", "Potential Causes", "Current Controls", "Actions Recommended"], // Headers
      ...rows, // Data
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failure Analysis");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    setExcelData(rows); // Store table preview data
    setExcelBlob(blob); // Store file for download
    setIsModalOpen(true); // Show modal
  };

  

  const downloadExcelFile = () => {
    if (!excelBlob) return;

    const url = window.URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Process_Failure_Analysis.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setIsModalOpen(false);
  };
  const memoizedHotTable = useMemo(
    () => (
      <HotTable
        data={excelData}
        colHeaders={["Process / Process Step", "Potential Failure Mode", "Potential Failure Effects", "Potential Causes", "Current Controls", "Actions Recommended"]}
        rowHeaders={true}
        width="100%"
        height="300"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        contextMenu={true}
      />
    ),
    [excelData]
  );

  return (
    <Card title="Process Failure Analysis" style={{ marginTop: 20 }} extra={<Button type="primary" onClick={handleExportRow}>Generate Excel</Button>}>
      <Table dataSource={memoizedData} columns={columns} pagination={{ pageSize: 5 }} />

      {/* Modal with Handsontable Excel Grid */}
      <Modal title="Excel File Preview" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={800}>
        {excelData.length > 0 ? (
          <>
            {memoizedHotTable}
            <Button type="primary" style={{ marginTop: 16 }} onClick={downloadExcelFile}>Download Excel</Button>
          </>
        ) : (
          <p>No Excel Data Available</p>
        )}
      </Modal>
    </Card>
  );
};

export default TableComponent;
