import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Sidebar from '../Shared/Sidebar';
import MobileNavigation from '../Shared/Sidebar/MobileNavigation';

const AdminLayout = ({ component, navItem, navLink, id }) => {
  const isMediumScreen = useMediaQuery({ maxWidth: 1000 });

  return (
    <div
      style={{ backgroundColor: 'var(--bg-dark)' }}
      className="lg:flex lg:h-screen h-[110vh] !w-[100vw] !overflow-x-hidden"
    >
      {!isMediumScreen ? <Sidebar /> : <MobileNavigation />}

      <div
        className="flex flex-col gap-3 h-screen lg:!w-[calc(100vw-16vw)] w-full !overflow-x-auto lg:p-5"
        style={{ backgroundColor: 'var(--bg-dark)' }}
      >
        <div className="flex flex-col overflow-y-auto w-full lg:h-[83vh] !h-[100vh] glass lg:!p-1 !rounded-md">
          {component}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;