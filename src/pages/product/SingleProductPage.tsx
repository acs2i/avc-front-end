import { LINKCARD_PRODUCT } from "../../utils/index";
import Card from "../../components/Shared/Card";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import useFetch from "../../utils/hooks/usefetch";

interface Product {
  reference: string;
  name: string;
  family: any;
  subFamily: string[];
  brand: string;
  productCollection: string;
  imgPath: any;
  status: number;
}

export default function SingleProductPage() {
  const [page, setPage] = useState("details");
  const { id } = useParams();
  const colors = ["bg-gray-700", "bg-gray-500", "bg-gray-400"];
  const { data: product } = useFetch<Product>(
    `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
  );

  console.log(product);
  return (
    <section className="mt-7">
      <Card title={`Article n°${product?.reference}`}>
        <div className="mt-4 mb-[30px] px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-7">
              {LINKCARD_PRODUCT.map((link: LinkCard) => (
                <>
                  <button
                    className={`font-bold text-gray-600 ${
                      page === link.page ? "text-green-700" : ""
                    } ${page === link.page ? "animate-bounce" : ""}`}
                    onClick={() => setPage(link.page)}
                  >
                    {link.name}
                  </button>
                  <div className="w-[1px] h-[20px] bg-gray-300"></div>
                </>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {/* Product Detail */}
        {page === "details" && (
          <div className="flex grid-rows-3 grid-flow-col gap-4 mt-5 px-4">
            <div className="flex-col row-span-3 justify-center">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={product?.imgPath}
                  alt=""
                  className="w-full h-auto rounded-lg transition-all duration-[20s] transform scale-100 hover:scale-150 shadow-none hover:shadow-lg"
                />
              </div>
            </div>
            <div className="flex-col col-span-2 justify-center">
              <h2 className="text-2xl text-gray-600 font-bold font-montserrat capitalize">
                {product?.name}
              </h2>
              <div className="grid grid-cols-1 gap-4 mt-5">
                <div className="overflow-x-auto">
                  <table className="table-auto">
                    <tbody className="capitalize font-bold">
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Famille :</td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.family}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Sous-famille :
                        </td>
                        <td className="px-4 py-4 flex items-center gap-2 select-none">
                          {product?.subFamily.map(
                            (subFamily: any, index: any) => (
                              <span
                                key={index}
                                className={`${colors[index]} text-white px-2 py-1 rounded-md text-[12px]`}
                              >
                                {subFamily}
                              </span>
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Marque :</td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.brand}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Collection :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.productCollection}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Uvc :</td>
                        {/* <td className="px-4 py-4 text-gray-500 font-normal">
                          {product&& product.uvc && product?.uvc.map((item: any, index: any) => (
                            <table key={index} className="w-full">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 text-left text-center">
                                    Tailles
                                  </th>
                                  <th className="px-4 py-2 text-left">
                                    Couleurs
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="px-4 py-2 border flex items-center gap-4 ">
                                    {item && item.size && item.size.map((item: any) => (
                                      <span>{item}</span>
                                    ))}
                                  </td>
                                  <td className="px-4 py-2 border">
                                    {item && item.size && item.color.map((item: any) => (
                                      <span>{item}</span>
                                    ))}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ))}
                        </td> */}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
