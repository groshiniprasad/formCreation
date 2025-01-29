import React, { createContext, useState } from "react";

export const ProcessContext = createContext();

export const ProcessProvider = ({ children }) => {
  const [processValues, setProcessValues] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const updateProcessValues = (values) => {
    setProcessValues(values);
  };

  const showModal = (record) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setCurrentRecord(null);
    setIsModalVisible(false);
  };

  const contextValue = React.useMemo(() => ({
    processValues,
    updateProcessValues,
    isModalVisible,
    showModal,
    hideModal,
    currentRecord,
  }), [processValues, isModalVisible, currentRecord]);

  return (
    <ProcessContext.Provider value={contextValue}>
      {children}
    </ProcessContext.Provider>
  );
};
