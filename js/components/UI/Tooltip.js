const Tooltip = ({ children, content, right }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef();

  const calculatePosition = (rect) => {
    if (!tooltipRef.current) return;

    const tooltipWidth = tooltipRef.current.offsetWidth;
    const tooltipHeight = tooltipRef.current.offsetHeight;

    // Calculate available space
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;

    let top = rect.top + rect.height / 2 - tooltipHeight / 2;
    let left = rect.right;

    if (right) {
      // Adjust if space is insufficient
      if (spaceRight < tooltipWidth + 10) {
        left = rect.left - tooltipWidth - 10; // Shift to the left
      }
    } else {
      top = rect.top - tooltipHeight - 10;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;

      if (spaceTop < tooltipHeight + 10) {
        top = rect.bottom + 10; // Show below if not enough space above
      }
    }

    setTooltipStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 1000,
      opacity: 1,
    });
  };

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsVisible(true);

    // Wait for tooltip to mount, then calculate position
    setTimeout(() => calculatePosition(rect), 0);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 p-4 max-w-[350px] text-xs  text-white bg-gray-800 rounded-lg shadow-lg text-sm leading-5 tooltip-styles"
          style={tooltipStyle}
        >
          {content}
        </div>
      )}
      {children}
    </div>
  );
};