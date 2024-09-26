import { Search } from "lucide-react";
import React from "react";

const DashHeader = () => {
  return (
    <div className=" p-5 shadow-sm border-b-2 flex justify-between bg-background items-center">
      <div className="flex gap-2 items-center p-2 border rounded-md max-w-lg bg-background">
        <Search />
        <input
          type="text"
          placeholder="Buscar..."
          className="outline-none text-sm"
        />
      </div>

      <div className="flex items-center justify-center gap-1">
        <h2 className=" cursor-pointer bg-primary p-1 rounded-full text-[12px] text-white px-2">
          🔥Obtén la Membresía por solo $99.99/mes
        </h2>
      </div>
    </div>
  );
};

export default DashHeader;
