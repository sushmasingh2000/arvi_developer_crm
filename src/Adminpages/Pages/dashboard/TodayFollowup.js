import React, { useState } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../../config/axios";
import { API_URLS } from "../../config/APIUrls";
import { Close, PersonPin, RemoveRedEye } from "@mui/icons-material";
import CustomTable from "../../Shared/CustomTable";
import moment from "moment";
import { useFormik } from "formik";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import FollowupList from "../followup/FollowupList";
import CustomToPagination from "../../Shared/Pagination";


const TodayFolowup = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [openFollowup, setOpenFollowup] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);

    const { data: todayData, isLoading } = useQuery(
        ["today_followups", currentPage],
        () => axiosInstance.post(API_URLS.today_lead_folowup, {
            page: currentPage,
            count: 5,
        }),
        { keepPreviousData: true }
    );

    const followups = todayData?.data?.response || [];

    const tableHead = [
        "S.No.",
        "Client Name",
        "Mobile",
        "Followup Date",
        "FollowUp",
        "Status",
        "Remark",
    ];

    const tableRow = followups?.data?.map((f, idx) => [
        <span>{idx + 1 + (currentPage - 1) * 8}</span>,
        f.crm_lead_name || "--",
        f.crm_mobile || "--",
        f.crm_next_followup_date
            ? moment(f.crm_next_followup_date).format("YYYY-MM-DD")
            : "--",
        <Button
            onClick={() => {
                setSelectedLead(f);
                setSelectedLeadId(f.id);
                setOpenFollowup(true);
            }}
            sx={{ color: 'var(--primary)' }}
        >
            <RemoveRedEye />
        </Button>,
        f.followup_status_name || "--",
        <Tooltip title={f.crm_remark}>
            <span>{f.crm_remark?.slice(0, 30) || "--"}</span>
        </Tooltip>
    ]);

    return (
        <div className="px-4">
            {/* ✅ heading color */}
            <h2 className="mt-6 font-bold mb-4" style={{ color: 'var(--text-main)' }}>
                Today Follow-ups
            </h2>

            <CustomTable
                tablehead={tableHead}
                tablerow={tableRow}
                isLoading={isLoading}
            />

            <CustomToPagination
                page={currentPage}
                setPage={setCurrentPage}
                data={followups}
            />

            <Dialog
                open={openFollowup}
                onClose={() => setOpenFollowup(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    style: {
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--border)',
                    }
                }}
            >
                {/* ✅ dialog title color */}
                <DialogTitle
                    className="flex justify-between items-center"
                    style={{ color: 'var(--text-main)' }}
                >
                    Follow-up <br />
                    {selectedLead?.crm_lead_name || "no name"}{" "}
                    {selectedLead?.crm_mobile ? `(${selectedLead.crm_mobile})` : ""}
                    <IconButton
                        onClick={() => setOpenFollowup(false)}
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        height: "70vh",
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                        borderColor: 'var(--border)',
                    }}
                >
                    {selectedLeadId && <FollowupList leadId={selectedLeadId} />}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TodayFolowup;