import React from 'react'
import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title);

type StatusPieChartProps = {
    pending: number;
    in_progress: number;
    resolved: number;
};


const StatusPieChart: React.FC<StatusPieChartProps> = ({ pending, in_progress, resolved }) => {
    const data = {
        labels: ["Pending", "In Progress", "Resolved"],
        datasets: [
            {
                label: "Issue Status",
                data: [pending, in_progress, resolved],
                backgroundColor: ["#FF9800", "#2196F3", "#4CAF50"],
                borderColor: ["#fff", "#fff", "#fff"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" },
            title: {
                display: true,
                text: "Issue Status Distribution",
                font: { size: 18 },
            },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 w-[350px] md:w-[450px] mx-auto">
            {/* @ts-ignore */}
            <Pie data={data} options={options} />
        </div>
    );
}

export default StatusPieChart