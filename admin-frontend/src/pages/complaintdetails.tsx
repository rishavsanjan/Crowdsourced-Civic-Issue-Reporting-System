import axios from 'axios';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MyMap from './map';
import { formatDate } from '../utils/helper';
import { useQuery } from '@tanstack/react-query';
import ReportDetails from '../components/ReportDetails';
import MediaCard from '../components/MediaCard';
import CommentCard from '../components/CommentCard';
import StatusChange from '../components/StatusChange';
import CitizenCard from '../components/CitizenCard';
import type { Complaint } from '../types/complaint';



const ReportDetail: React.FC = () => {
    const [status, setStatus] = useState<"pending" | "in_progress" | "resolved" | undefined>('pending');
    const { complaint_id } = useParams();

    const { data } = useQuery({
        queryKey: ['complaint', complaint_id],
        queryFn: async () => {
            const response = await axios({
                url: `http://localhost:3000/api/admin/details/${complaint_id}`,
                method: 'get'
            });
            setStatus(response.data.complaint.status)
            console.log(response.data)
            return response.data.complaint as Complaint;
        }
    })






    console.log(status)
    if (!complaint_id || !data) return;
    return (
        <div className="flex h-screen bg-gray-100 light:bg-gray-900">

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-sm">
                            <Link to={'/'}>
                                <a className="text-blue-600 hover:underline" href="#">Reports</a>
                            </Link>

                            <span className="text-gray-400">/</span>
                            <span className="text-gray-900 light:text-white">Report #{data?.complaint_id}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 light:text-white mt-2">{data?.title}</h1>

                        <p className="text-gray-500 light:text-gray-400 mt-1">Reported on {formatDate(data?.createdAt || 'N/A')} a verified citizen.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Report Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Report Details Card */}

                            <ReportDetails data={data} />

                            {/* Attached Media Card */}
                            <MediaCard data={data} />

                            {/* Geo-tagged Location Card */}
                            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm">
                                <h2 className="text-xl font-bold p-6">Geo-tagged Location</h2>
                                <MyMap lat={data?.latitude || 78} lng={data?.longitude || 23} />
                            </div>

                            {/* History & Comments Card */}
                            <CommentCard data={data} complaint_id={complaint_id} />
                        </div>

                        {/* Right Column - Sidebar Actions */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Admin Actions Card */}

                            <StatusChange data={data} complaint_id={complaint_id} status={status} setStatus={setStatus} />

                            {/* Citizen Details Card */}
                            
                            <CitizenCard data={data} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetail;