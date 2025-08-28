import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import { GeneralContextProvider } from "./GeneralContext";
import Profile  from "./Profile";
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (

  
<>


      <div className="dashboard-main">
        <GeneralContextProvider>
          <WatchList />
        </GeneralContextProvider>
        
        <div className="content">
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
      </>
  );
};

export default Dashboard;
