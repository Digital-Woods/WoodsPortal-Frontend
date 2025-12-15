import { useState, useEffect, useRef } from 'react';
import { env } from "@/env";
import { useSync } from '@/state/use-sync';
import { getAuthSubscriptionType, getPortal } from '@/data/client/auth-utils';
import { useMutation, useQuery } from "@tanstack/react-query";
import { Client } from '@/data/client/index'
import { EmptyMessageCard } from '@/components/ui/EmptyMessageCard'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { Chevron } from '@/assets/icons/Chevron'
import { IconPlus } from '@/assets/icons/IconPlus'
import { hubId, moduleStylesOptions, recorBtnCustom } from '@/data/hubSpotData'
import { ProseMirrorEditor } from '@/components/ui/ProseMirror/ProseMirrorEditor'
import { escapeHTML, isObject } from '@/utils/DataMigration';
import { CautionCircle } from '@/assets/icons/CautionCircle';
import { CloseIcon } from '@/assets/icons/closeIcon';
import { EditIcon } from '@/assets/icons/editIcon';
import { ExpandIcon } from '@/assets/icons/ExpandIcon';
import { ShrinkIcon } from '@/assets/icons/ShrinkIcon';
import { useMe } from '@/data/user';
import { Attachments } from './Attachments';
import { Dialog } from './Dialog';
import { NoteSkeleton } from './skeletons/NoteSkeleton';
import { HtmlParser } from '@/components/HtmlParser';
import DOMPurify from 'dompurify';
import { useToaster } from '@/state/use-toaster';
import { QueryClient } from "@tanstack/react-query";
import { useAuth } from '@/state/use-auth';
import { useUpdateLink } from '@/utils/GenerateUrl';
import { useEditor } from '@/state/use-editor';
import { isAuthenticateApp } from '@/data/client/token-store';


