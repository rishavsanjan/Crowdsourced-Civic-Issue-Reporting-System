import React from 'react'

interface Props {
    complainCounts: {
        pending: number
        in_progress: number
        resloved: number
    }
}

const ReportsStats: React.FC<Props> = ({ complainCounts }) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white light:bg-gray-800 p-6 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500 light:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-gray-900 light:text-white mt-1">{complainCounts?.pending || 0}</p>
            </div>
            <div className="bg-white light:bg-gray-800 p-6 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500 light:text-gray-400">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 light:text-white mt-1">{complainCounts?.in_progress || 0}</p>
            </div>
            <div className="bg-white light:bg-gray-800 p-6 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500 light:text-gray-400">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 light:text-white mt-1">{complainCounts?.resloved || 0}</p>
            </div>
        </section>
    )
}

export default ReportsStats