import React, { useState } from 'react'
import type { AdminstrativeComments, Complaint } from '../types/complaint'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Props {
    data: Complaint
    complaint_id: string
}

const CommentCard: React.FC<Props> = ({ data, complaint_id }) => {
    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState('');
    const queryClient = useQueryClient();   
    
    const addCommentMutation = useMutation({
        mutationKey: ['add-comment'],
        mutationFn: async () => {

            const token = localStorage.getItem('admincitytoken');
            console.log(token)
            const response = await axios(`http://localhost:3000/api/admin/add-comment`, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    comment, commentType, complaint_id
                }
            })

            return response.data.addComment;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['complaint', complaint_id] });

            const previousData = queryClient.getQueryData<Complaint>(['complaint', complaint_id]);

            queryClient.setQueryData<Complaint>(['complaint', complaint_id], (old) =>
                old ? {
                    ...old,
                    AdminstrativeComments: [
                        ...old.AdminstrativeComments,
                        { id: 'temp', comment, type: commentType, createdAt: new Date().toISOString() } as AdminstrativeComments
                    ]
                } : old
            );

            return { previousData };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(['complaint', complaint_id], context.previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['complaint', complaint_id] });
            setComment('');
            setCommentType('');
        },
    })

    return (
        <div className="bg-white light:bg-gray-800 rounded-lg shadow-sm p-6 gap-4 flex flex-col">
            <h1 className="text-2xl font-bold">Adminstrative Comments</h1>
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
                <textarea
                    required
                    value={comment}
                    onChange={(e) => { setComment(e.target.value) }} className="w-full  focus:border-blue-500 outline-none transition-colors duration-300 pb-8 border-2 p-2 border-gray-300 rounded-md"
                    placeholder="Enter adminstrative comments here..." name="" id=""></textarea>
            </div>
            <div className="gap-2 flex">
                <button
                    onClick={() => { addCommentMutation.mutate() }}
                    disabled={comment.length < 10 || !commentType}
                    className="cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-[#746acb] hover:shadow-md bg-gradient-to-r from-[#7668EB] to-[#968DF9] p-2 px-4 rounded-xl text-white font-bold disabled:cursor-not-allowed disabled:opacity-25">ADD COMMENT</button>
                <button
                    onClick={() => { setComment('') }} className="cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-[#7cb6f0] hover:shadow-md bg-gradient-to-r from-[#6AB4FC] to-[#198CE7] p-2 px-4 rounded-xl text-white font-bold">CLEAR</button>
            </div>
            <h1 className="font-semibold text-lg">Previous Comments</h1>
            {
                data?.AdminstrativeComments.map((item) => {
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
                data?.AdminstrativeComments.length === 0 &&
                <div>
                    <h1 className="text-center text-xl text-gray-400 font-medium">No Comments has been made by the adminstartion yet!</h1>
                </div>
            }
        </div>
    )
}

export default CommentCard