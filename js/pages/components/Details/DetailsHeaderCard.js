const DetailsHeaderCard = ({
  bgImageClass,
  date,
  serviceName,
  following,
  path,
  item,
}) => {
  const getHeaderCardProps = (item) => {
    let displayValue = "";
    let displayValue2 = "";

    if (item) {
      for (const key of Object.keys(item)) {
        const valueObject = item[key];
        if (
          valueObject &&
          valueObject.isPrimaryDisplayProperty &&
          valueObject.value
        ) {
          displayValue = isObject(valueObject.value) ? valueObject.value.label : valueObject.value;
        }
        if (
          valueObject &&
          valueObject.isSecondaryDisplayProperty &&
          valueObject.value
        ) {
          displayValue2 = isObject(valueObject.value) ? valueObject.value.label : valueObject.value;
        }
      }
    }

    return {
      showDate: false,
      showFollowing: false,
      showServiceName: false,
      clarifierName: displayValue,
      displayValueSecondary: displayValue2,
    };
  };

  const { showDate, showFollowing, showServiceName, clarifierName, displayValueSecondary } =
    getHeaderCardProps(item);

  return (
    <div
      className={`relative h-36 rounded-lg w-full flex items-center justify-between overflow-hidden bg-custom-gradient`}
    >
      <div className="relative flex flex-col justify-center px-4 text-detailsBannerTextColor z-10">
        <p className="text-xs font-normal text-detailsBannerTextColor line-clamp-2">{displayValueSecondary}</p>
        <p className="text-2xl font-semibold mt-1">{clarifierName}</p>
        {showDate && <p className="text-xs text-detailsBannerTextColor mt-1">{date}</p>}

        {showServiceName && (
          <span className="bg-sidelayoutColor w-fit px-3 py-1 rounded-md mt-2">
            <p className="text-xs">{serviceName}</p>
          </span>
        )}
      </div>
      {/* <div className="relative flex gap-3 mb-10 px-4 z-10">
        {showFollowing && (
          <span className="flex gap-x-4 dark:bg-dark-300 dark:text-white bg-cleanWhite text-gray-400 rounded-md px-4 py-2 font-medium text-sm">
            {following}
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="23px"
                viewBox="0 -960 960 960"
                width="20px"
                className="dark:fill-white fill-black"
              >
                <path d="M718-452v-84h-84v-32h84v-84h32v84h84v32h-84v84h-32Zm-334-52.62q-43.5 0-73.75-30.25T280-608.62q0-43.5 30.25-73.75T384-712.62q43.5 0 73.75 30.25T488-608.62q0 43.5-30.25 73.75T384-504.62ZM136-247.38v-45.85q0-16.55 9.42-31.24 9.43-14.68 26.81-24.61 49.62-28.15 103.31-43.23 53.69-15.07 108.46-15.07 54.77 0 108.46 15.07 53.69 15.08 103.31 43.23 17.38 9.93 26.81 24.61 9.42 14.69 9.42 31.24v45.85H136Zm32-32h432v-13.85q0-8.78-6.1-16.77-6.1-7.98-17.21-14-42.38-23.92-91.83-37.65-49.45-13.73-100.86-13.73t-100.86 13.73q-49.45 13.73-91.83 37.65-11.11 6.02-17.21 14-6.1 7.99-6.1 16.77v13.85Zm216.21-257.24q29.79 0 50.79-21.21t21-51q0-29.79-21.21-50.79t-51-21q-29.79 0-50.79 21.22-21 21.21-21 51 0 29.78 21.21 50.78t51 21Zm-.21-73Zm0 330.24Z" />
              </svg>
            </span>
          </span>
        )}

        <span className="bg-cleanWhite dark:bg-dark-300 rounded-md p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            className="dark:fill-white fill-black"
          >
            <path d="M216-216h44.46l393.46-393.46-44.46-44.46L216-260.46V-216Zm-52 52v-118.38l497.62-498.39q8.07-8.24 17.37-11.73 9.3-3.5 19.49-3.5 10.2 0 19.47 3.27 9.28 3.27 17.97 11.58l44.85 44.46q8.31 8.69 11.77 18 3.46 9.31 3.46 19.17 0 10.51-3.64 20.06-3.65 9.55-11.59 17.46L282.38-164H164Zm580.38-535.15-45.23-45.23 45.23 45.23ZM631.3-631.3l-21.84-22.62 44.46 44.46-22.62-21.84Z" />
          </svg>
        </span>

        <span className="bg-cleanWhite dark:bg-dark-300 rounded-md p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            className="fill-red-600"
          >
            <path d="M324.31-164q-26.62 0-45.47-18.84Q260-201.69 260-228.31V-696h-48v-52h172v-43.38h192V-748h172v52h-48v467.26q0 27.74-18.65 46.24Q662.7-164 635.69-164H324.31ZM648-696H312v467.69q0 5.39 3.46 8.85t8.85 3.46h311.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-696ZM400.16-288h51.99v-336h-51.99v336Zm107.69 0h51.99v-336h-51.99v336ZM312-696v480-480Z" />
          </svg>
        </span>
      </div> */}
    </div>
  );
};
