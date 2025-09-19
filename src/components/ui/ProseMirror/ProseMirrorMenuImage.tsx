import { useRef } from 'react';
import {MenuItem as MenuItem2} from "prosemirror-menu"
import { ImageIcon } from '@/assets/icons/ImageIcon';
import { getAuthToken } from '@/data/client/auth-utils';
import axios from 'axios';
import { createRoot } from 'react-dom/client';

// const insertImage = (view, src, width, height) => {
//   const { state, dispatch } = view;
//   const { selection } = state;
//   const position = selection.$cursor ? selection.$cursor.pos : selection.from;

//   const transaction = state.tr.insert(
//     position,
//     state.schema.nodes.image.create({ src, width, height, class: `w-${width} h-${height}` })
//   );
//   dispatch(transaction);
// };

const insertImage = (view: any, src: any, width: any, height: any) => {
  const { state, dispatch } = view;
  const { schema } = state;
  const { selection } = state;
  const position = selection.$cursor ? selection.$cursor.pos : selection.from;

  // Create the image node with a wrapper div
  const imageNode = schema.nodes.image.create({
    src,
    width,
    height,
    class: `w-${width} h-${height}`,
  });

  const newParagraphNode = schema.nodes.paragraph.create({}, "");

  // Create a transaction to insert the image and the paragraph
  const transaction = state.tr
    .insert(position, imageNode)
    .insert(position + imageNode.nodeSize + 1, newParagraphNode);

  // Dispatch the transaction
  dispatch(transaction);
};

const EditorImageUploadMenu = ({
  editorView,
  imageUploadUrl,
  setIsLoadingUploading,
  setUploadProgress,
}: any) => {
  const token = getAuthToken();
  const boldButtonRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
     if (!file) {
    // Reset the input if canceled
    event.target.value = "";
    return;
  }

    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);

    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = async () => {
      const maxWidth = 1000; // Maximum width
      const maxHeight = 1000; // Maximum height

      let width = image.width;
      let height = image.height;

      // Maintain aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (width > height) {
          width = maxWidth;
          height = Math.round(maxWidth / aspectRatio);
        } else {
          height = maxHeight;
          width = Math.round(maxHeight * aspectRatio);
        }
      }
      await uploadImageToAPI(editorView, formData, width, height);
    };
  };

  const uploadImageToAPI = async (pmView: any, formData: any, width: any, height: any) => {
    setIsLoadingUploading(true);
    try {
      const response = await axios({
        method: "POST",
        url: imageUploadUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent: any) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); // Update the progress
        },
      });

      const imageUrl: any = response.data.data.url;
      const imageName: any = response.data.data.name;

      insertImage(pmView, imageUrl, width, height);

      setUploadProgress(0);
      setIsLoadingUploading(false);
      // setIsUploading(false);
      // if (refetch) refetch();
    } catch (error) {
      setIsLoadingUploading(false);
      // setIsUploading(false);
    }
  };

  return (
    <div className="">
      <div
        className="CUSTOM-ProseMirror-icon CUSTOM-note-menuitem"
        title="Insert image"
        ref={boldButtonRef}
        onClick={uploadImage}
      >
        {/* <SvgRenderer svgContent={boldIcon} /> */}
        <ImageIcon/>
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

const renderReactImageUploadComponent = (
  editorView: any,
  imageUploadUrl: any,
  setIsLoadingUploading: any,
  setUploadProgress: any
) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(
    <EditorImageUploadMenu
      editorView={editorView}
      imageUploadUrl={imageUploadUrl}
      setIsLoadingUploading={setIsLoadingUploading}
      setUploadProgress={setUploadProgress}
    />
  );
  return container;
};

export const customMenuItemImage = (
  imageUploadUrl: any,
  setIsLoadingUploading: any,
  setUploadProgress: any
) =>
  new MenuItem2({
    title: `Insert image`,
    run: () => {},
    select: (state: any) => {
      return true;
    },
    render: (editorView: any) =>
      renderReactImageUploadComponent(
        editorView,
        imageUploadUrl,
        setIsLoadingUploading,
        setUploadProgress
      ),
  });
