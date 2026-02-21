import React, { type SetStateAction } from 'react'
import type { Complaint } from '../types/complaint'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
interface Props {
    data: Complaint
    complaint_id: string
    status: "pending" | "in_progress" | "resolved" | undefined
    setStatus: React.Dispatch<SetStateAction<"pending" | "in_progress" | "resolved" | undefined>>
}


export interface UpdateComplaintPayload {
    complaintId: number;
    status: "pending" | "in_progress" | "resolved" | undefined;
}

const StatusChange: React.FC<Props> = ({ data, complaint_id, status, setStatus }) => {
    const queryClient = useQueryClient();
    const updateStatusMutation = useMutation<Complaint, Error, UpdateComplaintPayload, { previousData?: Complaint }>({
        mutationKey: ['update-status'],
        mutationFn: async (variables: UpdateComplaintPayload) => {
            const token = localStorage.getItem('admincitytoken');
            const response = await axios(`http://localhost:3000/api/admin/update-status`, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    complaint_id: variables.complaintId,
                    newStatus: variables.status,

                }
            })
            console.log(response.data)
            return response.data.updateStatus

        },
        onMutate: async (newData) => {
            await queryClient.cancelQueries({
                queryKey: ['complaint', complaint_id],
            });

            const previousData = queryClient.getQueryData<Complaint>(['complaint', complaint_id])

            queryClient.setQueryData<Complaint>(["complaint", complaint_id], (old) =>
                old ? { ...old, status: newData.status } : old
            )

            return { previousData };
        },
        onError: (_err, newData, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(
                    ["complaint", newData.complaintId],
                    context.previousData
                );
            }
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["complaint", variables.complaintId],
            });
        },
    })
    return (

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

                        value={status}
                        //@ts-ignore
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value={'in_progress'}>In Progress</option>
                        <option value={'pending'}>Pending</option>
                        <option value={'resolved'}>Resolved</option>
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
                <button
                    onClick={() => {
                        updateStatusMutation.mutate({
                            complaintId: parseInt(complaint_id),
                            status: status,
                        })
                    }} disabled={data?.status == status || updateStatusMutation.isPending} className={`${data?.status == status ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} w-full px-4 py-2  text-white rounded-lg font-medium  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 light:focus:ring-offset-gray-900 items-center disabled:cursor-not-allowed`}>
                    {
                        updateStatusMutation.isPending ?
                            <ClipLoader color="#fffff" size={25} speedMultiplier={0.8} />
                            :
                            data?.status == status ? 'Change Status' : 'Update Status'

                    }
                </button>
            </div>
        </div>
    )
}

export default StatusChange