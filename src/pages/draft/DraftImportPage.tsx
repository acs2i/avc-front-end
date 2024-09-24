import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import Button from "../../components/FormElements/Button";
import { Plus } from "lucide-react";

interface ImportData {
  Famille: string;
  "Sous Famille": string;
  "Sous Sous Famille": string;
  "Type Produit": string;
  Modèle: string;
  Référence: string;
  Fournisseur: string;
  Marque: string;
  "Réf fournisseur": string;
  "Collection actuelle": string;
  Collection: string;
  "PA Net": string | number;
  "PV Conseillé": string | number;
}

interface PriceItemSchema {
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
}

interface Price {
  tarif_id: any;
  currency: string;
  supplier_id: any;
  price: PriceItemSchema;
  store: string;
}

interface Uvc {
  code: string;
  dimensions: string[];
  prices: Price[];
  eans: string[];
  status: string;
}

interface Supplier {
  supplier_id: string;
  supplier_ref: string;
  pcb: string;
  custom_cat: string;
  made_in: string;
  company_name: string;
}

interface FormData {
  creator_id: any;
  reference: string;
  name: string;
  short_label: string;
  long_label: string;
  type: string;
  tag_ids: any[];
  suppliers: Supplier[];
  dimension_types: string;
  brand_ids: any[];
  collection_ids: any[];
  peau: number;
  tbeu_pb: number;
  tbeu_pmeu: number;
  imgPath: string;
  status: string;
  additional_fields: any[];
  uvc: Uvc[];
  initialSizes: any[];
  initialColors: any[];
  initialGrid: any[];
}

