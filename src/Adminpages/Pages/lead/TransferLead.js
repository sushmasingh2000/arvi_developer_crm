import { FilterAlt } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useQuery } from "react-query";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";

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

const TransferLead = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const fk = useFormik({
        initialValues: {
            search: "",
            start_date: "",
            end_date: "",
            count: 10,
        },
        onSubmit: () => {
            setCurrentPage(1);
            refetch();
        },
    });

    const { data, isLoading, refetch } = useQuery(
        ["get_leads_transfer_history", fk.values.search, fk.values.start_date, fk.values.end_date, currentPage],
        () =>
            axiosInstance.post(API_URLS.get_leads_transfer_history, {
                search: fk.values.search,
                start_date: fk.values.start_date,
                end_date: fk.values.end_date,
                page: currentPage,
                count: 10,
            }),
        {
            keepPreviousData: true,
        }
    );

    const allData = data?.data?.response || [];

    const tableHead = ["S.No.", "Client Name", "From Employee", "To Employee", "Transferred At"];

    const tableRow = allData?.data?.map((f, idx) => [
        idx + 1,
        f.lead_name,
        f.from_employee_name,
        f.to_employee_name,
        f.transferred_at ? moment(f.transferred_at).format("DD-MM-YYYY HH:mm:ss") : "--",
    ]);


    return (
        <div className="">
            <div className="flex justify-between mb-3">
                <p className="font-bold text-xl" style={{ color: 'var(--text-main)' }} >Transfer Leads</p>
            </div>

            <div className="flex gap-3 mb-4">
                <TextField
                    type="date"
                    value={fk.values.start_date}
                    onChange={(e) => fk.setFieldValue("start_date", e.target.value)} sx={fieldSx}
                />
                <TextField
                    type="date"
                    value={fk.values.end_date}
                    onChange={(e) => fk.setFieldValue("end_date", e.target.value)} sx={fieldSx}
                />
                <TextField
                    type="search"
                    placeholder="Search by ....."
                    name="search"
                    value={fk.values.search}
                    onChange={fk.handleChange} sx={fieldSx}
                />
                <Button variant="contained" startIcon={<FilterAlt />} onClick={fk.handleSubmit}>
                    Filter
                </Button>
            </div>

            <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
            <CustomToPagination page={currentPage} setPage={setCurrentPage} data={allData} />


        </div>
    );
};

export default TransferLead;
