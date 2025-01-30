import React, { useContext, useMemo, useState, useCallback, useEffect } from "react";
import { Table, Card, Tag, Tooltip, Dropdown, Menu, Button, Modal } from "antd";
import { DownOutlined, DashOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { ProcessContext } from "../../../context/processStageContext";
import { debounce } from "lodash";
import DynamicFormModal from "../DynamicFormModal";

const sampleData = [
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
];

const processActions = [
  { label: "View", func: (row) => handleExportRow(row) },
  { label: "Download", func: () => console.log("Download") },
  { label: "Delete", func: () => console.log("Delete") },
];

const TableComponent = () => {
  const { processValues, updateProcessValues, updateTableData  } = useContext(ProcessContext);
  const [state, setState] = useState({
    selectedRow: null,
    excelData: [],
    isModalOpen: false,
    excelBlob: null,
  });
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  const data = processValues.length ? processValues : sampleData;

  const handleExportRow = useCallback(
    debounce((rowData) => {
      setState((prevState) => ({ ...prevState, selectedRow: rowData }));

      // Convert rowData to a worksheet
      const worksheet = XLSX.utils.json_to_sheet([rowData]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Generate Excel file as a Blob
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const fileBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

      // Read the file to display in modal
      const reader = new FileReader();
      reader.readAsArrayBuffer(fileBlob);
      reader.onload = (e) => {
        const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setState((prevState) => ({
          ...prevState,
          excelData: jsonData,
          isModalOpen: true,
          excelBlob: fileBlob,
        }));
      };

      // Clean up the object URL to prevent memory leaks
      const url = window.URL.createObjectURL(fileBlob);
      window.URL.revokeObjectURL(url);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      // Cleanup function to revoke object URLs if any
      if (state.selectedRow) {
        const url = window.URL.createObjectURL(new Blob());
        window.URL.revokeObjectURL(url);
      }
    };
  }, [state.selectedRow]);

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const memoizedData = useMemo(
    () =>
      data.map((item, index) => ({
        key: index,
        ...item,
        columnActions: processActions,
      })),
    [data]
  );

  const memoizedHotTable = useMemo(
    () => (
      <HotTable
        data={state.excelData}
        colHeaders={["Process / Process Step", "Potential Failure Mode", "Potential Failure Effects", "Potential Causes", "Current Controls", "Actions Recommended"]}
        rowHeaders={true}
        width="100%"
        height="300"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        contextMenu={true}
      />
    ),
    [state.excelData]
  );

  const downloadExcelFile = () => {
    if (!state.excelBlob) return;

    const url = window.URL.createObjectURL(state.excelBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Process_Failure_Analysis.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    setState((prevState) => ({ ...prevState, isModalOpen: false }));
  };

  const showFormModal = () => {
    setIsFormModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    updateTableData(values);
  };

  return (
    <Card title="Process Failure Analysis" style={{ marginTop: 20 }} extra={<><Button type="primary" style={{ marginRight: 10}} onClick={handleExportRow}>Generate Excel</Button><Button onClick={showFormModal}>Add Process Types</Button></>}>
      <Table dataSource={memoizedData} columns={columns} pagination={{ pageSize: 5 }} />

      {/* Modal with Handsontable Excel Grid */}
      <Modal title="Excel File Preview" open={state.isModalOpen} onCancel={() => setState((prevState) => ({ ...prevState, isModalOpen: false }))} footer={null} width={800}>
        {state.excelData.length > 0 ? (
          <>
            {memoizedHotTable}
            <Button type="primary" style={{ marginTop: 16 }} onClick={downloadExcelFile}>Download Excel</Button>
          </>
        ) : (
          <p>No Excel Data Available</p>
        )}
      </Modal>

      {/* Modal with Dynamic Form */}
      <DynamicFormModal
        isVisible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        onSubmit={handleFormSubmit}
      />
    </Card>
  );
};

export default TableComponent;