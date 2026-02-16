import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children, role = 'patient', userName = 'John Doe' }) => {
const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

// auto responsive
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={role} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          `lg:${isSidebarOpen ? 'ml-64' : 'ml-20'}`
        }`}
      >
        {/* Navbar */}
        <Navbar 
          role={role} 
          userName={userName} 
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content */}
        <main className="p-6">
  {children ? children : <Outlet />}
</main>

      </div>
    </div>
  );
};

export default Layout;