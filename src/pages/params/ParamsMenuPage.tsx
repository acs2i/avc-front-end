import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import Card from "../../components/Shared/Card";

function ParamsMenuPage() {
  const location = useLocation();
  return (
    <div>
      <Card title="Mes paramètres">
        <div className=" w-[80%] xl:w-[70%] mx-auto mt-5">
          <div className="flex items-center gap-3 h-[70px]">
            <div className="h-2/3 w-[8px] bg-emerald-700"></div>
            <h4 className="text-3xl text-gray-600">
              <span className="font-bold text-gray-700">Paramétrer</span> les données
            </h4>
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
