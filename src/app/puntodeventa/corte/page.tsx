import { getEndOfDayReport } from "@/app/_actions";
import React from "react";
import CorteComponent from "@/components/reports/CorteComponent";

const CortePage = async ({ searchParams }: { searchParams: any }) => {
  const urlParams = {
    paid: searchParams.paid,
    branch: searchParams.branch,
    "createdAt[lte]": searchParams.max,
    "createdAt[gte]": searchParams.min,
  };

  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );

  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  //const data = await getAllPayments(searchQuery, currentCookies);
  const dataString = await getEndOfDayReport(searchQuery);
  const data = JSON.parse(dataString);

  const itemCount = data?.itemCount;
  return (
    <div>
      <CorteComponent data={data} itemCount={itemCount} />
    </div>
  );
};

export default CortePage;
