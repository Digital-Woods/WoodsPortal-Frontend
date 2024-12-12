const SvgRenderer = ({ svgContent }) => {
  // Clean the SVG string by removing JSX-specific syntax
  const cleanSvgContent = (svgString) => {
    // Remove {...props} or any unsupported JSX syntax
    return svgString.replace(/{.*?}/g, '');
  };

  // Convert the cleaned SVG string to a DOM element
  const parseSvg = (svgString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    return doc.documentElement; // Return the root <svg> element
  };

  // Parse the svgContent into a React component
  const renderSvg = () => {
    const cleanedContent = cleanSvgContent(svgContent);
    const svgElement = parseSvg(cleanedContent);

    return (
      <svg
        {...Array.from(svgElement.attributes).reduce((attrs, attr) => {
          attrs[attr.name] = attr.value;
          return attrs;
        }, {})}
      >
        {Array.from(svgElement.childNodes).map((node, index) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return React.createElement(
              node.tagName,
              {
                key: index,
                ...Array.from(node.attributes).reduce((attrs, attr) => {
                  attrs[attr.name] = attr.value;
                  return attrs;
                }, {}),
              },
              node.textContent
            );
          }
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.trim() ? node.textContent : null;
          }
          return null;
        })}
      </svg>
    );
  };

  return <div>{renderSvg()}</div>;
};