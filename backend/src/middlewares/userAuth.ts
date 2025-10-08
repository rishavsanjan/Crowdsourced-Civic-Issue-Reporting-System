import jwt from "jsonwebtoken";

//@ts-ignore
const authMid = (req, res, next) => {
    const head = req.headers.authorization;
    console.log(head)
    if (!head || !head.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Authorization token missing", success: false })
    }
    const token = head.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        console.log(req.user)
        next();
    } catch (error) {
        console.log(error)

        return res.status(403).json({ msg: "Invalid or expired token", success: false });
    }
}

export default authMid;