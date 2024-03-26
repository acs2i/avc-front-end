import React from 'react'

type InFosCard = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};


export default function Card({title, subtitle, children}: InFosCard) {
  return (
    <section className="bg-white shadow-md rounded-lg p-6 mt-8">
      {children}
    </section>
  )
}