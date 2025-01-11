const SummernoteEditor = ({
  initialData = "",
  attachments = [],
  setEditorContent,
  id = "new",
  imageUploadUrl,
  attachmentUploadUrl,
  attachmentUploadMethod = "POST",
  setAttachmentId = null,
  refetch = null,
  objectId,
  setIsUploading,
}) => {
  const editorRef = useRef(null);
  const token = getAuthToken();
  const [uploadedAttachments, setUploadedAttachments] = useState(attachments);
  const [isLoadingUoloading, setisLoadingUoloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const attachmentIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>`;
  const imageIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>`;

  useEffect(() => {
    if (setAttachmentId)
      setAttachmentId(uploadedAttachments.map((item) => item.id).join(";"));
  }, [uploadedAttachments]);

  const uploadImage = async (file) => {
    setisLoadingUoloading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData

    try {
      const response = await axios({
        method: "POST",
        url: imageUploadUrl,
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

      const imageUrl = response.data.data.url;
      $(editorRef.current).summernote("insertImage", imageUrl);
      setUploadProgress(0);
      setisLoadingUoloading(false);
      setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      setisLoadingUoloading(false);
      setIsUploading(false);
    }
  };

  const attachmentUpload = async (file) => {
    setisLoadingUoloading(true);
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file); // Append the selected file to FormData

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

      setUploadedAttachments((prevAttachments) => [
        ...prevAttachments,
        response.data.data,
      ]);
      setUploadProgress(0);
      setisLoadingUoloading(false);
      setIsUploading(false);
      if (refetch) refetch();
    } catch (error) {
      setisLoadingUoloading(false);
      setIsUploading(false);
    }
  };
  useEffect(() => {
    // Extend Summernote with a custom plugin
    $.extend($.summernote.plugins, {
      imagePlugin: function (context) {
        var ui = $.summernote.ui;
        context.memo("button.imagePlugin", function () {
          const button = ui.button({
            contents: imageIcon,
            tooltip: false,
            click: function () {
              const $fileInput = $(context.layoutInfo.editor).find(
                "input.note-image-input"
              );

              if ($fileInput.length > 0) {
                // Set the accept attribute to only allow images
                $fileInput.attr("accept", "image/*");

                $fileInput.off("change").on("change", function (event) {
                  const file = event.target.files[0];
                  if (file) {
                    // Validate file type (optional extra validation)
                    if (file.type.startsWith("image/")) {
                      uploadImage(file); // Call the updated upload function
                    } else {
                      alert("Please upload a valid image file.");
                    }
                  }
                  $(this).val(""); // Clear input value for re-selection
                });

                $fileInput.trigger("click");
              } else {
                console.error("File input element not found!");
              }
            },
          });
          return button.render();
        });
      },
      attachmentPlugin: function (context) {
        var ui = $.summernote.ui;
        context.memo("button.attachmentPlugin", function () {
          const button = ui.button({
            contents: attachmentIcon,
            tooltip: false,
            click: function () {
              // Locate the file input element within Summernote's DOM
              const $fileInput = $(context.layoutInfo.editor).find(
                "input.note-image-input"
              );
              if ($fileInput.length > 0) {
                // Bind a change event listener to handle file selection
                $fileInput.off("change").on("change", function (event) {
                  const file = event.target.files[0];
                  if (file) {
                    attachmentUpload(file); // Call the upload function
                  }
                  // Clear the input value to allow re-selection of the same file
                  $(this).val("");
                });

                // Trigger the file input click
                $fileInput.trigger("click");
              } else {
                console.error("File input element not found!");
              }
            },
          });
          return button.render();
        });
      },
    });

    // Initialize Summernote
    $(editorRef.current).summernote({
      placeholder: "Write your content here...",
      tabsize: 2,
      height: 200,
      toolbar: [
        ["fontname"],
        ["fontsize"],
        ["font", ["bold", "italic", "underline", "clear"]],
        ["color", ["color"]],
        ["plugin", ["imagePlugin", "attachmentPlugin"]],
      ],
      codeviewFilter: true, // Limit HTML tags
      codeviewFilterRegex: /^(?!.*(script|iframe|embed|applet))/gi,
      callbacks: {
        onChange: function (contents) {
          setEditorContent(contents); // Update state on content change
          // console.log("Content changed:", contents);
        },
        onFocus: function () {
          // console.log("Editor focused");
        },
        onBlur: function () {
          // console.log("Editor lost focus");
        },
        // onImageUpload: function (files) {
        //   uploadImage(files[0]);
        // },
      },
    });

    // Preload content into the editor
    $(editorRef.current).summernote("code", initialData);

    // Cleanup on unmount
    return () => {
      $(editorRef.current).summernote("destroy");
    };
  }, []);

  return (
    <div>
      <textarea id={id} ref={editorRef} />
      <Attachments
        setUploadedAttachments={setUploadedAttachments}
        attachments={uploadedAttachments}
        objectId={objectId}
        id={id}
        isLoadingUoloading={isLoadingUoloading}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};
