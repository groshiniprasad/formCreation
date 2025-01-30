import React, { useContext, useMemo, useState } from "react";
import { Table, Card, Tag, Tooltip, Dropdown, Menu, Button, Modal } from "antd";
import { DownOutlined, DashOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
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
  
  const data = processValues.length ? processValues : sampleData;
  const processActions = [
    { label: "View", func: (row) => handleExportRow(row) },
    { label: "Download", func: () => console.log("Download") },
    { label: "Delete", func: () => console.log("Delete") },
  ];


  let rows = [];
  const handleExportRow = () => {
    const formData = processValues.length ? processValues : sampleData;

    let mergeRanges = [];

    let rowStart = 1; // Start row for merging cells

    formData.forEach((item) => {
        // Find the maximum number of rows needed for this process step
        const maxRows = Math.max(
            item.failureMode.length || 1,
            item.effects.length || 1,
            item.causes.length || 1,
            item.controls.length || 1,
            item.actions.length || 1
        );

        for (let i = 0; i < maxRows; i++) {
            rows.push({
                "Process / Process Step": i === 0 ? item.process : "", // Only keep process step in first row
                "Potential Failure Mode": item.failureMode[i] || "",
                "Potential Failure Effects": item.effects[i] || "",
                "Potential Causes": item.causes[i] || "",
                "Current Controls": item.controls[i] || "",
                "Actions Recommended": item.actions[i] || "",
            });
        }

        // Keep track of merged cell range
        if (maxRows > 1) {
            mergeRanges.push([rowStart + 1, rowStart + maxRows]); // Adjust for Excel row index (1-based)
        }
        rowStart += maxRows;
    });

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(rows, { origin: "A1" });

    // Create a workbook and append sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failure Analysis");

    // Apply merged cell formatting for process steps
    const wsRef = wb.Sheets["Failure Analysis"];
    mergeRanges.forEach(([start, end]) => {
        wsRef["!merges"] = wsRef["!merges"] || [];
        wsRef["!merges"].push({ s: { r: start, c: 0 }, e: { r: end - 1, c: 0 } }); // Merge Process Step Column (A)
    });

    // Export file
    XLSX.writeFile(wb, "Process_Failure_Analysis.xlsx");

    /*   setExcelData(jsonData); 
      setIsModalOpen(true);  */
  };

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
                {actions.map(({ label, func }, index) => (
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

  const memoizedData = useMemo(() => data.map((item, index) => ({
    key: index,
    ...item,
    columnActions: processActions,
  })), [data]);

  return (
    <Card title="Process Failure Analysis" style={{ marginTop: 20 }} extra={<><Button onClick={handleExportRow}>View</Button> <Button onClick={() => setIsModalOpen(true)}>See</Button></>}>
      <Table dataSource={memoizedData} columns={columns} pagination={{ pageSize: 5 }} />
      <Modal title="Excel Data" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={600}>
        {rows.length > 0 ? (
          <table border="1" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                {Object.keys(rows[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rows}>
                  {Object.entries(row).map(([key, value]) => (
                    <td key={`${rowIndex}-${key}`}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Excel Data Available</p>
        )}
      </Modal>
    </Card>
  );
};

export default TableComponent;