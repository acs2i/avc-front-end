import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isValidEan13 } from "../utils/func/checkEan";
import { Pen } from "lucide-react";
import { isValid } from "date-fns";

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
  const [invalidEanErrors, setInvalidEanErrors] = useState<{
    [key: string]: boolean;
  }>({});  
  const [originalValues, setOriginalValues] = useState<{
    [key: string]: string;
  }>({});
  const [linkedProductId, setLinkedProductId] = useState<string | null>(null);
  const [conflictDetails, setConflictDetails] =
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

 const handleEanChange = (
  uvcIndex: number,
  eanIndex: number,
  value: string
) => {
  const key = `${uvcIndex}-${eanIndex}`;

  // Si la valeur est vide, nettoyer les erreurs et arrêter la validation
  if (value.trim() === "") {
    setInvalidEanErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });

    // Réinitialiser les détails du conflit
    if (conflictDetails?.uvcIndex === uvcIndex && conflictDetails?.eanIndex === eanIndex) {
      setConflictDetails(null);
    }

    // Restaurer la valeur vide dans le parent
    onUpdateEan(uvcIndex, eanIndex, "");
    return;
  }

  // Si une saisie commence, réinitialiser les erreurs associées
  setValidationErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[key];
    return newErrors;
  });

  setInvalidEanErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[key];
    return newErrors;
  });

  // Sauvegarder la valeur originale si elle n'existe pas déjà
  if (!(key in originalValues)) {
    setOriginalValues((prev) => ({
      ...prev,
      [key]: uvcDimension[uvcIndex].eans[eanIndex],
    }));
  }

  const isValid = isValidEan13(value);

  // Mettre à jour les erreurs de format localement
  setInvalidEanErrors((prev) => ({
    ...prev,
    [key]: !isValid,
  }));

  // Mettre à jour la valeur dans le parent
  onUpdateEan(uvcIndex, eanIndex, value);

  // Si la valeur est valide, effectuer une vérification globale
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

    const {
      ean,
      uvcId,
      uvcIndex: currentUvcIndex,
      eanIndex: currentEanIndex,
    } = conflictDetails;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/uvc/update-ean/${uvcId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ean }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Mettre à jour uniquement les autres occurrences de l'EAN
        uvcDimension.forEach((uvc, uvcIndex) => {
          if (uvc.eans) {
            uvc.eans.forEach((currentEan, eanIndex) => {
              // Ne mettre à jour que si ce n'est pas l'input actuel
              if (
                currentEan === ean &&
                !(uvcIndex === currentUvcIndex && eanIndex === currentEanIndex)
              ) {
                // Mettre à jour l'EAN trouvé avec la version zzz
                onUpdateEan(uvcIndex, eanIndex, data.updatedEan);
              }
            });
          }
        });

        // Nettoyer les états
        setValidationErrors({});
        setShowModal(false);
        setConflictDetails(null);
        setLinkedProductId(null);
        onFormatErrorChange(false);
        onCheckEan(ean, uvcId, currentEanIndex);
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

  useEffect(() => {
    setDisplayValues(
      uvcDimension.map((uvc) => ({ id: uvc.id, eans: [...uvc.eans] }))
    );
  }, [uvcDimension]);

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
                <div className="flex">
                  <p className="w-[150px]">EAN {index + 2}</p>
                </div>
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
                        className={`border px-2 py-1 text-sm w-[150px] focus:outline-none ${
                          invalidEanErrors[`${uvcIndex}-${eanIndex}`]
                            ? "border-yellow-400"
                            : validationErrors[`${uvcIndex}-${eanIndex}`]
                            ? "border-red-500"
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
