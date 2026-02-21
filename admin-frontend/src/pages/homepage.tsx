import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import ReportsStats from '../components/ReportsStats';
import ReportsTable from '../components/ReportsTable';
import type { Complaint } from '../types/complaint';



const AdminHome: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [categoryFilter, setCategoryFilter] = useState('Category: All');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [sortFilter, setSortFilter] = useState('new');

  const [complainCounts, setComplainCounts] = useState({
    resloved: 0,
    pending: 0,
    in_progress: 0
  });

  const navigate = useNavigate();

  const getReports = async () => {
    const token = localStorage.getItem('admincitytoken');
    if (!token) {
      navigate("/admin-signup");
    }
    const response = await axios({
      url: `http://localhost:3000/api/admin/admin-home`,
      method: 'get'
    });
    setComplaints(response.data.complaints);
    setFilteredComplaints(response.data.complaints);
    setComplainCounts(response.data.countComplaints)
    console.log(response.data)
  };

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredComplaints(complaints)
    } else {
      setFilteredComplaints(
        complaints.filter((complaint) => complaint.status === statusFilter)
      );
    }
  }, [statusFilter]);

  useEffect(() => {
    const sortedComplaints = [...complaints].sort((a, b) => {
      if (sortFilter === 'new') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setFilteredComplaints(sortedComplaints);
  }, [sortFilter, complaints]);







  return (
    <div className="flex h-screen bg-gray-100 light:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 light:text-white">Reports Dashboard</h1>
            <p className="text-gray-500 light:text-gray-400 mt-1">Manage and track all reported civic issues.</p>
          </header>

          {/* Stats Cards */}
          <ReportsStats complainCounts={complainCounts} />

          {/* Reports Table */}
          <ReportsTable
            complaints={complaints}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            setSortFilter={setSortFilter}
            sortFilter={sortFilter}
            filteredComplaints={filteredComplaints}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminHome;