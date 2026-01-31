export const getStatusColor = (status: string) => {
    switch (status) {
        case 'in_progress':
            return '#FF9500';
        case 'resolved':
            return '#34C759';
        case 'pending':
            return '#007AFF';
        default:
            return '#8E8E93';
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Pending';
        case 'in_progress':
            return 'In Progress';
        case 'resolved':
            return 'Resolved';
        default:
            return status;
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'in_progress':
            return 'time-outline';
        case 'resolved':
            return 'checkmark-circle-outline';
        case 'pending':
            return 'paper-plane-outline';
        default:
            return 'help-circle-outline';
    }
};