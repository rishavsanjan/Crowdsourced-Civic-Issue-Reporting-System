import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import AdminHome from "./components/homepage";
import ReportDetail from "./components/complaintdetails";
import AdminLogin from "./components/login";
import AdminSignup from "./components/signup";
import MyMapAll from "./components/alllocationsmap";
import Dashboard from "./components/dashboard";

function App() {


  function AppContent() {

    return (
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/details/:complaint_id" element={<ReportDetail />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={< AdminSignup />} />
        <Route path="/my-map-all" element={< MyMapAll />} />
        <Route path="/dashboard" element={< Dashboard />} />
      </Routes>
    )
  }

  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  )
}

export default App
