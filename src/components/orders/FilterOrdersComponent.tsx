"use client";
import AllOrdersFilters from "./AllOrdersFilters";
import { useState } from "react";
import AllOrders from "./AllOrders";
import { generatePaymentsExpenseReports } from "@/app/_actions";

const FilterOrdersComponent = ({
  dataString,
  branchData,
}: {
  dataString: string;
  branchData: string;
}) => {
  const [reportData, setReportData] = useState(dataString);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async (searchParams: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const newData = await generatePaymentsExpenseReports(searchParams);
      setReportData(newData);
    } catch (err) {
      console.error("Error generating report:", err);
      setError(
        "An error occurred while generating the report. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={` overflow-y-auto px-5 py-5`}>
      <AllOrdersFilters
        branchData={branchData}
        onGenerateReport={handleGenerateReport}
      />
      <AllOrders dataString={reportData} />
    </div>
  );
};

export default FilterOrdersComponent;
