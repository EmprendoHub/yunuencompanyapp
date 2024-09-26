import { Search } from "lucide-react";
import React from "react";

const SearchSection = ({ onSearchInput }: any) => {
  return (
    <div className="m-2 p-10 bg-gradient-to-br from-purple-700 via-purple-600 to-teal-600 flex flex-col items-center justify-center text-white rounded-xl">
      <h2 className=" text-3xl font-bold">Browse all templates</h2>
      <p>What would you like to create today?</p>
      <div className="w-full flex justify-center items-center">
        <div className="flex gap-2 items-center p-2 border rounded-[10px] bg-background my-5 w-[50%]">
          <Search className="text-primary" />
          <input
            type="text"
            placeholder="buscar..."
            onChange={(event) => onSearchInput(event.target.value)}
            className="bg-transparent w-full outline-none text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
