import { Badge } from "./badge";
import { Complaint } from "./complain";

export type User = {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  Complaint: Complaint[]
  UserBage?: Badge[]
};