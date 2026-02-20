import type { Complaint } from "../types/complaint";

export const getStatusColor = (status: "pending" | "in_progress" | "resolved" | undefined) => {
    switch (status) {
        case 'pending':
            return 'bg-blue-100 text-blue-800 light:bg-blue-900 light:text-blue-300';
        case 'in_progress':
            return 'bg-yellow-100 text-yellow-800 light:bg-yellow-900 light:text-yellow-300';
        case 'resolved':
            return 'bg-green-100 text-green-800 light:bg-green-900 light:text-green-300';
    }
};

export const getStatusText = (status: "pending" | "in_progress" | "resolved" | undefined) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'in_progress':
            return 'In Progress';
        case 'resolved':
            return 'Resolved';
    }
};

export const updateStatusText = (status: Complaint['status']) => {
    switch (status) {
        case 'pending':
            return 'pending';
        case 'in_progress':
            return 'in_progress';
        case 'resolved':
            return 'resolved';
    }
};

export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}-${day}-${year}`;
}