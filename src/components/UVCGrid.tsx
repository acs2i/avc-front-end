import React, { useEffect, useState } from "react";
import {
  Maximize2,
  Palette,
  Plus,
  Ruler,
  Check,
  X,
  Trash2,
} from "lucide-react";
import Modal from "./Shared/Modal";

interface UVCGridProps {
  onDimensionsChange: (dimensions: string[][]) => void;
  initialSizes?: string[];
  initialColors?: string[];
  initialGrid?: boolean[][];
  setSizes: (sizes: string[]) => void;
  setColors: (colors: string[]) => void;
  setUvcGrid: (uvcGrid: boolean[][]) => void;
  sizes: string[];
  colors: string[];
  uvcGrid: boolean[][];
  isFullScreen?: any;
  isModify?: boolean;
  isEditable?: boolean;
}

interface Grid {
  _id: string;
  type: string;
  code: string;
  label: string;
  dimensions: string[];
}

const UVCGrid: React.FC<UVCGridProps> = ({
  onDimensionsChange,
  initialSizes = ["000"],
  initialColors = ["000"],
  initialGrid = [[true]],
  setSizes,
  setColors,
  setUvcGrid,
  sizes,
  colors,
  uvcGrid,
  isFullScreen,
  isModify,
  isEditable = true, // Permettre par défaut l'édition
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [showSizeGridOptions, setShowSizeGridOptions] = useState(false);
  const [showColorGridOptions, setShowColorGridOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    updateDimensions(uvcGrid);
  }, [sizes, colors, uvcGrid]);

  const toggleCheckbox = (colorIndex: number, sizeIndex: number) => {
    const newGrid = uvcGrid.map((row, i) =>
      row.map((col, j) => (i === colorIndex && j === sizeIndex ? !col : col))
    );
    setUvcGrid(newGrid);
    updateDimensions(newGrid);
  };

  const updateDimensions = (grid: boolean[][]) => {
    const dimensions = grid.map((row, i) =>
      row
        .map((col, j) => (col ? `${colors[i]},${sizes[j]}` : ""))
        .filter(Boolean)
    );
    onDimensionsChange(dimensions);
  };

  const removePrefix = (data: string[], prefix: string) => {
    const regex = new RegExp(`^${prefix}\\s*`, "i");
    return data.map((item) => item.replace(regex, "").trim());
  };

  const importSizes = (newSizes: string[]) => {
    const cleanedSizes = removePrefix(newSizes, "Taille");
    const updatedSizes = [...sizes, ...cleanedSizes];
    const uniqueSizes = Array.from(new Set(updatedSizes));

    setSizes(uniqueSizes);

    const newGrid = colors.map((_, colorIndex) =>
      uniqueSizes.map(
        (size, sizeIndex) => uvcGrid[colorIndex]?.[sizeIndex] ?? true
      )
    );
    setUvcGrid(newGrid);
    updateDimensions(newGrid);
  };

  const handleDeleteRow = (colorIndex: number): void => {
    const updatedColors = colors.filter((_, index) => index !== colorIndex);
    const updatedGrid = uvcGrid.filter((_, index) => index !== colorIndex);

    setColors(updatedColors);
    setUvcGrid(updatedGrid);
    updateDimensions(updatedGrid);
  };

  const handleDeleteColumn = (sizeIndex: number): void => {
    const updatedSizes = sizes.filter((_, index) => index !== sizeIndex);
    const updatedGrid = uvcGrid.map((row) =>
      row.filter((_, index) => index !== sizeIndex)
    );

    setSizes(updatedSizes);
    setUvcGrid(updatedGrid);
    updateDimensions(updatedGrid);
  };

  const importColors = (newColors: string[]) => {
    const cleanedColors = removePrefix(newColors, "Couleur");
    const updatedColors = [...colors, ...cleanedColors];
    const uniqueColors = Array.from(new Set(updatedColors));

    setColors(uniqueColors);

    const newGrid = uniqueColors.map((_, colorIndex) =>
      sizes.map((size, sizeIndex) => uvcGrid[colorIndex]?.[sizeIndex] ?? true)
    );
    setUvcGrid(newGrid);
    updateDimensions(newGrid);
  };

  const addNewColor = () => {
    const newColors = [...colors, ""];
    const newGrid = [...uvcGrid, sizes.map(() => true)];
    setColors(newColors);
    setUvcGrid(newGrid);
    updateDimensions(newGrid);
  };

  const addNewSize = () => {
    const newSizes = [...sizes, ""];
    const newGrid = uvcGrid.map((row) => [...row, true]);
    setSizes(newSizes);
    setUvcGrid(newGrid);
    updateDimensions(newGrid);
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = colors.map((color, i) => (i === index ? value : color));
    setColors(newColors);
    updateDimensions(uvcGrid);
  };

  const handleSizeChange = (index: number, value: string) => {
    const newSizes = sizes.map((size, i) => (i === index ? value : size));
    setSizes(newSizes);
    updateDimensions(uvcGrid);
  };

  useEffect(() => {
    fetchGrids();
  }, [currentPage]);

  const fetchGrids = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/dimension-grid?page=${currentPage}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setGrids(data.data);
      setTotalItem(data.total);
    } catch (error) {
      console.error("Erreur lors de la requête", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSizes = (gridId: string) => {
    const sizeGrid = grids.find((grid) => grid._id === gridId);
    if (sizeGrid) {
      importSizes(sizeGrid.dimensions);
      setShowSizeGridOptions(false);
    }
    setIsModalOpen(false);
  };

  const handleImportColors = (gridId: string) => {
    const colorGrid = grids.find((grid) => grid._id === gridId);
    if (colorGrid) {
      importColors(colorGrid.dimensions);
      setShowColorGridOptions(false);
    }
    setIsModalOpen(false);
  };

  const displaySizeGridOptions = () => {
    setIsModalOpen(true);
    setShowSizeGridOptions(true);
    setShowColorGridOptions(false);
  };

  const displayColorGridOptions = () => {
    setIsModalOpen(true);
    setShowColorGridOptions(true);
    setShowSizeGridOptions(false);
  };

  return (
    <>
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Grille de dimensions"
      >
        <div className="max-h-[500px] overflow-y-auto">
          {showSizeGridOptions && (
            <div className="mb-4 p-2">
              <h4 className="text-[18px] font-[700] text-gray-700">
                Choisissez une grille de tailles :
              </h4>
              <div className="relative overflow-x-auto bg-white">
                <table className="w-full text-left">
                  <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-2 w-1/2">
                        Code
                      </th>
                      <th scope="col" className="px-6 py-2 w-1/2">
                        Dimensions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grids
                      .filter((grid) => grid.type === "taille")
                      .map((grid) => (
                        <tr
                          key={grid._id}
                          className="border-y-[1px] border-gray-200 bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap"
                          onClick={() => handleImportSizes(grid._id)}
                        >
                          <td className="px-6 py-4">{grid.code}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center flex-wrap gap-2">
                              {grid.dimensions.map((dimension) => (
                                <span className="bg-orange-200 w-[30px] h-[30px] rounded-full flex items-center justify-center text-gray-800">
                                  {removePrefix([dimension], "Taille")}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {showColorGridOptions && (
            <div className="mb-4 p-2">
              <h4 className="text-[18px] font-[700] text-gray-700">
                Choisissez une grille de couleurs :
              </h4>
              <div className="relative overflow-x-auto bg-white">
                <table className="w-full text-left">
                  <thead className="border-y-[1px] border-gray-200 text-sm font-[800] text-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-2 w-1/2">
                        Code
                      </th>
                      <th scope="col" className="px-6 py-2 w-1/2">
                        Dimensions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {grids
                      .filter((grid) => grid.type === "couleur")
                      .map((grid) => (
                        <tr
                          key={grid._id}
                          className="border-y-[1px] border-gray-200 bg-white cursor-pointer hover:bg-slate-200 capitalize text-xs text-gray-800 even:bg-slate-50 whitespace-nowrap"
                          onClick={() => handleImportColors(grid._id)}
                        >
                          <td className="px-6 py-4">{grid.code}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center flex-wrap gap-2">
                              {grid.dimensions.map((dimension) => (
                                <span className="bg-orange-200 w-[30px] h-[30px] rounded-full flex items-center justify-center text-gray-800">
                                  {removePrefix([dimension], "Couleur")}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <div className="flex items-center justify-between">
        {isModify && (
          <div className="flex gap-4 mb-3 mt-3">
            <button
              onClick={displaySizeGridOptions}
              type="button"
              className="flex items-center gap-2 text-[12px] text-blue-500"
            >
              <Ruler size={17} />
              Associer une grille de tailles
            </button>
            <button
              onClick={displayColorGridOptions}
              type="button"
              className="flex items-center gap-2 text-[12px] text-blue-500"
            >
              <Palette size={17} />
              Associer une grille de couleurs
            </button>
            <div className="h-[30px] w-[2px] bg-gray-300"></div>
            <button
              onClick={addNewSize}
              type="button"
              className="flex items-center gap-2 text-[12px] text-green-500"
            >
              <Plus size={17} />
              Ajouter une taille
            </button>
            <button
              onClick={addNewColor}
              type="button"
              className="flex items-center gap-2 text-[12px] text-green-500"
            >
              <Plus size={17} />
              Ajouter une couleur
            </button>
          </div>
        )}
        <div
          onClick={isFullScreen}
          className={`cursor-pointer hover:text-gray-400 ${
            !isModify && "flex justify-end w-full py-2"
          }`}
        >
          <Maximize2 size={17} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full mx-auto border bg-white">
          <thead className="bg-gray-100 text-[12px] text-gray-600 border border-solid border-gray-300">
            <tr>
              <th
                scope="col"
                className="px-1 py-2 text-center border border-solid border-gray-300 border-b text-[10px]"
              >
                Couleur / Taille
              </th>
              {sizes.map((size, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-1 py-2 text-center border border-solid border-gray-300 border-b"
                >
                  {isModify && isEditable ? (
                    <div className="relative">
                      <input
                        type="text"
                        value={size}
                        onChange={(e) =>
                          handleSizeChange(index, e.target.value)
                        }
                        className="w-full text-center bg-gray-100 focus:outline-none"
                      />
                      <button
                        onClick={() => handleDeleteColumn(index)}
                        className="absolute right-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    size
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative text-center text-[12px]">
            {colors.map((color, colorIndex) => (
              <tr
                key={colorIndex}
                className="border text-gray-700 cursor-pointer"
              >
                <td className="max-w-[200px] py-2 px-2 border">
                  {isModify && isEditable ? (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDeleteRow(colorIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={13} />
                      </button>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) =>
                          handleColorChange(colorIndex, e.target.value)
                        }
                        className="w-full text-center bg-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    color
                  )}
                </td>
                {sizes.map((size, sizeIndex) => (
                  <td
                    key={sizeIndex}
                    className="max-w-[200px] py-2 px-2 border"
                  >
                    {isModify ? (
                      <input
                        type="checkbox"
                        checked={uvcGrid[colorIndex][sizeIndex]}
                        onChange={() => toggleCheckbox(colorIndex, sizeIndex)}
                      />
                    ) : uvcGrid[colorIndex][sizeIndex] ? (
                      <div className="flex items-center justify-center">
                        <Check className="text-green-500" size={18} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <X className="text-red-500" size={18} />
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UVCGrid;
