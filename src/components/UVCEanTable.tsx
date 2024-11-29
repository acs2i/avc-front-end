import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isValidEan13 } from "../utils/func/checkEan";

interface ConflictDetails {
  ean: string;
  uvcId: string;
  uvcIndex: number;
  eanIndex: number;
  originalValue: string;
}

interface UVCEanTableProps {
  reference: string;
  isModify?: boolean;
  isModifyUvc?: boolean;
  uvcDimension: {
    id: string;
    code: string;
    dimensions: string[];
    ean: string;
    eans: string[];
  }[];
  onUpdateEan: (uvcIndex: number, eanIndex: number, value: string) => void;
  onCheckEan: (
    ean: string,
    uvcId: string | null,
    currentEanIndex: number | null
  ) => Promise<{
    exists: boolean;
    productId: string | null;
    uvcId: string | null;
  }>;
  onFormatErrorChange: (hasFormatError: boolean) => void;
}

const UVCEanTable: React.FC<UVCEanTableProps> = ({
  reference,
  uvcDimension,
  onUpdateEan,
  onCheckEan,
  onFormatErrorChange,
  isModify,
  isModifyUvc,
}) => {
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [originalValues, setOriginalValues] = useState<{
    [key: string]: string;
  }>({});
  const [linkedProductId, setLinkedProductId] = useState<string | null>(null);
  const [conflictDetails, setConflictDetails] =
    useState<ConflictDetails | null>(null);
  const [formatErrorDetails, setFormatErrorDetails] =
    useState<ConflictDetails | null>(null);
  const [displayValues, setDisplayValues] = useState(
    uvcDimension.map((uvc) => ({ id: uvc.id, eans: [...uvc.eans] }))
  );
  const [baseValues, setBaseValues] = useState(
    uvcDimension.map((uvc) => ({ id: uvc.id, eans: [...uvc.eans] }))
  );

  const checkForDuplicatesInSameUVC = (
    uvcIndex: number,
    eanIndex: number,
    value: string
  ): boolean => {
    const currentUVC = uvcDimension[uvcIndex];
    if (!currentUVC || !currentUVC.eans) return false;

    // Check if the same EAN exists at a different index in the same UVC
    return currentUVC.eans.some(
      (ean, index) => ean === value && index !== eanIndex && value !== ""
    );
  };

  const handleEanChange = (uvcIndex: number, eanIndex: number, value: string) => {
    const key = `${uvcIndex}-${eanIndex}`;

    // Si la valeur est vide, nettoyer les erreurs et ne pas déclencher de validation
    if (value.trim() === "") {
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });

        // Restaurer la valeur vide dans le parent
        onUpdateEan(uvcIndex, eanIndex, "");
        return;
    }

    // Si la valeur saisie est identique à l'originale, nettoyez les erreurs
    if (originalValues[key] === value) {
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
        onFormatErrorChange(false); // Aucune erreur de format
        onUpdateEan(uvcIndex, eanIndex, value); // Mettez à jour la valeur
        return; // Ne continuez pas la validation
    }

    // Sauvegarder la valeur originale si elle n'existe pas déjà
    if (!(key in originalValues)) {
        setOriginalValues((prev) => ({
            ...prev,
            [key]: uvcDimension[uvcIndex].eans[eanIndex],
        }));
    }

    const isValid = isValidEan13(value);
    onFormatErrorChange(!isValid);

    setValidationErrors((prev) => ({
        ...prev,
        [key]: !isValid,
    }));

    onUpdateEan(uvcIndex, eanIndex, value);

    if (isValid) {
        debounceCheckEan(uvcIndex, eanIndex, value);
    }
};
  
  
  const handleCancel = () => {
    if (conflictDetails) {
      // Fermer la modale sans réinitialiser la valeur
      setShowModal(false);
  
      // Conserver l'erreur pour indiquer que la valeur est en conflit
      setValidationErrors((prev) => ({
        ...prev,
        [`${conflictDetails.uvcIndex}-${conflictDetails.eanIndex}`]: true,
      }));
  
      // Réinitialiser les détails du conflit
      setConflictDetails(null);
    }
  };
  
  
  
  const debounceCheckEan = (() => {
    let timeout: NodeJS.Timeout | null = null;

    return (uvcIndex: number, eanIndex: number, value: string) => {
        if (timeout) clearTimeout(timeout);

        // Ignorer les validations si la valeur est vide
        if (value.trim() === "") return;

        timeout = setTimeout(async () => {
            const uvcId = uvcDimension[uvcIndex]?.id;

            const hasDuplicateInSameUVC = checkForDuplicatesInSameUVC(
                uvcIndex,
                eanIndex,
                value
            );

            if (hasDuplicateInSameUVC) {
                setValidationErrors((prev) => ({
                    ...prev,
                    [`${uvcIndex}-${eanIndex}`]: true,
                }));

                setConflictDetails({
                    ean: value,
                    uvcId: uvcId,
                    uvcIndex,
                    eanIndex,
                    originalValue:
                        originalValues[`${uvcIndex}-${eanIndex}`] ||
                        uvcDimension[uvcIndex].eans[eanIndex],
                });

                setShowModal(true);
                // PAS DE RETURN ICI -> Continuer pour appeler le backend
            }

            // Appeler le backend pour vérifier globalement
            const result = await onCheckEan(value, uvcId, eanIndex);
            const isDuplicate = result.exists && result.uvcId !== uvcId;

            setValidationErrors((prev) => ({
                ...prev,
                [`${uvcIndex}-${eanIndex}`]: isDuplicate,
            }));

            if (isDuplicate) {
                setConflictDetails({
                    ean: value,
                    uvcId: result.uvcId!,
                    uvcIndex,
                    eanIndex,
                    originalValue:
                        originalValues[`${uvcIndex}-${eanIndex}`] ||
                        uvcDimension[uvcIndex].eans[eanIndex],
                });
                setLinkedProductId(result.productId);
                setShowModal(true);
            }
        }, 500);
    };
})();

  
  

  useEffect(() => {
    // À chaque changement de `uvcDimension`, mettez à jour les valeurs de base
    setBaseValues(
      uvcDimension.map((uvc) => ({ id: uvc.id, eans: [...uvc.eans] }))
    );
    setDisplayValues(
      uvcDimension.map((uvc) => ({ id: uvc.id, eans: [...uvc.eans] }))
    );
  }, [uvcDimension]);

  useEffect(() => {
    const initialValues: { [key: string]: string } = {};
    uvcDimension.forEach((uvc, uvcIndex) => {
      uvc.eans.forEach((ean, eanIndex) => {
        initialValues[`${uvcIndex}-${eanIndex}`] = ean;
      });
    });
    setOriginalValues(initialValues);
  }, [uvcDimension]);

  const handleUpdateEan = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!conflictDetails) return;

    const { ean, uvcId, eanIndex } = conflictDetails;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/uvc/update-ean/${uvcId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ean, eanIndex }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`EAN mis à jour : ${data.newEan}`);

        // Trouver l'index de l'UVC
        const uvcIndex = uvcDimension.findIndex((uvc) => uvc.id === uvcId);

        if (uvcIndex !== -1) {
          // Mettre à jour l'EAN dans le parent
          onUpdateEan(uvcIndex, eanIndex, data.newEan);

          // Nettoyer les erreurs de validation pour cet EAN spécifique
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`${uvcIndex}-${eanIndex}`];
            return newErrors;
          });
        }

        // Réinitialiser tous les états liés au conflit
        setShowModal(false);
        setConflictDetails(null);
        setLinkedProductId(null);

        // Revalider tous les EANs pour s'assurer que l'UI est à jour
        uvcDimension.forEach((uvc, idx) => {
          if (uvc.eans) {
            uvc.eans.forEach((eanValue, eanIdx) => {
              if (eanValue) {
                setValidationErrors((prev) => {
                  const updatedErrors = { ...prev };
                  delete updatedErrors[`${idx}-${eanIdx}`];
                  return updatedErrors;
                });

                debounceCheckEan(idx, eanIdx, eanValue);
              }
            });
          }
        });
      } else {
        console.error(
          "Erreur lors de la mise à jour de l'EAN :",
          await response.json()
        );
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
  };

  return (
    <div className="w-full">
      {/* Modale */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] ">
            <div className="flex flex-col items-center p-[30px]">
              <h2 className="text-lg font-semibold text-red-600">Attention</h2>
              <div>
                <p className="mt-4 text-gray-700 text-center font-bold text-[18px]">
                  Cet EAN est déjà enregistré dans une référence.
                </p>
                <p className="text-center mt-3 text-gray-600">
                  {" "}
                  Voulez-vous soit modifier la réference en cours ou mettre à
                  jour l'EAN de l'autre référence.
                </p>
                {linkedProductId && (
                  <div className="flex justify-center mt-3">
                    <Link
                      to={`/product/${linkedProductId}`}
                      className="text-[10px] text-blue-400 font-semibold"
                      onClick={() => setShowModal(false)}
                    >
                      Voir la référence concernée
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 bg-gray-100 p-4 rounded-b-lg">
              <button
                onClick={handleUpdateEan}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-white rounded-md hover:bg-"
              >
                Mettre à jour l'EAN
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table des EAN */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 text-sm font-semibold text-gray-600 w-[200px]">
              Code UVC
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600]  w-[200px]">
              Couleur
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600  w-[200px]">
              Taille
            </th>
            <th className="border px-4 py-2 text-sm font-semibold text-gray-600 w-[200px]">
              EAN Principal
            </th>
            {Array.from({ length: 9 }, (_, index) => (
              <th
                key={`ean-${index + 2}`}
                className="border px-4 py-2 text-sm font-semibold text-gray-600 w-[150px]"
              >
                <p className="w-[150px]">EAN {index + 2}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uvcDimension.map((uvc, uvcIndex) => {
            const [couleur, taille] = uvc.dimensions[0]?.split("/") || ["", ""];
            const uvcReference = `${reference}_${couleur}_${taille}`;

            return (
              <tr key={uvcIndex} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center text-sm">
                  {uvcReference}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {couleur}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {taille}
                </td>
                <td className="border px-4 py-2 text-center text-sm">
                  {uvc.ean || "-"}
                </td>
                {Array.from({ length: 9 }, (_, eanIndex) => (
                  <td
                    key={`uvc-${uvcIndex}-ean-${eanIndex + 1}`}
                    className="border px-4 py-2 text-center text-sm bg-blue-50 w-[150px]"
                  >
                    {isModify && isModifyUvc ? (
                      <input
                        type="text"
                        className={`border px-2 py-1 text-sm w-[150px] ${
                          validationErrors[`${uvcIndex}-${eanIndex}`]
                            ? "border-red-500 focus:outline-none focus:ring-red-500 transition-all focus:border-[2px] focus:border-red-500 focus:shadow-[0_0px_0px_5px_rgba(232,62,39,0.2)]"
                            : ""
                        }`}
                        value={uvc.eans?.[eanIndex] || ""}
                        onChange={(e) =>
                          handleEanChange(uvcIndex, eanIndex, e.target.value)
                        }
                      />
                    ) : (
                      uvc.eans?.[eanIndex] || "-"
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
