import React from "react";
import FilterOrdersComponent from "../orders/FilterOrdersComponent";
import { getAllPOSBranches } from "@/app/_actions";

const ReportsComponent = async ({
  data,
  itemCount,
}: {
  data: any;
  itemCount: any;
}) => {
  const branchData = await getAllPOSBranches();
  const branches = JSON.parse(branchData.branches);
  const allBranches: any = { _id: 0, name: "Todas" };
  branches.unshift(allBranches);
  return (
    <div>
      <FilterOrdersComponent
        data={data}
        itemCount={itemCount}
        branches={branches}
      />
    </div>
  );
};

export default ReportsComponent;
