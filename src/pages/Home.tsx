import { Avatar, Box, Divider, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";
import BarChart from "../components/Charts/BarCharts";
import DoughnutChart from "../components/Charts/Dougnhuts";
import SparkLineChart from "../components/Charts/LineCharts";
import PointChart from "../components/Charts/PointChart";
import Map from "../components/Shared/Map";
import { Pause, Star, X } from "lucide-react";
import CardHome, { ChartTypes } from "../components/Shared/CardHome";
import { useProducts } from "../utils/hooks/useProducts";
import { useNavigate } from "react-router-dom";
import { CARD, GRAPH } from "../utils";
import { useActiveInactiveProductGraph } from "../utils/hooks/dashboard/useActiveInactiveProductGraphs";
import useCardsHook from "../utils/hooks/dashboard/useCards";
import { Card } from "@/type";
import { Mosaic, OrbitProgress } from "react-loading-indicators";

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

interface Product {
  _id: string;
  creator_id: any;
  reference: string;
  alias: string;
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

interface SearchParams {
  codeValue?: string;
  labelValue?: string;
  brandChoiceValue?: string;
  supplierChoiceValue?: string;
  familyChoiceValue?: string;
  subFamilyChoiceValue?: string;
}

interface CardType {
  title: string;
  subtitle: string;
  data1: number[];
  data2: number[];
  labels: string[];
  chartType: string;
}

interface InitialCard {
  id: number;
  title: string;
  subtitle: string;
  data1: number[];
  data2?: number[];
  labels: string[];
  chartType: ChartTypes;
}

const INITIAL_CARDS: InitialCard[] = [
  {
    id: 0,
    title: "Produits",
    subtitle: "Actif vs. Inactif",
    data1: [50, 50],
    labels: ["Actif", "Inactif"],
    chartType: "pie",
  },
  {
    id: 1,
    title: "UVC",
    subtitle: "Actif vs. Inactif",
    data1: [50, 50],
    labels: ["Actif", "Inactif"],
    chartType: "pie",
  },
  {
    id: 2,
    title: "UVC",
    subtitle: "Actifs avec/sans EAN",
    data1: [50, 50],
    labels: ["Avec EAN", "Sans EAN"],
    chartType: "pie",
  },
  {
    id: 3,
    title: "Marques",
    subtitle: "Actif vs. Inactif",
    data1: [50, 50],
    labels: ["Actif", "Inactif"],
    chartType: "pie",
  },
  {
    id: 4,
    title: "Fournisseurs",
    subtitle: "Actif vs. Inactif",
    data1: [50, 50],
    labels: ["Actif", "Inactif"],
    chartType: "pie",
  },
];

export default function Home() {
  const limit = 10;

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [submittedSearchParams, setSubmittedSearchParams] =
    useState<SearchParams>({});
  const { data: products, refetch: refetchProducts } = useProducts(
    limit,
    currentPage,
    submittedSearchParams
  );

  const [numberValidatedOfProducts, setNumberValidatedOfProducts] =
    useState<number>(0);
  const [numberDraftsWaiting, setNumberDraftsWaiting] = useState<number>(0);

  const { cards, isLoadingCards }: { cards: Card[]; isLoadingCards: boolean } =
    useCardsHook();

  const [displayCards, setDisplayCards] =
    useState<InitialCard[]>(INITIAL_CARDS);

  useEffect(() => {
    if (!isLoadingCards && cards?.length > 0) {
      setDisplayCards(
        cards.map((card) => ({
          ...card,
          chartType: card.chartType as ChartTypes,
        }))
      );
    }
  }, [cards, isLoadingCards]);

  const totalPages = Math.ceil((totalItem ?? 0) / limit);
  const data1 = [12, 19, 14, 5, 16, 19];
  const data2 = [14, 16, 20, 5, 18, 22];
  const labels = ["January", "February", "March", "April", "May", "June"];
  const colors = ["#088F8F", "#6495ED", "#89CFF0"];

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/search?creation_date=2020-02-01T00:00:00Z`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data, total } = await response.json();

      setNumberValidatedOfProducts(total);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/status`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setNumberDraftsWaiting(data.length);
    })();
  }, []);

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

  // Fictitious data for the new indicators
  const indicatorsData = {
    coefsInferior: [120, 150, 100, 90, 80],
    priReferences: [300, 250, 200, 150, 100],
    packReferences: [50, 70, 60, 90, 100],
    priceChanges: {
      increases: [30, 40, 20, 10, 5],
      decreases: [10, 20, 15, 25, 30],
    },
    nonVisibleOnline: [60, 70, 80, 90, 100],
    missingInfo: [20, 30, 40, 50, 60],
    blockedProducts: [5, 10, 15, 20, 25],
    nonReassort: [15, 25, 35, 45, 55],
    unavailable10Days: [10, 20, 30, 40, 50],
    unavailable15Days: [5, 15, 25, 35, 45],
    tvaByProduct: [5.5, 10, 20],
  };

  return (
    <>
      <section className="w-full bg-gray-100 dark:bg-gray-800 p-8 flex border-b-[1px] border-gray-300 dark:border-gray-500">
        <div className="w-1/2">
          <div className="flex flex-col gap-8">
            <div className="text-gray-800 dark:text-white">
              <h3 className="text-[35px] font-bold">Tableau de bord</h3>
              <p className="text-[15px]">
                Vue globale des articles enregistrés
              </p>
            </div>
            <div className="flex items-center gap-5 dark:text-white">
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-green-100 text-green-500">
                  <Star size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">
                    {numberValidatedOfProducts} Nouveaux Produits
                  </span>
                  <span className="text-xs">Awaiting processing</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Pause size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">
                    {numberDraftsWaiting} Brouillons attendent la validation{" "}
                  </span>
                  <span className="text-xs">Awaiting processing</span>
                </div>
              </div>
              {/* <div className="flex items-center gap-5">
                <div className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-red-100 text-red-500">
                  <X size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">0 new orders</span>
                  <span className="text-xs">Awaiting processing</span>
                </div>
              </div> */}
            </div>
          </div>

          <div className="mt-6">
            <Divider />
          </div>

          {/* <div className="mt-[40px]">
            <div>
              <h3 className="text-[25px] font-bold text-gray-800 dark:text-white">
                Evolution des ventes
              </h3>
              <p className="text-[15px] text-gray-600 dark:text-white">
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
          </div> */}
        </div>
        <div className="w-[70%] flex flex-wrap justify-end gap-6">
          {displayCards.map((card) => (
            <CardHome
              key={card.id}
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

      <section className="bg-white dark:bg-gray-500 w-full p-8 border-b-[1px] border-gray-300">
        <div className="flx flex-col">
          <h4 className="text-[25px] font-bold text-gray-800 dark:text-white">
            Références récemment créées
          </h4>
          <p className="text-[15px] text-gray-600 dark:text-white">
            10 dernières références créées
          </p>
        </div>

        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-left">
            <thead className="border-t border-b dark:border-gray-600 text-sm dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-2 w-[50px]">
                  Code
                </th>
                <th scope="col" className="px-6 w-[300px]">
                  Libellé
                </th>
                <th scope="col" className="px-6 w-[300px]">
                  Famille
                </th>
                <th scope="col" className="px-6 w-[300px]">
                  Sous-famille
                </th>
                <th scope="col" className="px-6 w-[50px]">
                  Statut
                </th>
                <th scope="col" className="px-6 w-[150px] text-center">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {products &&
                products?.products.map((product: Product) => (
                  <tr
                    className="border-b cursor-pointer hover:bg-slate-200 dark:border-gray-600"
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2 dark:text-white">
                        <span className="text-xs">{product.reference}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600 dark:text-yellow-300">
                          {product.long_label}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs">
                      {product.tag_ids && product.tag_ids[0] ? (
                        <div className="dark:text-white">
                          <span>{product.tag_ids[0].code || "-"}</span>
                          <span className="mx-1">-</span>
                          <span>{product.tag_ids[0].name || "-"}</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      {product.tag_ids && product.tag_ids[1] ? (
                        <div className="dark:text-white">
                          <span>{product.tag_ids[1].code || "-"}</span>
                          <span className="mx-1">-</span>
                          <span>{product.tag_ids[1].name || "-"}</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <div
                        className={`flex items-center justify-center bg-green-200 border border-green-500 text-green-700 rounded-md w-[50px] mx-auto text-xs`}
                      >
                        <span>ACTIF</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-center">
                        <span className="text-xs dark:text-white">
                          24/06/2024
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* <section className="flex border-b-[1px]">
        <div className="w-1/2 h-[600px] p-8 bg-gray-100 dark:bg-gray-800 ">
          <div className="flx flex-col">
            <h4 className="text-[25px] font-bold text-gray-800 dark:text-white">
              Fournisseurs principaux
            </h4>
            <p className="text-[15px] text-gray-600 dark:text-white">
              Nos fournisseurs en France
            </p>
          </div>
          <div className="relative overflow-x-auto mt-5">
            <table className="w-full text-left">
              <thead className="text-sm text-gray-500 dark:text-white border-t border-b dark:border-gray-500">
                <tr>
                  <th scope="col" className="px-é py-2 w-[100px]">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-2 w-[300px] text-center">
                    Libellé
                  </th>
                </tr>
              </thead>
              <tbody>
                {suppliers &&
                  suppliers.length > 0 &&
                  suppliers.map((supplier, i) => (
                    <tr
                      className="border-b dark:border-gray-500"
                      key={supplier._id}
                    >
                      <td className="p-2">
                        <span className="text-xs text-blue-600 dark:text-yellow-400">
                          {supplier.code}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="text-sm font-bold text-gray-600 dark:text-white">
                          {supplier.company_name}
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
      </section> */}
    </>
  );
}
