import ScrollToTop from "../../components/ScrollToTop";
import React, { useState, useEffect } from "react";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import { ChevronsUpDown, CircleSlash2, Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

interface Supplier {
  _id: string;
  code: string;
  company_name: string;
  address_1: string;
  postal: string;
  city: string;
  country: string;
  status: string;
}

export default function SuppliersList() {
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [postalValue, setPostalValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [statusValue, setStatusValue] = useState("A");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchParams, setSearchParams] = useState<any>(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams) {
      searchSuppliers(searchParams);
    } else {
      fetchSuppliers(statusValue);
    }
  }, [currentPage, searchParams]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchSuppliers = async (status: string = "") => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/search?page=${currentPage}&limit=${limit}`;

      // Ne pas ajouter le paramètre status si on veut "tous"
      if (status && status !== "all") {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setSuppliers(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchSuppliers = async (params: any) => {
    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams(params);

      const response = await fetch(
        `${
          process.env.REACT_APP_URL_DEV
        }/api/v1/supplier/search?page=${currentPage}&limit=${limit}&${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSuppliers(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params: any = {};
  
    if (codeValue) params.code = codeValue;
    if (labelValue) params.company_name = labelValue;
    if (addressValue) params.address = addressValue;
    if (postalValue) params.postal = postalValue;
    if (cityValue) params.city = cityValue;
    if (countryValue) params.country = countryValue;
  
    if (statusValue !== "all") {
      params.status = statusValue;
    }
  
    if (
      !codeValue &&
      !labelValue &&
      !addressValue &&
      !postalValue &&
      !cityValue &&
      !countryValue &&
      statusValue === "all"
    ) {
      setSearchParams(null);
      setCurrentPage(1);
      fetchSuppliers();
    } else {
      setSearchParams(params);
      setCurrentPage(1);
      searchSuppliers(params);
    }
  };
  
  
  

  console.log(statusValue);

  return (
    <section>
      <Header
        title="Liste"
        light="des fournisseurs"
        link="/suppliers/create"
        btnTitle="Créer un fournisseur"
        placeholder="Rechercher un fournisseur"
        height="450px"
      >
        <div className="relative grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-6 text-gray-600">
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Code :</label>
            <input
              type="text"
              id="code"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par code"
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Raison sociale :</label>
            <input
              type="text"
              id="label"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par nom"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Autres champs de recherche */}
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Adresse :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par adresse"
              value={addressValue}
              onChange={(e) => setAddressValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Code postal :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par code postal"
              value={postalValue}
              onChange={(e) => setPostalValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Ville :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par ville"
              value={cityValue}
              onChange={(e) => setCityValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Pays :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par pays"
              value={countryValue}
              onChange={(e) => setCountryValue(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Boutons radio pour le statut */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="tous"
              name="status"
              value=""
              checked={statusValue === "all"}
              onChange={() => setStatusValue("all")}
            />
            <label
              htmlFor="tous"
              className="text-[14px] font-bold text-gray-600"
            >
              Tous
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="actif"
              name="status"
              value="A"
              checked={statusValue === "A"}
              onChange={() => setStatusValue("A")}
            />
            <label
              htmlFor="actif"
              className="text-[14px] font-bold text-gray-600"
            >
              Actifs
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="inactif"
              name="status"
              value="I"
              checked={statusValue === "I"}
              onChange={() => setStatusValue("I")}
            />
            <label
              htmlFor="inactif"
              className="text-[14px] font-bold text-gray-600"
            >
              Inactifs
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between w-full mt-3">
          <Button type="button" size="small" blue onClick={handleSearch}>
            Lancer la Recherche
          </Button>
          <Link
            to="/suppliers/create"
            className="bg-[#3B71CA] text-white text-[12px] p-2 rounded-md font-bold hover:brightness-125"
          >
            Créer un fournisseur
          </Link>
        </div>
      </Header>

      {/* Table des résultats */}
      <div className="relative overflow-x-auto bg-white">
        <table className="w-full text-left">
          <thead className="border-y-[2px] border-slate-100 text-sm font-[900] text-black uppercase">
            <tr>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center">
                  <span className="leading-3">Code</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6">
                <div className="flex items-center">
                  <span>Raison Sociale</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6">
                <div className="flex items-center">
                  <span>Adresse</span>
                </div>
              </th>
              <th scope="col" className="px-2">
                <div className="flex items-center">
                  <span>Code postal</span>
                </div>
              </th>
              <th scope="col" className="px-6">
                <div className="flex items-center">
                  <span>Ville</span>
                </div>
              </th>
              <th scope="col" className="px-6">
                <div className="flex items-center">
                  <span>Pays</span>
                </div>
              </th>
              <th scope="col" className="px-6">
                <div className="flex items-center">
                  <span>Status</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {suppliers && suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <tr
                  key={supplier._id}
                  className="border-y-[1px] border-gray-200 bg-white cursor-pointer hover:bg-slate-200 capitalize text-[11px] text-gray-500 whitespace-nowrap"
                  onClick={() => {
                    navigate(`/suppliers/${supplier._id}`);
                  }}
                >
                  <td className="px-6 py-2">{supplier.code}</td>
                  <td className="px-6 py-2">{supplier.company_name}</td>
                  <td className="px-6 py-2">
                    {supplier.address_1 ? (
                      supplier.address_1
                    ) : (
                      <CircleSlash2 size={15} />
                    )}
                  </td>

                  <td className="px-2 py-2">
                    {supplier.postal ? (
                      supplier.postal
                    ) : (
                      <CircleSlash2 size={15} />
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {supplier.city ? supplier.city : <CircleSlash2 size={15} />}
                  </td>
                  <td className="px-6 py-2">
                    {supplier.country ? (
                      supplier.country
                    ) : (
                      <CircleSlash2 size={15} />
                    )}
                  </td>
                  <td className="px-6 py-2 uppercase">
                    {supplier.status === "A" ? (
                      <div className="text-center bg-green-200 text-green-600 border border-green-400 py-1 rounded-md max-w-[60px]">
                        <span>Actif</span>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 text-gray-600 border border-gray-400 py-1 rounded-md max-w-[60px]">
                        <span>Inactif</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-7 text-center">
                  {totalItem === null ? (
                    <div className="flex justify-center overflow-hidden p-[30px]">
                      <Spinner />
                    </div>
                  ) : (
                    "Aucun Résultat"
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              <h4 className="text-sm whitespace-nowrap">
                <span className="font-bold">{totalItem}</span> Fournisseurs
              </h4>
            </div>
            <div className="flex justify-end w-full">
              {suppliers && suppliers.length > 0 && (
                <div className="flex justify-center">
                  <Stack spacing={2}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="small"
                    />
                  </Stack>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
