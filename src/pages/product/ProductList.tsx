import React, { useState, useEffect } from "react";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import truncateText from "../../utils/func/Formattext";
import ScrollToTop from "../../components/ScrollToTop";
import { useFamilies } from "../../utils/hooks/useFamilies";
import { useProducts } from "../../utils/hooks/useProducts";
import { useBrands } from "../../utils/hooks/useBrands";
import { useSuppliers } from "../../utils/hooks/useSuppliers";
import { useSubFamilies } from "../../utils/hooks/useSubFamilies";
import { ChevronDown, ChevronsUpDown, ChevronUp, Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";
import useFetch from "../../utils/hooks/usefetch";

interface Product {
  _id: string;
  creator_id: any;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  princ_supplier_id: any;
  supplier_ids: any[];
  dimension_types: string[];
  uvc_ids: any[];
  brand_ids: any[];
  collection_ids: any[];
  imgPath: string;
  status: string;
  additional_fields: any;
}

export default function ProductList() {
  const [page, setPage] = useState("standard");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedActiveValue, setSelectedActiveValue] = useState("all");
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [supplierValue, setSupplierValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [totalItem, setTotalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setProducts(result.data);
        setTotalItem(result.total);
      } else {
        console.error("Erreur lors de la requête");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log(products);

  return (
    <section className="w-full">
      <Header
        title="Toutes"
        light="les références"
        link="/product/edit"
        btnTitle="Créer un produit"
        placeholder="Rechercher un produit"
        height="400px"
      >
        <form className="py-1">
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-600">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Code :</label>
              <input
                type="text"
                id="code"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder="Rechercher un code"
                value={codeValue}
                onChange={(e) => setCodeValue(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Libellé :</label>
              <input
                type="text"
                id="label"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder="Rechercher par libellé"
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-bold mb-1">Marque :</label>
              <input
                type="text"
                id="brand"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder="Rechercher par marque"
                value={brandValue}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-bold mb-1">Fournisseur :</label>
              <input
                type="text"
                id="supplier"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
                placeholder="Rechercher par fournisseur"
                value={supplierValue}
                autoComplete="off"
              />
            </div>

            <div className="relative col-span-full flex justify-end">
              <div className="absolute left-0">
                <fieldset className="flex items-center gap-3 font-[700] text-gray-600">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="all"
                      name="actif"
                      value="all"
                      checked={selectedActiveValue === "all"}
                    />
                    <label htmlFor="all">Tous</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="actif"
                      name="actif"
                      value="actif"
                      checked={selectedActiveValue === "actif"}
                    />
                    <label htmlFor="actif">Actives</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="inactif"
                      name="actif"
                      value="inactif"
                      checked={selectedActiveValue === "inactif"}
                    />
                    <label htmlFor="inactif">Inactives</label>
                  </div>
                </fieldset>
              </div>
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
        </form>
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
              <th scope="col" className="px-6 w-[10%]"></th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Libellé</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-3">
                <div className="flex items-center">
                  <span>Marque</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Fournisseur</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Sous-famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
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
            {products && products.length > 0 ? (
              products.map((product: Product) => (
                <tr
                  key={product._id}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[11px] text-gray-500 whitespace-nowrap border-y-[1px] border-gray-200"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <td className="px-6 py-2">{product.reference}</td>
                  <td className="px-6 py-2">
                    {!product.imgPath ? (
                      <div className="relative w-[60px] h-[60px] flex items-center border p-1 rounded-md">
                        <img
                          src="/img/logo.png"
                          alt=""
                          className="w-full filter saturate-50 opacity-50"
                        />
                        <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-[10px] font-bold bg-black bg-opacity-50 p-1 rounded rotate-[-20deg]">
                          Pas d'image
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-[60px] h-[60px] flex items-center border p-1 rounded-md">
                        <img
                          src={product.imgPath ? product.imgPath : ""}
                          alt=""
                          className="w-full filter saturate-50 opacity-50"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-2 text-blue-500">
                    {truncateText(product.long_label, 25)}
                  </td>
                  <td className="px-6 py-2">
                    {product.brand_ids && product.brand_ids.length > 0 ? (
                      product.brand_ids.map((brand) => (
                        <div key={brand._id}>
                          <span>{brand?.code ?? "NA"}</span>
                          <span className="mx-1">-</span>
                          <span>{brand?.label ?? "NA"}</span>
                        </div>
                      ))
                    ) : (
                      <span>Aucune marque</span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {product.princ_supplier_id ? (
                      <div>
                        <span>{product.princ_supplier_id?.code ?? 'NA'}</span>
                        <span className="mx-1">-</span>
                        <span>{product.princ_supplier_id?.company_name ?? "NA"}</span>
                      </div>
                    ) : (
                      <span>Aucun fournisseur</span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {product.tag_ids && product.tag_ids.length > 0 ? (
                      <div>
                        <span>{product.tag_ids[0]?.code ?? 'NA'}</span>
                        <span className="mx-1">-</span>
                        <span>{product.tag_ids[0]?.name ?? 'NA'}</span>
                      </div>
                    ) : (
                      <span>NA</span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {product.tag_ids && product.tag_ids.length > 0 ? (
                      <div>
                        <span>{product.tag_ids[1]?.code ?? 'NA'}</span>
                        <span className="mx-1">-</span>
                        <span>{product.tag_ids[1]?.name ?? 'NA'}</span>
                      </div>
                    ) : (
                      <span>NA</span>
                    )}
                  </td>
                  <td className="px-6 py-2 uppercase">
                    {product.status === "A" ? (
                      <div className="text-center bg-green-200 text-green-600 border border-green-400  py-1 rounded-md max-w-[60px]">
                        <span>Actif</span>
                      </div>
                    ) : (
                      <div className="text-center bg-gray-200 text-gray-600 border border-gray-400  py-1 rounded-md max-w-[60px]">
                        <span>Innactif</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
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
              {/* {products?.products && products.products.length > 0 && (
                <h4 className="text-sm whitespace-nowrap">
                  <span className="font-bold">{totalItem}</span> Produits
                </h4>
              )} */}
              {prevSearchValue && (
                <span className="text-sm italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-end w-full">
              {products && products.length > 0 && (
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
