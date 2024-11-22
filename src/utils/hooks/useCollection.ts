import { useState } from "react";

type CollectionOption = {
  _id: string;
  value: string;
  label: string;
  code: string;
};

export const useCollections = (initialInputValue: string = "", limit = 10) => {
  const [inputValueCollection, setInputValueCollection] = useState(initialInputValue);
  const [optionsCollection, setOptionsCollection] = useState<CollectionOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionOption | null>(null); // Une seule collection
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all collections
  const fetchAllCollections = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/collection`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return (
        data.data?.map((collection: CollectionOption) => ({
          value: collection.label,
          label: collection.label,
          code: collection.code,
          _id: collection.label,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  // Search collections by input value
  const searchCollections = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection/search?label=${inputValue}&code=${inputValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return (
        data.data?.map((collection: CollectionOption) => ({
          value: collection.label,
          label: collection.label,
          code: collection.code,
          _id: collection.label,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  // Handle input changes for collection search
  const handleInputChangeCollection = async (inputValue: string) => {
    setInputValueCollection(inputValue);

    if (inputValue === "") {
      const allCollections = await fetchAllCollections();
      setOptionsCollection(allCollections);
    } else {
      const searchedCollections = await searchCollections(inputValue);
      setOptionsCollection(searchedCollections);
    }
  };

  // Handle collection selection changes (pas besoin d'index)
  const handleChangeCollection = (selectedOption: CollectionOption | null) => {
    setSelectedCollection(selectedOption);
  };

  return {
    inputValueCollection,
    optionsCollection,
    selectedCollection,
    setOptionsCollection,
    handleInputChangeCollection,
    handleChangeCollection,
  };
};
