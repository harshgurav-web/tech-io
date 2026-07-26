import { chatClient } from "../config/stream.js";

export const createStreamToken = async (req, res) => {
    try {

        const token = chatClient.createToken(req.user.clerkId)

        res.status(200).json({
            success: true,
            userToken: token,
            user: req.user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}