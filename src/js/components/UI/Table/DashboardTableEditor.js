const DashboardTableEditor = ({ title, value, setValue }) => {
  const editorRef = useRef(null);
  const menuConfig = {
    imageUploader: false,
    attachmentUploader: false,
    proseMirrorMenuDecreaseIndent: true,
    proseMirrorMenuIncreaseIndent: true,
    proseMirrorMenuEmoji: true,
  };

  return (
    <ProseMirrorEditor
      ref={editorRef}
      key={title}
      initialData={value}
      setEditorContent={setValue}
      id={`editor-${title}`}
      menuConfig={menuConfig}
    />
  );
};
