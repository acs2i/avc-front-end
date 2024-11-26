import React, { useState } from "react";
import { Link } from "react-router-dom";

interface UVCEanTableProps {
  reference: string;
  isModify?: boolean;
  isModifyUvc?: boolean;
  uvcDimension: {
    code: string;
    dimensions: string[];
    ean: string;
    eans: string[];
  }[];
  onUpdateEan: (uvcIndex: number, eanIndex: number, value: string) => void;
  onCheckEan: (ean: string) => Promise<{ exists: boolean; productId: string | null }>;
}

const UVCEanTable: React.FC<UVCEanTableProps> = ({
  reference,
  uvcDimension,
  onUpdateEan,
  onCheckEan,
  isModify,
  isModifyUvc,
}) => {
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [linkedProductId, setLinkedProductId] = useState<string | null>(null);

  const handleEanChange = (uvcIndex: number, eanIndex: number, value: string) => {
    const currentEan = uvcDimension[uvcIndex].eans[eanIndex]; // EAN d'origine à l'index donné
    onUpdateEan(uvcIndex, eanIndex, value);

    // Réinitialiser les erreurs si l'EAN revient à sa valeur d'origine
    if (value === currentEan) {
      setValidationErrors((prev) => ({
        ...prev,
        [`${uvcIndex}-${eanIndex}`]: false,
      }));
      return;
    }

    // Déclencher la vérification
    debounceCheckEan(uvcIndex, eanIndex, value, currentEan);
  };

  const debounceCheckEan = (() => {
    let timeout: NodeJS.Timeout | null = null;

    return (uvcIndex: number, eanIndex: number, value: string, originalEan: string) => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(async () => {
        // Vérifie si l'EAN est déjà présent dans la liste actuelle (à l'exception de l'index actuel)
        const isDuplicateLocal = uvcDimension.some((uvc, idx) =>
          uvc.eans.some((ean, idxEan) => ean === value && (idx !== uvcIndex || idxEan !== eanIndex))
        );

        if (isDuplicateLocal) {
          setValidationErrors((prev) => ({
            ...prev,
            [`${uvcIndex}-${eanIndex}`]: true,
          }));
          setShowModal(true);
          return;
        }

        // Si l'EAN n'est pas un doublon local mais différent de l'original, vérifier via l'API
        if (value !== originalEan) {
          const result = await onCheckEan(value);
          setValidationErrors((prev) => ({
            ...prev,
            [`${uvcIndex}-${eanIndex}`]: result.exists,
          }));

          if (result.exists) {
            setLinkedProductId(result.productId);
            setShowModal(true);
          }
        }
      }, 500);
    };
  })();

  return (
    <div className="w-full">
      {/* Modale */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[500px]">
            <h2 className="text-lg font-semibold text-red-600">Attention</h2>
            <div>
              <p className="mt-4 text-gray-700">
                Cet EAN est déjà enregistré dans une autre référence. Veuillez soit modifier
                l'EAN saisi, soit consulter la référence associée.
              </p>
              {linkedProductId && (
                <Link
                  to={`/product/${linkedProductId}`}
                  className="text-sm text-blue-500 font-semibold"
                  onClick={() => setShowModal(false)}
                >
                  Voir la référence
                </Link>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Table des EAN */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Code UVC</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Couleur</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">Taille</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN Principal</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN 2</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN 3</th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600">EAN 4</th>
          </tr>
        </thead>
        <tbody>
          {uvcDimension.map((uvc, uvcIndex) => {
            const [couleur, taille] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${couleur}_${taille}`;

            return (
              <tr key={uvcIndex} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">{uvcReference}</td>
                <td className="border px-4 py-2 text-center text-sm">{couleur}</td>
                <td className="border px-4 py-2 text-center text-sm">{taille}</td>
                <td className="border px-4 py-2 text-center text-sm">{uvc.ean || "-"}</td>
                {uvc.eans.map((ean, eanIndex) => (
                  <td key={eanIndex} className="border px-4 py-2 text-center text-sm">
                    {isModify && isModifyUvc ? (
                      <input
                        type="text"
                        className={`border px-2 py-1 text-sm w-full ${
                          validationErrors[`${uvcIndex}-${eanIndex}`]
                            ? "border-red-500 focus:outline-none focus:ring-red-500 transition-all focus:border-[2px] focus:border-red-500 focus:shadow-[0_0px_0px_5px_rgba(232,62,39,0.2)]"
                            : ""
                        }`}
                        value={ean}
                        onChange={(e) => handleEanChange(uvcIndex, eanIndex, e.target.value)}
                      />
                    ) : (
                      ean || "-"
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UVCEanTable;
