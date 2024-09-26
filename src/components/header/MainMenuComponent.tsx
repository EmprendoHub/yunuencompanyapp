import React from "react";
import MobileMenuComponent from "./MobileMenuComponent";

const MainMenuComponent = ({ className }: { className: string }) => {
  return (
    <nav className={`${className} menu-class bg-orange-700`}>
      {/*Mobile Navigation*/}
      <MobileMenuComponent />
    </nav>
  );
};

export default MainMenuComponent;
