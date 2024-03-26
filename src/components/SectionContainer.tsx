
export default function SectionContainer({children} : {children : React.ReactNode}) {
    return (
      <section className="h-screen w-full bg-red-500">
        {children}
      </section>
    )
  }