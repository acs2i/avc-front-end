import React from "react";
import { Link } from "react-router-dom";
import { LINKS_Params } from "../../utils/index";
import Card from "../../components/Shared/Card";

function ParamsMenuPage() {
  const colors = ["bg-orange-600", "bg-orange-500", "bg-orange-400", "bg-orange-300", "bg-orange-200"];
  return (
    <div>
      <Card title="Mes paramètres">
        <div className="w-[50%] mx-auto mt-[150px] mb-[200px] flex flex-col gap-3">
          {LINKS_Params.map((link, i) => (
            <Link to={link.link} key={i}>
              <div className={`${colors[i]} hover:brightness-90 text-white w-full h-[50px] flex items-center justify-center rounded-md shadow-lg`}>
                <span className="text-2xl font-bold">
                  {link.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ParamsMenuPage;
