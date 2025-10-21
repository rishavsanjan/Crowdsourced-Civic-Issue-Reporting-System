import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MyMap from './map';
import { ClipLoader } from 'react-spinners';

interface Complaint {
    address: string,
    complaint_id: number,
    createdAt: string,
    description: string,
    latitude: number,
    longitude: number,
    status: string,
    title: string,
    updatedAt: string,
    user_id: number,
    media: Array<{
        media_id: number;
        file_url: string;
        file_type: 'image' | 'video';
    }>;
    comments: AdminstrativeComments[]
    user: {
        name: string,
        email: string
    }
};



interface AdminstrativeComments extends Complaint {
    id: string
    type: String
    comment: string
}

const ReportDetail: React.FC = () => {
    const [status, setStatus] = useState('pending');
    const [category, setCategory] = useState('Roads & Streets');
    const { complaint_id } = useParams();
    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState('');
    const [comments, setComments] = useState<AdminstrativeComments[]>([]);
    const [complainDetails, setComplaindetails] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(false);


    const getReportDetails = async () => {
        const response = await axios({
            url: `http://192.168.29.105:3000/api/admin/details/${complaint_id}`,
            method: 'get'
        });
        setComplaindetails(response.data.complaint);
        setComments(response.data.complaint.AdminstrativeComments);
        console.log(response.data);
        setStatus(response.data.complaint.status)
    };

    useEffect(() => {
        getReportDetails();
    }, []);





    const addComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('commentType', commentType);
        const token = localStorage.getItem('admincitytoken');
        console.log(token)
        const response = await axios(`http://192.168.29.105:3000/api/admin/add-comment`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                comment, commentType, complaint_id
            }
        })
        console.log(response.data);
        setComments(prev => [...prev, response.data.addComment]);
        setComment('');
        setCommentType('');
    }

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

    const getStatusText = (status: Complaint['status']) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in_progress':
                return 'In Progress';
            case 'resolved':
                return 'Resolved';
        }
    };

    const updateStatusText = (status: Complaint['status']) => {
        switch (status) {
            case 'Pending':
                return 'pending';
            case 'In Progress':
                return 'in_progress';
            case 'Resolved':
                return 'resolved';
        }
    };

    function formatDate(isoDate: string): string {
        const date = new Date(isoDate);
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${month}-${day}-${year}`;
    }

    const updateStatus = async () => {
        setLoading(true)
        const token = localStorage.getItem('admincitytoken');
        const response = await axios(`http://192.168.29.105:3000/api/admin/update-status`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                complaint_id, newStatus: status
            }
        })
        setComplaindetails(prev => prev ? { ...prev, status } : prev);
        setLoading(false)
    }

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
                            <span className="text-gray-900 light:text-white">Report #{complainDetails?.complaint_id}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 light:text-white mt-2">{complainDetails?.title}</h1>

                        <p className="text-gray-500 light:text-gray-400 mt-1">Reported on {formatDate(complainDetails?.createdAt || 'N/A')} a verified citizen.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Report Details */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Report Details Card */}
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

                            {/* Attached Media Card */}
                            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Attached Media</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {complainDetails?.media.map((media, index) => (
                                        <div key={media.media_id}>
                                            {
                                                media.file_type === 'image' &&
                                                <img
                                                    key={index}
                                                    alt={`Pothole Image ${index + 1}`}
                                                    className="rounded-lg object-cover w-full h-32 cursor-pointer hover:opacity-80 transition-opacity"
                                                    src={media.file_url}
                                                />
                                            }

                                            {
                                                media.file_type === 'video' &&
                                                <video
                                                    key={index}
                                                    src={media.file_url}
                                                />
                                            }

                                        </div>


                                    ))}
                                </div>
                            </div>

                            {/* Geo-tagged Location Card */}
                            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm">
                                <h2 className="text-xl font-bold p-6">Geo-tagged Location</h2>
                                <MyMap lat={complainDetails?.latitude || 78} lng={complainDetails?.longitude || 23} />
                            </div>

                            {/* History & Comments Card */}
                            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6 gap-4 flex flex-col">
                                <h1 className="text-2xl font-bold">Adminstrative Comments</h1>
                                <form onSubmit={addComment}>
                                    <div>
                                        <p className="text-gray-500">Comment Type</p>
                                        <select required
                                            className="w-full border-2 p-2 border-gray-300 rounded-md focus:border-blue-500 outline-none transition-colors duration-300"
                                            onChange={(e) => { setCommentType(e.target.value) }} defaultValue="" >
                                            <option value="" disabled>Select a comment type</option>
                                            <option value="internal">Internal</option>
                                            <option value="public">Public Statement</option>
                                            <option value="status">Status Change</option>
                                        </select>
                                    </div>
                                    <div>
                                        <h1 className="text-gray-500">Comment</h1>
                                        <textarea required onChange={(e) => { setComment(e.target.value) }} className="w-full  focus:border-blue-500 outline-none transition-colors duration-300 pb-8 border-2 p-2 border-gray-300 rounded-md"
                                            placeholder="Enter adminstrative comments here..." name="" id=""></textarea>
                                    </div>
                                    <div className="gap-2 flex">
                                        <button type="submit" className="cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-[#746acb] hover:shadow-md bg-gradient-to-r from-[#7668EB] to-[#968DF9] p-2 px-4 rounded-xl text-white font-bold">ADD COMMENT</button>
                                        <button type="reset" onClick={() => { setComment('') }} className="cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-[#7cb6f0] hover:shadow-md bg-gradient-to-r from-[#6AB4FC] to-[#198CE7] p-2 px-4 rounded-xl text-white font-bold">CLEAR</button>
                                    </div>
                                </form>
                                <h1 className="font-semibold text-lg">Previous Comments</h1>
                                {
                                    comments.map((item) => {
                                        return (
                                            <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3 py-5 gap-2 flex flex-col" key={item.id}>
                                                <div className="flex justify-between">
                                                    <h1 className="font-medium">Admin User ({item.type})</h1>
                                                    <p>{(item.createdAt)}</p>
                                                </div>
                                                <p>{item.comment}</p>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    comments.length === 0 &&
                                    <div>
                                        <h1 className="text-center text-xl text-gray-400 font-medium">No Comments has been made by the adminstartion yet!</h1>
                                    </div>
                                }
                            </div>
                        </div>

                        {/* Right Column - Sidebar Actions */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Admin Actions Card */}
                            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 light:text-gray-400 mb-1" htmlFor="status">
                                            Update Status
                                        </label>
                                        <select
                                            className="block w-full px-3 py-2 text-base border border-gray-300 light:border-gray-600 bg-white light:bg-gray-700 text-gray-900 light:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                            id="status"

                                            value={getStatusText(status || 'N/A')}
                                            //@ts-ignore
                                            onChange={(e) => setStatus(updateStatusText(e.target.value))}
                                        >
                                            <option>In Progress</option>
                                            <option>Pending</option>
                                            <option>Resolved</option>
                                        </select>
                                    </div>
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-500 light:text-gray-400 mb-1" htmlFor="category">
                                            Reclassify
                                        </label>
                                        <select
                                            className="block w-full px-3 py-2 text-base border border-gray-300 light:border-gray-600 bg-white light:bg-gray-700 text-gray-900 light:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option>Roads & Streets</option>
                                            <option>Water & Sewage</option>
                                            <option>Garbage</option>
                                            <option>Streetlights</option>
                                            <option>Public Parks</option>
                                        </select>
                                    </div> */}
                                    <button  onClick={updateStatus} disabled={complainDetails?.status == status || loading} className={`${complainDetails?.status == status ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} w-full px-4 py-2  text-white rounded-lg font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 light:focus:ring-offset-gray-900 items-center`}>
                                        {
                                            loading ?
                                                <ClipLoader color="#fffff" size={25} speedMultiplier={0.8} />
                                                :
                                                complainDetails?.status == status ? 'Change Status' : 'Update Status'

                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Citizen Details Card */}
                            <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4">Citizen Details</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                        <p className="font-medium">{complainDetails?.user.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z" />
                                        </svg>
                                        <p className="font-mono text-gray-500 light:text-gray-400">{complainDetails?.user.email}</p>
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 light:bg-green-900 light:text-green-300">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportDetail;