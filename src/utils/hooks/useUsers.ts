// useUsers.ts
import { useState } from "react";
import { useSelector } from "react-redux";

type UserOption = {
  value: string;
  label: string;
};

export const useUsers = (initialInputValue: string = "", limit = 10) => {
  const [inputValueUser, setInputValueUser] = useState(initialInputValue);
  const [optionsUser, setOptionsUser] = useState<UserOption[]>([]);
  const [users, setUsers] = useState<(UserOption | null)[]>([null]);
  const token = useSelector((state: any) => state.auth.token);
  const [currentPage, setCurrentPage] = useState(1);


  const fetchAllUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/search?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setOptionsUser(
        data.map((user: any) => ({
          value: user.username,
          label: user.username,
        }))
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };
  

  const searchUsers = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/search?username=${inputValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      return (
        data.map((user: any) => ({
          value: user.username,
          label: user.username,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };
  
  const handleInputChangeUser = async (inputValue: string) => {
    setInputValueUser(inputValue);
    if (inputValue === "") {
      await fetchAllUsers(); // Fetch général si vide
    } else {
      const searchedUsers = await searchUsers(inputValue);
      setOptionsUser(searchedUsers);
    }
  };
  

  const handleChangeUser = (selectedOption: UserOption | null, index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index] = selectedOption;
    setUsers(updatedUsers);
  };

  const addUserField = () => setUsers([...users, null]);
  const removeUserField = (index: number) => {
    if (users.length === 1) return;
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return {
    inputValueUser,
    optionsUser,
    users,
    setOptionsUser,
    handleInputChangeUser,
    handleChangeUser,
    addUserField,
    removeUserField,
  };
};
