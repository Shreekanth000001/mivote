import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import Category from "./category";
import Candidates from "./candidates";
import Voters from "./voters";


const Home = () => {
  const location = useLocation();
  const [category, setCategory] = useState([]);
  const fetchClasses = () => {
    fetch("http://localhost:3000/category/show")
      .then((response) => response.json())
      .then((data) => setCategory(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }

  useEffect(() => {
    fetchClasses();
  }, [location.pathname]);

  const renderContent = () => {
    if (location.pathname === "/") {
      return <Voters />;

    }
    else if (location.pathname.startsWith('/category/')) {
      const voterid = location.pathname.split('/')[2];
      return <Category voterid={voterid} />;
    }
    else if (location.pathname.startsWith('/candidates/')) {
      const category = location.pathname.split('/')[2];
      return <Candidates category={category} />;
    }
    return null;
  };

  return (
    <div className="App bg-[#F1F5F9] tracking-wide min-h-screen">
      <div className="md:flex tracking-wider pb-2 md:mb-0">
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
