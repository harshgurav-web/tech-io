import { chatClient, streamClient } from "../config/stream.js";
import sessionModel from "../models/sssion.model.js";

export async function createSession(req,res) {
    try{
        const {problem, difficulty} = req.body

        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({message: "Please provide problem and difficulty"});
        }
      // generate unique callid for session
        const callID = `Session_${Date.now()}_${Math.random().toString(30).substring(7)}`
      // create session in db
        const session = await sessionModel.create({
            problem: problem,
            difficulty: difficulty.toLowerCase(),
            host: userId,
            callID: callID
        })

     // create video call in stream
     await streamClient.video.call("default",callID).getOrCreate({
        data: {
            created_by_id: clerkId,
            custom: { problem, difficulty, sessionId : session._id.toString() }
        }
     })
      //chat messing
      const channel = chatClient.channel(
        "messaging",
        callID,
        {name: `${problem} session`,
        created_by_id: clerkId,
        members: [clerkId]}
    );
      await channel.create();
      
      return res.status(200).json({message: "Session created successfully"});

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

export async function activeSession(req, res) {
    try{
       const session = await sessionModel.find({status: "active"}).populate("host", "username avatar email clerkId")
       .sort({createdAt: -1})
       .limit(20);

       return res.status(200).json({
        message: "Active sessions",
        session
       })
    
    }
    catch(err){
      console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }
}

export async function recentSession(req,res) {
    try{
        // getting sesisons where user is host or partiipent

        const session = await sessionModel.find({
            status: "completed",
            $or:[
                {host: req.user._id},
                {participent: req.user._id}
            ]
        }).sort({createdAt: -1}).limit(20);

        res.status(200).json({
            message: "Recent sessions",
            session
        })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error in recent session"});
    }
}

export async function joinSession(req,res) {
    try{
      const {id} = req.params;
      const userId = req.user._id;
      const clerkId = req.user.clerkId;

      const session = await sessionModel.findById(id); 
      if(!session) return res.status(404).json({message: "Session not found"});

      if(session.participent) return res.status(409).json({message: "Session already full"});

      if(session.status !== "active") return res.status(400).json({message: "Session is not active"});
      
      if (session.host.toString() === userId.toString()) return res.status(403).json({message: "You can not join your own session"});
      
      session.participent = userId;
      await session.save();

      //add user to chat
      const channel = chatClient.channel("messaging",session.callID);
      await channel.addMembers([clerkId]);

      return res.status(200).json({
        message: "Session joined successfully",
        session
      })

    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Internal server error in join session"});
    }

}

export async function getSessionById(req,res) {
   
    try {
        const {id} = req.params;
        const session = await sessionModel.findById(id)
        .populate("host", "username avatar email clerkId")
        .populate("participent", "username avatar email clerkId");
        
        if(!session){
            return res.status(404).json({message: "Session not found"});
        }

        return res.status(200).json({
            message: "Session found",
            session
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error in get session by id"});
    }
}

export async function endSession(req,res) {
  try {
    
    const {id} = req.params;
    const userId = req.user._id;
    const session = await sessionModel.findById(id);

    if(!session) return res.status(404).json({message: "Session not found"});
    
    if (session.status == "completed") return res.status(400).json({message: "Session already completed"});
     
    if(session.host.toString() !== userId.toString()) return res.status(403).json({message: "You are not authorized to end this session"});

    // delete video call
    const call = await streamClient.video.call("default", session.callID)
    await call.delete({ hard: true})

    // delete chat
    const chat = await chatClient.channel("messaging", session.callID)
    await chat.delete();
    
    session.status = "completed";
    await session.save();

    return res.status(200).json({message: "Session ended successfully", session});

    

  } catch (error) {
   res.status(500).json({message: "Internal server error in end session"}); 
  }
}
