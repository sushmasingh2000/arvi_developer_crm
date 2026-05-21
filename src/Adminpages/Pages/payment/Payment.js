import React, { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import axiosInstance from "../../config/axios";
import { useLocation, useParams } from "react-router-dom";
import { TextField, Button, MenuItem, Card } from "@mui/material";
import { useFormik } from "formik";
import { API_URLS } from "../../config/APIUrls";
import CustomTable from "../../Shared/CustomTable";
import moment from "moment";

const PaymentPage = () => {
    const { leadId } = useParams();
    const queryClient = useQueryClient();
    const location = useLocation();
    const name = location?.state?.leadName || "";
    const requirement = location?.state?.requirement || "";
    // ================= FETCH PAYMENTS =================
    const { data, isLoading } = useQuery(
        ["payments", leadId],
        () =>
            axiosInstance.post(API_URLS.payment_history, {
                crm_lead_id: leadId,
            }),
        {
            enabled: !!leadId,
            keepPreviousData: true,
        }
    );

    const payments = data?.data?.data || [];

    const latest = useMemo(() => payments[0] || {}, [payments]);
    // const latest = payments?.[0] || {};
    // ================= FORM =================
    const formik = useFormik({
        enableReinitialize: false,
        initialValues: {
            lead_id: leadId,
            total_amount: latest?.total_amount || "",
            advance_amount: "",
            pending_amount: "",
            payment_type: "",
        },

        onSubmit: async (values, { resetForm }) => {
            if (!values.advance_amount) return;

            await axiosInstance.post(API_URLS.payment_add, {
                ...values,
                total_amount: latest?.total_amount,
            });

            queryClient.invalidateQueries(["payments", leadId]);
            resetForm();
        },
    });

    useEffect(() => {
        if (!latest) return;

        const prevPending =
            latest?.pending_amount || latest?.total_amount || 0;

        const advance = Number(formik.values.advance_amount || 0);

        const newPending = prevPending - advance;

        formik.setFieldValue(
            "pending_amount",
            newPending >= 0 ? newPending : 0
        );
    }, [
        formik.values.advance_amount,
        latest?.pending_amount,
        latest?.total_amount,
    ]);

    // ================= TABLE SAFE =================
    const tableHead = ["S.No.", " Paid Amount", "Pending Amount", "Payment Method", " Payment Date"];

    const tableRow = (payments || []).map((p, i) => [
        i + 1,
        `₹ ${p?.advance_amount || 0}`,
        `₹ ${p?.pending_amount || 0}`,
        p?.payment_type || "--",
        p?.created_at
            ? moment(p.created_at).format("DD-MM-YYYY")
            : "--",
    ]);

    // ================= LOADING GUARD =================
    if (!leadId) return <div>Invalid Lead ID</div>;

    return (
        <div className="p-4">
            {/* SUMMARY */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <Card className="p-3">
                    <div className="flex flex-col  ">
                        <div className="flex gap-1">
                            <p>Client Name: </p>
                            <p className="font-bold  text-red-700">{name}</p>
                        </div>
                        <div className="flex gap-1 mb-3">
                            <p> Requirement: </p>
                            <p className="font-bold  text-red-700">{requirement}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-3">
                    <h3>Total Amount</h3>
                    <b>₹ {latest?.total_amount || 0}</b>
                </Card>

                <Card className="p-3">
                    <h3>Last Paid</h3>
                    <b className="text-green-600">
                        ₹ {latest?.advance_amount || 0}
                    </b>
                </Card>

                <Card className="p-3">
                    <h3>Pending</h3>
                    <b className="text-red-500">
                        ₹ {latest?.pending_amount || latest?.total_amount || 0}
                    </b>
                </Card>

            </div>

            {/* FORM */}
            <h1>Add Payment Status</h1>
            <div className="py-4 mb-4">

                <div className="grid grid-cols-4 gap-3">

                    <TextField
                        name="total_amount"
                        value={latest?.total_amount}
                        disabled
                        fullWidth
                    />


                    <TextField
                        label="Pending Amount"
                        name="pending_amount"
                        value={formik.values.pending_amount}
                        disabled
                        fullWidth
                    />
                    <TextField
                        label=" Amount"
                        name="advance_amount"
                        value={formik.values.advance_amount}
                        onChange={formik.handleChange}
                        type="number"
                        fullWidth
                    />


                    <TextField
                        select
                        label="Payment Type"
                        name="payment_type"
                        value={formik.values.payment_type}
                        onChange={formik.handleChange}
                        fullWidth
                    >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="online">Online</MenuItem>
                        <MenuItem value="emi">EMI</MenuItem>
                    </TextField>

                </div>

                <div className="flex justify-end mt-2">
                    <Button
                        className="mt-4"
                        variant="contained"
                        onClick={formik.handleSubmit}
                    >
                        Submit
                    </Button>
                </div>

            </div>

            {/* TABLE */}
            <CustomTable
                tablehead={tableHead}
                tablerow={tableRow}
                isLoading={isLoading}
            />

        </div>
    );
};

export default PaymentPage;