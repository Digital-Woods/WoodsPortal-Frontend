
const useResponsive = () => {
  const [screenSizes, setScreenSizes] = useState({
    isLargeScreen: false,
    isMediumScreen: false,
    isSmallScreen: false,
  });

  useEffect(() => {
    const updateScreenSizes = () => {
      const width = window.innerWidth;
      setScreenSizes({
        isLargeScreen: width > 1023,
        isMediumScreen: width > 768 && width <= 1023,
        isSmallScreen: width <= 768,
      });
    };

    // Initialize state on mount
    updateScreenSizes();

    // Add resize listener
    window.addEventListener("resize", updateScreenSizes);

    return () => {
      // Cleanup listener on unmount
      window.removeEventListener("resize", updateScreenSizes);
    };
  }, []);

  return screenSizes;
};

