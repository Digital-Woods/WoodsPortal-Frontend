const ProseMirrorLinkView = (mark, node, view, getPos) => {
  const dom = document.createElement("a");
  
  // Set the link attributes
  dom.setAttribute("href", mark.attrs.href);
  dom.setAttribute("title", mark.attrs.title || mark.attrs.href);
  dom.setAttribute("target", mark.attrs.target || "_blank");
  dom.setAttribute("rel", "noopener noreferrer");

  // Set the text content of the link
  dom.textContent = node.textContent;

  let isOpenLinkPopup = false;
  let linkPopupContainer = null;

  const closeLinkPopup = () => {
    if (linkPopupContainer) {
      document.body.removeChild(linkPopupContainer);
      linkPopupContainer = null;
    }
    isOpenLinkPopup = false;
  };

  const handleClickOutside = (event) => {
    // if (linkPopupContainer && !linkPopupContainer.contains(event.target)) {
    //   closeLinkPopup();
    // }

    if (
      (linkPopupContainer && linkPopupContainer.contains(event.target)) ||
      (dom && dom.contains(event.target)) // <- this disables outside click for the <a> tag
    ) {
      return; // Ignore click
    }
    closeLinkPopup();
  };

  dom.addEventListener("click", (event) => {
    let target = event.target.closest("a"); // Find the closest <a> element
    if (target) {
      event.preventDefault(); // Prevent default navigation

      // Close any existing popup if it's open
      if (isOpenLinkPopup && linkPopupContainer) {
        document.body.removeChild(linkPopupContainer);
        linkPopupContainer = null;
      }

      // Toggle popup visibility
      isOpenLinkPopup = !isOpenLinkPopup;

      // Add event listener to close popup when clicking outside
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      // If popup is opened, create and render the popup
      if (isOpenLinkPopup) {
        const randomId = Math.floor(Math.random() * 10000000) + 1;
        target.id = `main-${randomId}`;
        target.classList.add("relative", "inline-block");

        const href = target.getAttribute("href");
        const title = target.getAttribute("title") || target.textContent;
        const target_b = target.getAttribute("target");

        // Create the popup container and append to the document body
        linkPopupContainer = document.createElement("div");
        document.body.appendChild(linkPopupContainer);

        // Assuming ProseMirrorMenuInsertLinkPopUp is a valid React component, render it to the container
        ReactDOM.render(
          <ProseMirrorMenuInsertLinkPopUp
            randomId={randomId}
            editorView={view}
            href={href}
            title={title}
            target={target_b}
            closeLinkPopup={closeLinkPopup}
          />,
          linkPopupContainer
        );
      }
    }
  });

  return { dom };
};
