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