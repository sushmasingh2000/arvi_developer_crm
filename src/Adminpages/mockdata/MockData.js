import { Block, CalendarMonth, DashboardCustomize, Done, GraphicEqSharp, Home, LeaderboardSharp, PeopleAlt, Person, SupervisedUserCircle, TransferWithinAStationOutlined } from "@mui/icons-material";
const user_type = localStorage.getItem("type")

export const all_Data = [

  {
    id: 2,
    navLink: "/admindashboard",
    navItem: "Dashboard",
    navIcon: (
      <span>
        <Home color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

  {
    id: 1,
    navLink: "/list-services",
    navItem: "Master",
    navIcon: (
      <span>
        <LeaderboardSharp color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [
      {
        id: 1.2,
        navLink: "/list-services",
        navItem: " Services",
        navIcon: (
          <span>
            <SupervisedUserCircle color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },
      // {
      //   id: 1.3,
      //   navLink: "/list-property-master",
      //   navItem: " Property",
      //   navIcon: (
      //     <span>
      //       <AddToPhotosIcon color="#15317E" fontSize="medium" />
      //     </span>
      //   ),
      //   subcomponent: [],
      // },
      // {
      //   id: 1.4,
      //   navLink: "/list_area",
      //   navItem: "Area",
      //   navIcon: (
      //     <span>
      //       <AddToPhotosIcon color="#15317E" fontSize="medium" />
      //     </span>
      //   ),
      //   subcomponent: [],
      // },

    ],
  },
  {
    id: 5,
    navLink: "/employee_list",
    navItem: "Employee",
    navIcon: (
      <span>
        <Person color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },





  // {
  //   id: 14,
  //   navLink: "/owner_list_properties",
  //   navItem: " Properties ",
  //   navIcon: (
  //     <span>
  //       <AddToPhotosIcon color="#15317E" fontSize="medium" />
  //     </span>
  //   ),
  //   subcomponent: [],
  // },

  // {
  //   id: 4,
  //   navLink: "/list-owner",
  //   navItem: "Owner",
  //   navIcon: (
  //     <span>
  //       <DashboardCustomizeIcon color="#15317E" fontSize="medium" />
  //     </span>
  //   ),
  //   subcomponent: [],
  // },
  
  {
    id: 14,
    navLink: "/leads",
    navItem: " Leads ",
    navIcon: (
      <span>
        <GraphicEqSharp color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [
       {
        id: 14,
        navLink: "/leads",
        navItem: "All Leads",
        navIcon: (
          <span>
            <PeopleAlt color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },
      {
        id: 14,
        navLink: "/closed_lead",
        navItem: " Success  ",
        navIcon: (
          <span>
            <Done color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },
      {
        id: 14,
        navLink: "/rejected_lead",
        navItem: " Rejected  ",
        navIcon: (
          <span>
            <Block color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },
      {
        id: 18,
        navLink: "/transfer-lead",
        navItem: "Transfer",
        navIcon: (
          <span>
            <TransferWithinAStationOutlined color="#15317E" fontSize="medium" />
          </span>
        ),
        subcomponent: [],
      },

    ],
  },
      {
    id: 2,
    navLink: "/dashboard_master",
    navItem: "Monthly Report",
    navIcon: (
      <span>
        <CalendarMonth color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },

 {
    id: 4,
    navLink: "/monthly_report",
    navItem: "Report",
    navIcon: (
      <span>
        <DashboardCustomize color="#15317E" fontSize="medium" />
      </span>
    ),
    subcomponent: [],
  },
 


]?.filter((i) => {
  if (user_type === "admin") return true;

  if (user_type === "employee") {
    return i.navItem !== "Employee" && i.navItem !=="Monthly Report" && i.navItem !== "Transfer Leads";
  }

  return false;
});