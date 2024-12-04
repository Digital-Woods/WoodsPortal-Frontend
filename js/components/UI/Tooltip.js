const Tooltip = ({ children, content, right }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div
          className={`absolute ${
            right
              ? "left-full top-1/2 transform -translate-y-1/2 ml-2"
              : "bottom-full mb-2"
          } px-2 py-1 text-sm text-white bg-black rounded-md tooltip-styles z-50`}
        >
          {content}
        </div>
      )}
      {children}
    </div>
  );
};
