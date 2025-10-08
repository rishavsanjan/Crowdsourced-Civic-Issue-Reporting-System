"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const userAuth_1 = __importDefault(require("../middlewares/userAuth"));
const complainRoute = express_1.default.Router();
async function checkCommunityHeroBadge(userId) {
    const likeCount = await db_1.default.vote.count({
        where: { user_id: userId, vote_type: 'like' },
    });
    const communityHeroBadge = await db_1.default.badgeType.findUnique({
        where: { name: "Community Hero" },
    });
    const existingBadge = await db_1.default.userBadge.findFirst({
        where: {
            user_id: userId,
            badge_id: communityHeroBadge === null || communityHeroBadge === void 0 ? void 0 : communityHeroBadge.id,
        },
    });
    if (likeCount >= 100 && !existingBadge) {
        await db_1.default.userBadge.create({
            data: {
                user_id: userId,
                badge_id: communityHeroBadge.id,
            },
        });
        console.log("🏅 Awarded 'Active Reporter' badge to user", userId);
    }
}
complainRoute.post('/getHomeComplaints', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { userLat, userLng } = req.body;
        const complaints = await db_1.default.$queryRaw `
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
        const votes = await db_1.default.vote.findMany({
            where: { complaint_id: { in: complaintIds } },
            select: {
                complaint_id: true,
                vote_type: true,
                user_id: true
            }
        });
        const voteMap = {};
        //@ts-ignore
        for (const complain of complaints) {
            voteMap[complain.complaint_id] = { like: 0, dislike: 0, userReaction: null };
        }
        ;
        for (const r of votes) {
            if (r.vote_type === 'like')
                voteMap[r.complaint_id].like++;
            if (r.vote_type === 'dislike')
                voteMap[r.complaint_id].dislike++;
            if (r.user_id === userId)
                voteMap[r.complaint_id].userReaction = r.vote_type;
        }
        //@ts-ignore
        const response = complaints.map(complaint => ({
            ...complaint,
            votes: voteMap[complaint.complaint_id]
        }));
        return res.status(200).json({ msg: 'success', success: true, complaints: response });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
complainRoute.get('/complainDetail/:complaintId', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        let { complaintId } = req.params;
        complaintId = parseInt(complaintId);
        const complain = await db_1.default.complaint.findUnique({
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
        });
        const votes = await db_1.default.vote.findMany({
            where: {
                complaint_id: complaintId
            },
            select: {
                complaint_id: true,
                vote_type: true,
                user_id: true
            }
        });
        let voteMap;
        voteMap = { like: 0, dislike: 0, userReaction: null };
        for (const r of votes) {
            if (r.vote_type === 'like')
                voteMap.like += 1;
            if (r.vote_type === 'dislike')
                voteMap.dislike += 1;
            if (r.user_id === userId)
                voteMap.userReaction = r.vote_type;
        }
        const response = {
            ...complain,
            votes: voteMap
        };
        return res.status(200).json({ msg: 'success', success: true, response: response });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
complainRoute.get('/profile', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const user = await db_1.default.user.findUnique({
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
        const resolvedReports = await db_1.default.complaint.findMany({
            where: {
                user_id: userId,
                status: 'resolved'
            }
        });
        return res.status(200).json({ msg: 'success', success: true, user: user, resolvedReports: resolvedReports });
    }
    catch (error) {
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
complainRoute.post('/addvote', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { complaint_id, vote_type } = req.body;
        const addVote = await db_1.default.vote.create({
            data: {
                user_id: userId,
                complaint_id,
                vote_type
            }
        });
        const complaint = await db_1.default.complaint.findUnique({
            where: { complaint_id },
            select: {
                user: true
            }
        });
        if (vote_type === 'like') {
            //@ts-ignore
            checkCommunityHeroBadge(complaint === null || complaint === void 0 ? void 0 : complaint.user.id);
        }
        return res.status(200).json({ msg: "success", success: true, vote: addVote });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
complainRoute.post('/removevote', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { complaint_id, vote_type } = req.body;
        if (vote_type === null) {
            const deleteVote = await db_1.default.vote.delete({
                where: {
                    complaint_id_user_id: {
                        complaint_id,
                        user_id: userId
                    }
                }
            });
        }
        else {
            await db_1.default.vote.update({
                where: {
                    complaint_id_user_id: {
                        complaint_id,
                        user_id: userId
                    }
                },
                data: {
                    vote_type
                }
            });
        }
        return res.status(200).json({ msg: "success", success: true });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
complainRoute.post('/updatevote', userAuth_1.default, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.user.user_id;
        const { complaint_id, vote_type } = req.body;
        const update = await db_1.default.vote.update({
            where: {
                complaint_id_user_id: {
                    complaint_id,
                    user_id: userId
                }
            },
            data: {
                vote_type
            }
        });
        return res.status(200).json({ msg: "success", success: true, update: update });
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ error: "Server Problem!", success: false });
    }
});
exports.default = complainRoute;
