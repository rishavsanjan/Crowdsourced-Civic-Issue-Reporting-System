export interface Complaint {
  complaint_id: string;
  status: 'pending' | 'in_progress' | 'resolved';
  address: string;
  createdAt: string;
  date: string;
  media: [];
}