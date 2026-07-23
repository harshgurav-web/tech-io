import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
       
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: String,
        default:""
    },
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },

},{timestamps: true});

const userModel = mongoose.model("user", userSchema);

export default userModel;   