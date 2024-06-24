import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { Barcode } from "lucide-react";

interface User {
  _id: string;
  username: string;
  email: string;
  imgPath: string;
  products: string[];
}

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User>();
  const token = useSelector((state: any) => state.auth.token);

  const fetchdUser = async () => {
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
      setUser(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchdUser();
  }, [userId]);

  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <div className="w-full bg-white h-[450px] rounded-lg border border-gray-300 shadow-md">
        <div
          className="h-[45%] w-full rounded-lg relative"
          style={{
            backgroundImage: `url(${"/img/background.png"})`,
            opacity: 0.8,
            filter: "grayscale(10%)",
            backgroundPosition: "center bottom -50px",
          }}
        >
          <div className="absolute top-[100px] left-[50%] translate-x-[-50%] h-[160px] w-[160px] bg-white flex items-center justify-center rounded-full">
            <Avatar
              alt={user?.username ? user?.username : ""}
              src={user?.imgPath ? user.imgPath : ""}
              sx={{ width: 150, height: 150 }}
            />
          </div>
        </div>
        <div className="p-5">
          <div>
            <h1 className="text-[35px] capitalize font-[800]">
              {user?.username}
            </h1>
            <p className="text-[20px] text-gray-700">{user?.email}</p>
          </div>
          <div className="mt-[10px]">
            <div className="flex items-center gap-2 text-gray-600 text-[20px] capitalize">
              <Barcode size={17} />
              <p>
                <span className="font-[700]">{user?.products.length}</span>{" "}
                {user?.products && user?.products.length > 1
                  ? "références créées"
                  : "référence créée"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
