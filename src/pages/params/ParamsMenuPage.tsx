import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import Card from "../../components/Shared/Card";
import { Info } from "lucide-react";
import Modal from "../../components/Shared/Modal";
import Button from "../../components/FormElements/Button";
import { Divider } from "@mui/material";

function ParamsMenuPage() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Modal
        show={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
        header="Informations"
        icon="i"
      >
        <div className="px-7 mb-5">
          <p className="text-gray-800 text-xl">
            Cliquez sur une des catégories pour entrer dans le panneau
            d'édition. Une fois dans le panneau d'édition, vous pouvez modifier
            ou créer une nouvelle entrée dans le paramètre choisi.
          </p>
        </div>
        <Divider />
        <div className="flex justify-end mt-7 px-7">
          <Button blue size="small" onClick={() => setIsModalOpen(false)}>
            J'ai compris
          </Button>
        </div>
      </Modal>
      <Card title="Mes paramètres" createTitle="" link="">
        <div className=" w-[80%] xl:w-[70%] mx-auto mt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 h-[70px]">
              <div className="h-2/3 w-[8px] bg-[#01972B]"></div>
              <h4 className="text-3xl text-gray-600">
                <span className="font-bold text-gray-700">Paramétrer</span> les
                données
              </h4>
            </div>
            <div
              className="cursor-pointer text-gray-500"
              onClick={() => setIsModalOpen(true)}
            >
              <Info size={22} />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2  py-5">
            {LINKS_Params.map((link, i) => (
              <Link
                to={link.link}
                key={i}
                className={`w-[250px] h-[250px] bg-orange-500 border-2 border-orange-300 hover:bg-orange-400 hover:scale-110 text-white rounded-xl shadow-lg transition-all`}
              >
                <div
                  className={`flex flex-col items-center justify-center h-full gap-3`}
                >
                  <span className="text-xl font-bold">{link.name}</span>
                  {React.createElement(link.icon, {
                    size: new RegExp(`^${link.link}(/.*)?$`).test(
                      location.pathname
                    )
                      ? 60
                      : 40,
                  })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ParamsMenuPage;
