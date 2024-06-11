import { ChevronDown, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import DrawerChat from "./DrawerChat";
import { Avatar, Divider } from "@mui/material";
import { useSelector } from "react-redux";

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  imgPath: string;
  comment: string;
}

export default function Chat() {
  const user = useSelector((state: any) => state.auth.user);
  const [isClicked, setIsClicked] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

      const data = await response.json();
      const filteredUsers = data.filter((u: User) => u._id !== user._id); // Filtrer l'utilisateur actuel
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <>
      <DrawerChat show={isClicked}>
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
              {/* Afficher la conversation ici */}
              {/* Sous forme de composant */}
              <p>Conversation avec {selectedUser.username}...</p>
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
