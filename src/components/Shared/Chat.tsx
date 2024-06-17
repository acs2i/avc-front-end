import { ChevronDown, X, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import DrawerChat from "./DrawerChat";
import { Avatar, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:3001";

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  imgPath: string;
  comment: string;
}

interface Message {
  sender: string;
  receiver: string;
  message: string;
  timestamp?: Date;
}

export default function Chat() {
  const user = useSelector((state: any) => state.auth.user);
  const [isClicked, setIsClicked] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    if (!isClicked && selectedUser) {
      fetchMessages(selectedUser._id);  // Fetch messages when chat is opened
    }
  };

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    newSocket.emit('join', user._id);

    newSocket.on('chat message', (msg: Message) => {
      setMessages((msgs) => [...msgs, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user._id]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && isClicked) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, isClicked]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/all-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      const filteredUsers = data.filter((u: User) => u._id !== user._id);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    try {
      const response = await fetch(`${ENDPOINT}/api/v1/messages/${user._id}/${contactId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    if (isClicked) {
      fetchMessages(user._id);  // Fetch messages when a user is clicked if chat is open
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedUser) {
      const msg: Message = {
        sender: user._id,
        receiver: selectedUser._id,
        message: newMessage,
        timestamp: new Date(),
      };
      
      socket.emit('chat message', msg);
      setMessages((msgs) => [...msgs, msg]);
      setNewMessage("");

      // Send the message to the server
      try {
        const response = await fetch(`${ENDPOINT}/api/v1/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(msg),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send message");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi du message", error);
      }
    }
  };

  return (
    <>
      <DrawerChat show={isClicked} onClose={handleClick}>
        <div className="py-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h6 className="text-gray-700 font-[700] capitalize">
                {selectedUser ? selectedUser?.username : user?.username}
              </h6>
              <div className="w-[10px] h-[10px] rounded-full bg-green-500"></div>
            </div>
            {selectedUser && (
              <div
                className="cursor-pointer"
                onClick={() => setSelectedUser(null)}
              >
                <X />
              </div>
            )}
          </div>
        </div>
        <Divider />
        {selectedUser ? (
          <>
            <div className="py-2 px-6">
              <div className="overflow-y-auto" style={{ maxHeight: "380px" }}>
                {messages.map((msg: Message, index: number) => (
                  <div key={index} className={`my-2 ${msg.sender === user._id ? 'bg-blue-400 rounded-xl ml-[33px] text-white text-right' : 'bg-gray-300 mr-[33px] rounded-xl text-black text-left'}`}>
                    <p className="p-2 rounded">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className=" flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow p-2 border rounded-l"
                  placeholder="Type a message"
                />
                <button onClick={handleSendMessage} className="p-2 bg-blue-600 text-white rounded-r-lg">
                <Send />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-2 px-6">
            <div
              className="flex flex-col gap-3 overflow-y-auto"
              style={{ maxHeight: "400px" }}
            >
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <Avatar
                    alt={user && user?.username}
                    src={user && user?.imgPath}
                  />
                  <div className="flex flex-col">
                    <span className="text-[15px] capitalize font-[600]">
                      {user && user?.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DrawerChat>
      <div
        onClick={handleClick}
        className={`fixed bottom-[30px] right-[30px] h-[50px] ${
          isClicked ? "w-[50px]" : "w-[120px]"
        } bg-blue-600 flex items-center justify-center cursor-pointer z-[40000000] ${
          isClicked ? "rounded-full" : "rounded-[100px]"
        } border shadow-md transition-all duration-300`}
      >
        {!isClicked ? (
          <span className="text-md text-white font-[600]">Discutions</span>
        ) : (
          <div className="text-white">
            <ChevronDown />
          </div>
        )}
      </div>
    </>
  );
}
