import React, { useState, useEffect } from "react";
import Button from "../../components/FormElements/Button";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Shared/Spinner";
import truncateText from "../../utils/func/Formattext";
import Header from "../../components/Navigation/Header";
import { ChevronsUpDown, CircleSlash2 } from "lucide-react";
import { useBrands } from "../../utils/hooks/useBrands";
import { useFamily } from "../../utils/hooks/useFamily";
import { useSubFamily } from "../../utils/hooks/useSubFamily";
import BrandSection from "../../components/Formulaires/BrandSection";
import FamilySection from "../../components/Formulaires/FamilySection";
import SubFamilySection from "../../components/Formulaires/SubFamilySection";

interface Product {
  _id: string;
  reference: string;
  long_label: string;
  brand_ids: any[];
  suppliers: any[];
  tag_ids: any[];
  imgPath: string;
  status: string;
}

const customStyles = {
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
  control: (provided: any) => ({
    ...provided,
    border: "none",
    boxShadow: "none",
    borderRadius: "10px",
    "&:hover": {
      border: "none",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: "1px solid #e5e5e5",
    backgroundColor: state.isSelected ? "#e5e5e5" : "white",
    color: state.isSelected ? "black" : "gray",
    "&:hover": {
      backgroundColor: "#e5e5e5",
      color: "black",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedActiveValue, setSelectedActiveValue] = useState("A");
  const [codeValue, setCodeValue] = useState("");
  const [labelValue, setLabelValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [supplierValue, setSupplierValue] = useState("");
  const [familyValue, setFamilyValue] = useState("");
  const [subFamilyValue, setSubFamilyValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<any>(null);
  const [totalItem, setTotalItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const navigate = useNavigate();
  const {
    inputValueBrand,
    optionsBrand,
    brands,
    handleInputChangeBrand,
    handleChangeBrand,
    addBrandField,
    removeBrandField,
  } = useBrands("", 10);
  const {
    inputValueFamily,
    optionsFamily,
    selectedFamily,
    handleInputChangeFamily,
    handleChangeFamily,
  } = useFamily("", 10);
  const {
    inputValueSubFamily,
    optionsSubFamily,
    selectedSubFamily,
    handleInputChangeSubFamily,
    handleChangeSubFamily,
  } = useSubFamily("", 10);

  useEffect(() => {
    if (searchParams) {
      searchProducts(searchParams);
    } else {
      fetchProducts(selectedActiveValue);
    }
  }, [currentPage, searchParams]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const fetchProducts = async (status: string = "") => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_URL_DEV}/api/v1/product/search?page=${currentPage}&limit=${limit}`;

      if (status && status !== "all") {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setProducts(result.data);
      setTotalItem(result.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchProducts = async (params: any) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(
        `${
          process.env.REACT_APP_URL_DEV
        }/api/v1/product/search?page=${currentPage}&limit=${limit}&${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setProducts(result.data);
      setTotalItem(result.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params: any = {};

    if (codeValue) params.reference = codeValue;
    if (labelValue) params.long_label = labelValue;

    const selectedBrandLabel = brands?.find((brand) => brand !== null)?.label;
    if (selectedBrandLabel) {
      params.brand = selectedBrandLabel;
    }

    if (selectedFamily && selectedFamily.name) {
      params.tag = selectedFamily.name;
    }

    if (selectedSubFamily && selectedSubFamily.name) {
      params.sub_family = selectedSubFamily.name;
    }

    if (supplierValue) params.supplier = supplierValue;

    // N'ajoute pas le paramètre status si "Tous" est sélectionné
    if (selectedActiveValue !== "all") {
      params.status = selectedActiveValue;
    }

    if (
      !codeValue &&
      !labelValue &&
      !selectedBrandLabel &&
      !supplierValue &&
      !selectedFamily &&
      !selectedSubFamily &&
      selectedActiveValue === "all"
    ) {
      setSearchParams(null);
      setCurrentPage(1);
      fetchProducts();
    } else {
      setSearchParams(params);
      setCurrentPage(1);
      searchProducts(params);
    }
  };

  const handleCSV = async () => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_URL_DEV}/api/v1/product/search?exportToCsv=true`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(products);

  return (
    <section className="w-full">
      <Header
        title="Toutes"
        light="les références"
        link="/product/edit"
        btnTitle="Créer un produit"
        placeholder="Rechercher un produit"
        height="450px"
      >
        <div className="relative grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-6 text-gray-600">
          {/* Champs de recherche */}
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
            <label className="text-sm font-bold mb-1">Libellé :</label>
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
          <div className="flex flex-col relative">
            <label className="text-sm font-bold">Marque :</label>
            <BrandSection
              brands={brands}
              optionsBrand={optionsBrand}
              handleChangeBrand={handleChangeBrand}
              removeBrandField={removeBrandField}
              addBrandField={addBrandField}
              handleInputChangeBrand={handleInputChangeBrand}
              inputValueBrand={inputValueBrand}
              customStyles={customStyles}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-1">Fournisseur :</label>
            <input
              type="text"
              className="p-2 text-sm text-gray-900 border-2 border-gray-200 bg-gray-50 rounded-md focus:outline-none focus:ring-blue-500 transition-all focus:border-[2px] focus:border-blue-500 focus:shadow-[0_0px_0px_5px_rgba(44,130,201,0.2)]"
              placeholder="Tapez Votre Recherche..."
              value={supplierValue}
              onChange={(e) => setSupplierValue(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Famille :</label>
            <FamilySection
              family={selectedFamily}
              optionsFamily={optionsFamily}
              handleChangeFamily={handleChangeFamily}
              handleInputChangeFamily={handleInputChangeFamily}
              inputValueFamily={inputValueFamily}
              customStyles={customStyles}
              isList
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold">Sous-famille :</label>
            <SubFamilySection
              subFamily={selectedSubFamily}
              optionsSubFamily={optionsSubFamily}
              handleChangeSubFamily={handleChangeSubFamily}
              handleInputChangeSubFamily={handleInputChangeSubFamily}
              inputValueSubFamily={inputValueSubFamily}
              customStyles={customStyles}
              isList
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
              value="all"
              checked={selectedActiveValue === "all"}
              onChange={() => setSelectedActiveValue("all")}
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
              checked={selectedActiveValue === "A"}
              onChange={() => setSelectedActiveValue("A")}
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
              checked={selectedActiveValue === "I"}
              onChange={() => setSelectedActiveValue("I")}
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
          {/* <Button type="button" size="small" blue onClick={handleCSV}>
            Exporter le CSV
          </Button> */}
        </div>
      </Header>
      {products && products.length === 0 && (
        <div className="absolute left-[50%] top-[600px] translate-x-[50%]">
          {totalItem === null ? <Spinner /> : "Aucun Résultat"}
        </div>
      )}
      {/* Table des résultats */}
      <div className="overflow-x-auto bg-white">
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
            {products &&
              products.length > 0 &&
              products.map((product: Product) => (
                <tr
                  key={product._id}
                  className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[11px] text-gray-500 whitespace-nowrap border-y-[1px] border-gray-200"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <td className="px-6 py-2 font-bold">
                    {truncateText(product?.reference || "", 10)}
                  </td>
                  <td className="px-6 py-2">
                    {!product.imgPath ? (
                      <div className="relative w-[60px] h-[60px] flex items-center border p-1 rounded-md">
                        <img
                          src="/img/logo.png"
                          alt="Pas d'image"
                          className="w-full filter saturate-50 opacity-50"
                        />
                        <span className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white text-[10px] font-bold bg-black bg-opacity-50 p-1 rounded rotate-[-20deg]">
                          Pas d'image
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-[60px] h-[60px] flex items-center border p-1 rounded-md">
                        <img
                          src={product.imgPath}
                          alt="Product"
                          className="w-full filter saturate-50 opacity-50"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-2 text-blue-400 font-[700]">
                    <span>{truncateText(product?.long_label || "", 20)}</span>
                  </td>
                  <td className="px-6 py-2">
                  {product?.brand_ids?.length > 0 && product.brand_ids[0]?.label ? product.brand_ids[0].label : ""}
                  </td>
                  <td className="px-6 py-2">
                    {product.suppliers && product.suppliers.length > 0 ? (
                      <div>
                        <span>
                          {product.suppliers[0].supplier_id?.code ?? "NA"}
                        </span>
                        <span className="mx-1">-</span>
                        <span>
                          {product.suppliers[0].supplier_id?.company_name ??
                            "NA"}
                        </span>
                      </div>
                    ) : (
                      <span>Aucun fournisseur</span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {product.tag_ids && product.tag_ids.length > 0 ? (
                      <div>
                        <span>{product.tag_ids[0]?.code ?? "NA"}</span>
                        <span className="mx-1">-</span>

                        <span>
                          {truncateText(product.tag_ids[0]?.name, 10) ?? "NA"}
                        </span>
                      </div>
                    ) : (
                      <span>NA</span>
                    )}
                  </td>
                  <td className="px-6 py-2">
                    {product.tag_ids && product.tag_ids.length > 1 ? (
                      <div>
                        <span>{product.tag_ids[1]?.code ?? "NA"}</span>
                        <span className="mx-1">-</span>
                        <span>
                          {truncateText(product.tag_ids[1]?.name ?? "NA", 10)}
                        </span>
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
                        <span>Inactif</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="px-4 py-2 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center">
              {totalItem !== null && (
                <h4 className="text-sm whitespace-nowrap">
                  <span className="font-bold">{totalItem}</span> Produits
                </h4>
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
