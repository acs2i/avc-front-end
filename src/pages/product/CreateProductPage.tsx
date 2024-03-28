import Card from "../../components/Card";
import React, { useState, useEffect } from 'react';

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    productName: '',
    family: '',
    subFamily: '',
    brand: '',
    collection: '',
    color: '',
    size: ''
  });

  useEffect(() => {
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      setFormData(JSON.parse(storedData));
    }
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);
    localStorage.setItem('formData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    //alert('Les données ont été enregistrées dans le localStorage.');
  };

  const handleCancel = () => {
    setFormData({
      productName: '',
      family: '',
      subFamily: '',
      brand: '',
      collection: '',
      color: '',
      size: ''
    });
    localStorage.removeItem('formData');
  };

  return (
    <div>
      <Card title="Créez votre produit">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Nom du produit :{" "}
              </label>
              <input
                type="text"
                placeholder="Entrez le nom du produit"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center gap-4">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap"
                style={{ gridColumn: "label", minWidth: "120px" }}
              >
                Famille :{" "}
              </label>
              <select
                name="family"
                id="family"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-green-500 focus:outline-none w-full p-2.5"
                style={{ gridColumn: "select" }}
                value={formData.family}
                onChange={handleInputChange}
              >
                <option value="">Choisissez une famille</option>
                <option value="famille">Famille</option>
              </select>
            </div>

            {/* ... autres champs du formulaire ... */}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-green-600 text-white font-bold h-[35px] px-3 rounded-md hover:brightness-125 text-[12px]">
              Valider
            </button>
            <button type="button" onClick={handleCancel} className="bg-red-600 text-white font-bold h-[35px] px-3 rounded-md hover:brightness-125 text-[12px]">
              Annuler
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}