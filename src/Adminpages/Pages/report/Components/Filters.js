import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { API_URLS } from "../../../config/APIUrls";
import { useQuery } from "react-query";
import axiosInstance from "../../../config/axios";

const Filters = ({ filters, setFilters, fetchData, disableEmployee }) => {
  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

  const { data } = useQuery(
    ["get_employee"],
    () =>
      axiosInstance.post(API_URLS.employee_list, {
        search: "",
        start_date: "",
        end_date: "",
        page: "",
        count: 1000,
      }),
    {
      keepPreviousData: true,
    }
  );

  const employees = data?.data?.data || [];
  const userRole = localStorage.getItem("type");

  return (
    <div className="flex flex-wrap gap-4 bg-white/25 backdrop-blur-md p-4 rounded-xl shadow">

      {/* Month */}
      <TextField
        select
        size="small"
        label="Month"
        value={filters.month}
        onChange={(e) =>
          setFilters({ ...filters, month: e.target.value })
        }
        className="w-40  rounded"
      >
        <MenuItem value="">Select Month</MenuItem>
        {months.map((m) => (
          <MenuItem key={m.value} value={m.value}>
            {m.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Year */}
      <TextField
        select
        size="small"
        label="Year"
        value={filters.year}
        onChange={(e) =>
          setFilters({ ...filters, year: e.target.value })
        }
        className="w-40  rounded"
      >
        <MenuItem value="">Select Year</MenuItem>
        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      {/* Employee Dropdown */}
      {userRole === "admin" &&
        <TextField
          select
          size="small"
          label="Employee"
          value={filters.employee_id}
          disabled={disableEmployee}
          onChange={(e) =>
            setFilters({ ...filters, employee_id: e.target.value })
          }
          className="w-56  rounded"
        >
          <MenuItem value="">All Employees</MenuItem>

          {employees?.filter?.((i) => i?.role === "employee")?.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              {emp.name}
              {/* ({emp.mobile}) */}
            </MenuItem>
          ))}
        </TextField>
      }

      {/* Button */}
      <button
        onClick={fetchData}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        Apply
      </button>

    </div>
  );
};

export default Filters;
