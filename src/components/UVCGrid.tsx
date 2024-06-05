import React, { useEffect, useState } from "react";
import { Palette, Ruler } from "lucide-react";
import Button from "./FormElements/Button";
import Modal from "./Shared/Modal";

interface UVCGridProps {
  onDimensionsChange: (dimensions: string[][]) => void;
}

interface Grid {
  _id: string;
  TYPE: string;
  LIBELLE: string;
  DIMENSIONS: string[];
}

const UVCGrid: React.FC<UVCGridProps> = ({ onDimensionsChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [grids, setGrids] = useState<Grid[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [uvcGrid, setUvcGrid] = useState<boolean[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const [totalItem, setTotalItem] = useState<number | null>(null);
  const [showSizeGridOptions, setShowSizeGridOptions] = useState(false);
  const [showColorGridOptions, setShowColorGridOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCheckbox = (colorIndex: number, sizeIndex: number) => {
    const newGrid = uvcGrid.map((row, i) =>
      row.map((col, j) => (i === colorIndex && j === sizeIndex ? !col : col))
    );
    setUvcGrid(newGrid);
    updateDimensions(newGrid);
  };

  const updateDimensions = (grid: boolean[][]) => {
    const dimensions = grid
      .map((row, i) =>
        row.map((col, j) => (col ? `${colors[i]},${sizes[j]}` : '')).filter(Boolean)
      );
    onDimensionsChange(dimensions);
  };

  useEffect(() => {
    if (sizes.length > 0 && colors.length > 0) {
      const initialGrid = colors.map(() => sizes.map(() => true));
      setUvcGrid(initialGrid);
      updateDimensions(initialGrid);
    }
  }, [sizes, colors]);

  const importSizes = (newSizes: string[]) => {
    setSizes(newSizes);
    const newGrid = colors.map(() => newSizes.map(() => true));
    setUvcGrid(newGrid);
  };

  const importColors = (newColors: string[]) => {
    setColors(newColors);
    const newGrid = newColors.map(() => sizes.map(() => true));
    setUvcGrid(newGrid);
  };

  useEffect(() => {
    fetchGrids();
  }, [currentPage]);

  const fetchGrids = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL_DEV}/api/v1/grid?page=${currentPage}&limit=${limit}`,
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
      importSizes(sizeGrid.DIMENSIONS);
      setShowSizeGridOptions(false);
    }
    setIsModalOpen(false);
  };

  const handleImportColors = (gridId: string) => {
    const colorGrid = grids.find((grid) => grid._id === gridId);
    if (colorGrid) {
      importColors(colorGrid.DIMENSIONS);
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
        icon="G"
      >
        {showSizeGridOptions && (
          <div className="mb-4 p-2">
            <h4 className="text-[18px] font-[700] text-gray-700">
              Choisissez une grille de tailles :
            </h4>
            <ul className="grid grid-cols-5 gap-2 mt-3">
              {grids
                .filter((grid) => grid.TYPE === "Taille")
                .map((grid) => (
                  <li
                    key={grid._id}
                    className="bg-green-100 text-green-600 border border-green-600 rounded-lg text-center py-3 hover:bg-green-100 cursor-pointer"
                  >
                    <button onClick={() => handleImportSizes(grid._id)}>
                      {grid.LIBELLE}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
        {showColorGridOptions && (
          <div className="mb-4 p-2">
            <h4 className="text-[18px] font-[700] text-gray-700">
              Choisissez une grille de couleurs :
            </h4>
            <ul className="grid grid-cols-5 gap-2 mt-3">
              {grids
                .filter((grid) => grid.TYPE === "Couleur")
                .map((grid) => (
                  <li
                    key={grid._id}
                    className="bg-orange-100 text-orange-600 border border-orange-600 rounded-lg text-center py-3 hover:bg-orange-100 cursor-pointer"
                  >
                    <button onClick={() => handleImportColors(grid._id)}>
                      {grid.LIBELLE}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </Modal>
      <h3 className="text-[22px] font-[800] text-gray-800">
        Grille de dimension
      </h3>
      <div className="flex gap-2 mb-3 mt-3">
        <Button
          size="small"
          blue
          onClick={displaySizeGridOptions}
          type="button"
        >
          <Ruler size={17} />
          Importer une grille de tailles
        </Button>
        <Button
          size="small"
          blue
          onClick={displayColorGridOptions}
          type="button"
        >
          <Palette size={17} />
          Importer une grille de couleurs
        </Button>
      </div>
      <div className="overflow-x-auto bg-white">
        <table className="w-full mx-auto border">
          <thead className="bg-gray-100 text-sm text-gray-600 border border-solid border-gray-300">
            <tr>
              <th
                scope="col"
                className="px-6 py-2 text-center border border-solid border-gray-300 border-b"
              >
                Couleur / Taille
              </th>
              {sizes.map((size, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-2 text-center border border-solid border-gray-300 border-b"
                >
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center text-xs">
            {colors.map((color, colorIndex) => (
              <tr
                key={colorIndex}
                className="border text-gray-700 hover:bg-slate-200 cursor-pointer"
              >
                <td className="py-2 px-2 border">{color}</td>
                {sizes.map((size, sizeIndex) => (
                  <td key={sizeIndex} className="py-2 px-2 border">
                    <input
                      type="checkbox"
                      checked={uvcGrid[colorIndex][sizeIndex]}
                      onChange={() => toggleCheckbox(colorIndex, sizeIndex)}
                    />
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
