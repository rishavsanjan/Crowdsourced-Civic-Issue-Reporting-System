import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import AdminHome from "./components/homepage";
import ReportDetail from "./components/complaintdetails";
import AdminLogin from "./components/login";
import AdminSignup from "./components/signup";

function App() {


  function AppContent() {

    return (
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/details/:complaint_id" element={<ReportDetail />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={< AdminSignup/>} />
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
