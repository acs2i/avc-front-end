import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import truncateText from "../../utils/func/Formattext";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import ScrollToTop from "../../components/ScrollToTop";
import { Info, Mail, Plus } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import { Avatar, Divider, Tooltip } from "@mui/material";
import Header from "../../components/Navigation/Header";
import { useSelector } from "react-redux";

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  comment: string;
  imgPath: string;
}

export default function AdminPage() {
  const token = useSelector((state: any) => state.auth.token);
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/all-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Informations"
        icon="i"
      >
        <div className="px-7 mb-5">
          <p className="text-gray-800 text-xl">
            Ici vous trouverez la liste de toutes les collections enregistrées.
            Cliquez sur la collection que vous souhaitez modifier pour ouvrir le
            panneau de modification.
          </p>
        </div>
        <Divider />
        <div className="flex justify-end mt-7 px-7">
          <Button blue size="small" onClick={() => setIsModalOpen(false)}>
            J'ai compris
          </Button>
        </div>
      </Modal>
      <Header
        title="Liste des utilisateurs"
        link="/admin/create-user"
        btnTitle="Créer un utilisateur"
        placeholder="Rechercher un utilisateur"
        height="300px"
        button
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Nom :</label>
            <input
              type="text"
              id="code"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par nom"
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-[60px] text-sm font-bold">Email :</label>
            <input
              type="text"
              id="label"
              className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
              placeholder="Rechercher par email"
            />
          </div>

          <div
            className="cursor-pointer text-gray-500"
            onClick={() => setIsModalOpen(true)}
          >
            <Info size={22} />
          </div>
        </div>
      </Header>
      <div className="relative px-[20px] mt-4">
        <div className="grid grid-cols-4 gap-5">
          {users && users.length > 0 ? (
            users.map((user) => (
              <div
                key={user._id}
                className="border-[1px] border-slate-100 bg-white cursor-pointer w-[300px] h-[300px] rounded-md shadow-[0_0_20px_rgba(0,0,0,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-center py-3">
                    <Avatar
                      alt={user.username}
                      src={user.imgPath ? user.imgPath : user.username}
                      sx={{ width: 80, height: 80 }}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-[600] text-gray-700">
                      {user.username}
                    </p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail size={15} />
                      <p className="text-md font-[600]">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t-[1px]">
                  <p
                    className={`inline-block capitalize text-sm ${
                      user.authorization === "admin" &&
                      "bg-green-200 border border-green-500 text-green-700"
                    } ${
                      user.authorization === "guest" &&
                      "bg-red-200 border border-red-500 text-red-700"
                    } ${
                      user.authorization === "user" &&
                      "bg-orange-200 border border-orange-500 text-orange-700"
                    } ${
                      !user.authorization &&
                      "bg-gray-200 border border-gray-500 text-gray-700"
                    } px-1 rounded-[3px]`}
                  >
                    {user.authorization}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-7 text-center">
                {totalItem === null ? (
                  <div className="flex justify-center overflow-hidden p-[30px]">
                    <Spinner />
                  </div>
                ) : (
                  "Aucun Résultat"
                )}
              </td>
            </tr>
          )}
        </div>
      </div>
    </div>
  );
}
