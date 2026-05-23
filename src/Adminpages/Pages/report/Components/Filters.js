import { MenuItem, TextField } from "@mui/material";
import React from "react";
import { API_URLS } from "../../../config/APIUrls";
import { useQuery } from "react-query";
import axiosInstance from "../../../config/axios";

const fieldSx = {
  minWidth: 170,

  "& .MuiOutlinedInput-root": {
    color: "var(--text-main)",
    background: "var(--input-bg)",
    borderRadius: "12px",

    "& fieldset": {
      borderColor: "var(--border)",
    },

    "&:hover fieldset": {
      borderColor: "var(--primary)",
    },

    "&.Mui-focused fieldset": {
      borderColor: "var(--primary)",
      boxShadow: "0 0 0 2px rgba(200,144,64,0.15)",
    },
  },

  "& .MuiInputLabel-root": {
    color: "var(--text-muted)",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "var(--primary)",
  },

  "& .MuiSvgIcon-root": {
    color: "var(--primary)",
  },
};

const Filters = ({
  filters,
  setFilters,
  fetchData,
  disableEmployee,
}) => {

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

  const years = Array.from(
    { length: 6 },
    (_, i) => currentYear - 5 + i
  );

  const { data } = useQuery(
    ["get_employee"],
    () =>
      axiosInstance.post(
        API_URLS.employee_list,
        {
          search: "",
          start_date: "",
          end_date: "",
          page: "",
          count: 1000,
        }
      ),
    {
      keepPreviousData: true,
    }
  );

  const employees = data?.data?.data || [];

  const userRole = localStorage.getItem("type");

  return (
    <div
      className="flex flex-wrap items-center gap-4 p-5 rounded-2xl border"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--border)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >

      {/* Month */}
      <TextField
        select
        size="small"
        label="Month"
        value={filters.month}
        onChange={(e) =>
          setFilters({
            ...filters,
            month: e.target.value,
          })
        }
        sx={fieldSx}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                background: "#111",
                border:
                  "1px solid var(--border)",
                borderRadius: "12px",

                "& .MuiMenuItem-root": {
                  color: "var(--text-main)",

                  "&:hover": {
                    background:
                      "rgba(200,144,64,0.12)",
                  },

                  "&.Mui-selected": {
                    background:
                      "rgba(200,144,64,0.18)",
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem value="">
          Select Month
        </MenuItem>

        {months.map((m) => (
          <MenuItem
            key={m.value}
            value={m.value}
          >
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
          setFilters({
            ...filters,
            year: e.target.value,
          })
        }
        sx={fieldSx}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                background: "#111",
                border:
                  "1px solid var(--border)",
                borderRadius: "12px",

                "& .MuiMenuItem-root": {
                  color: "var(--text-main)",

                  "&:hover": {
                    background:
                      "rgba(200,144,64,0.12)",
                  },

                  "&.Mui-selected": {
                    background:
                      "rgba(200,144,64,0.18)",
                  },
                },
              },
            },
          },
        }}
      >
        <MenuItem value="">
          Select Year
        </MenuItem>

        {years.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      {/* Employee */}
      {userRole === "admin" && (
        <TextField
          select
          size="small"
          label="Employee"
          value={filters.employee_id}
          disabled={disableEmployee}
          onChange={(e) =>
            setFilters({
              ...filters,
              employee_id: e.target.value,
            })
          }
          sx={{
            ...fieldSx,
            minWidth: 240,
          }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  background: "#111",
                  border:
                    "1px solid var(--border)",
                  borderRadius: "12px",

                  "& .MuiMenuItem-root": {
                    color: "var(--text-main)",

                    "&:hover": {
                      background:
                        "rgba(200,144,64,0.12)",
                    },

                    "&.Mui-selected": {
                      background:
                        "rgba(200,144,64,0.18)",
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="">
            All Employees
          </MenuItem>

          {employees
            ?.filter(
              (i) => i?.role === "employee"
            )
            ?.map((emp) => (
              <MenuItem
                key={emp.id}
                value={emp.id}
              >
                {emp.name}
              </MenuItem>
            ))}
        </TextField>
      )}

      {/* Apply Button */}
      <button
        onClick={fetchData}
        className="px-6 py-2 rounded-xl font-semibold transition-all duration-300"
        style={{
          background: "var(--primary)",
          color: "#000",
          boxShadow:
            "0 4px 14px rgba(200,144,64,0.3)",
        }}
        onMouseEnter={(e) => {
          e.target.style.background =
            "var(--primary-hover)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background =
            "var(--primary)";
        }}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;