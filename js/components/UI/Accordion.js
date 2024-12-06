const Accordion = ({ children, className, isActive }) => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (isActive) {
      setActive(0);
    } else {
      setActive(null);
    }
  }, [isActive]);

  const handleToggle = (index) => {
    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }
  };

  return (
    <div
      className={twMerge(
        "rounded overflow-hidden border dark:border-gray-600 bg-white dark:bg-dark-300 dark:text-white mb-4",
        className
      )}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          active,
          id: index,
          handleToggle,
        })
      )}
    </div>
  );
};
const AccordionSummary = ({ children, active, id, handleToggle }) => {
  return (
    <div
      className={`flex justify-between dark:border-gray-600 bg-white dark:bg-dark-300 items-start p-4 bg-white cursor-pointer transition-colors ${
        active != null ? "" : ""
      }`}
      onClick={() => handleToggle(id)}
    >
      <h5 className="font-medium text-sm">{children}</h5>

      {active === id ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          className="dark:fill-white"
        >
          <path d="M200-440v-80h560v80H200Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="18px"
          viewBox="0 -960 960 960"
          width="18px"
          className="dark:fill-white"
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      )}
    </div>
  );
};
const AccordionDetails = ({ children, active, id }) => {
  const contentEl = useRef(null);
  useEffect(() => {
    if (contentEl.current) {
      contentEl.current.style.height =
        active != null ? `${contentEl.current.scrollHeight}px` : "0px";
    }
  }, [active, id]);
  return (
    <div
      ref={contentEl}
      className={`rounded-md transition-height duration-300 overflow-hidden  bg-white dark:bg-dark-300 ${
        active != null ? "max-h-screens" : "max-h-0"
      }`}
      style={
        active != null
          ? { height: contentEl.current.scrollHeight }
          : { height: "0px" }
      }
    >
      <div className="rounded-md px-2 bg-white dark:bg-dark-300">{children}</div>
    </div>
  );
};
