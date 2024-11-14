import { useState, useEffect } from "react";

type IsoCodeOption = {
  alpha2Code: string;
  alpha3Code: string;
  numeric: string;
  countryName: string;
  _id: any;
};

export const useIsoCode = (initialInputValue: string = "", limit = 10) => {
  const [inputValueIsoCode, setInputValueIsoCode] = useState(initialInputValue);
  const [optionsIsoCode, setOptionsIsoCode] = useState<IsoCodeOption[]>([]);
  const [isoCodes, setIsoCodes] = useState<(IsoCodeOption | null)[]>([null]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllIsoCodes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/iso-code`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return (
        data.data?.map((iso: IsoCodeOption) => ({
          value: iso.alpha2Code,
          label: iso.countryName,
          _id: iso._id,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  const searchIsoCodes = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/iso-code/search?countryName=${inputValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return (
        data.data?.map((iso: IsoCodeOption) => ({
          value: iso.alpha2Code,
          label: iso.countryName,
          _id: iso._id,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleInputChangeIsoCode = async (inputValue: string) => {
    setInputValueIsoCode(inputValue);
    if (inputValue === "") {
        const allCodes = await fetchAllIsoCodes();
        setOptionsIsoCode(allCodes)
    } else {
        const searchedCode = await searchIsoCodes(inputValue);
        setOptionsIsoCode(searchedCode)
    }
  };

  const handleChangeIsoCode = (selectedOption: IsoCodeOption | null, index: number) => {
    const updatedIsoCodes = [...isoCodes];
    updatedIsoCodes[index] = selectedOption;
    setIsoCodes(updatedIsoCodes);
  };

  const handleChangeCollection = (selectedOption: IsoCodeOption | null) => {
    if (selectedOption) {
      setOptionsIsoCode([selectedOption]);
    } else {
      setOptionsIsoCode([]);
    }
  };
  


  return {
    inputValueIsoCode,
    optionsIsoCode,
    isoCodes,
    setOptionsIsoCode,
    handleInputChangeIsoCode,
    handleChangeIsoCode,
    handleChangeCollection
  };
};
