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
      <div>
        <h2>New Folder</h2>
        <input
          className="dark:text-cleanWhite"
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <div>
          <Button className='dark:text-white' onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
          <Button onClick={createFolder}>Create</Button>
        </div>
      </div>
    </Dialog>
  );
};
