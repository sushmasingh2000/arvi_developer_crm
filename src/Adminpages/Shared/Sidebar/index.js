import { ExpandLess, ExpandMore, Logout } from "@mui/icons-material";
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import classNames from "classnames";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../../assets/mobile_logo-removebg-preview.png";
import { all_Data } from "../../mockdata/MockData";

const Sidebar = () => {
  const navigate = useNavigate();

  const [openSlide, setOpenSlide] = useState(true);

  const [openCollapse, setOpenCollapse] = useState(() => {
    const initialState = {};
    all_Data.forEach((nav) => {
      if (nav.subcomponent?.length > 0) {
        initialState[nav.navLink] = true;
      }
    });
    return initialState;
  });

  const handleCollapse = (navLink) => {
    setOpenCollapse((prevState) => ({
      ...prevState,
      [navLink]: !prevState[navLink],
    }));
  };

  return (
    <List
      className={`${openSlide ? "!min-w-[16vw] max-w-[16vw]" : "!w-auto"} shadow-md !h-screen !relative !overflow-y-auto !p-2 glass`}
      style={{ backgroundColor: 'var(--card-bg)' }}
    >
      <ListItem className="!py-3 !flex !justify-center">
        {openSlide ? (
          <img alt="" className="Capture !w-28" src={loginLogo} />
        ) : (
          <img alt="" className="Capture !w-16 py-8" src={loginLogo} />
        )}
      </ListItem>
      <Divider sx={{ borderColor: 'var(--primary)', opacity: 0.3 }} />

      {all_Data?.map((nav) => (
        <React.Fragment key={nav.id}>
          <ListItemButton
            onClick={() => {
              navigate(nav.navLink);
              if (nav.subcomponent?.length > 0) {
                handleCollapse(nav.navLink);
              }
            }}
            className={classNames("!rounded-lg !p-2")}
            sx={{
              color: window.location.pathname === nav.navLink ? 'var(--primary)' : 'var(--text-main)',
              '&:hover': { backgroundColor: 'var(--input-bg)' },
            }}
          >
            <ListItemIcon sx={{ color: window.location.pathname === nav.navLink ? 'var(--primary)' : 'var(--text-muted)' }}>
              {nav.navIcon}
            </ListItemIcon>
            <ListItemText primary={nav.navItem} />
            {nav.subcomponent?.length > 0 && (
              <span>
                {openCollapse[nav.navLink] ? <ExpandLess /> : <ExpandMore />}
              </span>
            )}
          </ListItemButton>
          <Collapse in={openCollapse[nav.navLink]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {nav.subcomponent?.map((subNav) => (
                <ListItemButton
                  key={subNav.id}
                  onClick={() => navigate(subNav.navLink)}
                  className={classNames("!rounded-lg")}
                  sx={{
                    pl: 4,
                    color: window.location.pathname === subNav.navLink ? 'var(--primary)' : 'var(--text-muted)',
                    '&:hover': { backgroundColor: 'var(--input-bg)' },
                  }}
                >
                  <ListItemIcon sx={{ color: window.location.pathname === subNav.navLink ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {subNav.navIcon}
                  </ListItemIcon>
                  <ListItemText primary={subNav.navItem} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}

      <List>
        <ListItemButton
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/");
          }}
          sx={{
            color: '#d44',
            '&:hover': { backgroundColor: 'rgba(200,60,60,0.1)' },
          }}
        >
          <ListItemIcon sx={{ color: '#d44' }}><Logout /></ListItemIcon>
          <ListItemText primary={"Logout"} />
        </ListItemButton>
      </List>
    </List>
  );
};

export default Sidebar;