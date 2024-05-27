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
import { Divider } from "@mui/material";
import { LinkCard } from "@/type";

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
  const [totalItem, setTotalItem] = useState(null);
  const limit = 20;
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
  const navigate = useNavigate();

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
    <div className="relative">
      <Card
        title="Tous les produits"
        createTitle="Créer Un Produit"
        link="/edit"
      >
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-7">
              {LINKCARD_SEARCH.map((link: LinkCard, i) => (
                <React.Fragment key={i}>
                  <button
                    className={`text-gray-600 text-sm ${
                      page === link.page ? "text-green-700 font-bold" : ""
                    }`}
                    onClick={() => setPage(link.page)}
                  >
                    {link.name}
                  </button>
                  <div className="w-[1px] h-[20px] bg-gray-300"></div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        <form className="px-7" onSubmit={handleSearch}>
          <div className="relative flex flex-wrap items-center gap-5 text-gray-600">
            {page === "standard" && (
              <>
                <div className="flex items-center gap-4">
                  <label className="w-[60px] text-sm font-bold">Code :</label>
                  <input
                    type="text"
                    id="code"
                    className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                    placeholder="Rechercher un code"
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-[100px] text-sm font-bold">
                    Libellé :
                  </label>
                  <input
                    type="text"
                    id="label"
                    className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                    placeholder="Rechercher par libellé"
                    value={labelValue}
                    onChange={(e) => setLabelValue(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="relative flex items-center gap-4">
                  <label className="w-[70px] text-sm font-bold">Marque :</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="brand"
                      className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                      placeholder="Rechercher par marque"
                      value={brandValue}
                      onChange={(e) => handleBrandChange(e)}
                      onFocus={() => setBrandDropDownIsOpen(true)}
                      autoComplete="off"
                    />
                    {brands?.brands && brandDropDownIsOpen && brandValue && (
                      <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
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
                      placeholder="Rechercher par fournisseur"
                      value={supplierValue}
                      onChange={(e) => handleSupplierChange(e)}
                      onFocus={() => setSupplierDropDownIsOpen(true)}
                      autoComplete="off"
                    />
                    {suppliers?.suppliers &&
                      supplierDropDownIsOpen &&
                      supplierValue && (
                        <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
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
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-[60px] text-sm font-bold">
                    Famille :
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="brand"
                      className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                      placeholder="Rechercher par famille"
                      value={familyValue}
                      onChange={(e) => handleFamilyChange(e)}
                      onFocus={() => setFamilyDropDownIsOpen(true)}
                      autoComplete="off"
                    />
                    {families && familyDropDownIsOpen && (
                      <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
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
                </div>
                <div className="flex items-center gap-4">
                  <label className="w-[100px] text-sm font-bold">
                    Sous-famille :
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="brand"
                      className="block p-1.5 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-sm"
                      placeholder="Rechercher par sous-famille"
                      value={subFamilyValue}
                      onChange={(e) => handleSubFamilyChange(e)}
                      onFocus={() => setSubFamilyDropDownIsOpen(true)}
                      autoComplete="off"
                    />
                    {subFamilies?.subFamilies && subFamilyDropDownIsOpen && (
                      <div className="absolute w-[100%] bg-gray-50 z-[20000] py-4 rounded-b-md shadow-md top-[40px]">
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
                </div>
              </>
            )}

            {!isLoading ? (
              <div>
                <Button type="submit" size="small" gray>
                  Lancer la Recherche
                </Button>
              </div>
            ) : (
              <div>
                <Spinner
                  width="50px"
                  height="40px"
                  logoSize="90%"
                  progressSize={50}
                />
              </div>
            )}
          </div>
        </form>
        {products?.products && products.products.length > 0 && (
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
          <div className="px-3 mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-md">
                <span className="font-bold">{totalItem}</span> Produits
              </h4>
              {prevSearchValue && (
                <span className="text-xl italic">{`"${prevSearchValue}"`}</span>
              )}
            </div>
            <Button type="submit" size="small" to="/product/edit" green>
              Créer un produit
            </Button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-sm text-gray-500">
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
              {products?.products && products.products.length > 0 ? (
                products.products.map((product: Product) => (
                  <tr
                    key={product._id}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <td className="px-6 py-4">{product.GA_CODEARTICLE}</td>
                    <td className="px-6 py-4">
                      {truncateText(product.GA_LIBELLE, 15)}
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
                    <td className="px-6 py-4">{product.GA_FOURNPRINC}</td>
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
