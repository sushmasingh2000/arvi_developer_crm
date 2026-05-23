import React, { useEffect, useState } from "react";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import Filters from "./Components/Filters";
import ReportCard from "./Components/ReportCard";
import ReportTable from "./Components/ReportTable";

const tableHeadStyle =
  "px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide border-b";

const tableCellStyle =
  "px-4 py-3 border-b text-sm";

const DetailTable = ({ data }) => {
  return (
    <div
      className="mt-8 rounded-2xl border overflow-hidden"
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
          Client Details
        </h2>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[700px]">
          <thead
            style={{
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <tr>
              <th
                className={tableHeadStyle}
                style={{
                  color: "var(--primary)",
                }}
              >
                S.No.
              </th>

              <th
                className={tableHeadStyle}
                style={{
                  color: "var(--primary)",
                }}
              >
                Client
              </th>

              <th
                className={tableHeadStyle}
                style={{
                  color: "var(--primary)",
                }}
              >
                Project
              </th>

              <th
                className={tableHeadStyle}
                style={{
                  color: "var(--primary)",
                }}
              >
                Status
              </th>

              <th
                className={tableHeadStyle}
                style={{
                  color: "var(--primary)",
                }}
              >
                Payment
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderColor: "var(--border)",
                  }}
                  className="hover:bg-white hover:bg-opacity-5 transition-all duration-200"
                >
                  <td
                    className={tableCellStyle}
                    style={{
                      color: "var(--text-main)",
                    }}
                  >
                    {index + 1}
                  </td>

                  <td
                    className={tableCellStyle}
                    style={{
                      color: "var(--text-main)",
                    }}
                  >
                    {row.client_name || "No Name"}
                  </td>

                  <td
                    className={tableCellStyle}
                    style={{
                      color: "var(--text-main)",
                    }}
                  >
                    {row.project_name}
                  </td>

                  <td className={tableCellStyle}>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background:
                          row.crm_status === "success"
                            ? "rgba(0,255,100,0.15)"
                            : row.crm_status === "rejected"
                            ? "rgba(255,0,0,0.15)"
                            : "rgba(200,144,64,0.15)",

                        color:
                          row.crm_status === "success"
                            ? "#59ff9c"
                            : row.crm_status === "rejected"
                            ? "#ff7b7b"
                            : "var(--primary)",
                      }}
                    >
                      {row.crm_status || "pending"}
                    </span>
                  </td>

                  <td
                    className={tableCellStyle}
                    style={{
                      color: "var(--text-main)",
                      fontWeight: 600,
                    }}
                  >
                    ₹{" "}
                    {Number(
                      row.total_payment || 0
                    ).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8"
                  style={{
                    color: "var(--text-muted)",
                  }}
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
  const [detailData, setDetailData] = useState([]);

  const fetchData = async () => {
    try {
      const payload = {
        month: Number(filters.month),
        year: Number(filters.year),
      };

      if (
        userRole === "admin" &&
        filters.employee_id
      ) {
        payload.employee_id =
          filters.employee_id;
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

  const fetchDetailData = async () => {
    try {
      const payload = {
        month: Number(filters.month),
        year: Number(filters.year),
      };

      if (
        userRole === "admin" &&
        filters.employee_id
      ) {
        payload.employee_id =
          filters.employee_id;
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

  const totals = data.reduce(
    (acc, curr) => {
      acc.leads += Number(curr.total_leads || 0);
      acc.success += Number(curr.success || 0);
      acc.rejected += Number(curr.rejected || 0);
      acc.turnover += Number(curr.turnover || 0);

      return acc;
    },
    {
      leads: 0,
      success: 0,
      rejected: 0,
      turnover: 0,
    }
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(20,20,20,0.95))",
      }}
    >
      <div className="mb-6">
        <h1
          className="text-3xl font-bold"
          style={{
            color: "var(--text-main)",
          }}
        >
          {userRole === "admin"
            ? "Employee Report"
            : "Monthly Report"}
        </h1>

        <p
          className="mt-1"
          style={{
            color: "var(--text-muted)",
          }}
        >
          Monthly performance and client report
        </p>
      </div>

      <Filters
        filters={filters}
        setFilters={setFilters}
        fetchData={handleSearch}
        disableEmployee={userRole !== "admin"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">

        <ReportCard
          title="Total Leads"
          value={totals.leads}
        />

        <ReportCard
          title="Success"
          value={totals.success}
        />

        <ReportCard
          title="Rejected"
          value={totals.rejected}
        />

        <ReportCard
          title="Turnover"
          value={`₹ ${Number(
            totals.turnover
          ).toLocaleString("en-IN")}`}
        />
      </div>

      {loading && (
        <div
          className="mt-6 text-center py-4 rounded-xl"
          style={{
            background:
              "rgba(255,255,255,0.03)",
            color: "var(--primary)",
            border:
              "1px solid var(--border)",
          }}
        >
          Loading Report...
        </div>
      )}

      <div className="mt-8">
        <ReportTable data={data} />
      </div>

      <DetailTable data={detailData} />
    </div>
  );
};

export default MonthlyReport;