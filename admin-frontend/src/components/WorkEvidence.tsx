interface WorkAssigned {
    id: number;
    complaint_id: number;
    worker_id: number;
    status: 'pending' | 'completed';
    workerComment?: string;
    createdAt: string;
    updatedAt: string;
    media: {
        file_type: 'image' | 'video';
        file_url: string;
        uploaded_at: Date;
    }[];
}

const WorkAssignedCard = ({ workAssigneds }: { workAssigneds: WorkAssigned }) => {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-4">

            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Work assigned</span>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    workAssigneds.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {workAssigneds.status}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {[
                    { label: 'Worker', value: `#${workAssigneds.worker_id}` },
                    { label: 'Complaint', value: `#${workAssigneds.complaint_id}` },
                    { label: 'Assigned', value: formatDate(workAssigneds.createdAt) },
                    { label: 'Updated', value: formatDate(workAssigneds.updatedAt) },
                ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                ))}
            </div>

            {workAssigneds.workerComment && (
                <div className="border-t border-gray-100 pt-4 mb-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1.5">Worker comment</p>
                    <p className="text-sm text-gray-700 italic">"{workAssigneds.workerComment}"</p>
                </div>
            )}

            {workAssigneds.media.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-3">Proof media</p>
                    <div className="flex flex-wrap gap-2">
                        {workAssigneds.media.map((item, index) => (
                            <div key={index} className="w-24 h-24 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                {item.file_type === 'image' ? (
                                    <img
                                        src={item.file_url}
                                        alt="proof"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={item.file_url}
                                        className="w-full h-full object-cover"
                                        controls
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default WorkAssignedCard;