const { MenuItem: MenuItem2 } = window.ProseMirrorMenuItem;

const insertImage = (view, src) => {
  const { state, dispatch } = view;
  const { selection } = state;
  const position = selection.$cursor ? selection.$cursor.pos : selection.from;
  console.log("insertImage", src);
  const transaction = state.tr.insert(
    position,
    state.schema.nodes.image.create({ src })
  );
  dispatch(transaction);
};

// const uploadImage = async (pmView, file) => {
//   // setisLoadingUoloading(true);
//   // setIsUploading(true);
//   const formData = new FormData();
//   formData.append("file", file); // Append the selected file to FormData
//   console.log('uploadImage', formData)

//   try {
//     const response = await axios({
//       method: "POST",
//       url: imageUploadUrl,
//       data: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//       },
//       // onUploadProgress: (progressEvent) => {
//       //   const percentCompleted = Math.round(
//       //     (progressEvent.loaded * 100) / progressEvent.total
//       //   );
//       //   setUploadProgress(percentCompleted); // Update the progress
//       // },
//     });

//     const imageUrl = response.data.data.url;
//     const imageName = response.data.data.name;

//     insertImage(pmView, imageUrl);

//     // setUploadProgress(0);
//     // setisLoadingUoloading(false);
//     // setIsUploading(false);
//     if (refetch) refetch();
//   } catch (error) {
//     // setisLoadingUoloading(false);
//     // setIsUploading(false);
//   }
// };

// const customMenuItemImage = new MenuItem2({
//   title: "Insert Image",
//   run: (state, dispatch, view) => {
//     // fileInputRef.current.click();
//     //  Create a hidden file input element
//     const fileInput = document.createElement("input");
//     fileInput.type = "file";
//     fileInput.accept = "image/*"; // Accept only images (modify as needed)

//     // Trigger the file selection dialog
//     fileInput.click();

//     // Handle the file selection
//     fileInput.addEventListener("change", async () => {
//       const file = fileInput.files[0];
//       if (file) {
//         console.log('customMenuItemImage', file)
//         uploadImage(view, file);
//       }
//     });
//   },
//   select: (state) => true, // Show this item always
//   icon: {
//     dom: (() => {
//       const span = document.createElement("span");
//       span.innerHTML = `
// <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>
// `;
//       span.className = "custom-menu-icon";
//       return span;
//     })(),
//   },
// });

const EditorImageUploadMenu = ({ editorView }) => {
  const token = getAuthToken();
  const boldIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>`;
  const boldButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageUploadUrl = "/";
  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);

    uploadImageToAPI(editorView, formData);

    // try {
    //   const response = await fetch("https://your-api.com/upload", {
    //     method: "POST",
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error("Upload failed");
    //   }

    //   const data = await response.json();
    //   console.log("Image uploaded successfully:", data);

    //   // Here, you can insert the uploaded image into the editor
    //   // Example: editorView.dispatch(insertImage(data.imageUrl));
    // } catch (error) {
    //   console.error("Error uploading image:", error);
    // }
  };

  const uploadImageToAPI = async (pmView, formData) => {
    // setisLoadingUoloading(true);
    // setIsUploading(true);
    // const formData = new FormData();
    // formData.append("file", file); // Append the selected file to FormData
    console.log("uploadImage", formData);

    try {
      const response = await axios({
        method: "POST",
        url: imageUploadUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        // onUploadProgress: (progressEvent) => {
        //   const percentCompleted = Math.round(
        //     (progressEvent.loaded * 100) / progressEvent.total
        //   );
        //   setUploadProgress(percentCompleted); // Update the progress
        // },
      });

      const imageUrl = response.data.data.url;
      const imageName = response.data.data.name;

      insertImage(pmView, imageUrl);

      // setUploadProgress(0);
      // setisLoadingUoloading(false);
      // setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      // setisLoadingUoloading(false);
      // setIsUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="ProseMirror-icon"
        title="Select Text Bold"
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

const renderReactImageUploadComponent = (editorView) => {
  const container = document.createElement("div");
  ReactDOM.render(<EditorImageUploadMenu editorView={editorView} />, container);
  return container;
};

const customMenuItemImage = new MenuItem2({
  title: `Bold`,
  run: () => {},
  select: (state) => {
    return true;
  },
  render: (editorView) => renderReactImageUploadComponent(editorView),
});
