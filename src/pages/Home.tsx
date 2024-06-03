import { Avatar, Box, Divider, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import BarChart from "../components/Charts/BarCharts";
import { CARD, GRAPH } from "../utils";
import DoughnutChart from "../components/Charts/Dougnhuts";
import SparkLineChart from "../components/Charts/LineCharts";
import PointChart from "../components/Charts/PointChart";
import Map from "../components/Shared/Map";
import { Pause, Star, X } from "lucide-react";
import Card from "../components/Shared/Card";
import CardHome from "../components/Shared/CardHome";
import { useProducts } from "../utils/hooks/useProducts";

interface Suppliers {
  _id: string;
  T_TIERS: string;
  T_LIBELLE: string;
  T_JURIDIQUE: string;
}

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

interface SearchParams {
  codeValue?: string;
  labelValue?: string;
  brandChoiceValue?: string;
  supplierChoiceValue?: string;
  familyChoiceValue?: string;
  subFamilyChoiceValue?: string;
}

export default function Home() {
  const data1 = [12, 19, 14, 5, 16, 19];
  const data2 = [14, 16, 20, 5, 18, 22];
  const labels = ["January", "February", "March", "April", "May", "June"];
  const colors = ["#088F8F", "#6495ED", "#89CFF0"];
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const limit = 10;
  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [submittedSearchParams, setSubmittedSearchParams] =
    useState<SearchParams>({});
  const { data: products, refetch: refetchProducts } = useProducts(
    limit,
    currentPage,
    submittedSearchParams
  );

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
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="w-full bg-gray-100 p-8 flex border-b-[1px] border-gray-300">
        <div className="w-1/2">
          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-[35px] font-[800] text-gray-800">
                Tableau de bord
              </h3>
              <p className="text-[15px] text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
            <div className="flex items-center gap-5 ">
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <Star size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">57 new orders</span>
                  <span className="text-xs">Awating processing</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Pause size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">57 new orders</span>
                  <span className="text-xs">Awating processing</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-red-100 text-red-500">
                  <X size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">57 new orders</span>
                  <span className="text-xs">Awating processing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Divider />
          </div>

          <div className="mt-[40px]">
            <div>
              <h3 className="text-[25px] font-[800] text-gray-800">
                Evolution des ventes
              </h3>
              <p className="text-[15px] text-gray-600">
                Lorem, ipsum dolor sit amet consectetur.
              </p>
            </div>
            <Stack direction="row" sx={{ width: "100%", height: "300px" }}>
              <Box sx={{ flexGrow: 1 }}>
                <SparkLineChart
                  data1={data1}
                  data2={data2}
                  labels={labels}
                  color1="#5a80d8"
                  color2="#7EC8E3"
                />
              </Box>
            </Stack>
          </div>
        </div>
        <div className="w-1/2 flex flex-wrap justify-end gap-6">
          {CARD.map((card) => (
            <CardHome
              title={card.title}
              subtitle={card.subtitle}
              data1={card.data1}
              data2={card.data2}
              labels={card.labels}
              chartType={card.chartType}
            />
          ))}
        </div>
      </section>

      <section className="bg-white w-full p-8 border-b-[1px] border-gray-300 ">
        <div className="flx flex-col">
          <h4 className="text-[25px] font-[800] text-gray-800">
            Produits récemment crées
          </h4>
          <p className="text-[15px] text-gray-600">
            Produits créé ces dernières 24 heures
          </p>
        </div>

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-left">
            <thead className="border-y-[1px] border-gray-200 text-md font-[800] text-gray-700">
              <tr>
                <th scope="col" className="px-6 py-2 w-[50px]">
                  Code
                </th>
                <th scope="col" className="px-6 py-2 w-[300px]">
                  Libellé
                </th>
                <th scope="col" className="px-6 py-2 w-[300px]">
                  Famille
                </th>
                <th scope="col" className="px-6 py-2 w-[300px]">
                  Sous-famille
                </th>
                <th scope="col" className="px-6 py-2 w-[300px]">
                  Créateur
                </th>
                <th scope="col" className="px-6 py-2 w-[150px] text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.products.map((product: Product) => (
                <tr className="border-b">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{product.GA_CODEARTICLE}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600">
                        {product.GA_LIBELLE}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-xs">
                    {product.family ? (
                      <div className="inline-block bg-gray-300 px-3 py-1 rounded-md font-bold">
                        <span>{product.family?.YX_CODE}</span>
                        <span className="mx-1">-</span>
                        <span>{product.family?.YX_LIBELLE}</span>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="p-4 text-xs">
                    {product.subFamily ? (
                      <div className="inline-block bg-gray-200 px-3 py-1 rounded-md font-bold">
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
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar alt="User" src="" />
                      <span className="text-sm font-bold text-gray-600">
                        Créateur
                      </span>
                    </div>
                  </td>

                  <td>
                    <div
                      className={`flex items-center justify-center bg-green-200 border border-green-500 text-green-700 rounded-md w-[80%] mx-auto text-xs`}
                    >
                      <span>ACTIF</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex border-b-[1px]">
        <div className="w-1/2 h-[600px] p-8 bg-gray-100">
          <div className="flx flex-col">
            <h4 className="text-[25px] font-[800] text-gray-800">
              Fournisseurs principaux
            </h4>
            <p className="text-[15px] text-gray-600">Nos fournisseurs en France</p>
          </div>
          <div className="relative overflow-x-auto mt-5">
            <table className="w-full text-left">
              <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-500">
                <tr>
                  <th scope="col" className="px-6 py-2 w-[400px]">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-2 w-[300px]">
                    Libellé
                  </th>
                  <th scope="col" className="px-6 py-2 w-[300px]">
                    Juridique
                  </th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier, i) => (
                  <tr className="border-b">
                    <td className="p-2">
                      <span className="text-xs text-blue-600">
                        {supplier.T_TIERS}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className="text-xs text-blue-600">
                        {supplier.T_LIBELLE}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm font-bold text-gray-600">
                        {supplier.T_JURIDIQUE}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/2">
          <Map />
        </div>
      </section>
    </>
  );
}
