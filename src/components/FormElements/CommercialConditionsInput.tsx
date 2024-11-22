import React, { useState } from 'react';
import { File, Plus } from 'lucide-react';
import FormSection from "../../components/Formulaires/FormSection";

interface CommercialCondition {
    pdf?: string;
    // Ajoutez d'autres propriétés selon vos besoins
  }
  
  // Props du composant
  interface CommercialConditionsProps {
    condition: CommercialCondition;
    index: number;
    onFileUpload: (file: File, index: number) => void;
  }
  
  const CommercialConditions: React.FC<CommercialConditionsProps> = ({ 
    condition, 
    index, 
    onFileUpload 
  }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        onFileUpload(file, index);
      }
    };
  
    const handleImportClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    };
  
    const handleViewClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (condition?.pdf) {
        // Logique pour visualiser le PDF existant
      }
    };
  
    return (
      <div>
        <div className="text-gray-500 flex items-center gap-2">
          <div
            onClick={handleViewClick}
            className="cursor-pointer hover:text-blue-500 transition-colors"
            role="button"
            aria-label="Visualiser le PDF"
          >
            <File size={18} />
          </div>
          <div
            onClick={handleImportClick}
            className="cursor-pointer hover:text-blue-500 transition-colors"
            role="button"
            aria-label="Importer un PDF"
          >
            <File size={18} />
          </div>
        </div>
  
        {isExpanded && (
          <FormSection title="Importer des conditions commerciales">
            {fileName ? (
              <div className="flex items-center mt-3">
                <div className="relative">
                  <div className="flex items-center gap-3 transition-all duration-300">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id={`fileUpload-${index}`}
                    />
                    <label
                      htmlFor={`fileUpload-${index}`}
                      className="border-[3px] border-blue-400 rounded-full py-1 px-4 hover:font-bold hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-white transition-all cursor-pointer"
                    >
                      Changer de fichier
                    </label>
                  </div>
                </div>
                <span className="ml-4 text-gray-600 font-semibold">
                  Fichier sélectionné : {fileName}
                </span>
              </div>
            ) : (
              <div className="w-full h-[200px] flex flex-col gap-5 border-[5px] border-dashed border-slate-300 rounded-lg hover:bg-white hover:bg-opacity-75 transition ease-in-out delay-150 duration-300 cursor-pointer mt-3">
                <div className="w-full h-full flex justify-center items-center rounded-md">
                  <div className="flex flex-col items-center text-center gap-5">
                    <div className="w-[80px]">
                      <img src="/img/upload.png" alt="icone" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-gray-600 text-[20px]">
                        Glissez déposez votre fichier PDF ici
                      </p>
                      <span className="text-gray-600 text-[15px]">ou</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id={`fileUpload-${index}`}
                      />
                      <label
                        htmlFor={`fileUpload-${index}`}
                        className="border-[3px] border-blue-400 rounded-full hover:font-bold py-1 hover:bg-gradient-to-r from-cyan-500 to-blue-500 hover:text-white transition-all cursor-pointer"
                      >
                        Téléchargez le depuis votre ordinateur
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </FormSection>
        )}
      </div>
    );
  };

export default CommercialConditions;