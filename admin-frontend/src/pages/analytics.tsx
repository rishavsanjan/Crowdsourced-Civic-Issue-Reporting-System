import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusPieChart from './charts/statuspiechart';
import ComplaintsOverTimeChart from './charts/ComplaintsOverTimeChart';
import ComplaintsByDepartment from './charts/ComplaintsByDepartment';
import API_BASE_URL from '../config/api';

const Analytics = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any>(null);
  const [complainCounts, setComplainCounts] = useState({
    resloved: 0,
    pending: 0,
    in_progress: 0,
  });
  const [complaintsByDepartment, setComplaintsByDepartment] = useState<Record<string, number>>();

  const total = complainCounts.resloved + complainCounts.pending + complainCounts.in_progress;
  const resolvedPct = total > 0 ? Math.round((complainCounts.resloved / total) * 100) : 0;
  useEffect(() => {
    const getStats = async () => {
      const token = localStorage.getItem('admincitytoken');
      if (!token) { navigate('/admin-signup'); return; }

      const response = await axios({
        url: `${API_BASE_URL}/api/admin/admin-dashboard`,
        method: 'get',
        headers: { Authorization: 'Bearer ' + token },
      });

      setComplainCounts(response.data.countComplaints);
      setComplaintsByDepartment(response.data.complaintsCountByGroup);

      const labels = Object.keys(response.data.monthlyData);
      const data = Object.values(response.data.monthlyData);

      setChartData({
        labels,
        datasets: [{
          label: 'Complaints Filed Over Time',
          data,
          borderColor: '#378ADD',
          backgroundColor: 'rgba(55,138,221,0.08)',
          tension: 0.35,
          fill: true,
        }],
      });
    };

    getStats();
  }, [navigate]);

  return (
    <div className="p-6 space-y-6 w-full">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Complaints overview</p>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-md bg-green-50 text-green-700">
          Live
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Total</p>
          <p className="text-3xl font-medium text-gray-900">{total}</p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Resolved</p>
          <p className="text-3xl font-medium text-green-600">{complainCounts.resloved}</p>
          <p className="text-xs text-green-500 mt-1">{resolvedPct}% of total</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Pending</p>
          <p className="text-3xl font-medium text-amber-500">{complainCounts.pending}</p>
          <p className="text-xs text-gray-400 mt-1">{complainCounts.in_progress} in progress</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900">Status breakdown</p>
          <p className="text-xs text-gray-400 mb-4">Current distribution of all complaints</p>
          <StatusPieChart
            pending={complainCounts.pending}
            in_progress={complainCounts.in_progress}
            resolved={complainCounts.resloved}
          />
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900">Complaints over time</p>
          <p className="text-xs text-gray-400 mb-4">Monthly volume filed</p>
          <ComplaintsOverTimeChart chartData={chartData} />
        </div>
      </div>
      <div>
        {
          complaintsByDepartment &&
          <ComplaintsByDepartment data={complaintsByDepartment} />
        }

      </div>

    </div>
  );
};

export default Analytics;