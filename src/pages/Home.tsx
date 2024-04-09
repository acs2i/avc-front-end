import React, { useState, useEffect } from "react";
import Card from "../components/Shared/Card";
import { Link, useNavigate } from "react-router-dom";
import { Pen } from "lucide-react";



export default function Home() {
  const [products, setProducts] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false); // Définir isLoading à false après avoir récupéré les données
    }
  };

  if (isLoading) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="flex flex-col gap-7 mt-7">
      <Card title="Recherche">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
           
        
          </div>
          <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Valider
          </button>
        </div>
      </Card>

      <Card title={`${products.products.length} résultats`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="uppercase bg-blue-50">
              <tr>
                <th scope="col" className="px-6 py-4">
                  RÉFÉRENCE
                </th>
                <th scope="col" className="px-6 py-6">
                  NOM
                </th>
                <th scope="col" className="px-6 py-6">
                  Famille
                </th>
                <th scope="col" className="px-6 py-6">
                  Sous-famille
                </th>
                <th scope="col" className="px-6 py-6">
                  MARQUE
                </th>
                <th scope="col" className="px-6 py-6">
                  COLLECTION
                </th>
              </tr>
            </thead>
            <tbody>
              {products.products.length > 0 ? (
                products.products.map((product: any) => (
                  <tr
                    key={product._id}
                    className="bg-white border-b cursor-pointer hover:bg-slate-100 capitalize font-bold text-sm text-gray-500"
                    onClick={() => navigate(`product/${product._id}`)}
                  >
                    <td className="px-6 py-4">{product.reference}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.familly}</td>
                    <td className="px-6 py-4">{product.subFamilly}</td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">{product.productCollection}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Aucun produit à afficher
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-5">
          <Link
            to="/edit/edit-product"
            className="w-[200px] bg-gradient-to-r from-orange-600 to-orange-400 text-white font-bold py-2 rounded-3xl hover:brightness-125 flex items-center justify-center gap-1"
          >
            Créer un produit
            <Pen size={20} />
          </Link>
        </div>
      </Card>
    </div>
  );
}
