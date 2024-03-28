import React, { useState } from "react";
import Card from "../../components/Card";
import { Link, useParams } from "react-router-dom";
import { Pen } from "lucide-react";
import { products } from "../../utils";

export default function SingleProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0", 10);
  const product = products.find((p) => p.id === productId);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card title={product ? `Détails du produit ${product.name}` : "Produit non trouvé"}>
      {product ? (
        <div className="overflow-x-auto flex flex-wrap -mx-2">
          <div className="md:w-1/2 px-2">
            <div className="border border-gray-400 rounded-lg overflow-hidden">
              <img
                src={product.img} // Assurez-vous de remplacer "img" par le bon attribut de l'image
                alt=""
                className={`img-fluid rounded-lg transition duration-2000 transform ${
                  isHovered ? "scale-140 shadow-2xl" : "scale-100 shadow-md"
                }`}
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
              />
            </div>
          </div>
          <div className="md:w-1/2 px-2">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-blue-50">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    RÉFÉRENCE
                  </th>
                  <th scope="col" className="px-6 py-4">
                    NOM
                  </th>
                  <th scope="col" className="px-6 py-4">
                    FAMILLE
                  </th>
                  <th scope="col" className="px-6 py-4">
                    SOUS-FAMILLE
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr key={product.id} className="bg-white border-b">
                  <td className="px-6 py-4">{product.reference}</td>
                  <td className="px-6 py-4">{product.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>Aucun produit trouvé pour l'ID spécifié.</p>
      )}
    </Card>
  );
}
