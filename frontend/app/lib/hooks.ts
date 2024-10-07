import { useEffect, useState } from "react";

const useIsMediumScreen = () => {
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMediumScreen(event.matches);
    };
    setIsMediumScreen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return isMediumScreen;
};

export default useIsMediumScreen;
