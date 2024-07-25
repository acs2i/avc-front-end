import React, { useEffect, useState } from "react";
import { DRAFT_CATEGORY, LINKCARD_DRAFT, PRODUCTS } from "../../utils/index";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Input from "../../components/FormElements/Input";
import { ChevronRight, ChevronsUpDown } from "lucide-react";

interface Draft {
  _id: string;
  creator_id: any;
  description_ref: string;
  reference: string;
  designation_longue: string;
  designation_courte: string;
  supplier_name: string;
  supplier_ref: string;
  family: string[];
  subFamily: string[];
  dimension_type: string;
  dimension: string[];
  brand: string;
  ref_collection: string;
  composition: string;
  description_brouillon: string;
  status: number;
  createdAt: any;
}

interface User {
  _id: any;
  username: string;
  email: string;
  authorization: string;
  comment: string;
}

export default function DraftPage() {
  const user = useSelector((state: any) => state.auth.user._id);
  const token = useSelector((state: any) => state.auth.token);
  const [page, setPage] = useState("draft");
  const [onglet, setOnglet] = useState("created");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState(user);
  const [selectedUsername, setSelectedUsername] = useState("");
  const navigate = useNavigate();
  const filteredDrafts = drafts.filter((draft) => draft.status === 0);
  const filteredInProgress = drafts.filter((draft) => draft.status === 1);

  const formatDate = (timestamp: any) => {
    return format(new Date(timestamp), "dd/MM/yyyy HH:mm:ss");
  };

  useEffect(() => {
    fetchDraft();
  }, [userId]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const user = users.find((user) => user._id === userId);
    if (user) {
      setSelectedUsername(user.username);
    }
  }, [userId, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/auth/all-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    }
  };

  const fetchDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/draft/user/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data)
      setDrafts(data);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
    }
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(event.target.value);
  };

  return (
    <section>
      {/* Partie Header */}
      <div className="w-full h-[250px] bg-slate-100 p-8 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${"/img/background_forest.jpg"})`,
            opacity: 0.05,
            filter: "grayscale(10%)",
            backgroundPosition: "center bottom -50px",
          }}
        ></div>
        <div className="relative z-10">
          <div className="mt-4 mb-[5px]">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {LINKCARD_DRAFT.map((link, i) => (
                  <React.Fragment key={i}>
                    <button
                      className={`text-sm font-[600] ${
                        page === link.page ? "text-blue-600" : "text-gray-800"
                      }`}
                      onClick={() => setPage(link.page)}
                    >
                      {link.name}
                    </button>
                    {i < LINKCARD_DRAFT.length - 1 && (
                      <div className="text-gray-800">
                        <ChevronRight size={13} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <h3 className="text-[32px] font-[800] text-gray-800">
            Références {" "}
            <span className="font-[200]">créées par {selectedUsername}</span>
          </h3>
          <div className="flex items-center gap-7 mt-[20px]">
            {DRAFT_CATEGORY.map((link, i) => (
              <div
                key={i}
                className="cursor-pointer flex items-center gap-2"
                onClick={() => setOnglet(link.page)}
              >
                <button
                  className={`text-sm font-[600] ${
                    onglet === link.page ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {link.name}
                </button>
                <span className="text-[14px]">(2222)</span>
              </div>
            ))}
          </div>
          <div className="relative flex items-center gap-3 mt-4">
            <label className="text-gray-700 font-semibold">Utilisateur :</label>
            <div className="relative w-[250px]">
              <select
                name="users"
                className="block w-full p-1 rounded-lg bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg capitalize"
                value={userId}
                onChange={handleUserChange}
              >
                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                    className="text-lg capitalize"
                  >
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Partie Liste */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-y-[2px] border-slate-100 text-sm font-[900] text-black uppercase">
            <tr>
              <th scope="col" className="px-6 py-4 w-[5%]">
                <div className="flex items-center">
                  <span className="leading-3">Référence</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Libellé</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Marque</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Fournisseur</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-1/6">
                <div className="flex items-center">
                  <span>Sous-famille</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
              <th scope="col" className="px-6 w-[10%]">
                <div className="flex items-center">
                  <span>Date</span>
                  <div className="cursor-pointer">
                    <ChevronsUpDown size={13} />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          {page === "draft" && (
            <tbody>
              {filteredDrafts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-2 text-center text-gray-500"
                  >
                    <span className="capitalize font-[800]">
                      {selectedUsername}
                    </span>{" "}
                    n'a pas de brouillon
                  </td>
                </tr>
              ) : (
                filteredDrafts.map((product, i) => (
                  <tr
                    key={i}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() => navigate(`/draft/${product._id}`)}
                  >
                    <td className="px-6 py-2 text-blue-500">
                      {product.reference}
                    </td>
                    <td className="px-6 py-2">{product.designation_longue}</td>
                    <td className="px-6 py-2">{product.brand}</td>
                    <td className="px-6 py-2">{product.supplier_name}</td>
                    <td className="px-6 py-2">{product.family}</td>
                    <td className="px-6 py-2">{product.subFamily}</td>
                    <td className="px-6 py-2 text-blue-600">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
          {page === "in progress" && (
            <tbody>
              {filteredInProgress.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <span className="capitalize font-[800]">
                      {selectedUsername}
                    </span>{" "}
                    n'a pas de références en cours de validation
                  </td>
                </tr>
              ) : (
                filteredInProgress.map((product, i) => (
                  <tr
                    key={i}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-[12px] text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                    onClick={() => navigate(`/draft/${product._id}`)}
                  >
                    <td className="px-6 py-2 text-blue-500">
                      {product.reference}
                    </td>
                    <td className="px-6 py-2">{product.designation_longue}</td>
                    <td className="px-6 py-2">{product.brand}</td>
                    <td className="px-6 py-2">{product.supplier_name}</td>
                    <td className="px-6 py-2">{product.family}</td>
                    <td className="px-6 py-2">{product.subFamily}</td>
                    <td className="px-6 py-2 text-blue-600">
                      {formatDate(product.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
          {page === "done" && (
            <tbody>
              {PRODUCTS.filter((product) => product.status === 2).map(
                (product, i) => (
                  <tr
                    key={i}
                    className="bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap border"
                  >
                    <td className="px-6 py-4">{product.code}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">{product.supplier}</td>
                    <td className="px-6 py-4">{product.family}</td>
                    <td className="px-6 py-4">{product.subFamily}</td>
                    <td className="px-6 py-4">{product.creatorName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-500 p-2 text-white rounded-md">
                        Validé
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
      </div>
    </section>
  );
}
