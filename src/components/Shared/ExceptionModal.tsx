import React from 'react';

interface Difference {
  field: string;
  productValue: string | number;
  uvcValue: string | number;
}

interface ExceptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  differences: Difference[];
  onConfirmKeepExceptions: () => void;
  onConfirmStandardize: () => void;
}

interface GroupedDifferences {
  [key: string]: Difference[];
}

type FieldLabels = {
  [key: string]: string;
};

export function ExceptionsModal({
  isOpen,
  onClose,
  differences,
  onConfirmKeepExceptions,
  onConfirmStandardize
}: ExceptionsModalProps) {
  // Grouper les différences par catégorie
  const groupedDifferences: GroupedDifferences = differences.reduce((acc: GroupedDifferences, diff) => {
    let category = '';
    if (['paeu', 'tbeu_pb', 'tbeu_pmeu'].includes(diff.field)) {
      category = 'Prix';
    } else if (['height', 'width', 'length', 'gross_weight', 'net_weight'].includes(diff.field)) {
      category = 'Cotes & Poids';
    } else if (diff.field === 'collectionUvc') {
      category = 'Collection';
    } else if (diff.field.startsWith('custom_')) {
      category = 'Champs utilisateurs';
    }

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(diff);
    return acc;
  }, {});

  const renderFieldLabel = (field: string): string => {
    const labels: FieldLabels = {
      paeu: 'Prix Achat (PAEU)',
      tbeu_pb: 'Prix Vente (TBEU/PB)',
      tbeu_pmeu: 'Prix Modulé (TBEU/PMEU)',
      height: 'Hauteur',
      width: 'Largeur',
      length: 'Longueur',
      gross_weight: 'Poids Brut',
      net_weight: 'Poids Net',
      collectionUvc: 'Collection',
    };
    return labels[field] || field.replace('custom_', '');
  };

  return (
    <div className={`fixed inset-0 z-[9999] ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black bg-opacity-50`}>
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Exceptions détectées</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Des différences ont été détectées entre les valeurs du produit et certaines UVC. Que souhaitez-vous faire ?
        </p>

        <div className="flex-1 overflow-y-auto mb-4">
          {Object.entries(groupedDifferences).map(([category, diffs]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">{category}</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Champ</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Valeur produit</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Valeur(s) UVC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diffs.map((diff: Difference, index: number) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {renderFieldLabel(diff.field)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {typeof diff.productValue === 'number' 
                            ? diff.productValue.toFixed(2) 
                            : diff.productValue}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {typeof diff.uvcValue === 'number' 
                            ? diff.uvcValue.toFixed(2) 
                            : diff.uvcValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onConfirmKeepExceptions}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors"
          >
            Conserver les exceptions
          </button>
          <button
            type="button"
            onClick={onConfirmStandardize}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Appliquer les nouvelles valeurs partout
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}