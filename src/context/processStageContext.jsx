import React, { createContext, useState } from "react";

export const ProcessContext = createContext();

export const ProcessProvider = ({ children }) => {
  const [processValues, setProcessValues] = useState([]);


  const updateProcessValues = (newValues) => {
    setProcessValues((prevValues) => [
      ...prevValues,
      ...newValues,
    ]);
  };
  const contextValue = React.useMemo(() => ({
    processValues,
    updateProcessValues,
  }), [processValues]);

  return (
    <ProcessContext.Provider value={contextValue}>
      {children}
    </ProcessContext.Provider>
  );
};