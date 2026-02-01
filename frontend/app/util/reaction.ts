import { SetStateAction } from "react";
import { Complaint } from "../types/complain";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_BASE_URL from "@/config/api";



export const removeVote = async (complaint_id: number, vote_type: 'like' | 'dislike' | null, currentReaction: 'like' | 'dislike' | null, setFilteredComplaints: React.Dispatch<SetStateAction<Complaint[]>>) => {
    console.log(complaint_id, vote_type)
    const token = await AsyncStorage.getItem('citytoken');


    await axios({
        method: 'POST',
        url: `${API_BASE_URL}/api/complain/removevote`,
        data: {
            complaint_id,
            vote_type
        },
        headers: {
            'Authorization': ' Bearer ' + token
        }
    });
    setFilteredComplaints(prevPosts =>
        prevPosts.map(post => {
            if (post.complaint_id !== complaint_id) return post;
            const newVotes = { ...post.votes };
            if (currentReaction === 'like') newVotes.like -= 1;
            if (currentReaction === 'dislike') newVotes.dislike -= 1;
            newVotes.userReaction = null;
            return {
                ...post,
                votes: newVotes
            }
        })
    )
}

export const addVote = async (complaint_id: number, vote_type: 'like' | 'dislike' | null, currentReaction: 'like' | 'dislike' | null, setFilteredComplaints: React.Dispatch<SetStateAction<Complaint[]>>) => {
    if (currentReaction === null) {
        const token = await AsyncStorage.getItem('citytoken');
        const response = await axios({
            method: 'POST',
            url: `${API_BASE_URL}/api/complain/addvote`,
            data: {
                complaint_id,
                vote_type
            },
            headers: {
                'Authorization': ' Bearer ' + token
            }
        });
        console.log(response.data)
        setFilteredComplaints(prevPosts =>
            prevPosts.map((post) => {
                if (post.complaint_id !== complaint_id) return post;
                const newVotes = { ...post.votes };
                if (vote_type === 'like') {
                    newVotes.like += 1;
                }
                if (vote_type === 'dislike') {
                    newVotes.dislike += 1;
                }
                newVotes.userReaction = vote_type;
                return {
                    ...post,
                    votes: newVotes
                }
            })
        )
    } else {
        const token = await AsyncStorage.getItem('citytoken');
        await axios({
            method: 'POST',
            url: `${API_BASE_URL}/api/complain/updatevote`,
            data: {
                complaint_id,
                vote_type
            },
            headers: {
                'Authorization': ' Bearer ' + token
            }
        });
        setFilteredComplaints(prevPosts =>
            prevPosts.map(post => {
                if (post.complaint_id !== complaint_id) return post;
                const newVotes = { ...post.votes };
                if (vote_type === 'like') {
                    newVotes.like += 1;
                    newVotes.dislike -= 1;
                };
                if (vote_type === 'dislike') {
                    newVotes.dislike += 1
                    newVotes.like -= 1;
                };
                newVotes.userReaction = vote_type;
                return {
                    ...post,
                    votes: newVotes
                };
            }))
        return;
    }
}