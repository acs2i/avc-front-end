import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type FetchOptionsParams = {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  endpoint: string;
  queryParamName: string;
  currentPage: number;
  limit: number;
};

const fetchOptions = async ({
  inputValue,
  setInputValue,
  setOptions,
  endpoint,
  queryParamName,
  currentPage,
  limit,
}: FetchOptionsParams) => {
  setInputValue(inputValue);

  const url = inputValue
    ? `${endpoint}/search?${queryParamName}=${inputValue}&page=${currentPage}&limit=${limit}`
    : endpoint;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    const options = data.data?.map((item: any) => ({
      value: item._id,
      label: item.name || item.company_name,
    }));

    setOptions(options);
  } catch (error) {
    console.error("Erreur lors de la requête", error);
  }
};

export function useFetchOptions(endpoint: string, queryParamName: string) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const currentPage = 1;
  const limit = 10;

  const handleInputChange = (value: string) => {
    fetchOptions({
      inputValue: value,
      setInputValue,
      setOptions,
      endpoint,
      queryParamName,
      currentPage,
      limit,
    });
  };

  return {
    inputValue,
    options,
    handleInputChange,
  };
}
