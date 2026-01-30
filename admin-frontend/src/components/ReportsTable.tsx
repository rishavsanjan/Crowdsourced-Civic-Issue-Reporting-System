import React, { type SetStateAction } from 'react'
import type { Complaint } from '../types/complaint';
import { Link } from 'react-router-dom';

interface Props {
    complaints : Complaint[]
    searchQuery: string,
    setSearchQuery: React.Dispatch<SetStateAction<string>>
    statusFilter: string
    setStatusFilter: React.Dispatch<SetStateAction<string>>
    categoryFilter: string
    setCategoryFilter: React.Dispatch<SetStateAction<string>>
    setSortFilter: React.Dispatch<SetStateAction<string>>
    sortFilter: string
    filteredComplaints: Complaint[]


}

const ReportsTable: React.FC<Props> = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, sortFilter, setSortFilter, filteredComplaints, complaints }) => {

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
    )
}

export default ReportsTable