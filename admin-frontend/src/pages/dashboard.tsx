import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import StatusPieChart from './charts/statuspiechart';
import ComplaintsOverTimeChart from './charts/ComplaintsOverTimeChart';



const Dashboard = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any>(null);

  const [complainCounts, setComplainCounts] = useState({
    resloved: 0,
    pending: 0,
    in_progress: 0
  });

  const getStats = async () => {
    const token = localStorage.getItem('admincitytoken');
    console.log(token)
    if (!token) {
      navigate("/admin-signup");
    }
    const response = await axios({
      url: `http://localhost:3000/api/admin/admin-dashboard`,
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    setComplainCounts(response.data.countComplaints);

    const labels = Object.keys(response.data.monthlyData);
    const data = Object.values(response.data.monthlyData);
    setChartData({
      labels,
      datasets: [
        {
          label: "Complaints Filed Over Time",
          data,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    });
  }

  useEffect(() => {
    getStats()
  }, [])

  return (
    <>
      <div>Dashboard</div>
      <StatusPieChart pending={complainCounts.pending} in_progress={complainCounts.in_progress} resolved={complainCounts.resloved} />
      <ComplaintsOverTimeChart chartData={chartData} />
    </>

  )
}

export default Dashboard