const NoteCard = ({
  note,
  objectId,
  id,
  imageUploadUrl,
  attachmentUploadUrl,
  refetch,
  setToaster,
  permissions,
}: any) => {
  // const { sync, setSync } = useSync();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [editorContent, setEditorContent] = useState(note.hs_note_body);
  const [isUploading, setIsUploading] = useState(false);
  const noteStyle = moduleStylesOptions.noteStyle;
  const editorRef = useRef(null);

  const {
    isLoadingUploading,
  }: any = useEditor();

  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  const formatTime = (timestamp: any) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const OpenIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
  );

  const openEditor = () => {};

  let portalId: any;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const updateNoteMutation = useMutation(
    async (newNote) => {
      return await Client.notes.updateNote({
        objectId: objectId,
        id: id,
        note: newNote,
        note_id: note.hs_object_id,
        portalId: portalId,
      });
    },

    {
      onSuccess: (res: any) => {
        const queryClient = new QueryClient();

        queryClient.invalidateQueries(["data"]);
        refetch();
        // setSync(true);
        setToaster({
          message: res?.statusMsg,
          type: "success",
        });
        setIsOpenEditor(false);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.errorMessage;
        setToaster({
          message: errorMessage,
          type: "error",
        });
      },
    }
  );
  const { isLoading: isLoadingUpdate } = updateNoteMutation;
  const handleUpdateNote = () => {
    const payload: any = {
      noteBody: editorContent,
    };
    updateNoteMutation.mutate(payload);
  };

  const noteViewConfig = {
    ADD_ATTR: ['target'],
    // ALLOWED_ATTR: ["style", "src", "width", "height", "alt"],
    // ALLOWED_TAGS: ["p", "a", "figure", "img", "br"],
    // ALLOW_DATA_ATTR: true, // If data attributes are required
    // KEEP_CONTENT: true // Keep empty tags
  };

  return (
    <div key={note.hs_object_id} className="mt-2">
      <div
        className={`border ${note?.createdBy === 'Hubspot' ? `bg-[var(--note-hs-bg)] dark:bg-dark-300 dark:border-gray-700  ` : `bg-[var(--note-wp-bg)] dark:bg-dark-500 dark:border-gray-600` } shadow-md rounded-md mt-1 p-2 dark:text-white text-sm cursor-pointer`}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsOpenEditor(false);
        }}
      >
        <div>
          <div className="flex items-center gap-2">
            <div className={`${note?.createdBy === 'Hubspot' ? `text-[var(--note-hs-text)]` : `text-[var(--note-wp-text)]` } dark:text-white`}>
              {isOpen ? (
                <Chevron className="rotate-[270deg] origin-center -webkit-transform" />
              ) : (
                <Chevron className="rotate-180 origin-center -webkit-transform" />
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <p className={`text-sm font-semibold  whitespace-nowrap ${note?.createdBy === 'Hubspot' ? `text-[var(--note-hs-text)]` : `text-[var(--note-wp-text)]` } dark:text-white`}>Note
                {note?.createdByName || note?.createdByEmail ? (
                    <span className={`${note?.createdBy === 'Hubspot' ? `text-[var(--note-hs-text)]` : `text-[var(--note-wp-text)]`} dark:text-white font-normal ml-1 inline-block text-xs`}>
                        by <span className=" border rounded-full px-2 py-1 text-xs ml-2 font-normal inline-block">{note?.createdByName || note?.createdByEmail}</span>
                    </span>
                ) : null}
              </p>
              <div>
                <p className={`${note?.createdBy === 'Hubspot' ? `text-[var(--note-hs-text)]` : `text-[var(--note-wp-text)]` } dark:text-white text-xs`}>
                  <span className="mr-1">
                    {" "}
                    {formatDate(note?.hs_createdate)}{" "}
                  </span>
                  {formatTime(note?.hs_createdate)}
                </p>
              </div>
            </div>
          </div>
          {isOpenEditor && permissions && permissions.update ? (
            <div
              className={`p-4 cursor-text`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`CUSTOM-edit-note`}>
              <ProseMirrorEditor
                ref={editorRef}
                key={id}
                initialData={escapeHTML(note?.hs_note_body)}
                attachments={note?.hs_attachment_ids || []}
                setEditorContent={setEditorContent}
                // id={`editor-${note.hs_object_id}`}
                id={id}
                imageUploadUrl={imageUploadUrl}
                attachmentUploadUrl={`${attachmentUploadUrl}/${note?.hs_object_id}`}
                attachmentUploadMethod={"PUT"}
                setAttachmentId={null}
                refetch={refetch}
                objectId={objectId}
                setIsUploading={setIsUploading}
                isLoading={isLoadingUpdate}
              />
              </div>
              <div className="flex gap-x-2 mt-2">
                <Button
                  disabled={
                    isLoadingUpdate || editorContent === "" || isUploading || isLoadingUploading
                  }
                  onClick={handleUpdateNote}
                  className="text-white"
                  size="sm"
                  isLoading={isLoadingUpdate}
                >
                  Save
                </Button>
                <Button
                  disabled={isLoadingUpdate || isUploading || isLoadingUploading}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsOpenEditor(false);
                    setIsOpen(!isOpen);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`text-black ${
                !isOpen
                  ? "relative line-clamp-3 h-[50px] overflow-hidden"
                  : "" }
              `}
            >
              <div
                className={`py-3 pr-3 pl-6 ${
                  !isOpen
                    ? "rounded-md dark:bg-white mt-2"
                    : `${
                        permissions?.update && note?.createdBy != 'Hubspot' ? "cursor-text hover:bg-secondaryBgHover hover:border-secondary" : "cursor-auto"
                      } bg-white mt-2 border border-[transparent] dark:border-[transparent] rounded-md relative group EditorView`}`}
                onClick={(e) => {
                  if (isOpen && note?.createdBy != 'Hubspot') {
                    e.stopPropagation();
                    setIsOpenEditor(true);
                    openEditor();
                  }
                }}
              >
                <div className="break-words">
                  <span>
                    <HtmlParser html={DOMPurify.sanitize(note?.hs_note_body, noteViewConfig)} className="ProseMirror" />
                  </span>
                </div>
                {permissions?.update === true && note?.createdBy != 'Hubspot' ? (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-secondary transition-opacity">
                    <EditIcon />
                  </div>
                ) : null}
              </div>
              {isOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Attachments
                    attachments={note?.hs_attachment_ids || []}
                    objectId={objectId}
                    id={id}
                    remove={false}
                  />
                </div>
              )}
              <div
                className={`${
                  !isOpen
                    ? ` ${note?.createdBy === 'Hubspot' ? `from-[var(--note-hs-bg)]` : `from-[var(--note-wp-bg)]` } bg-gradient-to-t dark:from-dark-500 to-transparent h-8 absolute bottom-0 right-0 left-0`
                    : ""
                }`}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Notes = ({tabName='', item, path, objectId, id, permissions: mPermissions = null }: any) => {
  const [permissions, setPermissions] = useState(mPermissions);
  const [showDialog, setShowDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { me } = useMe();
  const [editorContent, setEditorContent] = useState("");
  const [imageUploadUrl, setImageUploadUrl] = useState("");
  const [attachmentUploadUrl, setAttachmentUploadUrl] = useState("");
  const [page, setPage] = useState(getAuthSubscriptionType() === "FREE" ? ' ' : 1);
  const { setToaster } = useToaster();
  const [attachmentId, setAttachmentId] = useState("");
  const { sync, setSync, apiSync, setApiSync } = useSync();
  const [expandDialog, setExpandDialog] = useState(false);
  const { setPagination, subscriptionType }: any = useAuth();
  const [totalNotes, setTotalNotes] = useState(0);
  const {updateLink, filterParams} = useUpdateLink();
  const [isFristTimeLoadData, setIsFristTimeLoadData] = useState<any>(true);

  const {
    isLoadingUploading,
  }: any = useEditor();

  let portalId: any;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  useEffect(() => {
    setPagination([])
  }, []);

  const limit = 10;
  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["data", page, objectId, id],
    queryFn: async () => {
      let params: any = makeParam()

      return await Client.notes.all(params)
    },
    onSuccess: (data: any) => {
      // setPermissions(data.configurations.note);
      const totalData = data && data?.data && data?.data?.total
      setTotalNotes(totalData)
      setSync(false);
      setApiSync(false);
      setPermissions(data?.configurations?.note)
    },
    onError: (error: any) => {
      setSync(false);
      setApiSync(false);
      console.error("Error fetching file details:", error);
    },
    refetchInterval: (sync || apiSync) ? env.VITE_NOTE_INTERVAL_TIME : false,
    enabled: !!objectId && !!id && isAuthenticateApp(), 
  });

  const makeParam = () => {
    let params: any = {};
    const tab =  filterParams("tabs.notes")
    const baseParams: any = {
      objectId: objectId,
      id: id,
      portalId: portalId,
      cache: (sync || apiSync) ? false : true,
      isPrimaryCompany: tab?.isPrimaryCompany ? true : false,
    };

    if (subscriptionType === "FREE") {
      params = {
        ...baseParams,
        ...({ after: isFristTimeLoadData && tab?.page ? tab?.page : page }),
      };
    } else {
      params = {
        ...baseParams,
        ...({
          limit: limit,
          page: isFristTimeLoadData && tab?.page ? tab?.page : page,
        }),
      };
    }
    return params
  }
  useEffect(() => {
    if (sync || apiSync) refetch();
  }, [sync, apiSync]);


  const { mutate: handleSaveNote, isLoading: isPosting } = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async () => {
      let params: any = makeParam()
      return await Client.notes.createnote({
        params: {
          limit: params?.limit,
          page: params?.page,
          cache: !!params?.cache
        },
        objectId: objectId,
        id: id,
        noteBody: editorContent,
        attachmentId: attachmentId,
        portalId: portalId,
      });
    },

    onSuccess: (response: any) => {
      // setApiSync(true);
      refetch();
      setShowDialog(false);
      setToaster({
        message: response?.statusMsg,
        type: "success",
      });
      setExpandDialog(false);
      setAttachmentId('');
      setIsFristTimeLoadData(false)
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.errorMessage;
      setToaster({
        message: errorMessage,
        type: "error",
      });
      setAttachmentId('');
    },
  });

  const expandToggleButton = () => {
    setExpandDialog(!expandDialog);
  };

  useEffect(() => {
    const portalId = getPortal()?.portalId;
    setImageUploadUrl(
      `${env.VITE_PUBLIC_REST_API_ENDPOINT}/api/${hubId}/${portalId}/hubspot-object-notes/images/${objectId}/${id}`
    );
    setAttachmentUploadUrl(
      `${env.VITE_PUBLIC_REST_API_ENDPOINT}/api/${hubId}/${portalId}/hubspot-object-notes/attachments/${objectId}/${id}`
    );
  }, []);
  
  useEffect(() => {
    setPage(getAuthSubscriptionType() === "FREE" ? " " : 1);
    refetch(); // 👈 will now use new objectId and id because of queryKey
  }, [objectId, id]);

  useEffect(() => {
    // refetch();
    setPage(getAuthSubscriptionType() === "FREE" ? ' ' : 1);
  }, []);


  if(error && !id && objectId == '0-2' && tabName === 'home' ){
    return( 
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle/>
        </span>
        Primary Company not found.
      </div>
    )
  }

  if (error) {
        return( 
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle/>
        </span>
        {error?.response?.data?.errorMessage}
      </div>
    )
  }
  
  const results = data && data.data && data.data.results;
  // const totalNotes = data && data.data && data.data.total;
  const numOfPages = Math.ceil(totalNotes / limit);

  if (isLoading || isFetching) {
    return <NoteSkeleton />;
  }

  const getObjectName = () => {
    let displayValue = "";

    if (item) {
      for (const key of Object.keys(item)) {
        const valueObject = item[key];
        if (
          valueObject &&
          valueObject?.isPrimaryDisplayProperty &&
          valueObject?.value
        ) {
          displayValue = isObject(valueObject?.value)
            ? valueObject?.value.label
            : valueObject?.value;
        }
      }
    }
    return displayValue || me?.firstName;
  };

  return (
    <div className="border dark:border-none dark:bg-dark-300 md:p-4 p-2 rounded-lg bg-cleanWhite ">
      {permissions && permissions.create && (
        <div className="flex justify-end mb-6 items-center">
          <Button variant={!recorBtnCustom ? 'default' : 'create'} onClick={() => setShowDialog(true)}>
            <span className="mr-2">
              {" "}
              <IconPlus className="!w-3 !h-3" />{" "}
            </span>{" "}
            Create Note
          </Button>
        </div>
      )}
      {results && results?.rows && results?.rows?.length > 0 ? (
        results?.rows?.map((note: any, index: any) => (
          <NoteCard
            key={index}
            note={note}
            objectId={objectId}
            id={id}
            imageUploadUrl={imageUploadUrl}
            attachmentUploadUrl={attachmentUploadUrl}
            refetch={refetch}
            setToaster={setToaster}
            permissions={permissions}
          />
        ))
      ) : (
        <EmptyMessageCard name="note" />
      )}

      {((subscriptionType === 'FREE') || (subscriptionType != 'FREE' && totalNotes > limit)) && (
        <Pagination
          apiResponse={data}
          numOfPages={numOfPages || 1}
          currentPage={page}
          setCurrentPage={setPage}
          tabName="tabs.notes"
        />
      )}
      <Dialog
        open={showDialog}
        onClose={setShowDialog}
        className={`p-0 relative mx-auto bg-white dark:bg-white overflow-y-auto max-h-[95vh] ${
          expandDialog
            ? "lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]"
            : "lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] "
        } `}
      >
      <div className="sticky top-0 z-50">
         <div className="flex justify-between items-center bg-[#516f90] p-4 sticky top-0 z-50">
          <div className="text-lg font-semibold text-white dark:text-white mb-0">
            Note
          </div>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              disabled={isPosting || isUploading}
              variant="outline"
              onClick={expandToggleButton}
              className="text-white dark:text-white cursor-pointer"
            >
              {expandDialog ? (
                <div title="Shrink window">
                  <ShrinkIcon width="22px" height="22px" />
                </div>
              ) : (
                <div title="Make window expand">
                  <ExpandIcon width="22px" height="22px" />
                </div>
              )}
            </button>
            <button
              disabled={isPosting || isUploading}
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="text-white dark:text-white"
            >
              <CloseIcon width="24px" height="24px" />
            </button>
          </div>
        </div>
        <div className="flex items-center px-4 bg-white py-4 gap-2">
            <p className="text-gray-600 dark:!text-gray-600 text-xs">For</p>
            <p className="border rounded-full px-2 py-1 text-xs ml-2 dark:!text-gray-600">
              {getObjectName()}
            </p>
          </div>
        </div>
        <div className="px-4 CUSTOM-modal-editor">
          <ProseMirrorEditor
            id={objectId}
            attachments={[]}
            setEditorContent={setEditorContent}
            imageUploadUrl={imageUploadUrl}
            attachmentUploadUrl={attachmentUploadUrl}
            attachmentUploadMethod={"POST"}
            setAttachmentId={setAttachmentId}
            refetch={refetch}
            objectId={objectId}
            setIsUploading={setIsUploading}
            isLoading={isPosting}
          />
        </div>
          <div className="flex justify-end gap-3 darkbg-[#516f90] sticky bottom-0 z-50 bg-white px-4 pb-4 pt-2">
            <Button
              disabled={isPosting || isUploading || isLoadingUploading}
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setExpandDialog(false);
                setAttachmentId('');
              }}
              className={`dark:!text-white`}
            >
              Cancel
            </Button>
            <Button
              disabled={isPosting || editorContent.trim() === "" || isUploading || isLoadingUploading}
              onClick={handleSaveNote}
              isLoading={isPosting}
            >
              Create Note
            </Button>
          </div>
      </Dialog>
    </div>
  );
};
