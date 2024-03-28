import React from "react";


type InFosCard = {
  title: any;
  children: React.ReactNode;
};

export default function Card({ title, children }: InFosCard) {
  return (
    <section className="bg-white shadow-md rounded-lg mt-8 flex flex-col gap-7">
      <div className="bg-green-800 py-3 px-5">
        <h2 className="text-white font-bold text-lg">{title}</h2>
      </div>
      <div className="py-5 px-5">
        {children}
      </div>
    </section>
  );
}
