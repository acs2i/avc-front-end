import React, { useEffect, useState } from "react";
import Input from "../../components/FormElements/Input";
import { useNavigate } from "react-router-dom";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import useNotify from "../../utils/hooks/useToast";
import Card from "../../components/Shared/Card";
import { Avatar, CircularProgress } from "@mui/material";
import Button from "../../components/FormElements/Button";
import { X } from "lucide-react";

interface FormData {
  name: string;
  users: any[];
  password: string;
  authorization: string;
  comment: string;
}

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  comment: string;
}

export default function CreateGroupPage() {
  const [error, setError] = useState<string | null>("");
  const [choiceValue, setChoiceValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { notifySuccess, notifyError } = useNotify();
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    users: [],
    password: "",
    authorization: "",
    comment: "",
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/register`,
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
          notifySuccess("Utilisateur créé avec succès !");
          setIsLoading(false);
          navigate("/admin");
        }, 1000);
      } else {
        notifyError("Erreur lors de la création !");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };


  const handleDropdownOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChoiceValue("");
    setDropdownIsOpen(true);
  };

  const handleDropdownClose = (users: User) => {
    const existingDimension = selectedUsers.find(
      (d) => d._id === users._id
    );
    if (!existingDimension) {
      setSelectedUsers([...selectedUsers, users]);
      setFormData({
        ...formData,
        users: [...formData.users, users._id],
      });
    }
  };

  console.log(formData)

  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <div>
        <h3 className="text-[32px] font-[800] text-gray-800">
          Créer un groupe
        </h3>
      </div>
      <form className="flex flex-col gap-4 w-[70%]" onSubmit={handleSubmit}>
        <div className="mt-5 flex flex-col justify-between">
          <div className="flex flex-col">
            <Input
              element="input"
              id="name"
              type="text"
              placeholder="Entrez un nom"
              label="Nom du groupe"
              value={formData.name}
              onChange={handleChange}
              validators={[VALIDATOR_REQUIRE()]}
              required
              create
            />

            <div className="relative">
              <Input
                element="input"
                id="users"
                label="Ajouter des utilisateurs"
                placeholder="Ajoutez des utilisateurs"
                validators={[]}
                gray
                create
                onChange={handleDropdownOpen}
                onClick={() => setDropdownIsOpen(true)}
              />
              {dropdownIsOpen && users && (
                <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md">
                  <div
                    className="h-[30px] flex justify-end cursor-pointer px-3"
                    onClick={() => setDropdownIsOpen(false)}
                  >
                    <div className="h-[30px] w-[30px] flex justify-center items-center bg-gray-500 rounded-full text-white hover:bg-sky-400">
                      <X />
                    </div>
                  </div>
                  {users.map((user, i) => (
                    <ul key={i}>
                      <li
                        className={`cursor-pointer py-1 hover:bg-gray-200 text-lg px-4 py-2 border-b flex items-center gap-3 ${
                            selectedUsers.includes(user)
                              ? "bg-sky-600 text-white font-bold hover:bg-sky-300"
                              : ""
                          }`}
                        onClick={() => handleDropdownClose(user)}
                      >
                        <Avatar alt={user.username} src="img/avatar.jpg"/>
                        {user.username}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>
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
              id="comment"
              type="text"
              placeholder="Laissez une description"
              label="Description (falcultatif)"
              value={formData.comment}
              onChange={handleChange}
              maxLength={250}
              validators={[]}
              create
            />
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
