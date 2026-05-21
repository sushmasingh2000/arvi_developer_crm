import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {
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
                <p className="font-bold text-xl">   Success Leads</p>
                <div></div>
            </div>
            <div className="flex gap-3 mb-4">
                <TextField
                    type="date"
                    value={fk.values.start_date}
                    onChange={(e) => fk.setFieldValue("start_date", e.target.value)}
                />
                <TextField
                    type="date"
                    value={fk.values.end_date}
                    onChange={(e) => fk.setFieldValue("end_date", e.target.value)}
                />

                <TextField
                    type="search"
                    placeholder="Search by name or mobile"
                    name="search"
                    value={fk.values.search}
                    onChange={(e) => fk.setFieldValue("search", e.target.value)} />

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
