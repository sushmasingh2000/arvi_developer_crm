import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import moment from "moment";

const CreateFollowup = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const followup = location.state?.followup;
    const lead = location.state?.lead_id;

    const fk = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: followup?.id || null,
            crm_lead_id: lead,
            crm_status: followup?.crm_status || "",
            crm_remark: followup?.crm_remark || "",
            crm_next_followup_date: followup?.crm_next_followup_date
                ? moment(followup.crm_next_followup_date).format("YYYY-MM-DD")
                : "",

            total_amount: followup?.total_amount || "",
            advance_amount: followup?.advance_amount || "",
            pending_amount: followup?.pending_amount || "",
            payment_type: followup?.payment_type || "",

          
        },

        onSubmit: async (values) => {
            try {
                setLoading(true);

                if (!values.crm_status) {
                    return toast.error("Please select status");
                }

                const isDeal = values.crm_status === "Deal Success";

                if (isDeal) {
                    if (
                        !values.total_amount ||
                        !values.advance_amount ||
                        !values.pending_amount ||
                        !values.payment_type
                    ) {
                        return toast.error("Please FILL");
                    }
                }

                const formData = new FormData();

                Object.entries(values).forEach(([key, value]) => {
                    if (value !== null && value !== "") {
                        formData.append(key, value);
                    }
                });

                const res = await axiosInstance.post(
                    API_URLS.add_followup,
                    formData
                );

                if (res?.data?.success) {
                    toast.success(res.data.message || "Saved successfully");
                    navigate(-1);
                }

            } catch (err) {
                console.error(err);
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        }
    });

    const { data: statusList } = useQuery(
        ["get_followup_master"],
        () =>
            axiosInstance.post(API_URLS.get_followup_master, {
                count: 100000,
                status: 1,
            }),
        { refetchOnWindowFocus: false }
    );

    const statusData = statusList?.data?.response?.data || [];

    const isClosed = fk.values.crm_status === "Deal Success";

    const handleFileChange = (e) => {
        fk.setFieldValue(e.target.name, e.target.files[0]);
    };

    return (
        <div className="flex justify-center p-4">
            <div className="w-full max-w-3xl p-6 bg-white rounded shadow">

                <p className="text-lg font-bold text-center mb-6">
                    {followup?.id ? "Update Follow-up" : "Add Follow-up"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* STATUS */}
                    <TextField
                        select
                        label="Follow-up Status"
                        name="crm_status"
                        value={fk.values.crm_status}
                        onChange={fk.handleChange}
                        fullWidth
                    >
                        {statusData.map((item) => (
                            <MenuItem
                                key={item.followup_status_id}
                                value={item.followup_status_name}
                            >
                                {item.followup_status_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* DATE */}
                    <TextField
                        type="date"
                        label="Next Follow-up Date"
                        name="crm_next_followup_date"
                        InputLabelProps={{ shrink: true }}
                        value={fk.values.crm_next_followup_date}
                        onChange={fk.handleChange}
                        fullWidth
                    />

                    {/* REMARK */}
                    <TextField
                        label="Remark"
                        name="crm_remark"
                        value={fk.values.crm_remark}
                        onChange={fk.handleChange}
                        fullWidth
                        multiline
                        rows={2}
                    />

                    {/* PAYMENT FIELDS (ONLY DEAL SUCCESS) */}
                    {isClosed && (
                        <>
                            <TextField
                                label="Total Amount"
                                name="total_amount"
                                value={fk.values.total_amount}
                                onChange={fk.handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Advance Amount"
                                name="advance_amount"
                                value={fk.values.advance_amount}
                                onChange={fk.handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Pending Amount"
                                name="pending_amount"
                                value={fk.values.pending_amount}
                                onChange={fk.handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Payment Type"
                                name="payment_type"
                                value={fk.values.payment_type}
                                onChange={fk.handleChange}
                                fullWidth
                            />

                           
                        </>
                    )}

                </div>

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 mt-6">

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => fk.resetForm()}
                        disabled={loading}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="contained"
                        onClick={fk.handleSubmit}
                        disabled={loading || !lead}
                    >
                        {loading ? "Saving..." : "Submit"}
                    </Button>

                </div>

            </div>
        </div>
    );
};

export default CreateFollowup;