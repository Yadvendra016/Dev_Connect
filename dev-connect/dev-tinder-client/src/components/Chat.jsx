import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSockectConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUserData, setTargetUserData] = useState();
  const user = useSelector((store) => store.user);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  const userId = user?._id;

  // connection on page load
  useEffect(() => {
    if (!userId) return;
    const socket = createSockectConnection();

    // As soon as page is loaded, the socket connection is made and joinChat event is emitted
    socket.emit("joinChat", { userId, targetUserId });

    // received from server
    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      console.log(firstName + " : " + text);
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text, createdAt },
      ]);
    });

    // when component unmounts
    return () => {
      //cleanup
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // send message
  const sendMessage = () => {
    const socket = createSockectConnection();
    // event for sending message
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  // fetch chat from server
  const fetchChatMessages = async () => {
    const chat = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/chat/${targetUserId}`,
      { withCredentials: true }
    );

    // console.log(chat.data.messages);
    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        text: msg?.text,
        createdAt: msg?.createdAt,
      };
    });
    setMessages(chatMessages);
  };

  // get target User data
  const getTargetUserData = async () => {
    const targetUser = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/targetUser/${targetUserId}`
    );
    setTargetUserData(targetUser.data);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    getTargetUserData();
  }, [targetUserId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-3/4 mx-auto m-5 h-[70vh] flex flex-col bg-base-200 rounded-lg shadow-2xl overflow-hidden ">
      <div className="bg-base-300 p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">
          {targetUserData?.firstName + " " + targetUserData?.lastName}
        </h1>
      </div>
      <div className="flex-1 overflow-scroll p-5">
        {/* display message */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={
                  "chat " +
                  (user.firstName === msg.firstName ? "chat-end" : "chat-start")
                }
              >
                <div className="chat-header">
                  {msg.firstName + " " + msg.lastName}
                  <time className="text-xs opacity-50">
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
                <div
                  className={
                    "chat-bubble " +
                    (user.firstName === msg.firstName
                      ? "chat-bubble-accent"
                      : "chat-bubble-primary")
                  }
                >
                  {msg.text}
                </div>
                {/* <div className="chat-footer opacity-50">seen</div> */}
              </div>
            );
          })}
          {/* Invisible element for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Message Input Area */}
      <div className="bg-base-300 p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 input input-bordered bg-base-100 text-white"
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
