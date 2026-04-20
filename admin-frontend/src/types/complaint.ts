export interface Complaint {
    address: string,
    complaint_id: number,
    createdAt: string,
    description: string,
    latitude: number,
    longitude: number,
    status: "pending" | "in_progress" | "resolved" | undefined,
    title: string,
    updatedAt: string,
    user_id: number,
    media: Array<{
        media_id: number;
        file_url: string;
        file_type: 'image' | 'video';
    }>;
    AdminstrativeComments: AdminstrativeComments[]
    user: {
        name: string,
        email: string
    }

    worker: Worker
    availableWorker: Worker[]
    workerId: number | null
    workAssigneds: {
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
    category:string
};



export interface AdminstrativeComments extends Complaint {
    id: string
    type: string
    comment: string
}

export interface Worker {
    id: number
    name: string
}