import { ChevronDown, X, Send } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import DrawerChat from "./DrawerChat";
import { Avatar, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

const ENDPOINT = `${process.env.REACT_APP_URL_DEV}`;

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  imgPath: string;
  comment: string;
  unreadMessages: { [key: string]: number };
}

interface Message {
  sender: string;
  receiver: string;
  message: string;
  timestamp?: Date;
}

export default function Chat() {
  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const [connecteduser, setConnecteduser] = useState<User>();
  const [newMessages, setNewMessages] = useState<{ [key: string]: boolean }>(
    {}
  );

  const userId = user._id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    setIsClicked(!isClicked);
    if (!isClicked && selectedUser) {
      fetchMessages(selectedUser._id);
    }
  };

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    newSocket.emit("join", user._id);

    newSocket.on("chat message", (msg: Message) => {
      console.log("New message received:", msg);
      setMessages((msgs) => [...msgs, msg]);
      setNewMessages((prev) => ({
        ...prev,
        [msg.sender]: true,
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user._id]);

  useEffect(() => {
    fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    if (selectedUser && isClicked) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser, isClicked]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/all-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

  const fetchConnectedUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/connectedUser/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      console.log(data);
      setConnecteduser(data);

      // Mettez à jour newMessages en fonction des messages non lus
      const unreadMessages = data.unreadMessages || {};
      const updatedNewMessages = Object.keys(unreadMessages).reduce(
        (acc, key) => {
          acc[key] = unreadMessages[key] > 0;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      setNewMessages(updatedNewMessages);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedUser();
  }, [isOpen]);

  const fetchMessages = async (contactId: string) => {
    try {
      const response = await fetch(
        `${ENDPOINT}/api/v1/messages/${user._id}/${contactId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
    setNewMessages((prev) => ({
      ...prev,
      [user._id]: false,
    }));
    if (isClicked) {
      fetchMessages(user._id);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    if (newMessage.trim() && selectedUser) {
      const msg: Message = {
        sender: user._id,
        receiver: selectedUser._id,
        message: newMessage,
        timestamp: new Date(),
      };
  
      socket.emit("chat message", msg);
      setMessages((msgs) => [...msgs, msg]);
      setNewMessage("");
  
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.rows = 1;
      }
    }
  };

  const hasNewMessages = () => {
    return Object.values(newMessages).some((hasNew) => hasNew);
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
                onClick={() => {
                  setSelectedUser(null);
                  setIsOpen(false);
                }}
              >
                <X />
              </div>
            )}
          </div>
        </div>
        <Divider />
        {selectedUser ? (
          <>
            <div className="relative h-[440px] flex flex-col py-2">
              <div
                className="overflow-y-auto flex flex-col gap-2 px-3"
                style={{ maxHeight: "380px" }}
              >
                {messages.map((msg: Message, index: number) => (
                  <div
                    key={index}
                    className={`max-w-max ${
                      msg.sender === user._id
                        ? "bg-blue-400 text-white ml-auto rounded-xl px-4 py-2"
                        : "bg-gray-300 text-black mr-auto rounded-xl px-4 py-2"
                    }`}
                    style={{ display: "inline-block" }}
                  >
                    <p className="rounded" ref={messagesEndRef}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 py-2 w-full mt-auto border-t">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="py-2 px-4 border rounded-full w-[320px] focus:outline-none resize-none overflow-hidden"
                  placeholder="Ecrivez votre message"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
                <button onClick={handleSendMessage} className="text-sky-600">
                  <Send size={18} />
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
              {users.map((otherUser) => {
                return (
                  <div
                    key={otherUser._id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleUserClick(otherUser)}
                  >
                    <div className="relative">
                      <Avatar
                        alt={user && otherUser?.username}
                        src={user && otherUser?.imgPath}
                      />
                      {connecteduser &&
                        connecteduser.unreadMessages?.[otherUser._id] !==
                          undefined &&
                        connecteduser.unreadMessages[otherUser._id] > 0 && (
                          <div className="absolute top-0 right-[-5px] w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-[10px]">
                              {connecteduser.unreadMessages[otherUser._id]}
                            </span>
                          </div>
                        )}
                    </div>
                    <div className="relative">
                      <span className="text-[15px] capitalize font-[600]">
                        {otherUser && otherUser?.username}
                      </span>
                    </div>
                  </div>
                );
              })}
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
          <span className="text-md text-white font-[600]">Discussions</span>
        ) : (
          <div className="text-white">
            <ChevronDown />
          </div>
        )}
        {hasNewMessages() && (
          <div className="absolute top-[-5px] right-0 w-5 h-5 rounded-full bg-red-500">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </div>
        )}
      </div>
    </>
  );
}
