export const dynamic = "force-dynamic";

import React from "react";
import { generateReports, getAllPOSBranches } from "@/app/_actions";
import FilterOrdersComponent from "@/components/orders/FilterOrdersComponent";

const ReportsPage = async ({ searchParams }: { searchParams: any }) => {
  try {
    const dataString = await generateReports(searchParams);
    const branchData = await getAllPOSBranches();

    return (
      <div>
        <FilterOrdersComponent
          dataString={dataString}
          branchData={branchData}
        />
      </div>
    );
  } catch (error) {
    console.error("Error generating reports:", error);
    return (
      <div>
        <h1>Error generating reports</h1>
        <p>
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }
};

export default ReportsPage;
