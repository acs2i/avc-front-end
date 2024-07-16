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
import { LINKCARD_SEARCH } from "../../utils/index";
import { Collapse, Divider } from "@mui/material";
import { LinkCard } from "@/type";
import { ChevronDown, ChevronsUpDown, ChevronUp, Plus } from "lucide-react";
import Header from "../../components/Navigation/Header";

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

interface SearchParams {
  codeValue?: string;
  labelValue?: string;
  brandChoiceValue?: string;
  supplierChoiceValue?: string;
  familyChoiceValue?: string;
  subFamilyChoiceValue?: string;
}

export default function ProductList() {
  const [page, setPage] = useState("standard");
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [brandDropDownIsOpen, setBrandDropDownIsOpen] = useState(false);
  const [supplierDropDownIsOpen, setSupplierDropDownIsOpen] = useState(false);
  const [familyDropDownIsOpen, setFamilyDropDownIsOpen] = useState(false);
  const [subFamilyDropDownIsOpen, setSubFamilyDropDownIsOpen] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [familyValue, setFamilyValue] = useState("");
  const [subFamilyValue, setSubFamilyValue] = useState("");
  const [supplierValue, setSupplierValue] = useState("");
  const [brandChoiceValue, setBrandChoiceValue] = useState("");
  const [supplierChoiceValue, setSupplierChoiceValue] = useState("");
  const [familyChoiceValue, setFamilyChoiceValue] = useState("");
  const [subFamilyChoiceValue, setSubFamilyChoiceValue] = useState("");
  const [prevSearchValue, setPrevSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [totalItem, setTotalItem] = useState(null);
  const limit = 30;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const searchParams: SearchParams = {
    codeValue,
    labelValue,
    brandChoiceValue,
    supplierChoiceValue,
    familyChoiceValue,
    subFamilyChoiceValue,
  };
  const [submittedSearchParams, setSubmittedSearchParams] =
    useState<SearchParams>({});
  const { data: products, refetch: refetchProducts } = useProducts(
    limit,
    currentPage,
    submittedSearchParams
  );
  const { data: families, refetch: refecthFamilies } = useFamilies(
    familyValue,
    limit,
    currentPage
  );
  const { data: subFamilies, refetch: refecthSubFamilies } = useSubFamilies(
    subFamilyValue,
    currentPage
  );
  const { data: brands, refetch: refecthBrands } = useBrands(
    brandValue,
    currentPage
  );
  const { data: suppliers, refetch: refecthSuppliers } = useSuppliers(
    supplierValue,
    currentPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (products?.products) {
      setTotalItem(products.total);
    }
  }, [products?.products]);

  const handleBrandChange = (e: any) => {
    setBrandValue(e.target.value);
    setBrandChoiceValue("");
  };

  const handleSupplierChange = (e: any) => {
    setSupplierValue(e.target.value);
    setSupplierChoiceValue("");
  };

  const handleFamilyChange = (e: any) => {
    setFamilyValue(e.target.value);
    setFamilyChoiceValue("");
  };

  const handleSubFamilyChange = (e: any) => {
    setSubFamilyValue(e.target.value);
    setSubFamilyChoiceValue("");
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setCurrentPage(1);
    setSubmittedSearchParams({
      codeValue,
      labelValue,
      brandChoiceValue,
      supplierChoiceValue,
      familyChoiceValue,
      subFamilyChoiceValue,
    });
    refetchProducts()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      refecthFamilies();
      refecthSubFamilies();
      refecthBrands();
      refecthSuppliers();
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [
    familyValue,
    refecthFamilies,
    brandValue,
    refecthBrands,
    supplierValue,
    refecthSuppliers,
    subFamilyValue,
    refecthSubFamilies,
  ]);

  return (
    <section className="w-full">
      <Header
        title="Références"
        link="/product/edit"
        btnTitle="Créer un produit"
        placeholder="Rechercher un produit"
        height="400px"
      >
        <form className="py-1" onSubmit={handleSearch}>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-600">
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-1">Code :</label>
              <input
                type="text"
                id="code"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md"
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
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md"
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
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md"
                placeholder="Rechercher par marque"
                value={brandValue}
                onChange={(e) => handleBrandChange(e)}
                onFocus={() => setBrandDropDownIsOpen(true)}
                autoComplete="off"
              />
              {brands?.brands && brandDropDownIsOpen && brandValue && (
                <div className="absolute w-full bg-gray-50 z-10 py-4 rounded-b-md shadow-md top-[40px]">
                  <div className="h-[30px] flex justify-end cursor-pointer">
                    <span
                      className="text-md px-4"
                      onClick={() => setBrandDropDownIsOpen(false)}
                    >
                      X
                    </span>
                  </div>
                  {brands?.brands.map((brand: Brand) => (
                    <ul key={brand._id}>
                      <li
                        className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                        onClick={() => {
                          setBrandChoiceValue(brand.YX_CODE);
                          setBrandValue(brand.YX_LIBELLE);
                          setBrandDropDownIsOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        {brand.YX_LIBELLE}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-bold mb-1">Fournisseur :</label>
              <input
                type="text"
                id="supplier"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md"
                placeholder="Rechercher par fournisseur"
                value={supplierValue}
                onChange={(e) => handleSupplierChange(e)}
                onFocus={() => setSupplierDropDownIsOpen(true)}
                autoComplete="off"
              />
              {suppliers?.suppliers &&
                supplierDropDownIsOpen &&
                supplierValue && (
                  <div className="absolute w-full bg-gray-50 z-10 py-4 rounded-b-md shadow-md top-[40px]">
                    <div className="h-[30px] flex justify-end cursor-pointer">
                      <span
                        className="text-md px-4"
                        onClick={() => setSupplierDropDownIsOpen(false)}
                      >
                        X
                      </span>
                    </div>
                    {suppliers?.suppliers.map((supplier: Supplier) => (
                      <ul key={supplier._id}>
                        <li
                          className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                          onClick={() => {
                            setSupplierChoiceValue(supplier.T_TIERS);
                            setSupplierValue(supplier.T_LIBELLE);
                            setSupplierDropDownIsOpen(false);
                            setCurrentPage(1);
                          }}
                        >
                          {supplier.T_LIBELLE}
                        </li>
                      </ul>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-bold mb-1">Famille :</label>
              <input
                type="text"
                id="family"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md"
                placeholder="Rechercher par famille"
                value={familyValue}
                onChange={(e) => handleFamilyChange(e)}
                onFocus={() => setFamilyDropDownIsOpen(true)}
                autoComplete="off"
              />
              {families && familyDropDownIsOpen && (
                <div className="absolute w-full bg-gray-50 z-10 py-4 rounded-b-md shadow-md top-[40px]">
                  <div className="h-[30px] flex justify-end cursor-pointer">
                    <span
                      className="text-md px-4"
                      onClick={() => setFamilyDropDownIsOpen(false)}
                    >
                      X
                    </span>
                  </div>
                  {families.families.map((family: Family) => (
                    <ul key={family._id}>
                      <li
                        className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                        onClick={() => {
                          setFamilyChoiceValue(family.YX_CODE);
                          setFamilyValue(family.YX_LIBELLE);
                          setFamilyDropDownIsOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        {family.YX_LIBELLE}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-bold mb-1">Sous-famille :</label>
              <input
                type="text"
                id="subFamily"
                className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md"
                placeholder="Rechercher par sous-famille"
                value={subFamilyValue}
                onChange={(e) => handleSubFamilyChange(e)}
                onFocus={() => setSubFamilyDropDownIsOpen(true)}
                autoComplete="off"
              />
              {subFamilies?.subFamilies && subFamilyDropDownIsOpen && (
                <div className="absolute w-full bg-gray-50 z-10 py-4 rounded-b-md shadow-md top-[40px]">
                  <div className="h-[30px] flex justify-end cursor-pointer">
                    <span
                      className="text-md px-4"
                      onClick={() => setSubFamilyDropDownIsOpen(false)}
                    >
                      X
                    </span>
                  </div>
                  {subFamilies?.subFamilies.map((subFamily: Family) => (
                    <ul key={subFamily._id}>
                      <li
                        className="cursor-pointer py-1 hover:bg-gray-200 text-xs px-4 py-2 border-b"
                        onClick={() => {
                          setSubFamilyChoiceValue(subFamily.YX_CODE);
                          setSubFamilyValue(subFamily.YX_LIBELLE);
                          setSubFamilyDropDownIsOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        {subFamily.YX_LIBELLE}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>

            <div className="col-span-full flex justify-end">
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
              <th scope="col" className="px-6 py-4 w-[10%]">
                <div className="flex items-center">
                  <span className="leading-3">Code</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Libellé</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
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
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Sous-famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.products && products.products.length > 0 ? (
              products.products.map((product: Product) => (
                <tr
                  key={product._id}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[11px] text-gray-500 whitespace-nowrap border-y-[1px] border-gray-200"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <td className="px-6 py-2">{product.GA_CODEARTICLE}</td>
                  <td className="px-6 py-2 text-blue-500">
                    {truncateText(product.GA_LIBELLE, 50)}
                  </td>
                  <td className="px-6 py-2">
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
                  <td className="px-6 py-2">{product.GA_FOURNPRINC}</td>
                  <td className="px-6 py-2">
                    {product.family ? (
                      <div className="inline-block">
                        <span>{product.family?.YX_CODE}</span>
                        <span className="mx-1">-</span>
                        <span>{product.family?.YX_LIBELLE}</span>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {product.subFamily ? (
                      <div className="inline-block">
                        <span>{product?.subFamily?.YX_CODE}</span>
                        <span className="mx-1">-</span>
                        {product?.subFamily.YX_LIBELLE && (
                          <span>{product?.subFamily?.YX_LIBELLE}</span>
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
              {products?.products && products.products.length > 0 && (
                <h4 className="text-sm whitespace-nowrap">
                  <span className="font-bold">{totalItem}</span> Produits
                </h4>
              )}
              {prevSearchValue && (
                <span className="text-sm italic ml-2">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <div className="flex justify-end w-full">
              {products?.products && products.products.length > 0 && (
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
