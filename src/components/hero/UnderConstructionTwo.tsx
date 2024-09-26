import React from "react";
import SquareLogo from "../logos/SquareLogo";

const UnderConstructionTwo = () => {
  return (
    <div
      className={`min-w-full min-h-screen relative flex flex-col justify-center items-center `}
    >
      <div className="flex flex-col items-center justify-center z-20 w-full">
        <SquareLogo className={"w-[250px]"} />
        <p className="text-2xl text-foreground tracking-wide">¡Muy Pronto!</p>
      </div>

      {/* overlay */}
      <div className="min-h-[100%] absolute z-[1] w-full top-0 left-0 bg-background" />
    </div>
  );
};

export default UnderConstructionTwo;
