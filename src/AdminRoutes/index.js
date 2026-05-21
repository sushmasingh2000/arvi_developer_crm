
import Area from "../Adminpages/Pages/allmaster/Area";
import FollowupMaster from "../Adminpages/Pages/allmaster/Followup";
import PropertyMaster from "../Adminpages/Pages/allmaster/Property";
import ServiceTypeMaster from "../Adminpages/Pages/allmaster/Services";
import Dashboard from "../Adminpages/Pages/dashboard/Dashboard";
import AdminDashboard from "../Adminpages/Pages/dashboard/OverAllReport";
import EmployeeList from "../Adminpages/Pages/employee/AllEmployee";
import CreateFollowup from "../Adminpages/Pages/followup/CreateFollowup";
import FollowupList from "../Adminpages/Pages/followup/FollowupList";
import CloseLeadList from "../Adminpages/Pages/lead/ClosedLead";
import CreateLead from "../Adminpages/Pages/lead/CreateLead";
import LeadList from "../Adminpages/Pages/lead/LeadList";
import RejectedLeadList from "../Adminpages/Pages/lead/RejectedLead";
import TransferLead from "../Adminpages/Pages/lead/TransferLead";
import OwnerList from "../Adminpages/Pages/owner/OwnerList";
import Payment from "../Adminpages/Pages/payment/Payment";
import ALlOwnerProperty from "../Adminpages/Pages/properties/AllOwnerProperty";
import PropertyList from "../Adminpages/Pages/properties/ListProperties";
import MonthlyReport from "../Adminpages/Pages/report/Monthlyreport";


export const adminroutes = [ 

  {
    id: 2,
    path: "/admindashboard",
    component: <Dashboard />,
    navItem: "Dashboard",
  },

   {
    id: 2,
    path: "/payment-history/:leadId",
    component: <Payment />,
    navItem: "Payment",
  },
  //  {
  //   id: 2,
  //   path: "/master",
  //   component: <Master />,
  //   navItem: "Master",
  // },
  {
    id: 2,
    path: "/add-lead",
    component: <CreateLead />,
    navItem: "Create Leads",
  },
  {
    id: 2,
    path: "/leads",
    component: <LeadList />,
    navItem: " Leads",
  },

   {
    id: 2,
    path: "/closed_lead",
    component: <CloseLeadList />,
    navItem: " Closed Leads",
  },
   {
    id: 2,
    path: "/rejected_lead",
    component: <RejectedLeadList />,
    navItem: " Rejected Leads",
  },
  
  
  {
    id: 3,
    path: "/follow-up",
    component: <FollowupList />,
    navItem: " Followup",
  },
   {
    id: 3,
    path: "/create-follow-up",
    component: <CreateFollowup />,
    navItem: "Add Followup",
  },
  {
    id: 4,
    path: "/list_properties",
    component: <PropertyList/>,
    navItem: "List Property",
  },
   {
    id: 4,
    path: "/owner_list_properties",
    component: <ALlOwnerProperty/>,
    navItem: "Owner Property",
  },
 
    {
    id: 7,
    path: "/list-owner",
    component: <OwnerList/>,
    navItem: " Owner",
  },
   {
    id: 7,
    path: "/transfer-lead",
    component: <TransferLead/>,
    navItem: " Transfer lead",
  },

   {
    id: 8,
    path: "/list-services",
    component: <ServiceTypeMaster/>,
    navItem: " Services",
  },
    {
    id: 9,
    path: "/list-property-master",
    component: <PropertyMaster/>,
    navItem: " Property",
  },
   {
    id: 10,
    path: "/list-followup-master",
    component: <FollowupMaster/>,
    navItem: " FollowUp",
  },
 {
    id: 11,
    path: "/list_area",
    component: <Area/>,
    navItem: "Area Master",
  },
  {
    id: 12,
    path: "/employee_list",
    component: <EmployeeList/>,
    navItem: "Employee Detail",
  },
  
   {
    id: 12,
    path: "/monthly_report",
    component: <MonthlyReport/>,
    navItem: "Monthly Report",
  },

   {
    id: 12,
    path: "/dashboard_master",
    component: <AdminDashboard/>,
    navItem: "Master Dashboard",
  },
 
  
];