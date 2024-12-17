const CreateFolderDialog = ({
  isCreateFolderOpen,
  setIsCreateFolderOpen,
  newFolderName,
  setNewFolderName,
  currentFiles,
  setCurrentFiles,
}) => {
  const createFolder = () => {
    if (newFolderName) {
      const newFolder = { name: newFolderName, type: "folder", child: [] };
      currentFiles.push(newFolder);
      setCurrentFiles([...currentFiles]);
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  return (
    <Dialog
      open={isCreateFolderOpen}
      onClose={() => setIsCreateFolderOpen(false)}
    >
      <div className="lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)] flex flex-col justify-start">
        <h3 className="text-lg text-start font-semibold mb-4 dark:text-white">New Folder</h3>
        <input
          className="dark:text-cleanWhite"
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <div className="flex items-center gap-3 justify-between">
          <Button className='dark:text-white' onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
          <Button onClick={createFolder}>Create</Button>
        </div>
      </div>
    </Dialog>
  );
};
