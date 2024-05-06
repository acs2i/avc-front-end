import React, { useState, useEffect } from "react";
import Card from "../components/Shared/Card";
import Button from "../components/FormElements/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronUp, SquarePen } from "lucide-react";
import Spinner from "../components/Shared/Spinner";
import { Tooltip } from "@mui/material";
import truncateText from "../utils/func/Formattext";
import { spawn } from "child_process";
import ScrollToTop from "../components/ScrollToTop";

interface Product {
  _id: string;
  GA_CODEARTICLE: number;
  GA_FERME: string;
  GA_FOURNPRINC: number;
  GA_LIBCOMPL: string;
  GA_LIBELLE: string;
  GA_LIBREART1: any;
  GA_LIBREART2: any;
  GA_LIBREART4: any;
  family: any;
  subFamily: any;
  brand: any;
  productCollection: string;
}

interface Brand {
  _id: string;
  YX_CODE: string;
  YX_LIBELLE: string;
}

interface Supplier {
  _id: string;
  T_TIERS: string;
  T_LIBELLE: string;
  T_JURIDIQUE: string;
 
}

interface Family {
  _id: string;
  YX_TYPE: string;
  YX_CODE: string;
  YX_LIBELLE: string;
 
}

export default function Home() {
  const [brandDropDownIsOpen, setBrandDropDownIsOpen] = useState(false)
  const [supplierDropDownIsOpen, setSupplierDropDownIsOpen] = useState(false)
  const [familyDropDownIsOpen, setFamilyDropDownIsOpen] = useState(false)
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [familyValue, setFamilyValue] = useState("");
  const [supplierValue, setSupplierValue] = useState("");
  const [brandChoiceValue, setBrandChoiceValue] = useState("");
  const [supplierChoiceValue, setSupplierChoiceValue] = useState("");
  const [familyChoiceValue, setFamilyChoiceValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const navigate = useNavigate();
  const colors = ["text-gray-700", "text-gray-500", "text-gray-400"];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProducts(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    setBrandDropDownIsOpen(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand/search?YX_LIBELLE=${brandValue}&page=${currentPage}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setBrands(data.data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    setSupplierDropDownIsOpen(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/supplier/search?T_LIBELLE=${supplierValue}&page=${currentPage}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data)
      setSuppliers(data.data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFamilies = async () => {
    setFamilyDropDownIsOpen(true)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/search?YX_LIBELLE=${familyValue}&page=${currentPage}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setFamilies(data.data);
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
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/search?GA_CODEARTICLE=${codeValue}&GA_LIBELLE=${labelValue}&GA_LIBREART4=${brandChoiceValue}&GA_FOURNPRINC=${supplierChoiceValue}&GA_LIBREART1=${familyChoiceValue}&page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProducts(data.data);
      setTotalItem(data.total);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  useEffect(() => {
    if(brandValue){
      fetchBrands();
    }
  }, [brandValue]);

  useEffect(() => {
    if(supplierValue){
      fetchSuppliers();
    }
  }, [supplierValue]);

  useEffect(() => {
    if(familyValue){
      fetchFamilies();
    }
  }, [familyValue]);

  useEffect(() => {
    if(codeValue || labelValue || brandChoiceValue|| supplierChoiceValue || familyChoiceValue){
      handleSearch();
    }
  }, [codeValue, labelValue, brandChoiceValue, supplierChoiceValue, familyChoiceValue]);

  return (
    <div className="relative">
      <Card title="Tous les produits">
        <div className="p-7">
          <div className="relative flex flex-wrap items-center gap-5 text-gray-600">
            <div className="flex items-center gap-4">
              <label className="w-[60px] text-sm font-bold">Code :</label>
              <input
                type="text"
                id="code"
                className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                placeholder="Rechercher un code"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-[100px] text-sm font-bold">Libellé :</label>
              <input
                type="text"
                id="label"
                className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                placeholder="Rechercher un code"
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
              />
            </div>
            <div className="relative flex items-center gap-4">
              <label className="w-[70px] text-sm font-bold">Marque :</label>
              <div className="relative">
                <input
                  type="text"
                  id="brand"
                  className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                  placeholder="Rechercher un code"
                  value={brandValue}
                  onChange={(e) => setBrandValue(e.target.value)}
                />
                {brands && brandDropDownIsOpen && (
                  <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
                    <div className="h-[30px] flex justify-end cursor-pointer">
                      <span className="text-md px-4" onClick={()=>setBrandDropDownIsOpen(false)}>X</span>
                    </div>
                    {brands.map((brand) => (
                      <ul>
                        <li
                          className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                          onClick={() => {
                            setBrandChoiceValue(brand.YX_CODE);
                            setBrandValue(brand.YX_LIBELLE)
                            setBrandDropDownIsOpen(false);
                          }}
                        >
                          {brand.YX_LIBELLE}
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-[90px] text-sm font-bold">
                Fournisseur :
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="brand"
                  className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                  placeholder="Rechercher un code"
                  value={supplierValue}
                  onChange={(e) => setSupplierValue(e.target.value)}
                />
                {suppliers && supplierDropDownIsOpen && (
                  <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
                    <div className="h-[30px] flex justify-end cursor-pointer">
                      <span className="text-md px-4" onClick={()=>setSupplierDropDownIsOpen(false)}>X</span>
                    </div>
                    {suppliers.map((supplier) => (
                      <ul>
                        <li
                          className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                          onClick={() => {
                            setSupplierChoiceValue(supplier.T_TIERS);
                            setSupplierValue(supplier.T_LIBELLE)
                            setSupplierDropDownIsOpen(false);
                          }}
                        >
                          {supplier.T_LIBELLE}
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-[60px] text-sm font-bold">Famille :</label>
              <div className="relative">
                <input
                  type="text"
                  id="brand"
                  className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                  placeholder="Rechercher un code"
                  value={familyValue}
                  onChange={(e) => setFamilyValue(e.target.value)}
                />
                {families && familyDropDownIsOpen && (
                  <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
                    <div className="h-[30px] flex justify-end cursor-pointer">
                      <span className="text-md px-4" onClick={()=>setFamilyDropDownIsOpen(false)}>X</span>
                    </div>
                    {families.map((family) => (
                      <ul>
                        <li
                          className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                          onClick={() => {
                            setFamilyChoiceValue(family.YX_CODE);
                            setFamilyValue(family.YX_LIBELLE)
                            setFamilyDropDownIsOpen(false);
                          }}
                        >
                          {family.YX_LIBELLE}
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-[100px] text-sm font-bold">
                Sous-famille :
              </label>
              <input
                type="text"
                id="search"
                className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                placeholder="Rechercher un code"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
              />
            </div>

            <div>
              <Button to="/edit" size="small" green>
                Créer un produit
              </Button>
            </div>
          </div>
        </div>
        {products && products.length > 0 && (
          <div className="flex justify-center p-7">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        )}
        <div className="relative overflow-x-auto bg-white">
          <div className="px-3 mb-2 flex items-center gap-2">
            <h4 className="text-xl">
              <span className="font-bold">{totalItem}</span> Produits
            </h4>
            {prevSearchValue && (
              <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
            )}
          </div>
          <table className="w-full text-left">
            <thead className="bg-blue-50 text-md text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-4 w-1/6">
                  Code
                </th>
                <th scope="col" className="px-6 py-4 w-1/6">
                  Libellé
                </th>
                <th scope="col" className="px-6 py-4 w-1/6">
                  Marque
                </th>
                <th scope="col" className="px-6 py-4 w-1/6">
                  Founisseur
                </th>
                <th scope="col" className="px-6 py-4 w-1/6">
                  Famille
                </th>
                <th scope="col" className="px-6 py-4 w-1/6">
                  Sous-famille
                </th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-sm text-gray-400 even:bg-slate-50 whitespace-nowrap font-bold border"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <td className="px-6 py-4">{product.GA_CODEARTICLE}</td>
                    <td className="px-6 py-4">
                      {truncateText(product.GA_LIBELLE, 20)}
                    </td>
                    <td className="px-6 py-4">
                      {product.brand ? (
                        <div>
                          <span>{product?.brand?.YX_CODE}</span>
                          <span className="mx-1">-</span>
                          <span>{product?.brand?.YX_LIBELLE}</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.GA_FOURNPRINC}
                    </td>
                    <td className="px-6 py-4">
                      {product.family ? (
                        <div>
                          <span>{product.family?.YX_CODE}</span>
                          <span className="mx-1">-</span>
                          <span>{product.family?.YX_LIBELLE}</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.subFamily ? (
                        <div>
                          <span>{product?.subFamily?.YX_CODE}</span>
                          <span className="mx-1">-</span>
                          {product?.subFamily.YX_LIBELLE && (
                            <span>
                              {truncateText(product?.subFamily?.YX_LIBELLE, 15)}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span>-</span>
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
        </div>
      </Card>
      {totalItem !== null && totalItem > 10 && (
        <ScrollToTop scrollThreshold={300} />
      )}
    </div>
  );
}
