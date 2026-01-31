import { Complaint } from "./complain"
import { User } from "./user"

export interface ProfileData {
  resolvedReports: Complaint[]
  user: User
}