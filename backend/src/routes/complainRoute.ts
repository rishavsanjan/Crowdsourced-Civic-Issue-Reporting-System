import express from 'express';
import prisma from '../config/db';
import authMid from '../middlewares/userAuth';
import { success } from 'zod';

const complainRoute = express.Router();

async function checkCommunityHeroBadge(userId: number) {
    const likeCount = await prisma.vote.count({
        where: { user_id: userId, vote_type: 'like' },
    });

    const communityHeroBadge = await prisma.badgeType.findUnique({
        where: { name: "Community Hero" },
    });

    const existingBadge = await prisma.userBadge.findFirst({
        where: {
            user_id: userId,
            badge_id: communityHeroBadge?.id,
        },
    });

    if (likeCount >= 100 && !existingBadge) {
        await prisma.userBadge.create({
            data: {
                user_id: userId,
                badge_id: communityHeroBadge!.id,
            },
        });
        console.log("🏅 Awarded 'Active Reporter' badge to user", userId);
    }
}

complainRoute.post('/getHomeComplaints', authMid, async (req, res) => {

    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { userLat, userLng } = req.body;

        const complaints = await prisma.$queryRaw`
        SELECT c.*, 
               json_agg(
                  json_build_object(
                    'media_id', m.media_id,
                    'file_url', m.file_url,
                    'file_type', m.file_type
                  )
               ) AS media,
               (6371 * ACOS(
                 COS(RADIANS(${userLat}::double precision)) * COS(RADIANS(c.latitude::double precision)) *
                 COS(RADIANS(c.longitude::double precision) - RADIANS(${userLng}::double precision)) +
                 SIN(RADIANS(${userLat}::double precision)) * SIN(RADIANS(c.latitude::double precision))
               )) AS distance
        FROM "Complaint" c
        LEFT JOIN "Media" m ON c.complaint_id = m.complaint_id
        WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL
        GROUP BY c.complaint_id
        HAVING (6371 * ACOS(
                 COS(RADIANS(${userLat}::double precision)) * COS(RADIANS(c.latitude::double precision)) *
                 COS(RADIANS(c.longitude::double precision) - RADIANS(${userLng}::double precision)) +
                 SIN(RADIANS(${userLat}::double precision)) * SIN(RADIANS(c.latitude::double precision))
               )) BETWEEN ${0} AND ${1000000000}
        ORDER BY distance;
        `;

        //@ts-ignore
        const complaintIds = complaints.map(c => c.complaint_id);

        const votes = await prisma.vote.findMany({
            where: { complaint_id: { in: complaintIds } },
            select: {
                complaint_id: true,
                vote_type: true,
                user_id: true
            }
        });

        const voteMap: {
            [complaintId: number]: {
                like: number,
                dislike: number,
                userReaction: 'like' | 'dislike' | null
            }
        } = {};

        //@ts-ignore
        for (const complain of complaints) {
            voteMap[complain.complaint_id] = { like: 0, dislike: 0, userReaction: null }
        };

        for (const r of votes) {
            if (r.vote_type === 'like') voteMap[r.complaint_id].like++
            if (r.vote_type === 'dislike') voteMap[r.complaint_id].dislike++
            if (r.user_id === userId) voteMap[r.complaint_id].userReaction = r.vote_type
        }

        //@ts-ignore
        const response = complaints.map(complaint => ({
            ...complaint,
            votes: voteMap[complaint.complaint_id]
        }))

        return res.status(200).json({ msg: 'success', success: true, complaints: response })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

complainRoute.get('/complainDetail/:complaintId', authMid, async (req, res) => {
    try {

        //@ts-ignore
        const userId = req.user.user_id;
        let { complaintId }: any = req.params;
        complaintId = parseInt(complaintId);


        const complain = await prisma.complaint.findUnique({
            where: {
                complaint_id: complaintId
            },
            select: {
                media: {
                    select: {
                        file_type: true,
                        file_url: true
                    }
                },
                description: true,
                title: true,
                createdAt: true,
                status: true,
                latitude: true,
                longitude: true,
                AdminstrativeComments: {
                    where: {
                        type: { in: ['internal', 'status'] }
                    },
                    select: {
                        id: true,
                        comment: true,
                        createdAt: true
                    }
                }
            }
        })

        const votes = await prisma.vote.findMany({
            where: {
                complaint_id: complaintId
            },
            select: {
                complaint_id: true,
                vote_type: true,
                user_id: true
            }
        })

        let voteMap: {
            like: number;
            dislike: number;
            userReaction: 'like' | 'dislike' | null;
        }

        voteMap = { like: 0, dislike: 0, userReaction: null }
        for (const r of votes) {
            if (r.vote_type === 'like') voteMap.like += 1;
            if (r.vote_type === 'dislike') voteMap.dislike += 1;
            if (r.user_id === userId) voteMap.userReaction = r.vote_type;
        }

        const response = {
            ...complain,
            votes: voteMap
        }

        return res.status(200).json({ msg: 'success', success: true, response: response })

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});


complainRoute.get('/profile', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true,
                createdAt: true,
                email: true,
                Complaint: true
            }
        });

        const resolvedReports = await prisma.complaint.findMany({
            where: {
                user_id: userId,
                status: 'resolved'
            }
        })


        return res.status(200).json({ msg: 'success', success: true, user: user, resolvedReports: resolvedReports })
    } catch (error) {

        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});


complainRoute.post('/addvote', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { complaint_id, vote_type } = req.body;

        const addVote = await prisma.vote.create({
            data: {
                user_id: userId,
                complaint_id,
                vote_type
            }
        });

        const complaint = await prisma.complaint.findUnique({
            where: { complaint_id },
            select: {
                user: true
            }
        });

        if (vote_type === 'like') {
            //@ts-ignore
            checkCommunityHeroBadge(complaint?.user.id)
        }


        return res.status(200).json({ msg: "success", success: true, vote: addVote })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});


complainRoute.post('/removevote', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { complaint_id, vote_type } = req.body;
        if (vote_type === null) {
            const deleteVote = await prisma.vote.delete({
                where: {
                    complaint_id_user_id: {
                        complaint_id,
                        user_id: userId
                    }
                }
            })
        } else {
            await prisma.vote.update({
                where: {
                    complaint_id_user_id: {
                        complaint_id,
                        user_id: userId
                    }
                },
                data: {
                    vote_type
                }
            })
        }
        return res.status(200).json({ msg: "success", success: true })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});

complainRoute.post('/updatevote', authMid, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { complaint_id, vote_type } = req.body;
        const update = await prisma.vote.update({
            where: {
                complaint_id_user_id: {
                    complaint_id,
                    user_id: userId
                }
            },
            data: {
                vote_type
            }
        })
        return res.status(200).json({ msg: "success", success: true, update: update })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ error: "Server Problem!", success: false })
    }
});









export default complainRoute