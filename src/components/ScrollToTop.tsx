import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  scrollThreshold?: number;
  scrollDuration?: number; // Nouvelle prop pour définir la durée du défilement
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
  scrollThreshold = 300,
  scrollDuration = 500, // Durée par défaut de 500 millisecondes
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > scrollThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    const startTime = performance.now(); // Horodatage de début

    const scrollStep = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1); // Calculer la progression
      const scrollY = window.pageYOffset * (1 - progress); // Calculer la nouvelle position de défilement

      window.scrollTo(0, scrollY); // Défiler vers la nouvelle position

      if (progress < 1) {
        window.requestAnimationFrame(scrollStep); // Demander une nouvelle frame d'animation
      }
    };

    window.requestAnimationFrame(scrollStep); // Démarrer l'animation
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, [scrollThreshold]);

  return (
    <>
        <a
          onClick={scrollToTop}
          className="absolute bottom-0 right-[-60px] bg-orange-500 p-3 rounded-full text-white hover:bg-orange-400 cursor-pointer"
        >
          <ChevronUp size={24} />
        </a>
    </>
  );
};

export default ScrollToTop;