import { LINKCARD_PRODUCT } from "../../utils/index";
import Card from "../../components/Shared/Card";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LinkCard } from "@/type";
import { Pen } from "lucide-react";

export default function SingleProductPage() {
  const [product, setProduct] = useState<{ product: any } | null>(null);
  const [page, setPage] = useState("details");

  const { id } = useParams();

  useEffect(() => {
    getProduct();
  }, [id]);

  const getProduct = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_DEV}/api/v1/product/${id}`
    );
    const data = await response.json();
    console.log(data);

    if (data && data.product) {
      setProduct(data);
    }
  };

  return (
    <section className="mt-7">
      <Card title={`Article n°${product?.product.reference}`}>
        <div className="h-[70px] w-[100%] flex items-center justify-between">
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
          <div>
            <Link to="/" className="text-[14px] text-sky-700 hover:text-sky-400 flex items-center gap-2">
              <Pen size={14}/>
              <span>Modifier</span>
            </Link>
          </div>
        </div>

        {/* Product Detail */}
        {page === "details" && (
          <div className="flex grid-rows-3 grid-flow-col gap-4 mt-5">
            <div className="flex-col row-span-3 justify-center">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={product?.product.imgPath}
                  alt=""
                  className="w-full h-auto rounded-lg transition-all duration-[20s] transform scale-100 hover:scale-150 shadow-none hover:shadow-lg"
                />
              </div>
            </div>
            <div className="flex-col col-span-2 justify-center">
              <h2 className="text-2xl text-gray-600 font-bold font-montserrat">
                {product?.product.name}
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div className="overflow-x-auto">
                  <table className="table-auto">
                    <tbody className="capitalize font-bold">
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Famille :</td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.product.familly}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Sous-famille :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.product.subFamilly}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">Marque :</td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.product.brand}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 text-gray-700">
                          Collection :
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-normal">
                          {product?.product.productCollection}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="capitalize font-bold"></tbody>
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
