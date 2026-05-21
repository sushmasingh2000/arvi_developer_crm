import React from "react";

const ReportCard = ({ title, value }) => {
  return (
    <div className="bg-white bg-opacity-50 p-4 rounded-xl shadow w-full">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default ReportCard;