const express = require("express");
const { Chat } = require("../models/chat");
const User = require("../models/user");
const { userAuth } = require("../middleware/auth");

const chatRouter = express.Router();

// find chat between two user
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;

  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.log(error);
  }
});

// get targetUser data

chatRouter.get("/targetUser/:targetUserId", async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const user = await User.findById(targetUserId);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
