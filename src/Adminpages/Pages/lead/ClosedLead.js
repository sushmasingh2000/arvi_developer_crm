import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
    Button,
    TextField
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: 'var(--text-main)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--primary)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
  },
  '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
  '& input::-webkit-calendar-picker-indicator': { filter: 'invert(0.7)' },
  '& .MuiSelect-icon': { color: 'var(--text-muted)' },
};

const menuProps = {
  PaperProps: {
    style: {
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border)',
      color: 'var(--text-main)',
    }
  }
};

const CloseLeadList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [dateSort, setDateSort] = useState("desc");
    const userRole = localStorage.getItem("type")
    const location = useLocation()
    const searchMobileFromState = location.state?.searchMobile || "";



    const fk = useFormik({
        initialValues: {
            search: searchMobileFromState || "",
            start_date: "",
            end_date: "",
            count: 10,
            status: ""
        },
        onSubmit: () => setCurrentPage(1),
    });

    const { values } = fk;

    const { data: leadsData, isLoading } = useQuery(
        ["get_leads", currentPage, dateSort, values.status, values.search, values.start_date, values.end_date], () =>
        axiosInstance.post(API_URLS.lead_list, {
            search: values.search?.trim(),
            start_date: values.start_date,
            end_date: values.end_date,
            page: currentPage,
            count: 8,
            status:"Deal Success",
            sort_order: dateSort
        }),
        { keepPreviousData: true }
    );

    const allData = leadsData?.data?.response || [];
   



    const tableHead = [
        "S.No.",
        ...(userRole === "admin" ? ["Assigned"] : []),
        "Client Name",
        "Status",
        "Mobile",
        "Requirement",
        "Budget",
        <span
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={() =>
                setDateSort(prev => (prev === "asc" ? "desc" : "asc"))
            }
        >
            Date/Time
            {dateSort === "asc" ? (
                <ArrowUpwardIcon className="!text-red-800" fontSize="small" />
            ) : (
                <ArrowDownwardIcon className="!text-blue-800" fontSize="small" />
            )}
        </span>,
        "Services",
        "Remark",
        "Source",
        "Alternate Mobile",
        "Email",
        "Address",
    ];


    const tableRow = allData?.data?.map((lead, index) => [
        <div className="flex gap-2">
            {index + 1 + (currentPage - 1) * 8}
        </div>,
        ...(userRole === "admin"
            ? [<span className="font-semibold">{lead.assigned_employee_name}</span>]
            : []),
        <span className="!text-center"> {lead.crm_lead_name || "--"}</span>,
        <span className="text-green-800 font-bold">  {lead.current_status || "--"} </span>,
        lead.crm_mobile || "--",
        lead.crm_requirement || "--",
        <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() =>
                navigate(`/payment-history/${lead.id}`, {
                    state: {
                        leadName: lead.crm_lead_name,
                        requirement: lead.crm_requirement
                    }
                })
            }
        >
            {lead.crm_budget || "--"}
        </span>,

        lead.crm_created_at
            ? moment.utc(lead.crm_created_at).format("DD-MM-YYYY HH:mm:ss")
            : "--",

        lead.crm_service_type || "--",
        lead.crm_secondary_status || "--",
        lead.crm_source || "--",
        lead.crm_alternate_mobile || "--",
        lead.crm_email || "--",
        lead.crm_address || "--",

    ]);



    return (
        <div>
            <div className="flex justify-between mb-4">
                <p className="font-bold text-xl" style={{ color: 'var(--text-main)' }}>   Success Leads</p>
                <div></div>
            </div>
              <div className="flex gap-3 mb-4">
        <TextField type="date" value={fk.values.start_date}
          onChange={(e) => fk.setFieldValue("start_date", e.target.value)} sx={fieldSx} />
        <TextField type="date" value={fk.values.end_date}
          onChange={(e) => fk.setFieldValue("end_date", e.target.value)} sx={fieldSx} />


        <TextField
          type="search" placeholder="Search by name or mobile"
          name="search" value={fk.values.search}
          onChange={(e) => fk.setFieldValue("search", e.target.value.trimStart())}
          sx={fieldSx}
        />

        <Button
          variant="contained"
          sx={{
            backgroundColor: 'var(--primary)',
            color: '#000',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'var(--primary-hover)' },
          }}
          onClick={async () => {
            try {
              const res = await axiosInstance.post(
                API_URLS.download_leads_excel,
                { start_date: fk.values.start_date, end_date: fk.values.end_date, status: fk.values.status, search: fk.values.search?.trim() },
                { responseType: "blob" }
              );
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `Leads_${Date.now()}.xlsx`);
              document.body.appendChild(link);
              toast.success("Excel downloaded successfully");
              link.click();
              link.remove();
            } catch {
              Swal.fire("Error", "Failed to download Excel", "error");
            }
          }}
        >
          Download Excel
        </Button>
      </div>
            <CustomTable
                tablehead={tableHead}
                tablerow={tableRow}
                isLoading={isLoading}
            />
            <CustomToPagination
                page={currentPage}
                setPage={setCurrentPage}
                data={allData}
            />
        </div>
    );
};

export default CloseLeadList;
