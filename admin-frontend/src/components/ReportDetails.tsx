import React from 'react'

interface Props {
    complainDetails : {
        
    }
}

const ReportDetails = () => {
    return (
        <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Report Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-500 light:text-gray-400">Report ID</p>
                    <p className="font-medium">#{complainDetails?.complaint_id}</p>
                </div>
                <div>
                    <p className="text-gray-500 light:text-gray-400">Status</p>
                    <p className="font-medium">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complainDetails?.status || 'N/A')}`}>
                            {/* @ts-ignore */}
                            {getStatusText(complainDetails?.status) || 'N/A'}
                        </span>                                        </p>
                </div>
                <div>
                    <p className="text-gray-500 light:text-gray-400">Category</p>
                    <p className="font-medium">Roads & Streets</p>
                </div>
                <div>
                    <p className="text-gray-500 light:text-gray-400">Date Reported</p>
                    <p className="font-medium">{formatDate(complainDetails?.createdAt || 'N/A')}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-gray-500 light:text-gray-400">Description</p>
                    <p className="font-medium">{complainDetails?.description}</p>
                </div>
            </div>
        </div>
    )
}

export default ReportDetails