import { useState, useEffect } from "react";

type BrandOption = {
  _id: string;
  value: string;
  code: string;
  label: string;
};

export const useBrands = (initialInputValue: string = "", limit = 10) => {
  const [inputValueBrand, setInputValueBrand] = useState(initialInputValue);
  const [optionsBrand, setOptionsBrand] = useState<BrandOption[]>([]);
  const [brands, setBrands] = useState<(BrandOption | null)[]>([null]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllBrands = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/brand`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.data?.map((brand: BrandOption) => ({
        value: brand.label,
        label: brand.label,
        _id: brand._id,
      })) || [];
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
      return data.data?.map((brand: BrandOption) => ({
        value: brand.label,
        label: brand.label,
        _id: brand.label,
      })) || [];
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

  const handleChangeBrand = (selectedOption: BrandOption | null, index: number) => {
    const updatedBrands = [...brands];
    updatedBrands[index] = selectedOption;
    setBrands(updatedBrands);
  };

  const addBrandField = () => setBrands([...brands, null]);

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
