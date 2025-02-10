const fontState = Recoil.atom({
  key: "fontState",
  default: "Select",
});

const isLoadingUoloadingState = Recoil.atom({
  key: "isLoadingUoloadingState",
  default: false,
});

const uploadProgressState = Recoil.atom({
  key: "uploadProgressState",
  default: 0,
});

const attachmentsState = Recoil.atom({
  key: "attachmentsState",
  default: [],
});



function useEditor() {
  const [font, setFont] = Recoil.useRecoilState(fontState);
  const [isLoadingUoloading, setisLoadingUoloading] = Recoil.useRecoilState(isLoadingUoloadingState);
  const [uploadProgress, setUploadProgress] = Recoil.useRecoilState(uploadProgressState);
  const [uploadedAttachments, setUploadedAttachments] = Recoil.useRecoilState(attachmentsState);

  return {
    font,
    setFont,
    isLoadingUoloading,
    setisLoadingUoloading,
    uploadProgress,
    setUploadProgress,
    uploadedAttachments,
    setUploadedAttachments
  };
}
