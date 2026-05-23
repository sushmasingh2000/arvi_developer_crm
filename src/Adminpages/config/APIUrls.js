
// export const domain = "http://192.168.18.101:9044"
// export const frontend = "http://192.168.18.101:3000"

export const domain = "https://lead.arvideveloper.com"
export const frontend = "https://lead.arvideveloper.com"


export const API_URLS = {

  admin_login: `${domain}/api/v1/auth-admin-login`,
  emp_registration: `${domain}/api/v1/auth-emp-registration`,
  
  delete_lead: `${domain}/api/v1/delete-lead`,

  dashboard_count: `${domain}/api/v1/dashboard-count`,
  motnhly_report: `${domain}/api/v1/get-monthly-report`,
  employee_client_details: `${domain}/api/v1/get-employee-client-detail`,
  monthly_report_graph: `${domain}/api/v1/get-monthly-report-graph`,
  all_employee_motnhly_report: `${domain}/api/v1/get-all-employee-monthly-report`,
  employee_list: `${domain}/api/v1/employee-list`,

  create_leads: `${domain}/api/v1/create-leads`,
  lead_list: `${domain}/api/v1/get-leads`,
  get_leads_transfer_history: `${domain}/api/v1/get-leads-transfer-history`,

  check_mobile_exists: `${domain}/api/v1/check-mobile-exists`,
  owner_check_mobile_exists: `${domain}/api/v1/owner-check-mobile-exists`,
  download_leads_excel: `${domain}/api/v1/download-leads-excel`,
  download_owner_excel: `${domain}/api/v1/download-owner-excel`,
  download_property_excel: `${domain}/api/v1/download-properties-excel`,

  add_followup: `${domain}/api/v1/add-followups`,
  get_followup: `${domain}/api/v1/get-followups`,
  today_lead_folowup: `${domain}/api/v1/get-today-followups`,


  add_owners: `${domain}/api/v1/create-owners`,
  get_owner: `${domain}/api/v1/get-owners`,

  create_properties: `${domain}/api/v1/create-properties`,
  get_properties: `${domain}/api/v1/get-properties`,
  get_all_properties_owner: `${domain}/api/v1/get-all-properties-owner`,

  update_properties: `${domain}/api/v1/update-properties`,
  delete_properties: `${domain}/api/v1/delete-properties`,

  create_service_type: `${domain}/api/v1/create-service-type`,
  get_service_type: `${domain}/api/v1/get-service-type`,
  update_service_type: `${domain}/api/v1/update-service-type`,
  update_service_type_status: `${domain}/api/v1/update-service-type-status`,

  create_property_master: `${domain}/api/v1/create-property-type-master`,
  get_property_master: `${domain}/api/v1/get-property-type-master`,
  update_property_master: `${domain}/api/v1/update-property-master`,
  update_property_master_status: `${domain}/api/v1/update-property-master-status`,

  get_followup_master: `${domain}/api/v1/get-followup-master`,
  create_followup_status: `${domain}/api/v1/create-followup-status`,
  update_followup_status: `${domain}/api/v1/update-followup-status`,
  toggle_followup_status: `${domain}/api/v1/update-followup-status-status`,


  get_area: `${domain}/api/v1/get-area`,
  create_area: `${domain}/api/v1/create-area`,
  update_area: `${domain}/api/v1/update-area`,
  toggle_area: `${domain}/api/v1/update-area-status`,

  assign_lead: `${domain}/api/v1/assign-lead-to-employee`,
  assign_property: `${domain}/api/v1/assign-property-to-lead`,
  payment_add: `${domain}/api/v1/add-payment-lead`,
  payment_history: `${domain}/api/v1/payment-lead-list`,


  master_bhk: `${domain}/api/v1/get-bhk-master`,

  employee_excel: `${domain}/api/v1/employee-excel`,
  upload_leads_excel: `${domain}/api/v1/upload-leads-excel`,
  upload_property_excel: `${domain}/api/v1/upload-property-excel`,


};
