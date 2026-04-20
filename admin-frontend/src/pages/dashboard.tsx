import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ReportsStats from '../components/ReportsStats';
import ReportsTable from '../components/ReportsTable';
import { useQuery } from '@tanstack/react-query';
import API_BASE_URL from '../config/api';



const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('Category: All');
  const [sortFilter, setSortFilter] = useState('new');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery])





  const navigate = useNavigate();


  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const token = localStorage.getItem('admincitytoken');
      if (!token) {
        navigate("/admin-signup");
        return;
      }

      const result = await axios({
        url: `${API_BASE_URL}/api/admin/admin-home`,
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })

      return result.data;
    }
  });

  console.log(API_BASE_URL)

  const { data: searchData } = useQuery({
    queryKey: ['search', debouncedSearchQuery],
    queryFn: async () => {
      
      const token =  localStorage.getItem('admincitytoken');

      const result = await axios({
        url: `${API_BASE_URL}/api/admin/admin-home?search=${debouncedSearchQuery}`,
        method: 'get',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      console.log(result.data)

      return result.data;
    },
    enabled: debouncedSearchQuery.trim() !== ""
  });

  const complaints = searchData?.complaints || data?.complaints || [];
  const complainCounts = data?.countComplaints || {
    resolved: 0,
    pending: 0,
    in_progress: 0
  };



  const filteredComplaints = complaints
    .filter((c: any) => {
      if (statusFilter === 'all') return true;
      return c.status === statusFilter;
    })
    .sort((a: any, b: any) => {
      return sortFilter === 'new'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  return (



    < main className="flex-1 overflow-y-auto" >
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 light:text-white">Reports Dashboard</h1>
          <p className="text-gray-500 light:text-gray-400 mt-1">Manage and track all reported civic issues.</p>
        </header>

        {/* Stats Cards */}
        <ReportsStats complainCounts={complainCounts} />

        {/* Reports Table */}
        <ReportsTable
          isLoading={isLoading}
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
    </main >
  );
};

export default Dashboard;