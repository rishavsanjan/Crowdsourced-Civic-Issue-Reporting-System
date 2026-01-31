export type Report = {
  id: number;
  title: string;
  category: string;
  status: 'In Progress' | 'Resolved' | 'Submitted';
  icon: string;
  createdAt: string;

};