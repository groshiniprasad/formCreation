import React, { createContext, useState } from "react";

export const ProcessContext = createContext();

export const ProcessProvider = ({ children }) => {
  const [processValues, setProcessValues] = useState([]);
  const [tableData, setTableData] = useState(null);

  const updateProcessValues = (newValues) => {
    if (!Array.isArray(newValues)) {
      newValues = [newValues];
    }
    setProcessValues((prevValues) => [
      ...prevValues,
      ...newValues,
    ]);
  };

  const updateTableData = (newValues) => {
    if (!Array.isArray(newValues)) {
      newValues = [newValues];
    }
    setTableData((prevValues) => [
      ...prevValues,
      ...newValues,
    ]);
  };

  const contextValue = React.useMemo(() => ({
    processValues,
    updateProcessValues,
    tableData,
    updateTableData,
  }), [processValues, tableData, updateTableData]);

  return (
    <ProcessContext.Provider value={contextValue}>
      {children}
    </ProcessContext.Provider>
  );
};
