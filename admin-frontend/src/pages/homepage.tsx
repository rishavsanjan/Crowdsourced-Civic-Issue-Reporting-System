import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from './dashboard';
import Analytics from './analytics';
import MyMapAll from './alllocationsmap';



const AdminHome: React.FC = () => {
  const [activetab, setActiveTab] = useState<"dashboard" | "map" | "analytics">("dashboard");

  return (
    <div className="flex h-screen bg-gray-100 light:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activeTab={activetab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      {
        activetab === "dashboard" &&
        <Dashboard />
      }
      {
        activetab === "analytics" &&
        <Analytics />
      }
      {
        activetab === "map" &&
        <MyMapAll />
      }
    </div>
  );
};

export default AdminHome;