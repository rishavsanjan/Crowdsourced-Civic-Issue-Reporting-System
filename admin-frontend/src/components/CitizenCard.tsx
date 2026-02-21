import React from 'react'
import type { Complaint } from '../types/complaint'

interface Props {
    data: Complaint
}

const CitizenCard: React.FC<Props> = ({ data }) => {
    return (
        <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Citizen Details</h2>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <p className="font-medium">{data?.user.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z" />
                    </svg>
                    <p className="font-mono text-gray-500 light:text-gray-400">{data?.user.email}</p>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 light:bg-green-900 light:text-green-300">Verified</span>
                </div>
            </div>
        </div>
    )
}

export default CitizenCard