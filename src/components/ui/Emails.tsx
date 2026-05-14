import { useState, useEffect, useRef } from 'react';
import { env } from "@/env";
import { useSync } from '@/state/use-sync';
import { getAuthSubscriptionType, getPortal } from '@/data/client/auth-utils';
import { useMutation, useQuery } from "@tanstack/react-query";
import { Client } from '@/data/client/index';
import { EmptyMessageCard } from '@/components/ui/EmptyMessageCard';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Chevron } from '@/assets/icons/Chevron';
import { IconPlus } from '@/assets/icons/IconPlus';
import { hubId, recorBtnCustom } from '@/data/hubSpotData';
import { ProseMirrorEditor } from '@/components/ui/ProseMirror/ProseMirrorEditor';
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
import { useToaster } from '@/state/use-toaster';
import { useAuth } from '@/state/use-auth';
import { useUpdateLink } from '@/utils/GenerateUrl';
import { isAuthenticateApp } from '@/data/client/token-store';
import { ViewEmail } from './ViewEmail';
import { useEditor } from '@/state/use-editor';

const getEmailBody = (email: any) => {
  return email?.hs_email_html || email?.hs_email_text || "";
};

const formatDateTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export const EmailCard = ({
  email,
  objectId,
  id,
  imageUploadUrl,
  attachmentUploadUrl,
  refetch,
  setToaster,
  permissions,
  makeParam,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditor, setIsOpenEditor] = useState(false);
  const [editorContent, setEditorContent] = useState(getEmailBody(email));
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);
  const { subscriptionType }: any = useAuth();
  const { isLoadingUploading }: any = useEditor();

  const { date, time } = formatDateTime(email.hs_timestamp || email.hs_createdate);

  let portalId: any;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  const updateEmailMutation = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async (newEmailBody: any) => {
      const params: any = makeParam();
      const mParams: any = {
        cache: !!params?.cache,
        isPrimaryCompany: params?.isPrimaryCompany,
        limit: params?.limit || 5,
      };

      if (subscriptionType === 'FREE') {
        mParams.after = params?.after || "";
      } else {
        mParams.limit = params?.limit || "";
        mParams.page = params?.page || "";
      }

      return await Client.emails.updateEmail({
        params: mParams,
        objectId: objectId,
        id: id,
        emailBody: newEmailBody?.emailBody ?? "",
        email_id: email.hs_object_id,
        portalId: portalId,
      });
    },
    onSuccess: (res: any) => {
      refetch();
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
  });

  const { isLoading: isLoadingUpdate } = updateEmailMutation;

  const handleUpdateEmail = () => {
    const payload: any = {
      emailBody: editorContent,
    };
    updateEmailMutation.mutate(payload);
  };

  return (
    <div className="mt-2">
      <div className="border bg-white dark:bg-dark-500 dark:border-gray-600 shadow-md rounded-md px-2 py-3 text-sm cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
          setIsOpenEditor(false);
        }}>
        <div className="flex items-center gap-2">
          <Chevron
            className={`transition-transform text-gray-500 ${isOpen ? "rotate-[270deg]" : "rotate-180"
              }`}
          />

          <div className="flex justify-between w-full flex-wrap gap-1">
            <p className="text-xs whitespace-wrap dark:text-white">
              <span className="font-semibold text-gray-500">Logged email - {email.hs_email_subject || "No subject"} </span>
              <span className="font-normal text-xs inline-block text-gray-500">by {email.hs_email_from_firstname} {email.hs_email_from_lastname} {email.hs_email_to_firstname || email.hs_email_to_lastname ? "to" : ""} {email.hs_email_to_firstname} {email.hs_email_to_lastname}</span>
            </p>

            <p className="text-xs text-gray-500 whitespace-nowrap">
              {date} {time}
            </p>
          </div>
        </div>

        {isOpenEditor && permissions?.update ? (
          <div className="cursor-text p-4" onClick={(e) => e.stopPropagation()}>
            <div className="CUSTOM-edit-note mt-2">
              <ProseMirrorEditor
                ref={editorRef}
                key={id}
                initialData={escapeHTML(getEmailBody(email))}
                attachments={email?.hs_attachment_ids || []}
                setEditorContent={setEditorContent}
                id={id}
                imageUploadUrl={imageUploadUrl}
                attachmentUploadUrl={`${attachmentUploadUrl}/${email?.hs_object_id}`}
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
                disabled={isLoadingUpdate || editorContent === "" || isUploading || isLoadingUploading}
                onClick={handleUpdateEmail}
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
            className={`p-4 ${!isOpen
              ? "relative line-clamp-3 h-[50px] overflow-hidden"
              : ""
              }`}
          >
            <div
              className={`bg-white rounded-md p-2 border ${isOpen && permissions?.update ? "cursor-text hover:bg-secondaryBgHover hover:border-secondary group relative" : ""}`}
              onClick={(e) => {
                if (isOpen && permissions?.update) {
                  e.stopPropagation();
                  setIsOpenEditor(true);
                }
              }}
            >
              <ViewEmail html={getEmailBody(email)} />
              {isOpen && permissions?.update ? (
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-secondary transition-opacity">
                  <EditIcon />
                </div>
              ) : null}
            </div>

            {isOpen && (
              <div onClick={(e) => e.stopPropagation()}>
                <Attachments
                  attachments={email?.hs_attachment_ids || []}
                  objectId={objectId}
                  id={id}
                  remove={false}
                />
              </div>
            )}

            {!isOpen && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-dark-500" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Emails = ({ tabName = '', item, objectId, id, permissions: mPermissions = null, emailCreateFor = null, title = "Emails" }: any) => {
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
  const [totalEmails, setTotalEmails] = useState(0);
  const { filterParams } = useUpdateLink();
  const [isFristTimeLoadData, setIsFristTimeLoadData] = useState<any>(true);
  const { isLoadingUploading }: any = useEditor();

  let portalId: any;
  if (env.VITE_DATA_SOURCE_SET != true) {
    portalId = getPortal()?.portalId;
  }

  useEffect(() => {
    setPagination([]);
  }, []);

  const VITE_PUBLIC_REST_API_ENDPOINT = window?.hubSpotData?.developerOption === true
    ? window?.hubSpotData?.developerOptionTempUrl
    : env.VITE_PUBLIC_REST_API_ENDPOINT ?? '';

  const limit = 10;
  const { data, error, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["emails-data", page, objectId, id],
    queryFn: async () => {
      const params: any = makeParam();
      return await Client.emails.all(params);
    },
    onSuccess: (response: any) => {
      const totalData = response && response?.data && response?.data?.total;
      setTotalEmails(totalData);
      setSync(false);
      setApiSync(false);
      setPermissions(response?.configurations?.email || response?.configurations?.note);
      setIsFristTimeLoadData(false);
    },
    onError: (err: any) => {
      setSync(false);
      setApiSync(false);
      console.error("Error fetching email details:", err);
    },
    refetchInterval: (sync || apiSync) ? env.VITE_NOTE_INTERVAL_TIME : false,
    enabled: !!objectId && !!id && isAuthenticateApp(),
  });

  const makeParam = () => {
    let params: any = {};
    const tab = filterParams("tabs.emails");
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

    return params;
  };

  useEffect(() => {
    if (sync || apiSync) {
      refetch();
    }
  }, [sync, apiSync]);

  const { mutate: handleSaveEmail, isLoading: isPosting } = useMutation({
    mutationKey: ["TableFormData"],
    mutationFn: async () => {
      const params: any = makeParam();
      const mParams: any = {
        cache: !!params?.cache,
        isPrimaryCompany: params?.isPrimaryCompany,
        limit: params?.limit || 5,
      };

      if (subscriptionType === 'FREE') {
        mParams.after = params?.after || "";
      } else {
        mParams.limit = params?.limit || "";
        mParams.page = params?.page || "";
      }

      return await Client.emails.createEmail({
        params: mParams,
        objectId: objectId,
        id: id,
        emailBody: editorContent,
        subject: getObjectName(),
        attachmentIds: Array.isArray(attachmentId)
          ? attachmentId.join(";")
          : attachmentId || "",
        portalId: portalId,
      });
    },
    onSuccess: (response: any) => {
      refetch();
      closeDialog();
      setToaster({
        message: response?.statusMsg,
        type: "success",
      });
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.errorMessage;
      setToaster({
        message: errorMessage,
        type: "error",
      });
      setAttachmentId('');
    },
  });

  useEffect(() => {
    const currentPortalId = getPortal()?.portalId;
    setImageUploadUrl(
      `${VITE_PUBLIC_REST_API_ENDPOINT}/api/${hubId}/${currentPortalId}/hubspot-object-emails/images/${objectId}/${id}`
    );
    setAttachmentUploadUrl(
      `${VITE_PUBLIC_REST_API_ENDPOINT}/api/${hubId}/${currentPortalId}/hubspot-object-emails/attachments/${objectId}/${id}`
    );
  }, []);

  useEffect(() => {
    setPage(getAuthSubscriptionType() === "FREE" ? "" : 1);
  }, [objectId, id]);

  const expandToggleButton = () => {
    setExpandDialog(!expandDialog);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setExpandDialog(false);
    setAttachmentId('');
  };

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

    return displayValue || emailCreateFor || me?.firstName || me?.email;
  };

  if (error && !id && objectId == '0-2' && tabName === 'home') {
    return (
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle />
        </span>
        Primary Company not found.
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle />
        </span>
        {error?.response?.data?.errorMessage}
      </div>
    );
  }

  const results = data && data.data && data.data.results;
  const numOfPages = Math.ceil(totalEmails / limit);

  if (isLoading || isFetching) {
    return <NoteSkeleton />;
  }

  return (
    <div className="border dark:border-none dark:bg-dark-300 md:p-4 p-2 rounded-lg bg-cleanWhite ">
      {permissions && permissions.create && (
        <div className="flex justify-end mb-6 items-center">
          <Button variant={!recorBtnCustom ? 'default' : 'create'} onClick={() => setShowDialog(true)}>
            <span className="mr-2">
              <IconPlus className="!w-3 !h-3" />
            </span>
            Create {title}
          </Button>
        </div>
      )}

      {results && results?.rows && results?.rows?.length > 0 ? (
        results?.rows?.map((email: any, index: any) => (
          <EmailCard
            key={index}
            email={email}
            objectId={objectId}
            id={id}
            imageUploadUrl={imageUploadUrl}
            attachmentUploadUrl={attachmentUploadUrl}
            refetch={refetch}
            setToaster={setToaster}
            permissions={permissions}
            makeParam={makeParam}
          />
        ))
      ) : (
        <EmptyMessageCard name="email" />
      )}

      {((subscriptionType === 'FREE') || (subscriptionType != 'FREE' && totalEmails > limit)) && (
        <Pagination
          apiResponse={data}
          numOfPages={numOfPages || 1}
          currentPage={page}
          setCurrentPage={setPage}
          tabName="tabs.emails"
        />
      )}

      <Dialog
        open={showDialog}
        onClose={closeDialog}
        className={`p-0 relative mx-auto bg-white dark:bg-white overflow-y-auto max-h-[95vh] ${
          expandDialog
            ? "lg:w-[calc(100vw-25vw)] md:w-[calc(100vw-5vw)] w-[calc(100vw-20px)]"
            : "lg:w-[830px] md:w-[720px] w-[calc(100vw-28px)] "
        } `}
      >
        <div className="sticky top-0 z-50">
          <div className="flex justify-between items-center bg-[#516f90] p-4 sticky top-0 z-50">
            <div className="text-lg font-semibold text-white dark:text-white mb-0">
              {title}
            </div>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                disabled={isPosting || isUploading}
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
                onClick={closeDialog}
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

        <div className="flex justify-end gap-3 sticky bottom-0 z-50 bg-white px-4 pb-4 pt-2">
          <Button
            disabled={isPosting || isUploading || isLoadingUploading}
            variant="outline"
            onClick={closeDialog}
            className="dark:!text-white"
          >
            Cancel
          </Button>
          <Button
            disabled={isPosting || editorContent.trim() === "" || isUploading || isLoadingUploading}
            onClick={handleSaveEmail}
            isLoading={isPosting}
          >
            Create {title}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
