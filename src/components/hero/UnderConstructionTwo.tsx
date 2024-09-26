import React from "react";
import ImageOpacityMotion from "../motions/ImageOpacityMotion";
import TextUnderConstruction from "../motions/TextUnderConstruction";
import LogoComponent from "../logos/LogoComponent";

const UnderConstructionTwo = () => {
  return (
    <div
      className={`min-w-full min-h-screen relative flex flex-col justify-center items-center `}
    >
      <div className="flex flex-col items-center justify-center z-20 w-full">
        <LogoComponent className={""} />
        <p className="text-2xl text-white tracking-widest">¡Muy Pronto!</p>
      </div>

      <div className="h-full flex flex-wrap bg-black bg-opacity-95 w-1/2 absolute bottom-0 right-0 z-0" />
      {/* overlay */}
      <div className="min-h-[100%] absolute z-[1] w-1/2 top-0 left-0 bg-red-600 bg-opacity-90" />
    </div>
  );
};

export default UnderConstructionTwo;
