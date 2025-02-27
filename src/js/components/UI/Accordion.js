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
      className={`flex justify-between gap-2 dark:border-gray-600 dark:bg-dark-300 items-start p-4 cursor-pointer transition-colors ${active != null ? "" : ""
        }`}
      onClick={() => handleToggle(id)}
    >
        <span className='font-semibold text-secondary dark:text-white'>
          {active === id ? (
            <Chevron transform="rotate(270)" />
          ) : (
            <Chevron transform="rotate(180)" />
          )}
        </span>
        <h5 className="font-medium text-sm flex items-center justify-between gap-x-2 flex-1 ">{children}</h5>

      {/* {active === id ? <IconMinus className='font-semibold fill-rstextcolor dark:fill-white' /> : <IconPlus className='font-semibold fill-rstextcolor dark:fill-white' />} */}
    </div>
  );
};
const AccordionDetails = ({ children, active, id }) => {
  const contentEl = useRef(null);
  useEffect(() => {
    if (contentEl.current) {
      contentEl.current.style.maxHeight =
        active != null ? `100%` : "0px";
    }
  }, [active, id, contentEl]);
  return (
    <div
      ref={contentEl}
      className={`rounded-md transition-all duration-500 overflow-y-auto hide-scrollbar dark:bg-dark-300 `}
    >
      <div className="rounded-md px-2">{children}</div>
    </div>
  );
};
