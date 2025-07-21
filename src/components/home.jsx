import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import Category from "./category";
import Candidates from "./candidates";
import Voters from "./voters";


const Home = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname === "/") {
      return <Voters />;

    }
    else if (location.pathname.startsWith('/candidates')) {
      return <Candidates/>;
    }
    return null;
  };

  return (
    <div className="App bg-[#F9FAFB] tracking-wide min-h-screen">
      <div className="md:flex tracking-wider md:mb-0 flex flex-col min-h-screen">

        <header className="bg-white shadow-md">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-8 h-8 text-indigo-600" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg>
              <h1 className="text-2xl font-bold text-gray-800">Student Council Election</h1>
            </div>
            <div className="text-sm font-semibold text-gray-600">Spring 2025</div>
          </div>
        </header>

        {renderContent()}
        <footer className="bg-gray-800 text-white mt-auto w-full">
          <div className="container mx-auto px-6 py-4 text-center">
            <p>&copy; 2025 MIMS. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
