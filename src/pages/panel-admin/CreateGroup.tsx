import React, { useEffect, useState } from "react";
import Input from "../../components/FormElements/Input";
import { useNavigate } from "react-router-dom";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import useNotify from "../../utils/hooks/useToast";
import { CircularProgress } from "@mui/material";
import Button from "../../components/FormElements/Button";
import { Tooltip } from "@mui/material";
import truncateText from "../../utils/func/Formattext";
import Spinner from "../../components/Shared/Spinner";
import { useSelector } from "react-redux";

interface FormData {
  groupname: string;
  users: any[];
  authorization: string;
  description: string;
  creator_id: string;
}

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  comment: string;
}

export default function CreateGroupPage() {
  const creatorId = useSelector((state: any) => state.auth.user);
  const [error, setError] = useState<string | null>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    groupname: "",
    users: [],
    authorization: "",
    description: "",
    creator_id: creatorId._id,
  });

  const authorizationOptions = [
    { value: "admin", name: "Admin", label: "Admin" },
    { value: "user", name: "User", label: "User" },
    { value: "guest", name: "Guest", label: "Guest" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError("");
  };

  const handleUserChange = (e: any, userId: any) => {
    const isChecked = e.target.checked;
    setFormData((prevFormData) => {
      const users = [...prevFormData.users];
      if (isChecked) {
        users.push(userId);
      } else {
        const index = users.indexOf(userId);
        if (index > -1) {
          users.splice(index, 1);
        }
      }
      return { ...prevFormData, users };
    });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/group`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setTimeout(() => {
          notifySuccess("Groupe créé avec succès !");
          setIsLoading(false);
          navigate("/admin/created-group");
        }, 1000);
      } else {
        notifyError("Erreur lors de la création !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  return (
    <section className="w-full bg-gray-100 p-7">
      <div>
        <h3 className="text-[32px] font-[800] text-gray-800">
          Créer un groupe
        </h3>
      </div>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="mt-5 flex flex-col justify-between">
          <h3 className="text-[25px] font-[800] text-gray-800">
            Informations du groupe
          </h3>
          <div className="flex flex-col">
            <Input
              element="input"
              id="groupname"
              type="text"
              placeholder="Entrez un nom"
              label="Nom du groupe"
              value={formData.groupname}
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
            />
            <Input
              element="select"
              id="authorization"
              placeholder="Choississez une niveau d'autorisation"
              label="Autorisation"
              value={formData.authorization}
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              options={authorizationOptions}
              required
              create
            />
            <Input
              element="textarea"
              id="description"
              type="text"
              placeholder="Laissez une description"
              label="Description (falcultatif)"
              value={formData.description}
              onChange={handleChange}
              maxLength={250}
              validators={[]}
              create
            />
          </div>
          <div className="relative overflow-x-auto mt-4">
            <div>
              <h3 className="text-[25px] font-[800] text-gray-800 mb-2">
                Ajout d'utilisateurs au groupe
              </h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-white border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-2 w-[5%]">
                    #
                  </th>
                  <th scope="col" className="px-6 py-2 w-[10%]">
                    Nom d'utilisateur
                  </th>
                  <th scope="col" className="px-6 py-2 w-[15%]">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-2 w-[5%]">
                    Autorisations
                  </th>
                  <th scope="col" className="px-6 py-2 w-[15%]">
                    Commentaires
                  </th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-y-[1px] border-gray-200 bg-white cursor-pointer hover:bg-slate-200 text-[10px] text-gray-800 whitespace-nowrap"
                    >
                      <td className="px-6 py-4 text-blue-600">
                        <input
                          type="checkbox"
                          id="user"
                          name="user"
                          onChange={(e) => handleUserChange(e, user._id)}
                        />
                      </td>
                      <td className="px-6 py-4 text-blue-600 text-md">
                        {user.username}
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-block uppercase ${
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
                          <span className="text-[8px]">
                            {user.authorization ? user.authorization : "NC"}
                          </span>
                        </div>
                      </td>
                      <Tooltip
                        title={
                          user.comment ? user.comment : "Pas de commentaire"
                        }
                      >
                        <td className="px-6 py-4">
                          {user.comment
                            ? truncateText(user.comment, 50)
                            : "Pas de commentaire"}
                        </td>
                      </Tooltip>
                    </tr>
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
              </tbody>
            </table>
          </div>
          {!isLoading ? (
            <div className="w-full mt-5 flex items-center gap-2">
              <Button size="small" cancel type="button" to="/admin">
                Annuler
              </Button>
              <Button size="small" blue type="submit">
                Création le groupe
              </Button>
            </div>
          ) : (
            <div className="mt-3">
              <CircularProgress />
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
