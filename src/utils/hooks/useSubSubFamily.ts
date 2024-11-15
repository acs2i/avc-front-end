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
};

export const useSubSubFamily = (initialInputValue: string = "", limit = 10) => {
  const [inputValueSubSubFamily, setInputValueSubSubFamily] = useState(initialInputValue);
  const [optionsSubSubFamily, setOptionsSubSubFamily] = useState<TagOption[]>([]);
  const [selectedSubSubFamily, setSelectedSubSubFamily] = useState<TagOption | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all sub-sub-families when no search input is provided
  const fetchAllSubSubFamilies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?level=sous-sous-famille`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const optionsSubSubFamily = data.data?.map((tag: Tag) => ({
        value: tag.code,
        label: tag.name,
        name: tag.name,
        code: tag.code,
      }));
      setOptionsSubSubFamily(optionsSubSubFamily);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  // Search sub-sub-families by input value
  const searchSubSubFamilies = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/tag/search?name=${inputValue}&level=sous-sous-famille&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const optionsSubSubFamily = data.data?.map((tag: Tag) => ({
        value: tag.code,
        label: tag.name,
        name: tag.name,
        code: tag.code,
      }));
      setOptionsSubSubFamily(optionsSubSubFamily);
    } catch (error) {
      console.error("Erreur lors de la recherche des sous-sous-familles :", error);
    }
  };

  // Handle input changes for sub-sub-family search
  const handleInputChangeSubSubFamily = async (inputValueSubSubFamily: string) => {
    setInputValueSubSubFamily(inputValueSubSubFamily);

    if (inputValueSubSubFamily === "") {
      await fetchAllSubSubFamilies();
    } else {
      await searchSubSubFamilies(inputValueSubSubFamily);
    }
  };

  // Handle sub-sub-family selection changes
  const handleChangeSubSubFamily = (selectedOption: TagOption | null) => {
    setSelectedSubSubFamily(selectedOption);
  };

  return {
    inputValueSubSubFamily,
    optionsSubSubFamily,
    selectedSubSubFamily,
    setOptionsSubSubFamily,
    handleInputChangeSubSubFamily,
    handleChangeSubSubFamily,
  };
};
