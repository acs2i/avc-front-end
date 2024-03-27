import React from "react";
import Card from "../components/Card";
import Header from "../components/Header";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

type Product = {
  reference: string;
  name: string;
  family: string;
  subFamily: string;
  brand: string;
  collection: string;
};

const products: Product[] = [
  {
    reference: '03.800010198',
    name: 'Chaussures D\'intervention ZEPHYR TF MID',
    family: 'Chaussures',
    subFamily: 'Chaussures De Randonnée',
    brand: 'ZEPHYR',
    collection: 'LOWA',
  },
  {
    reference: '02.82910006',
    name: 'Sac À Dos Alpinisme PAPANG 37',
    family: 'Alpinisme',
    subFamily: 'Sacs À Dos Et Accessoires',
    brand: 'CILAO',
    collection: 'PAPANG',
  }
];

export default function Home() {
  return (
    <>
    <Header titlePage="Recherche Produit"/>
    <Card title="Recherche" subtitle="Recherche">
      <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Rechercher"
              className="border border-gray-300 rounded-l-md px-4 py-2 w-64"
            />
            <select className="border border-gray-300 px-4 py-2">
              <option>Famille</option>
            </select>
            <select className="border border-gray-300 px-4 py-2">
              <option>Sous-famille</option>
            </select>
            <div className="ml-4 flex items-center">
                <FormControlLabel className="ml-3 text-gray-700 font-medium" control={<Switch />} label="Strict" />
            </div>
          </div>
          <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Valider
          </button>
        </div>

        <h2 className="text-2xl font-bold text-green-800 mb-4">Résultats</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                RÉFÉRENCE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                NOM
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                FAMILLE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                SOUS-FAMILLE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                MARQUE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                COLLECTION
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.reference}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-grey-900">{product.reference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">{product.family}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">{product.subFamily}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-500">{product.collection}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mt-4">
          +Créer un produit
        </button>
    </Card>
    </>
 
  );
}
