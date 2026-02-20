import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import AdminHome from "./pages/homepage";
import ReportDetail from "./pages/complaintdetails";
import AdminLogin from "./pages/login";
import AdminSignup from "./pages/signup";
import MyMapAll from "./pages/alllocationsmap";
import Dashboard from "./pages/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {

  const queryClient = new QueryClient();
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
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>

    </>
  )
}

export default App
