import React from "react";
import FilterOrdersComponent from "../orders/FilterOrdersComponent";

const ReportsComponent = ({
  data,
  itemCount,
}: {
  data: any;
  itemCount: any;
}) => {
  return (
    <div>
      <FilterOrdersComponent data={data} itemCount={itemCount} />
    </div>
  );
};

export default ReportsComponent;
