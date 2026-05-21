import React, { useEffect, useState } from "react";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import Filters from "./Components/Filters";
import ReportCard from "./Components/ReportCard";
import ReportTable from "./Components/ReportTable";

const DetailTable = ({ data }) => {
  return (
    <div className="mt-8 bg-white bg-opacity-20 shadow rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Client Details</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 bg-opacity-20">
            <th>S.No.</th>
            {/* <th>Employee</th> */}
            <th>Client</th>
            <th>Project</th>
            <th>Status</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="text-center border-t">

              {/* <td>{row.assigned_employee_name || row.assigned_employee_id}</td> */}
              <td>{index + 1}</td>
              <td>{row.client_name || "No Name"}</td>
              <td>{row.project_name}</td>
              <td>
                <span className="px-2 py-1 rounded text-black text-sm"
                >
                  {row.crm_status || "pending"}
                </span>
              </td>
              <td>
                ₹ {Number(row.total_payment).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MonthlyReport = () => {
  const userRole = localStorage.getItem("type");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    employee_id: "",
  });

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const payload = {
        month: Number(filters.month),
        year: Number(filters.year),
      };

      // ✅ Only admin sends employee_id
      if (userRole === "admin" && filters.employee_id) {
        payload.employee_id = filters.employee_id;
      }

      const res = await axiosInstance.post(
        API_URLS?.motnhly_report,
        payload
      );

      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };


  // totals calculation
  const totals = data.reduce(
    (acc, curr) => {
      acc.leads += Number(curr.total_leads || 0);
      acc.success += Number(curr.success || 0);
      acc.rejected += Number(curr.rejected || 0);
      acc.turnover += Number(curr.turnover || 0);
      return acc;
    },
    { leads: 0, success: 0, rejected: 0, turnover: 0 }
  );

  const [detailData, setDetailData] = useState([]);

  const fetchDetailData = async () => {
    try {
      const payload = {
        month: Number(filters.month),
        year: Number(filters.year),
      };

      // ✅ Only admin sends employee_id
      if (userRole === "admin" && filters.employee_id) {
        payload.employee_id = filters.employee_id;
      }

      const res = await axiosInstance.post(
        API_URLS?.employee_client_details,
        payload
      );

      setDetailData(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    await fetchData();
    await fetchDetailData();
    setLoading(false);
  };

  useEffect(() => {
  if (userRole !== "admin") {
    handleSearch();
  }
}, []);

  return (

    <div className="p-6 bg-gray-100 bg-opacity-25 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">
        {userRole=== "admin" && 
        "Employee"} Report
      </h1>

      <Filters
        filters={filters}
        setFilters={setFilters}
        fetchData={handleSearch}
        disableEmployee={userRole !== "admin"} // ✅ only admin can use it
      />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <ReportCard title="Total Leads" value={totals.leads} />
        <ReportCard title="Success" value={totals.success} />
        <ReportCard title="Rejected" value={totals.rejected} />
        <ReportCard title="Turnover" value={`₹ ${totals.turnover}`} />
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      <ReportTable data={data} />
      <DetailTable data={detailData} />

    </div>
  );
};

export default MonthlyReport;