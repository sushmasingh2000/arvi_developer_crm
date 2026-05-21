import React from "react";
import CustomTable from "../../../Shared/CustomTable";

const ReportTable = ({ data, isLoading }) => {

  const tableHead = [
    "S.No.",
    // "Employee",
    "Leads",
    "Success",
    "Rejected",
    "Turnover"
  ];

  const tableRow = (data || []).map((item, i) => [
    i + 1,
    // item.employee_name || `Emp-${item.assigned_employee_id}`, // fallback
    item.total_leads || 0,
    <span className="text-green-600 font-medium">
      {item.success || 0}
    </span>,
    <span className="text-red-600 font-medium">
      {item.rejected || 0}
    </span>,
    <span className="font-semibold">
      ₹ {item.turnover || 0}
    </span>,
  ]);

  return (
    <div className="mt-6">
      <CustomTable
        tablehead={tableHead}
        tablerow={tableRow}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReportTable;