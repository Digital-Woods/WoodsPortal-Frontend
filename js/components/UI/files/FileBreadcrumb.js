const FileBreadcrumb = ({ id, folderStack, onClick }) => (

  <nav className="text-xs">
    <ol className="flex flex-wrap">
      {folderStack && folderStack.length > 0 ? (
        folderStack.map((folder, index) => {
          if (folder && folder.name) {
            return (
              <li key={index} className="flex items-center">
                <span
                  className="text-primary dark:text-cleanWhite cursor-pointer"
                  onClick={() => onClick(index)}
                >
                  {folder.name != id ? folder.name : 'Home'}
                </span>
                {index < folderStack.length - 1 && (
                  <span className="mx-1 text-primary dark:text-cleanWhite">
                    <svg width="8" height="10" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 6.5L4 3.5L1 0.5" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </li>
            );
          } else {
            return (
              <li key={index} className="flex items-center">
                <span className="text-primary dark:text-cleanWhite cursor-default">No Folder</span>
                {index < folderStack.length - 1 && (
                  <span className="mx-1 text-primary dark:text-cleanWhite">
                    <svg width="8" height="10" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 6.5L4 3.5L1 0.5" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </li>
            );
          }
        })
      ) : (
        <li className="text-gray-500">Root</li>
      )}
    </ol>
  </nav>

);
