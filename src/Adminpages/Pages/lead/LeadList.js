import { CompareArrowsTwoTone, Delete, Edit, RemoveRedEyeSharp } from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URLS } from "../../config/APIUrls";
import axiosInstance from "../../config/axios";
import CustomTable from "../../Shared/CustomTable";
import CustomToPagination from "../../Shared/Pagination";
import FollowupList from "../followup/FollowupList";

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

const LeadList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkEmployee, setBulkEmployee] = useState("");
  const [assignAll, setAssignAll] = useState(false);
  const [transferAll, setTransferAll] = useState(false);
  const [openFollowup, setOpenFollowup] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [dateSort, setDateSort] = useState("desc");
  const userRole = localStorage.getItem("type");
  const searchMobileFromState = location.state?.searchMobile || "";
  const statusFromState = location.state?.status || "";

  const fk = useFormik({
    initialValues: {
      search: searchMobileFromState || "",
      start_date: "",
      end_date: "",
      count: 10,
      status: statusFromState,
    },
    onSubmit: () => setCurrentPage(1),
  });

  const { values } = fk;

  const { data: leadsData, isLoading } = useQuery(
    ["get_leads", currentPage, dateSort, values.status, values.search, values.start_date, values.end_date],
    () => axiosInstance.post(API_URLS.lead_list, {
      search: values.search?.trim(),
      start_date: values.start_date,
      end_date: values.end_date,
      page: currentPage,
      count: 8,
      status: values.status,
      sort_order: dateSort,
    }),
    { keepPreviousData: true }
  );

  const allData = leadsData?.data?.response || [];

  const { data: employeesData } = useQuery(
    ["employees"],
    () => axiosInstance.post(API_URLS.employee_list, { count: 10000 }),
    { keepPreviousData: true }
  );

  const employee_all = employeesData?.data?.data || [];

  const { data: statusList } = useQuery(
    ["get_followup_master"],
    () => axiosInstance.post(API_URLS.get_followup_master, { count: 100000, status: 1 }),
    { refetchOnWindowFocus: false }
  );

  const status = statusList?.data?.response || [];

  const handleBulkAssign = async () => {
    if (!bulkEmployee) return;
    if (!assignAll && selectedLeads.length === 0) {
      Swal.fire("Please select leads", "", "warning");
      return;
    }
    const employeeName = employee_all.find(emp => emp.id === bulkEmployee)?.name;
    const text = assignAll
      ? "Assign ALL unassigned leads?"
      : transferAll
        ? `Transfer ${selectedLeads.length} leads to ${employeeName}?`
        : `Assign ${selectedLeads.length} leads to ${employeeName}?`;

    const result = await Swal.fire({
      title: "Are you sure?", text, icon: "warning",
      showCancelButton: true, confirmButtonText: "Yes, assign",
      cancelButtonText: "Cancel", allowOutsideClick: false, allowEscapeKey: false,
    });
    if (!result.isConfirmed) return;

    Swal.fire({ title: "Assigning...", didOpen: () => Swal.showLoading(), allowOutsideClick: false });
    try {
      await axiosInstance.post(API_URLS.assign_lead, {
        assign_all: assignAll, lead_ids: assignAll ? [] : selectedLeads,
        employee_id: bulkEmployee, employee_name: employeeName,
      });
      Swal.close();
      Swal.fire("Assigned!", "Leads assigned successfully.", "success");
      setSelectedLeads([]); setAssignAll(false); setBulkEmployee("");
      queryClient.invalidateQueries("get_leads");
    } catch {
      Swal.close();
      Swal.fire("Error!", "Failed to assign leads.", "error");
    }
  };

  const toggleLeadSelection = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleDeleteLead = async (leadId) => {
    const result = await Swal.fire({
      title: "Are you sure?", text: "This lead will be permanently deleted!",
      icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel", confirmButtonColor: "#d33",
    });
    if (!result.isConfirmed) return;
    Swal.fire({ title: "Deleting...", didOpen: () => Swal.showLoading(), allowOutsideClick: false });
    try {
      const res = await axiosInstance.post(API_URLS.delete_lead, { lead_id: leadId });
      Swal.close();
      if (!res.data.success) { Swal.fire("Error!", res.data.message, "error"); return; }
      Swal.fire("Deleted!", "Lead deleted successfully.", "success");
      queryClient.invalidateQueries("get_leads");
    } catch {
      Swal.close();
      Swal.fire("Error!", "Failed to delete lead", "error");
    }
  };

  const tableHead = [
    "S.No.",
    ...(userRole === "admin"
      ? [
        <span className="flex gap-2 items-center" style={{ color: 'var(--text-main)' }}>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={assignAll} onChange={(e) => { setAssignAll(e.target.checked); if (e.target.checked) setTransferAll(false); }} />
            Assign All
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={transferAll} onChange={(e) => { setTransferAll(e.target.checked); if (e.target.checked) setAssignAll(false); }} />
            Transfer All
          </label>
        </span>
      ]
      : []),
    ,
    <span
      className="flex items-center gap-1 cursor-pointer select-none"
      style={{ color: 'var(--text-main)' }}
      onClick={() => setDateSort(prev => (prev === "asc" ? "desc" : "asc"))}
    >
      Date/Time
      {dateSort === "asc"
        ? <ArrowUpwardIcon style={{ color: 'var(--primary)' }} fontSize="small" />
        : <ArrowDownwardIcon style={{ color: 'var(--primary)' }} fontSize="small" />
      }
    </span>,
    "FollowUp", "Client Name", "Mobile", "Requirement", "Rate Quote",
    "Services", "Status", "Remark", "Source", "Alternate Mobile", "Email", "Address", "Action",
  ];

  const tableRow = allData?.data?.map((lead, index) => [
    <div className="flex gap-2">
      {index + 1 + (currentPage - 1) * 8}
      {userRole !== "admin" && (!lead.current_status) && (
        <span className="bg-green-600 text-white text-[10px] px-2 rounded-full">NEW</span>
      )}
    </div>,
    ...(userRole === "admin"
      ? [
        <span className="flex gap-2 items-center">
          {lead?.assigned_employee_name ? (
            <>
              <span className="font-semibold" style={{ color: 'var(--text-main)' }}>
                {lead.assigned_employee_name}
              </span>
              <Button
                size="small"
                variant="outlined"
                sx={{ borderColor: 'var(--border)', color: 'var(--primary)', '&:hover': { borderColor: 'var(--primary)' } }}
                onClick={() => { setSelectedLeads([lead.id]); setAssignAll(false); setTransferAll(false); }}
              >
                <CompareArrowsTwoTone />
              </Button>
            </>
          ) : (
            <input
              type="checkbox"
              disabled={assignAll}
              checked={assignAll || selectedLeads.includes(lead.id)}
              onChange={() => toggleLeadSelection(lead.id)}
            />
          )}
        </span>
      ]
      : []),
    lead.crm_created_at ? moment.utc(lead.crm_created_at).format("DD-MM-YYYY HH:mm:ss") : "--",
    <RemoveRedEyeSharp
      className="!ml-4"
      style={{ color: 'var(--primary)', cursor: 'pointer' }}
      onClick={() => { setSelectedLeadId(lead.id); setOpenFollowup(true); }}
    />,
    <span>{lead.crm_lead_name || "--"}</span>,
    lead.crm_mobile || "--",
    lead.crm_requirement || "--",
    <span
      style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => navigate(`/payment-history/${lead.id}`, {
        state: { leadName: lead.crm_lead_name, requirement: lead.crm_requirement }
      })}
    >
      {lead.crm_budget || "--"}
    </span>,
    lead.crm_service_type || "--",
    lead.current_status || "--",
    lead.crm_secondary_status || "--",
    lead.crm_source || "--",
    lead.crm_alternate_mobile || "--",
    lead.crm_email || "--",
    lead.crm_address || "--",
    <div className="flex gap-2">
      <Edit style={{ color: '#4ecb71', cursor: 'pointer' }} onClick={() => navigate("/add-lead", { state: { lead } })} />
      <Delete style={{ color: '#e05555', cursor: 'pointer' }} onClick={() => handleDeleteLead(lead.id)} />
    </div>,
  ]);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4">
        {/* ✅ heading */}
        <p className="font-bold text-xl" style={{ color: 'var(--text-main)' }}>All Leads</p>
        <div className="flex justify-end gap-5">
          <Button
            variant="contained"
            onClick={() => navigate("/add-lead")}
            sx={{
              backgroundColor: 'var(--primary)',
              color: '#000',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'var(--primary-hover)' },
            }}
          >
            + Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <TextField type="date" value={fk.values.start_date}
          onChange={(e) => fk.setFieldValue("start_date", e.target.value)} sx={fieldSx} />
        <TextField type="date" value={fk.values.end_date}
          onChange={(e) => fk.setFieldValue("end_date", e.target.value)} sx={fieldSx} />

        <TextField
          select label="Followup Status" name="status"
          value={fk.values.status || "ALL"}
          onChange={(e) => fk.setFieldValue("status", e.target.value === "ALL" ? "" : e.target.value)}
          className="lg:w-[300px]"
          sx={fieldSx}
          SelectProps={{ MenuProps: menuProps }}
        >
          <MenuItem value="ALL" sx={{ color: 'var(--text-main)', '&:hover': { backgroundColor: 'var(--input-bg)' } }}>All</MenuItem>
          {status?.data?.map((item) => (
            <MenuItem
              key={item.followup_status_id}
              value={item.followup_status_name}
              sx={{ color: 'var(--text-main)', '&:hover': { backgroundColor: 'var(--input-bg)' } }}
            >
              {item.followup_status_name}
            </MenuItem>
          ))}
        </TextField>

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

      {(selectedLeads.length > 0 || assignAll || transferAll) && (
        <div className="flex items-center justify-end gap-3 mb-4">
          <FormControl size="small">
            <InputLabel sx={{ color: 'var(--text-muted)', '&.Mui-focused': { color: 'var(--primary)' } }}>
              Select Employee
            </InputLabel>
            <Select
              value={bulkEmployee}
              onChange={(e) => setBulkEmployee(e.target.value)}
              style={{ width: 200 }}
              sx={{
                color: 'var(--text-main)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                '& .MuiSelect-icon': { color: 'var(--text-muted)' },
              }}
              MenuProps={menuProps}
            >
              {employee_all?.filter(emp => emp.role === "employee").map(emp => (
                <MenuItem key={emp.id} value={emp.id}
                  sx={{ color: 'var(--text-main)', '&:hover': { backgroundColor: 'var(--input-bg)' } }}>
                  {emp.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={!bulkEmployee}
            sx={{
              backgroundColor: 'var(--primary)',
              color: '#000',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'var(--primary-hover)' },
              '&.Mui-disabled': { backgroundColor: 'var(--input-bg)', color: 'var(--text-muted)' },
            }}
            onClick={handleBulkAssign}
          >
            {transferAll ? "Transfer ALL Leads" : selectedLeads.length > 0 ? "Transfer Leads" : "Assign Leads"}
          </Button>
        </div>
      )}

      <CustomTable tablehead={tableHead} tablerow={tableRow} isLoading={isLoading} />
      <CustomToPagination page={currentPage} setPage={setCurrentPage} data={allData} />

      <Dialog
        open={openFollowup}
        onClose={() => setOpenFollowup(false)}
        fullWidth maxWidth="md"
        PaperProps={{
          style: { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }
        }}
      >
        <DialogTitle
          className="flex justify-between items-center"
          style={{ color: 'var(--text-main)' }}
        >
          Follow-up
          <IconButton onClick={() => setOpenFollowup(false)} style={{ color: 'var(--text-muted)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ height: "70vh", display: "flex", flexDirection: "column", padding: 0, borderColor: 'var(--border)' }}
        >
          {selectedLeadId && <FollowupList leadId={selectedLeadId} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadList;