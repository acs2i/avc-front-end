import { useLocation } from "react-router-dom";



export default function SectionContainer({
  children,
}: {
  children: React.ReactNode;
}) {

  const defaultBackground = "/img/background_forest.jpg";

  type BackgroundPaths = {
    [key: string]: string;
  };
  
 const backgroundPaths: BackgroundPaths = {
  "/login": "/img/background.png",
};
  
  const location = useLocation();
  const pathname = location.pathname;
  const backgroundImage = backgroundPaths[pathname] || defaultBackground;;

  return (
    <section
      className="relative w-[100%] h-[1500px]"
    >
      <div
        className="fixed top-0 h-full w-full"
        style={{ overflow: "hidden" }}
      >
        <img
          src={backgroundImage}
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
