
const DisassociateButton = ({ onConfirm }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpenModal(false);
  };

  return (
    <>
      <Button
        size="xsm"
        // className="text-white bg-red-600 hover:bg-red-700"
        onClick={() => setOpenModal(true)}
      >
        Disassociate
      </Button>

      <Dialog
        open={openModal}
        onClose={setOpenModal}
        className="bg-cleanWhite dark:bg-dark-200 rounded-md sm:min-w-[430px]"
      >
        <div className="rounded-md flex-col gap-6 flex">
          <h3 className="text-start text-xl font-semibold dark:text-white">
            Are you sure you want to disassociate?
          </h3>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}
            //  className="bg-red-600 text-white hover:bg-red-700"
             >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

