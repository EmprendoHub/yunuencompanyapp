import React from "react";

const CommissionMonitor = ({ data }: { data: any }) => {
  return (
    <div className="mt-8 p-4 border border-gray-300 rounded">
      <h2 className="text-lg font-semibold mb-4">Commission Monitor</h2>
      <ul>
        {data?.map((commission: any, index: number) => (
          <li key={index} className="mb-2">
            <span className="text-gray-600">{commission.date}</span> - $
            {commission.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommissionMonitor;
