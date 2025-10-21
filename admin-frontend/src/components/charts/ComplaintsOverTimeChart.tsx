// src/components/ComplaintsOverTimeChart.tsx
import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface ComplaintsResponse {
    chartData: any
}

const ComplaintsOverTimeChart: React.FC<ComplaintsResponse> = ({ chartData }) => {


    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                text: "Complaints Submitted Each Month",
            },
        },
    };

    if (!chartData) return <p>Loading chart...</p>;

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-3">Complaints Over Time</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ComplaintsOverTimeChart;
