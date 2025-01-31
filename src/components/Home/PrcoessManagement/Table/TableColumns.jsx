import { Select, Tag, Tooltip } from "antd";

export const columnsDefined = [
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
          <Tag color="blue" key={index}>{item}</Tag>
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
          <Tag color="green" key={index}>{item.type}: {item.value}</Tag>
        ))}
      </>
    ),
  },
];


export const generateColumns = (data) => {
  if (!data || data.length === 0) return [];

  const sampleRow = data[0]; // Use first row to extract keys
  const columns = Object.keys(sampleRow).map((key) => ({
    title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
    dataIndex: key,
    key: key,
    render: (value, row) => {
      if (key === "type") {
        // Render based on type field
        switch (row.type) {
          case "dropdown":
            return (
              <Select style={{ width: "100%" }} defaultValue={row.value}>
                {row.options?.map((option) => (
                  <Select.Option key={option.id} value={option.value}>
                    {option.value}
                  </Select.Option>
                ))}
              </Select>
            );
          case "radio":
            return (
              <>
                {row.options?.map((option) => (
                  <Tag color="blue" key={option.id}>
                    {option.value}
                  </Tag>
                ))}
              </>
            );
          case "textarea":
            return <Tooltip title={row.value}>{row.value}</Tooltip>;
          default:
            return row.value || "-";
        }
      }
      return value || "-"; // Handle empty values
    },
  }));

  return columns;
};
