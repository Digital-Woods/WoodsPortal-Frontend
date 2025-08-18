import { useAtom } from "jotai";
import { fontState, isLoadingUploadingState , uploadProgressState , attachmentsState , linkDataState  } from '@/state/store';

export function useEditor() {
  const [font, setFont] = useAtom(fontState);
  const [isLoadingUploading, setIsLoadingUploading] = useAtom(isLoadingUploadingState);
  const [uploadProgress, setUploadProgress] = useAtom(uploadProgressState);
  const [uploadedAttachments, setUploadedAttachments] = useAtom(attachmentsState);
  const [linkData, setLinkDataState] = useAtom(linkDataState);
  const [getLinkData] = useAtom(linkDataState);

  return {
    font,
    setFont,
    isLoadingUploading,
    setIsLoadingUploading,
    uploadProgress,
    setUploadProgress,
    uploadedAttachments,
    setUploadedAttachments,
    linkData,
    setLinkDataState,
    getLinkData
  };
}