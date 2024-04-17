import React, { useState, useEffect } from "react";
import { Collapse } from "@mui/material";
import { ChevronDown, ChevronUp, MoveLeft, Plus, Save, X } from "lucide-react";
import Input from "../../components/FormElements/Input";
import { Link } from "react-router-dom";
import Card from "../../components/Shared/Card";
import Button from "../../components/FormElements/Button";
import { LINKCARD_EDIT } from "../../utils/index";
import { LinkCard } from "@/type";
import { Divider } from "@mui/material";
import { useSelector } from "react-redux";
import CreateFamilyComponent from "../../components/CreateFamilyComponent";
import CreateBrandComponent from "../../components/CreateBrandComponent";
import CreateCollectionComponent from "../../components/CreateCollectionComponent";
import { VALIDATOR_REQUIRE } from "../../utils/validator";
import MultiSelect from "../../components/FormElements/MultiSelect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Family {
  _id: string;
  name: string;
}

interface Collection {
  _id: string;
  name: string;
}

interface SubFamily {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface FormData {
  reference: string;
  name: string;
  family: any;
  subFamily: any;
  brand: string;
  productCollection: string;
  uvc: {
    code: string;
    color: any;
    size: any;
    price: any;
  };
  status: number;
  creatorId: any;
}

export default function CreateProductPage() {
  const user = useSelector((state: any) => state.auth.user);
  const [page, setPage] = useState("addProduct");
  const [uvcIsOpen, setUvcIsOpen] = useState(false);
  const [createProductIsOpen, setCreateProductcIsOpen] = useState(true);
  const [familyId, setFamilyId] = useState<string>("");
  const [famillies, setFamillies] = useState<Family[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [subFamillies, setSubFamillies] = useState<{ subFamillies: any[] }>({
    subFamillies: [],
  });

  // Fonction pour afficher un toast de succès
  const notifySuccess = (message: any) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  // Fonction pour afficher un toast d'erreur
  const notifyError = (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleOpenUvcCollapse = (event: any) => {
    event.preventDefault();
    setUvcIsOpen(!uvcIsOpen);
  };
  

  const handleOpenProductCollapse = (event: any) => {
    event.preventDefault();
    setCreateProductcIsOpen(!createProductIsOpen);
  };

  const sizes = [
    { value: "XS", label: "XS", name: "XS" },
    { value: "S", label: "S", name: "S" },
    { value: "M", label: "M", name: "M" },
    { value: "L", label: "L", name: "L" },
    { value: "XL", label: "XL", name: "XL" },
    { value: "XXL", label: "XXL", name: "XXL" },
  ];

  const [formData, setFormData] = useState<FormData>({
    reference: "",
    name: "",
    family: [],
    subFamily: [],
    brand: "",
    productCollection: "",
    uvc: {
      code: "",
      color: [],
      size: [],
      price: [],
    },
    status: 0,
    creatorId: user._id,
  });

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { id: string; value: any } }
  ) => {
    const { id, value } = e.target || e;

    if (id === "family") {
      const selectedFamilyObject = famillies?.find(
        (family: any) => family._id === value
      );
      if (selectedFamilyObject) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          family: selectedFamilyObject.name,
        }));
        setFamilyId(value);
      }
    } else if (id === "size") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uvc: {
          ...prevFormData.uvc,
          [id]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
        uvc: {
          ...prevFormData.uvc,
          [id]: value,
        },
      }));
    }
  };

  const options = famillies?.map((family: Family) => ({
    value: family._id,
    label: family.name,
    name: family.name,
  }));

  const selectedFamilyName = famillies?.find(
    (family: Family) => family._id === formData.family
  )?.name;

  const collectionOptions = collections?.map((collection: Collection) => ({
    value: collection.name,
    label: collection.name,
    name: collection.name,
  }));

  const brandOptions = brands?.map((brand: Brand) => ({
    value: brand.name,
    label: brand.name,
    name: brand.name,
  }));

  const fetchFamilies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setFamillies(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchSubFamilies = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/family/subFamily/${familyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSubFamillies(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/brand`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/collection`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/product/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        notifySuccess("Produit créée avec succès!");
      } else {
        console.error("Erreur lors de la connexion");
        notifyError("Erreur lors de la création du produit");
      }
    } catch (error) {
      console.error("Erreur lors de la requête", error);
      notifyError("Erreur lors de la création du produit");
    }
  };

  useEffect(() => {
    fetchFamilies();
    fetchBrands();
    fetchCollections();
    if (familyId) {
      fetchSubFamilies();
    } else {
      setSubFamillies({ subFamillies: [] });
    }
  }, [familyId]);

  return (
    <div className="mt-7">
      <Link
        to="/edit"
        className="flex items-center justify-start gap-3 mb-5 font-bold text-gray-600"
      >
        <MoveLeft />
        <span>Retour</span>
      </Link>
      <Card title="Panel d'ajout">
        <div className="mt-4 mb-[50px] px-4">
          <div className="flex items-center gap-7">
            {LINKCARD_EDIT.map((link: LinkCard, i) => (
              <React.Fragment key={i}>
                <button
                  className={`font-bold text-gray-600 ${
                    page === link.page ? "text-green-700" : ""
                  } ${page === link.page ? "animate-bounce" : ""}`}
                  onClick={() => setPage(link.page)}
                >
                  {link.name}
                </button>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-6">
            <Divider />
          </div>
        </div>

        {page === "addProduct" && (
          <div className="mt-7 mb-7">
            <form
              className="flex flex-col gap-4 w-[60%] mx-auto"
              onSubmit={handleCreateProduct}
            >
              <div className="flex items-center gap-3 h-[70px]">
                <div className="h-2/3 w-[8px] bg-emerald-700"></div>
                <h4 className="text-3xl text-gray-600">
                  <span className="font-bold text-gray-700">Ajout</span> d'un
                  produit
                </h4>
              </div>

              <div>
                <div
                  className="flex items-center gap-3 h-[70px]"
                  onClick={handleOpenProductCollapse}
                >
                  <h5 className="text-2xl text-gray-600">
                    <span className="font-bold text-gray-700">Création</span> de
                    la fiche produit
                  </h5>
                  <button className="focus:outline-none text-gray-500">
                    {!createProductIsOpen && <ChevronDown size={25} />}
                    {createProductIsOpen && <ChevronUp size={25} />}
                  </button>
                </div>
                <Collapse in={createProductIsOpen}>
                  <div className="gap-5 grid grid-cols-1 grid-template-columns: [label] 1fr [select] 2fr;">
                    <Input
                      element="input"
                      id="reference"
                      label="Référence du produit :"
                      value={formData.reference}
                      onChange={handleChange}
                      validators={[VALIDATOR_REQUIRE()]}
                      placeholder="Ajouter la référence du produit"
                      required
                      gray
                    />
                    <Input
                      element="input"
                      id="name"
                      label="Nom du produit :"
                      value={formData.name}
                      onChange={handleChange}
                      validators={[VALIDATOR_REQUIRE()]}
                      placeholder="Ajouter le libellé du produit"
                      required
                      gray
                    />
                  </div>
                  <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr;">
                    <div className="flex flex-col gap-3">
                      <Input
                        element="select"
                        id="family"
                        label="Famille :"
                        value={selectedFamilyName}
                        onChange={handleChange}
                        options={options}
                        required
                        placeholder="Selectionner une famille"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <Input
                        element="select"
                        id="subFamily"
                        label="Sous-famille :"
                        value={formData.subFamily}
                        onChange={handleChange}
                        options={familyId ? Array.isArray(subFamillies) ? subFamillies : [] : []}
                        placeholder="Selectionner une sous-famille"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <Input
                        element="select"
                        id="brand"
                        label="Marque :"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                        options={brandOptions}
                        placeholder="Selectionner une marque"
                      />
                    </div>

                    <div className="flex flex-col gap-3">
                      <Input
                        element="select"
                        id="productCollection"
                        label="Collection :"
                        value={formData.productCollection}
                        onChange={handleChange}
                        required
                        options={collectionOptions}
                        placeholder="Selectionner une collection"
                      />
                    </div>
                  </div>
                </Collapse>
              </div>

              <div>
                <div
                  className="flex items-center gap-3 h-[70px]"
                  onClick={handleOpenUvcCollapse}
                >
                  <h5 className="text-2xl text-gray-600">
                    <span className="font-bold text-gray-700">Création</span> de
                    l'uvc du produit
                  </h5>
                  <button className="focus:outline-none text-gray-500">
                    {!uvcIsOpen && <ChevronDown size={25} />}
                    {uvcIsOpen && <ChevronUp size={25} />}
                  </button>
                </div>
                <Collapse in={uvcIsOpen}>
                  <h6>Uvc 1</h6>
                  <div className="gap-5 grid grid-cols-2 grid-template-columns: [label] 1fr [select] 2fr; mb-[50px]">
                    <div className="flex flex-col gap-3">
                      <Input
                        element="input"
                        id="code"
                        label="Code fournisseur :"
                        value={formData.uvc.code}
                        onChange={handleChange}
                        validators={[]}
                        placeholder="Veuillez saisir le code fournisseur"
                        gray
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <MultiSelect
                        id="size"
                        label="Tailles :"
                        options={sizes}
                        value={formData.uvc.size}
                        onChange={(selectedOptions) =>
                          handleChange({
                            target: { id: "size", value: selectedOptions },
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Input
                        element="input"
                        id="color"
                        label="Couleurs :"
                        value={formData.uvc.color}
                        onChange={handleChange}
                        validators={[]}
                        placeholder="Veuillez saisir le ou les couleurs"
                        gray
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Input
                        element="input"
                        id="price"
                        label="Prix :"
                        value={formData.uvc.price}
                        onChange={handleChange}
                        validators={[]}
                        placeholder="Veuillez saisir le prix"
                        gray
                      />
                    </div>
                  </div>
                </Collapse>
              </div>

              <div className="flex gap-2 mt-5">
                <Button
                  size="small"
                  green
                  type="submit"
                  onClick={() => setFormData({ ...formData, status: 1 })}
                >
                  <Plus size={15} />
                  Ajouter
                </Button>
                <Button size="small" inverse type="submit">
                  <Save size={15} />
                  Enregistrer dans brouillon
                </Button>
                <Button size="small" cancel>
                  <X size={15} />
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {page === "addFamilly" && (
          <div className="mt-7 mb-7">
            <CreateFamilyComponent />
          </div>
        )}

        {page === "addBrand" && (
          <div className="mt-7 mb-7">
            <CreateBrandComponent />
          </div>
        )}

        {page === "addCollection" && (
          <div className="mt-7 mb-7">
            <CreateCollectionComponent />
          </div>
        )}
      </Card>
    </div>
  );
}
