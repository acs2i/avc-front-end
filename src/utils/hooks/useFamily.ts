import { useState } from "react";

type Tag = {
  _id: string;
  level: string;
  code: string;
  name: string;
};

type TagOption = {
  value: string;
  label: string;
  name: string;
  code: string
};

export const useFamily = (initialInputValue: string = "", limit = 10) => {
  const [inputValueFamily, setInputValueFamily] = useState(initialInputValue);
  const [optionsFamily, setOptionsFamily] = useState<TagOption[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<TagOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all families (tags de niveau "famille")
  const fetchAllFamilies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/tag`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const optionsFamily = data.data?.map((tag: Tag) => ({
        value: tag.code,
        label: tag.name,
        name: tag.name,
        code: tag.code,
      }));
      setOptionsFamily(optionsFamily);
    } catch (error) {
      console.error("Erreur lors du fetch des familles :", error);
    }
  };
  

  // Search families by input value
  const searchFamilies = async (inputValue: string) => {
    try {
        // Déterminer le paramètre de recherche, soit `name`, soit `code`
        const searchParam = isNaN(Number(inputValue)) ? "name" : "code";
        
        const response = await fetch(
            `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?${searchParam}=${inputValue}&page=${currentPage}&limit=${limit}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const optionsFamily = data.data?.map((tag: Tag) => ({
            value: tag.code,
            label: tag.name,
            name: tag.name,
            code: tag.code,
        }));

        setOptionsFamily(optionsFamily);
    } catch (error) {
        console.error("Erreur lors de la recherche des familles :", error);
    }
};

  // Handle input changes for family search
  const handleInputChangeFamily = async (inputValueFamily: string) => {
    setInputValueFamily(inputValueFamily);
    if (inputValueFamily === "") {
      await fetchAllFamilies();
    } else {
      await searchFamilies(inputValueFamily);
    }
  };
  

  // Handle family selection changes (pas besoin d'index)
  const handleChangeFamily = (selectedOption: TagOption | null) => {
    setSelectedFamily(selectedOption);
  };

  return {
    inputValueFamily,
    optionsFamily,
    selectedFamily,
    setOptionsFamily,
    handleInputChangeFamily,
    handleChangeFamily,
  };
};