export default function DraftImportPage() {
  const creatorId = useSelector((state: any) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState<ImportData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const columnsToHighlight = [
    "Famille",
    "Sous Famille",
    "Sous Sous Famille",
    "Référence",
    "Fournisseur",
    "Marque",
    "Réf fournisseur",
    "Collection",
  ];
  const [formData, setFormData] = useState<FormData>({
    creator_id: creatorId._id,
    reference: "",
    name: "",
    short_label: "",
    long_label: "",
    type: "Marchandise",
    tag_ids: [],
    suppliers: [],
    dimension_types: "Couleur/Taille",
    brand_ids: [],
    collection_ids: [],
    peau: 0,
    tbeu_pb: 0,
    tbeu_pmeu: 0,
    imgPath: "",
    status: "A",
    uvc: [
      {
        code: "",
        dimensions: [],
        prices: [
          {
            tarif_id: "",
            currency: "",
            supplier_id: "",
            price: {
              peau: 0,
              tbeu_pb: 0,
              tbeu_pmeu: 0,
            },
            store: "",
          },
        ],
        eans: [],
        status: "",
      },
    ],
    additional_fields: [],
    initialSizes: ["000"],
    initialColors: ["000"],
    initialGrid: [[true]],
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension === "xlsx" || fileExtension === "xls") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0]; // Sélectionne la première feuille
          const worksheet = workbook.Sheets[sheetName];

          // Transformation des données en JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          });

          // Trouver l'index de la ligne contenant les en-têtes
          const headerIndex = jsonData.findIndex(
            (row: any) =>
              row.includes("Famille") || row.includes("Sous Famille")
          );

          if (headerIndex === -1) {
            console.error(
              "Les colonnes nécessaires ne sont pas présentes dans le fichier."
            );
            return;
          }

          // Extraire les en-têtes et les lignes de données
          const headers = jsonData[headerIndex] as string[];
          const rows = jsonData.slice(headerIndex + 1);

          // Colonnes à garder et mappage dynamique
          const columnsToKeep = [
            "Famille",
            "Sous Famille",
            "Sous Sous Famille",
            "Type Produit",
            "Modèle",
            "Référence",
            "Code Fournisseur",
            "Code Marque",
            "Réf fournisseur",
            "Collection actuelle",
            "Nouvelle Collection",
            "PA Net",
            "PV Conseillé",
          ];

          const columnMap: { [key: string]: number } = {};
          columnsToKeep.forEach((col) => {
            const index = headers.findIndex(
              (header: string) => header.trim() === col
            );
            if (index !== -1) {
              columnMap[col] = index;
            }
          });

          // Créer un tableau pour stocker les données formatées et mettre à jour formData
          const formattedData: ImportData[] = rows.map((row: any) => {
            const formattedRow: ImportData = {
              Famille: row[columnMap["Famille"]] || "",
              "Sous Famille": row[columnMap["Sous Famille"]] || "",
              "Sous Sous Famille": row[columnMap["Sous Sous Famille"]] || "",
              "Type Produit": row[columnMap["Type Produit"]] || "",
              Modèle: row[columnMap["Modèle"]] || "",
              Référence: row[columnMap["Référence"]] || "",
              Fournisseur: row[columnMap["Code Fournisseur"]] || "",
              Marque: row[columnMap["Code Marque"]] || "",
              "Réf fournisseur": row[columnMap["Réf fournisseur"]] || "",
              "Collection actuelle":
                row[columnMap["Collection actuelle"]] || "",
              Collection: row[columnMap["Nouvelle Collection"]] || "",
              "PA Net": row[columnMap["PA Net"]] || 0,
              "PV Conseillé": row[columnMap["PV Conseillé"]] || 0,
            };

            return formattedRow;
          });

          if (formattedData.length > 0) {
            const firstRow = formattedData[0];

            setFormData((prevFormData) => ({
              ...prevFormData,
              reference: firstRow.Référence,
              name: "",
              long_label: "",
              suppliers: [
                {
                  supplier_id: firstRow.Fournisseur,
                  supplier_ref: firstRow["Réf fournisseur"],
                  pcb: "",
                  custom_cat: "",
                  made_in: "",
                  company_name: firstRow.Fournisseur,
                },
              ],
              tag_ids: [
                firstRow.Famille,
                firstRow["Sous Famille"],
                firstRow["Sous Sous Famille"],
              ],
              brand_ids: [firstRow.Marque],
              collection_ids: [firstRow.Collection],
              peau: 0,
              tbeu_pb: 0,
            }));
          }

          setFileData(formattedData);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  console.log(formData);

  const handleButtonClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      setIsExpanded(false);
    }, 3000);
  };

  return (
    <>
      <section className="w-full bg-slate-50 p-7 min-h-screen">
        <div className="max-w-[2024px] mx-auto">
          <form className="">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[32px] font-[800] text-gray-800">
                  Importer <span className="font-[200]">des articles</span>
                </h3>
                {creatorId && (
                  <p className="text-[17px] text-gray-600 italic">
                    Importation faite par{" "}
                    <span className="font-[600]">{creatorId.username}</span>
                  </p>
                )}
              </div>
              {!isLoading ? (
                <div className="flex items-center justify-between gap-3 mt-[50px]">
                  <div className="flex gap-3">
                    <Button size="small" cancel type="button">
                      Annuler
                    </Button>
                    <Button size="small" blue type="submit">
                      Valider l'importation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <CircularProgress />
                </div>
              )}
            </div>

            {fileData.length === 0 ? (
              <div className="flex flex-col-reverse lg:flex-row gap-7 mt-[50px] items-stretch">
                <div className="w-full h-[400px] flex flex-col gap-5 border-[5px] border-dashed border-slate-300 rounded-lg hover:bg-white hover:bg-opacity-75 transition ease-in-out delay-150 duration-300 cursor-pointer">
                  <div className="w-full h-full flex justify-center items-center rounded-md">
                    <div className="flex flex-col items-center text-center gap-5">
                      <div className="w-[120px]">
                        <img src="/img/upload.png" alt="icone" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-gray-600 text-[25px]">
                          Glissez déposez votre fichier ici
                        </p>
                        <span className="text-gray-600 text-[15px]">ou</span>
                        <input
                          type="file"
                          accept=".csv, .xlsx, .xls"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="fileUpload"
                        />
                        <label
                          htmlFor="fileUpload"
                          className="border-[3px] border-blue-400 rounded-full hover:font-bold py-1 hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-white transition-all cursor-pointer"
                        >
                          Téléchargez le depuis votre ordinateur
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="relative">
                  {!isExpanded ? (
                    <button
                      onClick={handleButtonClick}
                      className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center transition-all duration-300"
                    >
                      <Plus />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 transition-all duration-300">
                      <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="fileUpload"
                      />
                      <label
                        htmlFor="fileUpload"
                        className="border-[3px] border-blue-400 rounded-full py-1 px-4 hover:font-bold hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-white transition-all cursor-pointer"
                      >
                        Changer de fichier d'importation
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>

          {/* Affichage des données */}
          {fileData.length > 0 && (
            <div>
              <div className=" mt-5 mb-2">
                <h3 className="text-[20px] font-[700]">
                  Fichier{" "}
                  <span className="text-[15px] font-[400] italic">
                    {fileName}
                  </span>{" "}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-[40px] h-[10px] bg-[#3B71CA]"></div>
                    <span>Colonnes prises en compte</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-[40px] h-[10px] bg-gray-300"></div>
                    <span>Colonnes non prises en compte</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-[40px] h-[10px] bg-red-600"></div>
                    <span>Erreurs</span>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto border-collapse border border-gray-400 w-full">
                  <thead>
                    <tr>
                      {Object.keys(fileData[0]).map((key, index) => (
                        <th
                          key={index}
                          className={`border border-gray-300 px-4 py-2 text-[13px] ${
                            columnsToHighlight.includes(key)
                              ? "bg-[#3B71CA] text-white"
                              : "bg-gray-300 text-white"
                          }`}
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="odd:bg-gray-100">
                        {Object.entries(row).map(
                          ([colName, value], colIndex) => (
                            <td
                              key={colIndex}
                              className={`border border-gray-300 px-4 py-2 text-center text-[13px]`}
                            >
                              {value ? String(value) : ""}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
