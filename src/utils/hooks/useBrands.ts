import { useState, useEffect } from "react";

type BrandOption = {
  _id: string;
  value: string;
  code: string;
  label: string;
};

export const useBrands = (
  initialInputValue: string = "",
  limit = 10,
  isCreate: boolean = false
) => {
  const [inputValueBrand, setInputValueBrand] = useState(initialInputValue);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [brands, setBrands] = useState<(BrandOption | null)[]>([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValues, setInputValues] = useState<string[]>([]);

  const fetchAllBrands = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return (
        data.data?.map((brand: BrandOption) => ({
          value: isCreate ? brand.label : brand.label,
          label: isCreate ? brand.label : brand.label,
          code: isCreate ? brand.code : brand.code,
          _id: isCreate ? brand._id : brand.label,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  const searchBrands = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?label=${inputValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return (
        data.data?.map((brand: BrandOption) => ({
          value: isCreate ? brand.label : brand.label,
          label: isCreate ? brand.label : brand.label,
          code: isCreate ? brand.code : brand.code,
          _id: isCreate ? brand._id : brand.label,
        })) || []
      );
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  const handleInputChangeBrand = async (inputValue: string) => {
    setInputValueBrand(inputValue);

    if (inputValue === "") {
      const allBrands = await fetchAllBrands();
      setOptionsBrand(allBrands);
    } else {
      const searchedBrands = await searchBrands(inputValue);
      setOptionsBrand(searchedBrands);
    }
  };

  const handleChangeBrand = (
    selectedOption: BrandOption | null,
    index: number
  ) => {
    const updatedBrands = [...brands];
  
    // Remplacer ou ajouter la marque à l'index spécifié
    updatedBrands[index] = selectedOption;
  
    // Mettre à jour seulement si la marque est nouvelle ou modifiée
    if (selectedOption) {
      const existingIndex = updatedBrands.findIndex(
        (brand) => brand?._id === selectedOption._id
      );
  
      if (existingIndex === -1 || existingIndex === index) {
        setBrands(updatedBrands);
      }
    } else {
      // Si la sélection est annulée (null), supprimez la marque correspondante
      updatedBrands[index] = null;
      setBrands(updatedBrands);
    }
  };  


  const addBrandField = () => {
    setBrands([...brands, null]);
  };
  

  const removeBrandField = (index: number) => {
    if (brands.length === 1) return;
    const updatedBrands = brands.filter((_, i) => i !== index);
    setBrands(updatedBrands);
  };

  return {
    inputValueBrand,
    optionsBrand,
    brands,
    setOptionsBrand,
    handleInputChangeBrand,
    handleChangeBrand,
    addBrandField,
    removeBrandField,
  };
};
