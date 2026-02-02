import axios from "axios"
import { Complaint } from "../types/complain"
import API_BASE_URL from "@/config/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
    const [, selectedStatus, distance, lattitude, longitude] = queryKey

    const token = await AsyncStorage.getItem('citytoken');

    const response = await axios<ComplaintResposne>({
        url: `${API_BASE_URL}/api/complain/test?page=${pageParam}`,
        method: 'POST',
        data: {
            filter: selectedStatus
        },
        headers:{
            Authorization:'Bearer ' + token
        }
    })
   

    return {
        posts: response.data.posts,
        nextPage: response.data.posts.length > 0 ? pageParam + 1 : undefined,
    }
}