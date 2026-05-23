import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import Loader from "../../Shared/Loader";

const inputStyle = {
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
        },
    },

    "& .MuiInputLabel-root": {
        color: "var(--text-muted)",
    },

    "& .MuiInputLabel-root.Mui-focused": {
        color: "var(--primary)",
    },

    "& .MuiFormHelperText-root": {
        color: "#ff6b6b",
    },

    "& .MuiSvgIcon-root": {
        color: "var(--primary)",
    },
};

const CreateLead = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [mobileError, setMobileError] = useState("");
    const [existingLead, setExistingLead] = useState(null);

    const location = useLocation();
    const lead = location.state?.lead || {};
    const isEdit = Boolean(lead?.id);

    const fk = useFormik({
        initialValues: {
            crm_lead_name: lead?.crm_lead_name || "",
            crm_mobile: lead?.crm_mobile || "",
            crm_alternate_mobile: lead?.crm_alternate_mobile || "",
            crm_email: lead?.crm_email || "",
            crm_service_type: lead?.crm_service_type || "",
            crm_requirement: lead?.crm_requirement || "",
            crm_secondary_status: lead?.crm_secondary_status || "",
            crm_source: lead?.crm_source || "",
            crm_budget: lead?.crm_budget || "",
            crm_address: lead?.crm_address || "",
        },

        onSubmit: async (values) => {
            setLoading(true);

            try {
                const payload = lead?.id
                    ? { ...values, lead_id: lead.id }
                    : values;

                const res = await axiosInstance.post(
                    API_URLS.create_leads,
                    payload
                );

                toast(res.data.message, { id: 1 });

                if (res.data.success) {
                    navigate("/leads");
                    fk.resetForm();
                }
            } catch (e) {
                console.error(e);
                toast.error("Something went wrong");
            }

            setLoading(false);
        },
    });

    const handleMobileChange = async (e) => {
        const value = e.target.value;

        fk.setFieldValue("crm_mobile", value);

        const digits = value.replace(/\D/g, "");

        if (digits.length < 10) {
            setMobileError("");
            setExistingLead(null);
            return;
        }

        try {
            const res = await axiosInstance.post(
                API_URLS.check_mobile_exists,
                {
                    mobile: value,
                    lead_id: lead?.id || null,
                }
            );

            if (res.data.exists) {
                setMobileError("Mobile number already exists");
                setExistingLead(res.data.lead);
            } else {
                setMobileError("");
                setExistingLead(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const { data: serviceList } = useQuery(
        ["get_service_type_master"],
        () =>
            axiosInstance.post(API_URLS.get_service_type, {
                count: 10000000000,
                status: 1,
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    const services = serviceList?.data?.response || [];

    return (
        <div
            className="flex justify-center items-center w-full p-5"
            style={{
                minHeight: "100vh",
                background: "var(--bg-dark)",
            }}
        >
            <Loader isLoading={loading} />

            <div
                className="w-full lg:max-w-6xl p-6 rounded-2xl border"
                style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--border)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                }}
            >
                <p
                    className="text-center text-3xl font-bold mb-8"
                    style={{
                        color: "var(--text-main)",
                    }}
                >
                    {lead?.id ? "Update Lead" : "Create Lead"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    <TextField
                        fullWidth
                        label="Client Name"
                        name="crm_lead_name"
                        value={fk.values.crm_lead_name}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Mobile"
                        name="crm_mobile"
                        value={fk.values.crm_mobile}
                        onChange={handleMobileChange}
                        error={Boolean(mobileError)}
                        helperText={
                            mobileError && (
                                <span>
                                    {mobileError}

                                    {existingLead && (
                                        <>
                                            <br />

                                            <span
                                                onClick={() =>
                                                    navigate("/leads", {
                                                        state: {
                                                            searchMobile:
                                                                existingLead.crm_mobile,
                                                        },
                                                    })
                                                }
                                                style={{
                                                    color: "#c89040",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                View Lead:{" "}
                                                {existingLead.name}
                                            </span>
                                        </>
                                    )}
                                </span>
                            )
                        }
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Alternate Mobile No."
                        name="crm_alternate_mobile"
                        value={fk.values.crm_alternate_mobile}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="crm_email"
                        value={fk.values.crm_email}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Select Service"
                        name="crm_service_type"
                        value={fk.values.crm_service_type}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    >
                        {services?.data?.map((item) => (
                            <MenuItem
                                key={item.service_type_id}
                                value={item.service_type_name}
                            >
                                {item.service_type_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth
                        label="Project Requirement"
                        name="crm_requirement"
                        value={fk.values.crm_requirement}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Remark"
                        name="crm_secondary_status"
                        value={fk.values.crm_secondary_status}
                        onChange={fk.handleChange}
                        disabled={isEdit}
                        helperText={
                            isEdit
                                ? "Remark cannot be edited while updating lead"
                                : ""
                        }
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Source"
                        name="crm_source"
                        value={fk.values.crm_source}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Project Budget"
                        name="crm_budget"
                        value={fk.values.crm_budget}
                        onChange={fk.handleChange}
                        sx={inputStyle}
                    />

                    <TextField
                        fullWidth
                        label="Address"
                        name="crm_address"
                        value={fk.values.crm_address}
                        onChange={fk.handleChange}
                        multiline
                        rows={3}
                        sx={inputStyle}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-8">

                    <Button
                        variant="outlined"
                        onClick={() => fk.resetForm()}
                        sx={{
                            borderColor: "var(--primary)",
                            color: "var(--primary)",
                            px: 4,
                            py: 1.2,
                            borderRadius: "10px",
                            fontWeight: "600",

                            "&:hover": {
                                borderColor: "var(--primary-hover)",
                                background: "rgba(200,144,64,0.1)",
                            },
                        }}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="contained"
                        onClick={fk.handleSubmit}
                        disabled={Boolean(mobileError) || existingLead}
                        sx={{
                            background: "var(--primary)",
                            color: "#000",
                            px: 4,
                            py: 1.2,
                            borderRadius: "10px",
                            fontWeight: "700",

                            "&:hover": {
                                background: "var(--primary-hover)",
                            },

                            "&.Mui-disabled": {
                                background: "#555",
                                color: "#aaa",
                            },
                        }}
                    >
                        {lead?.id ? "Update" : "Submit"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateLead;