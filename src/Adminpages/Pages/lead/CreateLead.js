import { Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import Loader from "../../Shared/Loader";

const CreateLead = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [mobileError, setMobileError] = useState("");
    const [existingLead, setExistingLead] = useState(null);

    const location = useLocation();
    const lead = location.state?.lead || {}
    const isEdit = Boolean(lead?.id);


    const fk = useFormik({
        initialValues: {
            crm_lead_name: lead?.crm_lead_name || "",
            crm_mobile: lead?.crm_mobile || "",
            crm_alternate_mobile: lead?.crm_alternate_mobile || "",
            crm_email: lead?.crm_email || "",
            crm_service_type: lead?.crm_service_type || "",
            crm_requirement: lead?.crm_requirement || "",
            crm_secondary_status: lead.crm_secondary_status || "",
            crm_source: lead?.crm_source || "",
            crm_budget: lead?.crm_budget || "",
            crm_address: lead?.crm_address || "",
        },

        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = lead?.id ? { ...values, lead_id: lead.id } : values;
                const res = await axiosInstance.post(API_URLS.create_leads, payload);
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
                    lead_id: lead?.id || null
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
                status: 1
            }),
        {
            refetchOnWindowFocus: false,
        }
    );

    const services = serviceList?.data?.response || [];

    const { data: propertyList } = useQuery(
        ["get_property_master"],
        () =>
            axiosInstance.post(API_URLS.get_property_master, {
                count: 100000,
                status: 1,
            }),
        { refetchOnWindowFocus: false }
    );

    const properties = propertyList?.data?.response || [];


    return (
        <div className="flex justify-center items-center w-full p-5">
            <Loader isLoading={loading} />
            <div className=" rounded-lg p-5 w-full lg:max-w-6xl bg-white bg-opacity-45">
                <p className="text-center font-bold text-lg mb-5">
                    {lead?.id ? "Update Lead" : "Create Lead"} </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <TextField
                        fullWidth
                        label="Client Name"
                        name="crm_lead_name"
                        value={fk.values.crm_lead_name}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_lead_name && Boolean(fk.errors.crm_lead_name)}
                        helperText={fk.touched.crm_lead_name && fk.errors.crm_lead_name}
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
                                                        state: { searchMobile: existingLead.crm_mobile }
                                                    })
                                                }
                                                style={{
                                                    color: "#1976d2",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    textDecoration: "underline"
                                                }}
                                            >
                                                View Lead: {existingLead.name}
                                            </span>

                                        </>
                                    )}
                                </span>
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        label="Alternate Mobile No."
                        name="crm_alternate_mobile"
                        value={fk.values.crm_alternate_mobile}
                        onChange={fk.handleChange}
                    // error={fk.touched.crm_alternate_mobile && Boolean(fk.errors.crm_alternate_mobile)}
                    // helperText={fk.touched.crm_alternate_mobile && fk.errors.crm_alternate_mobile}
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="crm_email"
                        value={fk.values.crm_email}
                        onChange={fk.handleChange}
                        error={fk.touched.crm_email && Boolean(fk.errors.crm_email)}
                        helperText={fk.touched.crm_email && fk.errors.crm_email}
                    />

                   
                       <TextField
                        select
                        fullWidth
                        label="Select Service"
                        name="crm_service_type"
                        value={
                            services?.data?.some(
                                (item) => item.service_type_name === fk.values.crm_service_type
                            )
                                ? fk.values.crm_service_type
                                : ""
                        }
                        onChange={fk.handleChange}
                        error={fk.touched.crm_service_type && Boolean(fk.errors.crm_service_type)}
                        helperText={fk.touched.crm_service_type && fk.errors.crm_service_type}
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
                        error={fk.touched.crm_requirement && Boolean(fk.errors.crm_requirement)}
                        helperText={fk.touched.crm_requirement && fk.errors.crm_requirement}
                    />

                    <TextField
                        fullWidth
                        label="Remark"
                        name="crm_secondary_status"
                        value={fk.values.crm_secondary_status}
                        onChange={fk.handleChange}
                        disabled={isEdit}
                        helperText={isEdit ? "Remark cannot be edited while updating lead" : ""}
                    />
                    <TextField
                        fullWidth
                        label="Source"
                        name="crm_source"
                        value={fk.values.crm_source}
                        onChange={fk.handleChange}
                    />

                    <TextField
                        fullWidth
                        type="text"
                        label="Project Budget"
                        name="crm_budget"
                        value={fk.values.crm_budget}
                        onChange={fk.handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Address (Optional)"
                        name="crm_address"
                        value={fk.values.crm_address}
                        onChange={fk.handleChange}
                    />

                </div>
                <div className="flex justify-end gap-3 mt-5">
                    <Button variant="contained" color="error" onClick={() => fk.resetForm()}>
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={fk.handleSubmit}
                        disabled={Boolean(mobileError) || existingLead}
                    >
                        {lead?.id ? "Update" : "Submit"}
                    </Button>


                </div>
            </div>
        </div>
    );
};

export default CreateLead;
