import getRandomColor from "../../utils/func/getRandomColor";
import { Avatar, AvatarGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Group {
  _id: any;
  groupname: string;
  authorization: string;
  description: string;
  users: any[];
}

export default function CreatedGroupPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/group`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <div>
        <h3 className="text-[32px] font-[800] text-gray-800">
          Tous les groupes créés
        </h3>
      </div>
      <div className="grid grid-cols-6 gap-3 mt-5">
        {groups.map((group) => (
          <Link to="/" className="bg-white rounded-md p-2 shadow-md flex flex-col items-center justify-center hover:scale-105 hover:bg-gray-200 transition-all">
            <div>
              <AvatarGroup max={4} className="flex items-center">
                {group.users.map((avatar) => (
                  <Avatar
                    alt={avatar.username}
                    src="/static/images/avatar/1.jpg"
                    sx={{ bgcolor: getRandomColor() }}
                  />
                ))}
              </AvatarGroup>
              <p className="text-center whitespace-nowrap text-gray-600 font-[700]">{group.groupname}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
