import React from "react";
import { Link, useLocation  } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import Card from "../../components/Shared/Card";

function ParamsMenuPage() {
  const colors = ["bg-orange-600", "bg-orange-500", "bg-orange-400", "bg-orange-300", "bg-orange-200"];
  const borders = ["border-orange-500", "border-orange-400", "border-orange-300", "border-orange-200", "border-orange-100"];
  const location = useLocation();
  return (
    <div>
      <Card title="Mes paramètres">
        <div className="gap-7 mt-2 grid grid-cols-3 w-[70%] mx-auto py-10">
          {LINKS_Params.map((link, i) => (
            <Link to={link.link} key={i} className={`w-[250px] h-[250px] ${colors[i]} border-2 ${borders[i]} hover:brightness-105 hover:scale-110 text-white rounded-xl shadow-lg transition-all`}>
              <div className={`flex flex-col items-center justify-center h-full gap-3`}>
                <span className="text-xl font-bold">
                  {link.name}
                </span>
                {React.createElement(link.icon, {
                size: new RegExp(`^${link.link}(/.*)?$`).test(
                  location.pathname
                )
                  ? 50
                  : 40,
              })}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ParamsMenuPage;
