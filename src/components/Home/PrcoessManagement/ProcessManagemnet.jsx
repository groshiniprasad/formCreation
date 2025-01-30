import AddPrcessManagement from "../GenericFormModal";
 import { ProcessProvider } from "../../../context/processStageContext";
 import  ProcessManagementTable from "./PrcoessManagementTable";

const ProcessManagement = () => {
  return (
      <ProcessProvider>
        <AddPrcessManagement />
        <ProcessManagementTable />
      </ProcessProvider>
  );
};

export default ProcessManagement;