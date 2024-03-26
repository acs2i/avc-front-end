export default function SectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative h-screen w-full"
      style={{
        backgroundColor: "#f1f1f1",
        minHeight: "100vh",
        overflow: "auto",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="fixed top-0 w-100 h-screen"
        style={{ overflow: "hidden" }}
      >
        <img
          src="img/background_forest.jpg"
          className="w-100 h-screen"
          style={{
            ["object-fit"]: "cover",
            opacity: "0.4",
            filter: "grayscale(100%)",
          }}
        />
      </div>
      {children}
    </section>
  );
}
