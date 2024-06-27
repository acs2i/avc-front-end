import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";

interface User {
  _id: string;
  username: string;
  email: string;
  imgPath: string;
  products: string[];
  authorization: string;
}

interface FormData {
  username: string;
  authorization: string;
  email: string;
  password: string;
}

export default function ProfilePage() {
  const { userId } = useParams();
  const [isUpdate, setIsUpdate] = useState(false);
  const [nameInputIsOpen, setNameInputIsOpen] = useState(false);
  const [emailInputIsOpen, setEmailInputIsOpen] = useState(false);
  const [paswordisOpen, setPasswordIsOpen] = useState(false)
  const [user, setUser] = useState<User>();
  const token = useSelector((state: any) => state.auth.token);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    authorization: "",
    email: "",
    password: "",
  });

  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/${userId}`,
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
      setUser(data);
      setFormData({
        username: data.username,
        authorization: data.authorization,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdate(false);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        notifySuccess("modification réussie !");
        setNameInputIsOpen(false);
        setEmailInputIsOpen(false);
        setPasswordIsOpen(false);
        setIsUpdate(true);
      } else {
        notifyError("Erreur lors de la modification");
      }
    } catch (error) {
      console.error(error);
      notifyError("Erreur lors de la modification");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId, isUpdate]);

  return (
    <section className="w-full h-screen bg-gray-100 p-7">
      <h1 className="text-[35px]">Mon profil</h1>
      <Divider />
      <div
        className={`w-full bg-white h-auto rounded-lg border border-gray-300 shadow-md mt-7`}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                alt={user?.username && user?.username}
                src={user?.imgPath && user?.imgPath}
                sx={{ width: 100, height: 100 }}
              />

              {!nameInputIsOpen ? (
                <h1 className="text-[35px] capitalize font-[800]">
                  {user?.username}
                </h1>
              ) : (
                <Input
                  element="input"
                  id="username"
                  label=""
                  value={formData.username}
                  placeholder=""
                  validators={[]}
                  gray
                  onChange={handleChange}
                />
              )}
              {!nameInputIsOpen ? (
                <span
                  className="text-blue-600 text-xs ml-5 cursor-pointer"
                  onClick={() => setNameInputIsOpen(true)}
                >
                  Modifier
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    className="bg-transparent text-xs text-blue-600"
                    type="submit"
                  >
                    Valider
                  </button>
                  <button
                    className="bg-transparent text-xs text-red-600"
                    type="button"
                    onClick={() => setNameInputIsOpen(false)}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
            <Divider />
            <div className="mt-3">
              <div className="flex items-center text-[20px] gap-2 text-gray-700">
                <span>Email :</span>
                {!emailInputIsOpen ? (
                  <span className="font-[600]">{user?.email}</span>
                ) : (
                  <Input
                    element="input"
                    id="email"
                    label=""
                    value={formData.email}
                    placeholder=""
                    validators={[]}
                    gray
                    onChange={handleChange}
                  />
                )}

                {!emailInputIsOpen ? (
                  <span
                    className="text-blue-600 text-xs ml-5 cursor-pointer"
                    onClick={() => setEmailInputIsOpen(true)}
                  >
                    Modifier
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      className="bg-transparent text-xs text-blue-600"
                      type="submit"
                    >
                      Valider
                    </button>
                    <button
                      className="bg-transparent text-xs text-red-600"
                      type="button"
                      onClick={() => setEmailInputIsOpen(false)}
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center text-[20px] gap-2 text-gray-700 mt-3">
                <span>Droits :</span>
                <span className="font-[600] capitalize">
                  {user?.authorization}
                </span>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  className="bg-gray-200 p-2 text-[13px] rounded-md shadow-md uppercase font-[600]"
                  onClick={() => setPasswordIsOpen((prev) => !prev)}
                >
                  Changer mon mot de passe
                </button>
                {paswordisOpen && <div className="w-[50%] flex items-center gap-3">
                  <Input
                    element="input"
                    id="password"
                    type="password"
                    label=""
                    placeholder="Votre nouveau mot de passe"
                    validators={[]}
                    gray
                    onChange={handleChange}
                  />
                  <Button size="small" blue type="submit">Valider</Button>
                  <Button size="small" cancel type="button" onClick={() => setPasswordIsOpen(false)}>Annuler</Button>
                </div>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
