const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = async (server) => {
  // socket.io configuration
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // receive the connection and handle event
  io.on("connection", (socket) => {
    // handle the joinChat
    socket.on("joinChat", ({ userId, targetUserId }) => {
      //create room (two room Id are same then chat should happend just why sort)
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log("Joining room: " + roomId);
      socket.join(roomId);
    });

    // handle the sendMessge
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          //   TODO: check userId and targetUserId are friends

          // two case : 1-> first time send message, 2-> already have some messages
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // case1: if first time chatting (chat not available)
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          const newMessage = {
            senderId: userId,
            text,
            createdAt: new Date(),
          };

          // push the message
          chat.messages.push(newMessage);
          // save message to the database
          await chat.save();

          //received message sending to the room
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text,
            createdAt: newMessage.createdAt,
          });
          //
        } catch (error) {
          console.log(error.message);
        }
      }
    );

    // handle the disconnect
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
