import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronUp } from "lucide-react";

interface Dimension {
    _id: string;
    CODE: string;
    LIBELLE: string;
  }

export default function DimensionPage() {
    const [isModify, setIsModify] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [collections, setCollections] = useState<Dimension[]>([]);
  const navigate = useNavigate();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchDimensions();
  }, [currentPage]);

  const fetchDimensions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCollections(data.data);
      setTotalItem(data.total);
      console.log(data)
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension/search?value=${searchValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCollections(data);
      setTotalItem(data.length);
      setPrevSearchValue(searchValue);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleKeyDown = (event : any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };


  return (
    <div>DimensionPage</div>
  )
}
