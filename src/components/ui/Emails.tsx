import { useState, useEffect } from 'react';
import { env } from "@/env";
import { useSync } from '@/state/use-sync';
import { getAuthSubscriptionType, getPortal } from '@/data/client/auth-utils';
import { useQuery } from "@tanstack/react-query";
import { Client } from '@/data/client/index'
import { EmptyMessageCard } from '@/components/ui/EmptyMessageCard'
import { Pagination } from '@/components/ui/Pagination'
import { Chevron } from '@/assets/icons/Chevron'
import { CautionCircle } from '@/assets/icons/CautionCircle';
import { NoteSkeleton } from './skeletons/NoteSkeleton';
import { useAuth } from '@/state/use-auth';
import { isAuthenticateApp } from '@/data/client/token-store';
import { ViewEmail } from './ViewEmail';
import { useUpdateLink } from '@/utils/GenerateUrl';
import { Attachments } from './Attachments';

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

export const EmailCard = ({ email, objectId, id }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { date, time } = formatDateTime(email.hs_timestamp);

  return (
    <div className="mt-2">
      <div
        className="border bg-white dark:bg-dark-500 dark:border-gray-600 shadow-md rounded-md px-2 py-3 text-sm cursor-pointer">
        {/* Header */}
        <div className="flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}>
          <Chevron
            className={`transition-transform text-gray-500 ${isOpen ? "rotate-[270deg]" : "rotate-180"
              }`}
          />

          <div className="flex justify-between w-full flex-wrap gap-1">
            <p className={`text-xs whitespace-wrap dark:text-white`}>
              <span className='font-semibold text-gray-500'>Email - {email.hs_email_subject || "No subject"} </span> <span className="font-normal text-xs inline-block text-gray-500">from {email.hs_email_from_firstname} {email.hs_email_from_lastname} {email.hs_email_to_firstname || email.hs_email_to_lastname ? "to" : ""} {email.hs_email_to_firstname} {email.hs_email_to_lastname}</span>
            </p>

            <p className="text-xs text-gray-500 whitespace-nowrap">
              {date} {time}
            </p>
          </div>
        </div>

        {/* Email Body */}
        <div
          className={`p-4 ${!isOpen
            ? "relative line-clamp-3 h-[50px] overflow-hidden"
            : ""
            }`}
        >
          <div className="bg-white rounded-md p-2 border">
            <ViewEmail html={email.hs_email_html || email.hs_email_text || ""} />
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
      </div>
    </div>
  );
};

export const Emails = ({ tabName = '', objectId, id }: any) => {
  const [page, setPage] = useState(getAuthSubscriptionType() === "FREE" ? ' ' : 1);
  const { sync, setSync, apiSync, setApiSync } = useSync();
  const { setPagination, subscriptionType }: any = useAuth();
  const [totalEmails, setTotalEmails] = useState(0);
  const [isFristTimeLoadData, setIsFristTimeLoadData] = useState<any>(true);
  const {filterParams} = useUpdateLink();

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

      return await Client.emails.all(params)
    },
    onSuccess: (data: any) => {
      const totalData = data && data?.data && data?.data?.total
      setTotalEmails(totalData)
      setSync(false);
      setApiSync(false);
      setIsFristTimeLoadData(false)
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
    const tab = filterParams("tabs.emails")
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

  useEffect(() => {
    setPage(getAuthSubscriptionType() === "FREE" ? "" : 1);
  }, [objectId, id]);

  if (error && !id && objectId == '0-2' && tabName === 'home') {
    return (
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle />
        </span>
        Primary Company not found.
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center text-center p-4 min-h-[300px] max-h-[400px]  justify-center gap-4">
        <span className="text-yellow-600">
          <CautionCircle />
        </span>
        {error?.response?.data?.errorMessage}
      </div>
    )
  }

  const results = data && data.data && data.data.results;
  // const totalEmails = data && data.data && data.data.total;
  const numOfPages = Math.ceil(totalEmails / limit);

  if (isLoading || isFetching) {
    return <NoteSkeleton />;
  }

  return (
    <div className="border dark:border-none dark:bg-dark-300 md:p-4 p-2 rounded-lg bg-cleanWhite ">
      {results && results?.rows && results?.rows?.length > 0 ? (
        results?.rows?.map((email: any, index: any) => (
          <EmailCard
            key={index}
            email={email}
            objectId={objectId}
            id={id}
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
    </div>
  );
};
