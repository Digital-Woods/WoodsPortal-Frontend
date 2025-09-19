import { Button } from "../Button";
import { Dialog } from "../Dialog";

export const CreateFolderDialog = ({
  isCreateFolderOpen,
  setIsCreateFolderOpen,
  newFolderName,
  setNewFolderName,
  currentFiles,
  setCurrentFiles,
}: any) => {
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
      <div className="lg:w-[480px] md:w-[410px] w-[calc(100vw-60px)] flex flex-col justify-start p-4">
        <div className="text-lg text-start font-semibold mb-4 dark:text-white">New Folder</div>
        <input
          className="dark:text-white"
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <div className="flex items-center gap-3 justify-end">
          <Button className='dark:text-white' onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
          <Button onClick={createFolder}>Create</Button>
        </div>
      </div>
    </Dialog>
  );
};
