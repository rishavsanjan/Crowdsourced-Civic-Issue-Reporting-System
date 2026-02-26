export interface Jobs {
    complaint_id: number;
    title: string;
    description: string;
    status: 'in-progress' | 'pending' | 'completed';
    address: string;
    dueTime?: string;
    isPriority?: boolean;
    hasEvidence?: boolean;
    teamMember?: string;
}

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
    media: {
        media_id: number;
        file_url: string;
        file_type: 'image' | 'video';
    }[];
    worker: Worker

};


export interface Worker {
    id: number
    name: string
}

export interface JobDetails {
    complaint: Complaint

    complaint_id: number
    createdAt: string
    id: number
    status: 'in-progress' | 'pending' | 'completed',
    worker_id: number
    instructions: string[]
    worker: Worker
}