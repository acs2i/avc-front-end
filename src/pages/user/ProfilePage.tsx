import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Divider } from "@mui/material";
import useNotify from "../../utils/hooks/useToast";
import Input from "../../components/FormElements/Input";
import Button from "../../components/FormElements/Button";
import Modal from "../../components/Shared/Modal";
import { Eye } from "lucide-react";

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
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [nameInputIsOpen, setNameInputIsOpen] = useState(false);
  const [emailInputIsOpen, setEmailInputIsOpen] = useState(false);
  const [paswordisOpen, setPasswordIsOpen] = useState(false);
  const [user, setUser] = useState<User>();
  const token = useSelector((state: any) => state.auth.token);
  const { notifySuccess, notifyError } = useNotify();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    authorization: "",
    email: "",
    password: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [hasStartedTypingConfirmPassword, setHasStartedTypingConfirmPassword] =
    useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

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
        password: "",
      });
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
    setFormData({ ...formData, password: newPassword });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(newConfirmPassword === password);
    setHasStartedTypingConfirmPassword(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "email") {
      setIsEmailValid(validateEmail(value));
    }
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
    <>
      <Modal
        show={paswordisOpen}
        onCancel={() => setPasswordIsOpen(false)}
        onClose={() => setPasswordIsOpen(false)}
        onSubmit={handleSubmit}
        header="Changer de mot de passe"
      >
        <div className="w-[70%] flex flex-col gap-3 mt-2 mx-auto">
          <div>
            <div className="relative">
              <div
                className="absolute right-[-30px] top-0 translate-y-[50%] text-gray-500 hover:text-gray-400 cursor-pointer"
                onMouseDown={() => setShowPass(true)}
                onMouseUp={() => setShowPass(false)}
                onMouseLeave={() => setShowPass(false)}
              >
                <Eye size={20} />
              </div>
              <Input
                element="input"
                id="password"
                type={!showPass ? "password" : "text"}
                label=""
                placeholder="Nouveau mot de passe"
                validators={[]}
                create
                gray
                onChange={handlePasswordChange}
              />
            </div>
            <div className="relative">
              <div
                className="absolute right-[-30px] top-0 translate-y-[50%] text-gray-500 hover:text-gray-400 cursor-pointer"
                onMouseDown={() => setShowConfirmPass(true)}
                onMouseUp={() => setShowConfirmPass(false)}
                onMouseLeave={() => setShowConfirmPass(false)}
              >
                <Eye size={20} />
              </div>
              <Input
                element="input"
                id="confirmPassword"
                type={!showConfirmPass ? "password" : "text"}
                label=""
                placeholder="Confirmez le mot de passe"
                validators={[]}
                create
                gray
                onChange={handleConfirmPasswordChange}
              />
            </div>
          </div>
          {!passwordsMatch && hasStartedTypingConfirmPassword && (
            <p className="text-red-600 text-sm">
              Les mots de passe ne correspondent pas
            </p>
          )}
          <Button
            size="small"
            type="submit"
            blue={passwordsMatch}
            disabled={!passwordsMatch}
          >
            Changer mon mot de passe
          </Button>
        </div>
      </Modal>
      <Modal
        show={emailInputIsOpen}
        onCancel={() => setEmailInputIsOpen(false)}
        onClose={() => setEmailInputIsOpen(false)}
        onSubmit={handleSubmit}
        header="Modifier mon adresse mail"
      >
        <div className="w-[70%] flex flex-col gap-3 mt-2 mx-auto">
          <div>
            <Input
              element="input"
              id="email"
              label=""
              value={formData.email}
              placeholder="Entrez votre adresse e-mail"
              validators={[]}
              create
              gray
              onChange={handleChange}
            />
            {!isEmailValid && (
              <p className="text-red-600 text-sm">
                L'adresse e-mail n'est pas valide
              </p>
            )}
          </div>
          <Button
            size="small"
            type="submit"
            blue={isEmailValid}
            disabled={!isEmailValid}
          >
            Modifier mon adresse mail
          </Button>
        </div>
      </Modal>
      <Modal
        show={nameInputIsOpen}
        onCancel={() => setNameInputIsOpen(false)}
        onClose={() => setNameInputIsOpen(false)}
        onSubmit={handleSubmit}
        header="Modifier mon nom d'utilisateur"
      >
        <div className="w-[70%] flex flex-col gap-3 mt-2 mx-auto">
          <div>
            <Input
              element="input"
              id="username"
              label=""
              value={formData.username}
              placeholder=""
              validators={[]}
              create
              gray
              onChange={handleChange}
            />
          </div>
          <Button
            size="small"
            type="submit"
            blue={isEmailValid}
            disabled={!isEmailValid}
          >
            Modifier mon nom d'utilisateur
          </Button>
        </div>
      </Modal>
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
                  sx={{ width: 80, height: 80 }}
                />

                <h1 className="text-[30px] capitalize font-[800]">
                  {user?.username}
                </h1>

                <span
                  className="text-blue-600 text-xs ml-5 cursor-pointer"
                  onClick={() => setNameInputIsOpen(true)}
                >
                  Modifier
                </span>
              </div>
              <Divider />
              <div className="mt-3">
                <div className="flex items-center text-[18px] gap-2 text-gray-700">
                  <span>Email :</span>
                  <span className="font-[600]">{user?.email}</span>
                  <span
                    className="text-blue-600 text-xs ml-5 cursor-pointer"
                    onClick={() => setEmailInputIsOpen(true)}
                  >
                    Modifier
                  </span>
                </div>
                <div className="flex items-center text-[18px] gap-2 text-gray-700 mt-3">
                  <span>Droits :</span>
                  <span className="font-[600] capitalize">
                    {user?.authorization}
                  </span>
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    className="text-[12px] font-[600] text-blue-500"
                    onClick={() => setPasswordIsOpen((prev) => !prev)}
                  >
                    {!paswordisOpen
                      ? "Changer mon mot de passe"
                      : "Annuler changement"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
