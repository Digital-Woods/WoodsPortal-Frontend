const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

// const attachmentUpload = async (file) => {
//   setisLoadingUoloading(true);
//   setIsUploading(true);
//   const formData = new FormData();
//   formData.append("file", file); // Append the selected file to FormData

//   try {
//     const response = await axios({
//       method: attachmentUploadMethod,
//       url: attachmentUploadUrl,
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//       onUploadProgress: (progressEvent) => {
//         const percentCompleted = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         setUploadProgress(percentCompleted); // Update the progress
//       },
//     });

//     setUploadedAttachments((prevAttachments) => [
//       ...prevAttachments,
//       response.data.data,
//     ]);
//     setUploadProgress(0);
//     setisLoadingUoloading(false);
//     setIsUploading(false);
//     if (refetch) refetch();
//   } catch (error) {
//     setisLoadingUoloading(false);
//     setIsUploading(false);
//   }
// };

// const customMenuItemAttachment = new MenuItem2({
//   title: "Add Attachment",
//   run: (state, dispatch, view) => {
//     // Create a hidden file input element
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";

//     // Trigger the file selection dialog
//     fileInput.click();

//     // Handle the file selection
//     fileInput.addEventListener("change", async () => {
//       const file = fileInput.files[0];
//       if (file) {
//         // attachmentUpload(file);
//       }
//     });
//   },
//   select: (state) => true, // Show this item always
//   icon: {
//     dom: (() => {
//       const span = document.createElement("span");
//       span.innerHTML = `
//        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
//       `;
//       span.className = "custom-menu-icon";
//       return span;
//     })(),
//   },
// });

const EditorAttachmentUploadMenu = ({
  editorView,
  attachmentUploadUrl,
  attachmentUploadMethod,
  setUploadedAttachments,
  setisLoadingUoloading,
  setUploadProgress,
  setAttachmentId
}) => {
  const token = getAuthToken();
  const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>`;
  // const { isLoadingUoloading, setisLoadingUoloading, uploadProgress, setUploadProgress } = useSync();
  const boldButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);

    await uploadImageToAPI(editorView, formData);
  };

  const uploadImageToAPI = async (pmView, formData) => {
    setisLoadingUoloading(true);
    try {
      const response = await axios({
        method: attachmentUploadMethod,
        url: attachmentUploadUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update the progress
        },
      });

      setAttachmentId((prevAttachments) => 
        prevAttachments ? `${prevAttachments},${response.data.data.id}` : response.data.data.id
      );
      
      setUploadedAttachments((prevAttachments) => [
        ...prevAttachments,
        response.data.data,
      ]);
      setUploadProgress(0);
      setisLoadingUoloading(false);
      // setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      setisLoadingUoloading(false);
      // setIsUploading(false);
    }
  };

  return (
    <div className="">
      <div
        className="ProseMirror-icon note-menuitem"
        title="Insert Attatchment"
        ref={boldButtonRef}
        onClick={uploadImage}
      >
        <SvgRenderer svgContent={boldIcon} />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

const renderReactAttachmentUploadComponent = (
  editorView,
  attachmentUploadUrl,
  attachmentUploadMethod,
  setUploadedAttachments,
  setisLoadingUoloading,
  setUploadProgress,
  setAttachmentId
) => {
  const container = document.createElement("div");
  ReactDOM.render(
    <EditorAttachmentUploadMenu
      editorView={editorView}
      attachmentUploadUrl={attachmentUploadUrl}
      attachmentUploadMethod={attachmentUploadMethod}
      setUploadedAttachments={setUploadedAttachments}
      setisLoadingUoloading={setisLoadingUoloading}
      setUploadProgress={setUploadProgress}
      setAttachmentId={setAttachmentId}
    />,
    container
  );
  return container;
};

const customMenuItemAttachment = (
  attachmentUploadUrl,
  attachmentUploadMethod,
  setUploadedAttachments,
  setisLoadingUoloading,
  setUploadProgress,
  setAttachmentId
) =>
  new MenuItem2({
    title: `Insert Attatchment`,
    run: () => {},
    select: (state) => {
      return true;
    },
    render: (editorView) =>
      renderReactAttachmentUploadComponent(
        editorView,
        attachmentUploadUrl,
        attachmentUploadMethod,
        setUploadedAttachments,
        setisLoadingUoloading,
        setUploadProgress,
        setAttachmentId
      ),
  });
