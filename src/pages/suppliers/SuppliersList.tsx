import ScrollToTop from "../../components/ScrollToTop";
import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import { ChevronsUpDown, CircleSlash2, FileDown, Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

interface Supplier {
  _id: string;
  code: string;
  company_name: string;
  siret: string;
  tva: string;
  web_url: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  address_3: string;
  postal: string;
  country: string;
  contacts?: any[];
  conditions?: any[];
  brand_id: any[];
  status: string;
  creator: any; // it's an object
  additional_fields?: any;
}

export default function SuppliersList() {
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const navigate = useNavigate();

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier?page=${currentPage}&limit=${limit}`,
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
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePdf = async (supplier: Supplier) => {
    setIsLoading(true);
    console.log(supplier);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/generate-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supplier),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        // console.log(data.filePath);
        // window.open(data.filePath, '_blank');
        const fileName = data.filePath.substring(
          data.filePath.lastIndexOf('/') + 1, 
          data.filePath.indexOf('.pdf')
        );
        const link = document.createElement('a');
        link.href = 'http://'+data.filePath;
        link.target = '_blank';
        link.download = `${fileName}.pdf`; // Vous pouvez spécifier un nom de fichier pour le téléchargement
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <section>
      <Header
        title="Liste"
        light="des fournisseurs"
        link="/suppliers/create"
        btnTitle="Créer un fournisseur"
        placeholder="Rechercher un fournisseur"
        height="300px"
      >
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 text-gray-600">
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Code :</label>
            <input
              type="text"
              id="code"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par code fournisseur"
              value={codeValue}
              onChange={(e) => setCodeValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Raison social :</label>
            <input
              type="text"
              id="label"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Rechercher par nom du fournisseur"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="flex items-center">
            {!isLoading ? (
              <Button type="submit" size="small" blue>
                Lancer la Recherche
              </Button>
            ) : (
              <Spinner
                width="50px"
                height="40px"
                logoSize="90%"
                progressSize={50}
              />
            )}
          </div>
        </div>
      </Header>
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
                  <span>Raison Social</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6">
                <div className="flex items-center">
                  <span>Email</span>
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
              <th scope="col" className="px-1">
                <div className="flex items-center justify-center">
                  <span>Action</span>
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
                  // onClick={() => {
                  //   console.log('Navigating to:', `/suppliers/${supplier._id}`);
                  //   navigate(`/suppliers/${supplier._id}`);
                  // }}
                >
                  <td className="px-6 py-2">{supplier.code}</td>
                  <td className="px-6 py-2">{supplier.company_name}</td>
                  <td className="px-6 py-2">
                    {supplier.email ? (
                      supplier.email
                    ) : (
                      <CircleSlash2 size={15} />
                    )}
                  </td>
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
                  <td className="flex justify-center">
                    <div
                      className="w-[30px] h-[30px] flex items-center justify-center text-sky-600 cursor-pointer"
                      onClick={() => handleGeneratePdf(supplier)}
                    >
                      <FileDown size={17} />
                    </div>
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
              {prevSearchValue && (
                <span className="text-sm italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
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
