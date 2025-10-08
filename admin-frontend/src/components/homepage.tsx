import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";




interface Complaint {
  complaint_id: string;
  status: 'pending' | 'in_progress' | 'resolved';
  address: string;
  createdAt: string;
  date: string;
  media: [];
}

const AdminHome: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [categoryFilter, setCategoryFilter] = useState('Category: All');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [sortFilter, setSortFilter] = useState('new');
  const navigate = useNavigate();

  const getReports = async () => {
    const token = localStorage.getItem('admincitytoken');
    if (!token) {
      navigate("/admin-signup");
    }
    const response = await axios({
      url: `http://127.0.0.1:3000/api/admin/admin-home`,
      method: 'get'
    });
    setComplaints(response.data.complaints);
    setFilteredComplaints(response.data.complaints);
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
        //@ts-ignore
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        //@ts-ignore
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setFilteredComplaints(sortedComplaints)
  }, [sortFilter]);

  console.log(statusFilter)



  const getStatusColor = (status: Complaint['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 light:bg-blue-900 light:text-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 light:bg-yellow-900 light:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 light:bg-green-900 light:text-green-300';
    }
  };

  function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}-${day}-${year}`;
  }

  return (
    <div className="flex h-screen bg-gray-100 light:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white light:bg-gray-800 flex-shrink-0 border-r border-gray-200 light:border-gray-700">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 py-4">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 light:text-white">CityFix</h1>
          </div>
          <nav className="mt-8 flex-1">
            <ul className="space-y-2">
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                  <span className="font-medium">Dashboard</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded bg-blue-50 light:bg-blue-900/20 text-blue-600 font-medium" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                  </svg>
                  <span className="font-medium">Reports</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                  </svg>
                  <span className="font-medium">Users</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                  <span className="font-medium">Settings</span>
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                  </svg>
                  <span className="font-medium">Help</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              <span className="font-medium">Logout</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 light:text-white">Reports Dashboard</h1>
            <p className="text-gray-500 light:text-gray-400 mt-1">Manage and track all reported civic issues.</p>
          </header>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white light:bg-gray-800 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500 light:text-gray-400">New</p>
              <p className="text-3xl font-bold text-gray-900 light:text-white mt-1">25</p>
            </div>
            <div className="bg-white light:bg-gray-800 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500 light:text-gray-400">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 light:text-white mt-1">75</p>
            </div>
            <div className="bg-white light:bg-gray-800 p-6 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500 light:text-gray-400">Resolved</p>
              <p className="text-3xl font-bold text-gray-900 light:text-white mt-1">150</p>
            </div>
          </section>

          {/* Reports Table */}
          <section>
            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 light:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 light:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <input
                      className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 light:border-gray-600 bg-gray-50 light:bg-gray-900 text-gray-900 light:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search by ID..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <select
                        className="appearance-none w-full md:w-auto bg-gray-50 light:bg-gray-900 border border-gray-300 light:border-gray-600 text-gray-700 light:text-gray-300 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value={'all'}>Status: All</option>
                        <option value={'pending'}>Pending</option>
                        <option value={'in_progress'}>In Progress</option>
                        <option value={'resolved'}>Resolved</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 light:text-gray-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        className="appearance-none w-full md:w-auto bg-gray-50 light:bg-gray-900 border border-gray-300 light:border-gray-600 text-gray-700 light:text-gray-300 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <option>Category: All</option>
                        <option>Roads</option>
                        <option>Water</option>
                        <option>Waste</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 light:text-gray-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        className="appearance-none w-full md:w-auto bg-gray-50 light:bg-gray-900 border border-gray-300 light:border-gray-600 text-gray-700 light:text-gray-300 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        
                        onChange={(e) => setSortFilter(e.target.value)}
                      >
                        <option value={'new'}>Sort by : {`${sortFilter}`}</option>
                        <option value={'new'}>Newest first</option>
                        <option value={'old'}>Oldest first</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 light:text-gray-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 light:border-gray-600 bg-gray-50 light:bg-gray-900 text-gray-700 light:text-gray-300 hover:bg-gray-100 light:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                      </svg>
                      <span>Date Range</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 light:border-gray-600 bg-gray-50 light:bg-gray-900 text-gray-700 light:text-gray-300 hover:bg-gray-100 light:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>Location</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 light:text-gray-400">
                  <thead className="text-xs text-gray-700 light:text-gray-300 uppercase bg-gray-50 light:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3" scope="col">Report ID</th>
                      <th className="px-6 py-3" scope="col">Status</th>
                      <th className="px-6 py-3 w-96" scope="col">Location</th>
                      {/* <th className="px-6 py-3" scope="col">Reported By</th> */}
                      <th className="px-6 py-3" scope="col">Date</th>
                      <th className="px-6 py-3" scope="col">Media</th>
                      <th className="px-6 py-3" scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((report, index) => (
                      <tr key={report.complaint_id} className={`bg-white light:bg-gray-800 hover:bg-gray-50 light:hover:bg-gray-600 ${index !== complaints.length - 1 ? 'border-b light:border-gray-700' : ''}`}>
                        <th className="px-6 py-4 font-medium text-gray-900 light:text-white whitespace-nowrap" scope="row">
                          {report.complaint_id}
                        </th>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{report.address}</td>
                        {/* <td className="px-6 py-4">{report.reportedBy}</td> */}
                        <td className="px-6 py-4">{formatDate(report.createdAt)}</td>
                        <td className="px-6 py-4">
                          {
                            report.media.length > 0 ?
                              <p className='text-black'>Yes</p>
                              :
                              <p className='text-black'>No</p>
                          }

                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/details/${report.complaint_id}`} >
                            <button className="font-medium text-blue-600 hover:underline" >
                              View
                            </button>
                          </Link>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;