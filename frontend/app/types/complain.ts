export interface Complaint {
  complaint_id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  category: string;
  address: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
  user: {
    id: number;
    name: string;
  };
  media: {
    media_id: number;
    file_url: string;
    file_type: 'image' | 'video';
  }[];
  votes: {
    like: number;
    dislike: number;
    userReaction: 'like' | 'dislike' | null;
  };
  _count?: {
    votes: number;
  };
}