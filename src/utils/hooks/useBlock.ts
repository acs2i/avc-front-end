import { useState, useEffect } from "react";

type BlockOption = {
  _id: string;
  value: string;
  code: number;
  label: string;
};

export const useBlocks = (initialInputValue: string = "", limit = 10, isCreate: boolean = false) => {
  const [inputValueBlock, setInputValueBlock] = useState(initialInputValue);
  const [optionsBlock, setOptionsBlock] = useState<BlockOption[]>([]);
  const [blocks, setBlocks] = useState<(BlockOption | null)[]>([null]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllBlocks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_DEV}/api/v1/block`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data.data?.map((block: BlockOption) => ({
        value: isCreate ? block.label : block.label,
        label: isCreate ? block.label : block.label,
        code: isCreate ? block.code : block.code,
        _id: isCreate ? block._id : block.label,
      })) || [];
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  const searchBlocks = async (inputValue: string) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/block/search?label=${inputValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      return data.data?.map((block: BlockOption) => ({
        value: isCreate ? block.label : block.label,
        label: isCreate ? block.label : block.label,
        code: isCreate ? block.code : block.code,
        _id: isCreate ? block._id : block.label,
      })) || [];
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      return [];
    }
  };

  const handleInputChangeBlock = async (inputValue: string) => {
    setInputValueBlock(inputValue);

    if (inputValue === "") {
      const allBlocks = await fetchAllBlocks();
      setOptionsBlock(allBlocks);
    } else {
      const searchedBlocks = await searchBlocks(inputValue);
      setOptionsBlock(searchedBlocks);
    }
  };

  const handleChangeBlock = (selectedOption: BlockOption | null, index: number) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = selectedOption;
    setBlocks(updatedBlocks);
  };

  const addBlockField = () => setBlocks([...blocks, null]);

  const removeBrandField = (index: number) => {
    if (blocks.length === 1) return;
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
  };

  return {
    inputValueBlock,
    optionsBlock,
    blocks,
    setOptionsBlock,
    handleInputChangeBlock,
    handleChangeBlock,
    addBlockField,
    removeBrandField,
  };
};
