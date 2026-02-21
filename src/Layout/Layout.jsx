import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children, role = 'patient', userName = 'John Doe' }) => {
const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
// auto responsive
useEffect(() => {
  const handleResize = () => {
    const desktop = window.innerWidth >= 1024;
    setIsDesktop(desktop);
    setIsSidebarOpen(desktop);
  };

  handleResize(); // run once
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
    isDesktop
      ? isSidebarOpen
        ? 'ml-64'
        : 'ml-20'
      : 'ml-0'
  }`}
>

        {/* Navbar */}
        <Navbar 
          role={role} 
          userName={userName} 
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content */}
        <main className="p-2 bg-blue-100">
  {children ? children : <Outlet />}
</main>

      </div>
    </div>
  );
};

export default Layout;