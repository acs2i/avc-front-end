export default function SectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative h-screen w-[100%]"
      style={{
        backgroundColor: "#f1f1f1",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="fixed top-0 w-[100%] h-screen"
        style={{ overflow: "hidden" }}
      >
        <img
          src="img/background_forest.jpg"
          className="w-full h-full"
          style={{
            opacity: "0.4",
            filter: "grayscale(100%)",
            objectFit: "cover",
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}
