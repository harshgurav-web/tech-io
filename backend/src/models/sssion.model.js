import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

    problem: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    participent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    status: {
        type: String,
        enum: ["active","completed"],
        default: "active"
    },
    callID: {
        type: String,
        default: ""
    }
},{timestamps: true});


const sessionModel = mongoose.model("session", sessionSchema);

export default sessionModel;