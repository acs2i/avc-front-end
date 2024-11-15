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
};

export const useSubFamily = (initialInputValue: string = "", limit = 10) => {
  const [inputValueSubFamily, setInputValueSubFamily] = useState(initialInputValue);
  const [optionsSubFamily, setOptionsSubFamily] = useState<TagOption[]>([]);
  const [selectedSubFamily, setSelectedSubFamily] = useState<TagOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all subfamilies when no search input is provided
  const fetchAllSubFamilies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?level=sous-famille`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const optionsSubFamily = data.data?.map((tag: Tag) => ({
        value: tag.code,
        label: tag.name,
        name: tag.name,
        code: tag.code,
      }));
      setOptionsSubFamily(optionsSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  // Search subfamilies by input value
  const searchSubFamilies = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?name=${inputValue}&level=sous-famille&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const optionsSubFamily = data.data?.map((tag: Tag) => ({
        value: tag.code,
        label: tag.name,
        name: tag.name,
        code: tag.code,
      }));
      setOptionsSubFamily(optionsSubFamily);
    } catch (error) {
      console.error("Erreur lors de la recherche des sous-familles :", error);
    }
  };

  // Handle input changes for subfamily search
  const handleInputChangeSubFamily = async (inputValueSubFamily: string) => {
    setInputValueSubFamily(inputValueSubFamily);

    if (inputValueSubFamily === "") {
      await fetchAllSubFamilies();
    } else {
      await searchSubFamilies(inputValueSubFamily);
    }
  };

  // Handle subfamily selection changes
  const handleChangeSubFamily = (selectedOption: TagOption | null) => {
    setSelectedSubFamily(selectedOption);
  };

  return {
    inputValueSubFamily,
    optionsSubFamily,
    selectedSubFamily,
    setOptionsSubFamily,
    handleInputChangeSubFamily,
    handleChangeSubFamily,
  };
};
