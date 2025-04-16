const DashboardTableEditor = ({ title, value, setValue, ...rest }, ref) => {
  const [inputValue, setInputValue] = useState("");

  const menuConfig = {
    imageUploader: false,
    attachmentUploader: false,
    proseMirrorMenuDecreaseIndent: true,
    proseMirrorMenuIncreaseIndent: true,
    proseMirrorMenuEmoji: true,
  };

  useEffect(() => {
    setValue(rest.name, inputValue);
  }, [inputValue]);

  return (
    <ProseMirrorEditor
      ref={ref}
      key={title}
      initialData={value}
      setEditorContent={setInputValue}
      id={`editor-${title}`}
      menuConfig={menuConfig}
    />
  );
};
