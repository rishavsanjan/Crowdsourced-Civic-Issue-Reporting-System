import axios from "axios"
import { Complaint } from "../types/complain"
import API_BASE_URL from "@/config/api"

interface ComplaintResposne {
    posts: Complaint[]
    nextPage?: number
}

export const fetchHomePosts = async ({
    pageParam = 1,
    queryKey,
}: {
    pageParam?: number
    queryKey: string[]
}): Promise<ComplaintResposne> => {
    const [, selectedStatus] = queryKey

    const res = await axios.post<ComplaintResposne>(
        `${API_BASE_URL}/api/test?page=${pageParam}`,
        { filter:selectedStatus }
    )

    return {
        posts: res.data.posts,
        nextPage: res.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}