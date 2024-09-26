import React from "react";

const ClickTracker = ({ data }: { data: any }) => {
  return (
    <div className="mt-8 p-4 border border-gray-300 rounded">
      <h2 className="text-lg font-semibold mb-4">Click Tracker</h2>
      <ul>
        {data?.map((click: any, index: number) => (
          <li key={index} className="mb-2">
            <span className="text-gray-600">{click.timestamp}</span> -{" "}
            {click.eventType}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClickTracker;
