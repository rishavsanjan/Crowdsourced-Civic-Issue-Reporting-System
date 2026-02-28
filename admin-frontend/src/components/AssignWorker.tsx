import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import type { Complaint, Worker } from "../types/complaint";
import axios from "axios";
import { ClipLoader } from "react-spinners";



interface Props {
    worker: Worker[]
    complaint_id: string
}






const AssignWorker: React.FC<Props> = ({ worker, complaint_id }) => {
    const [selectedWorker, setSelectedWorker] = useState<Worker>();
    const queryClient = useQueryClient();
    const assignWorkerMutation = useMutation({
        mutationKey: ['complaint', complaint_id],
        mutationFn: async ({ workerId }: { workerId: number; worker: Worker }) => {
            const token = localStorage.getItem('admincitytoken');
            console.log(token)
            const response = await axios(`http://localhost:3000/api/admin/assign-worker`, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    workerId, complaint_id
                }
            })
            console.log(response.data)

            return response.data.worker as Worker;
        },
        onMutate: async ({ worker, workerId }) => {

            await queryClient.cancelQueries({ queryKey: ['complaint', complaint_id] });

            const previousData = queryClient.getQueryData<Complaint>(['complaint', complaint_id]);
            queryClient.setQueryData<Complaint>(['complaint', complaint_id], (old) =>
                old ? { ...old, worker, workerId } : old
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
        },
    })
    return (
        <section className="bg-white light:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 light:border-slate-700">
            <h2 className="text-xl font-bold mb-6">Assign Worker</h2>
            {
                worker ?
                    <>
                        <div className="mb-4">

                            <label
                                className="block text-sm font-medium text-slate-600 light:text-slate-400 mb-1"
                                htmlFor="worker-select"
                            >
                                Select Worker
                            </label>
                            <select
                                id="worker-select"
                                value={selectedWorker?.id || ""}
                                onChange={(e) => {
                                    const selected = worker.find(
                                        (w) => w.id === Number(e.target.value)
                                    );
                                    setSelectedWorker(selected);
                                }}
                                className="w-full rounded-md border border-slate-300 light:border-slate-600 light:bg-slate-700 light:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-1 px-3 py-2 text-sm"
                            >
                                <option value="" disabled>
                                    Choose a worker...
                                </option>
                                {worker.map((w) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>


                        </div>


                        {/* Submit */}
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition duration-200 shadow-sm shadow-blue-500/20 disabled:cursor-not-allowed cursor-pointer disabled:opacity-25"
                            disabled={assignWorkerMutation.isPending || !selectedWorker}
                            onClick={() => {
                                if (selectedWorker) {
                                    assignWorkerMutation.mutate({ workerId: selectedWorker.id, worker: selectedWorker });
                                }
                            }}
                        >
                            {assignWorkerMutation.isPending ? (
                                <ClipLoader color="white" size={20} />
                            ) : (
                                "Assign Task"
                            )}
                        </button>
                    </>
                    :
                    <>
                        <span>No workers available!</span>
                    </>
            }

        </section>
    );
}

export default AssignWorker