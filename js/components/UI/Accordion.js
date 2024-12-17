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
        "rounded overflow-hidden border dark:border-gray-600 bg-rsbackground dark:bg-dark-300 dark:text-white mb-4",
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
      className={`flex justify-between dark:border-gray-600 dark:bg-dark-300 items-start p-4 cursor-pointer transition-colors ${
        active != null ? "" : ""
      }`}
      onClick={() => handleToggle(id)}
    >
      <h5 className="font-medium text-sm">{children}</h5>
      
      {active === id ? <IconMinus className='font-semibold fill-rstextcolor dark:fill-white' /> : <IconPlus className='font-semibold fill-rstextcolor dark:fill-white' />}
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
      className={`rounded-md transition-height duration-300 overflow-hidden   dark:bg-dark-300 ${
        active != null ? "max-h-screens" : "max-h-0"
      }`}
      style={
        active != null
          ? { height: contentEl.current.scrollHeight }
          : { height: "0px" }
      }
    >
      <div className="rounded-md px-2">{children}</div>
    </div>
  );
};
