import React from "react";
import CustomTable from "../../../Shared/CustomTable";

const ReportTable = ({ data, isLoading }) => {

  const tableHead = [
    "S.No.",
    // "Employee",
    "Leads",
    "Success",
    "Rejected",
    "Turnover",
  ];

  const tableRow = (data || []).map((item, i) => [
    <span
      style={{
        color: "var(--text-main)",
        fontWeight: 500,
      }}
    >
      {i + 1}
    </span>,

    // item.employee_name || `Emp-${item.assigned_employee_id}`,

    <span
      style={{
        color: "var(--text-main)",
        fontWeight: 500,
      }}
    >
      {item.total_leads || 0}
    </span>,

    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: "rgba(0,255,100,0.12)",
        color: "#59ff9c",
      }}
    >
      {item.success || 0}
    </span>,

    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: "rgba(255,0,0,0.12)",
        color: "#ff7b7b",
      }}
    >
      {item.rejected || 0}
    </span>,

    <span
      style={{
        color: "var(--primary)",
        fontWeight: 700,
      }}
    >
      ₹ {Number(item.turnover || 0).toLocaleString("en-IN")}
    </span>,
  ]);

  return (
    <div
      className="mt-6 rounded-2xl border overflow-hidden"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="px-5 py-4 border-b"
        style={{
          borderColor: "var(--border)",
        }}
      >
        <h2
          className="text-xl font-bold"
          style={{
            color: "var(--text-main)",
          }}
        >
          Monthly Performance
        </h2>
      </div>

      <div className="p-4">
        <CustomTable
          tablehead={tableHead}
          tablerow={tableRow}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReportTable;