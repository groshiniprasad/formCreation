import React, { useContext, useMemo } from "react";
import { Table, Card, Tag, Tooltip, Dropdown, Menu, Button } from "antd";
import { DownOutlined, DashOutlined  } from "@ant-design/icons";
import { ProcessContext } from "../../../context/processStageContext";

const sampleData = [
  // Sample data structure
  {
    process: "Sample Process",
    failureMode: ["Mode1", "Mode2"],
    effects: ["Effect1", "Effect2"],
    causes: ["Cause1", "Cause2", "Cause3"],
    actions: ["Action1", "Action2"],
  },
];

const processActions = ["View", "Download", "Edit"];

const TableComponent = () => {
  const { processValues } = useContext(ProcessContext);
  const data = processValues ? processValues.process_steps : sampleData;
  console.log("Data:", data);
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
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (items) => {
        return (
          items && (
            <Dropdown
              menu={{
                items: items.map((item, index) => ({
                  key: index,
                  label: item,
                })),
              }}
            >
              <Button>
                Actions <DownOutlined />
              </Button>
            </Dropdown>
          )
        );
      },    
    },
    {
      title: "Controls",
      dataIndex: "controls",
      key: "controls",
      render: (items) => {
        return (
          items && (
            <Dropdown
              menu={{
                items: items.map((item, index) => ({
                  key: index,
                  label: item,
                })),
              }}
            >
              <Button>
                Actions <DownOutlined />
              </Button>
            </Dropdown>
          )
        );
      },    
    },
    {
      title: "",
      dataIndex: "columnActions",
      key: "columnActions",
      render: (actions) => (
        actions && (
          <Dropdown
            menu={{
              items: actions.map((item, index) => ({
                key: index,
                label: item,
              })),
            }}
          >
            <Button>
            <DashOutlined />
            </Button>
          </Dropdown>
        )
      ),
    },
  ], []);

  const memoizedData = useMemo(() => data?.map((item, index) => ({
    key: index,
    ...item,
    columnActions: processActions,
  })), [data]);

  return (
    <Card title="Process Failure Analysis" style={{ marginTop: 20 }}>
      <Table
        dataSource={memoizedData}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default TableComponent;