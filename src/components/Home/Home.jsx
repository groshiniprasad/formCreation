import { useState } from "react";
import HomeLayout from "../../Layout/HomePage";
import PrcessManagement from "./PrcoessManagement/ProcessManagemnet";

const HomePage = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("processManager");

  const handleMenuSelect = (key) => {
    setActiveMenuItem(key);
  };

  // Render content dynamically based on the selected menu item
  const renderContent = () => {
    switch (activeMenuItem) {
      case "processManager":
        return   <PrcessManagement /> ;
      case "features":
        return <h1>Features Section</h1>;
      case "stats":
        return <h1>Statistics Section</h1>;
      default:
        return <h1>form Section</h1>;
    }
  };

  return (
    <HomeLayout
      activeMenuItem={activeMenuItem}
      onMenuSelect={handleMenuSelect}
    >
      {renderContent()}
    </HomeLayout>
  );
};

export default HomePage;
