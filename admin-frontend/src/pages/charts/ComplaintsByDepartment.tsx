import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
    data: Record<string, number>;
}

const formatLabel = (key: string) =>
    key
        .replace(/_(DEPARTMENT|ADMINISTRATION|OFFICE|DIVISION)$/i, '')
        .replace(/_AND_/gi, ' & ')
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());

const ComplaintsByDepartment = ({ data }: Props) => {
    const labels = Object.keys(data).map(formatLabel);
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [{
            label: 'Complaints',
            data: values,
            backgroundColor: '#85B7EB',
            borderColor: '#378ADD',
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false as const,
        }],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: any) =>
                        ` ${ctx.parsed.x} complaint${ctx.parsed.x !== 1 ? 's' : ''}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 },
                grid: { color: 'rgba(128,128,128,0.12)' },
            },
            y: {
                grid: { display: false },
            },
        },
    };

    const height = Object.keys(data).length * 52 + 64;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900">Complaints by department</p>
            <p className="text-xs text-gray-400 mb-4">Volume filed per department</p>
            <div style={{ height }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default ComplaintsByDepartment;