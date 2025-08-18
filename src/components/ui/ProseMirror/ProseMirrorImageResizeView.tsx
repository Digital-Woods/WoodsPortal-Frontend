import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import {NodeSelection} from "prosemirror-state"

const updateImageNodeAttributes = (node: any, view: any, getPos: any, attrs: any) => {
  if (node && node.type) {
    const { tr } = view.state;
    const pos = getPos();
    const newAttrs = { ...node.attrs, ...attrs };

    tr.setNodeMarkup(pos, null, newAttrs);
    view.dispatch(tr);
  }
};

const ProseMirrorImage = ({ node, view, getPos }: any) => {
  const imgResizeRef = useRef<any>(null);
  const [imageResize, setImageResize] = useState<any>(false);
  const width = Number(node.attrs.width);
  const height = Number(node.attrs.height);

  const [size, setSize] = useState<any>({ width: width, height: height });
  const aspectRatio = size.width / size.height;

  const handleResize = (e: any, corner: any) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const onMouseMove = (moveEvent: any) => {
      const deltaX = moveEvent.clientX - startX;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (corner === "bottom-right" || corner === "top-right") {
        newWidth = startWidth + deltaX;
        newHeight = newWidth / aspectRatio;
      } else if (corner === "bottom-left" || corner === "top-left") {
        newWidth = startWidth - deltaX;
        newHeight = newWidth / aspectRatio;
      }

      setSize({
        width: Math.max(50, newWidth),
        height: Math.max(50 / aspectRatio, newHeight),
      });
      updateImageNodeAttributes(node, view, getPos, {
        width: newWidth,
        height: newHeight,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleClickOutside = (event: any) => {
    if (imgResizeRef.current && !imgResizeRef.current.contains(event.target)) {
      setImageResize(false);
    }
  };

  useEffect(() => {
    if (imageResize) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imageResize]);

  const handleImageClick = (event: any) => {
    event.preventDefault(); // Prevent ProseMirror's default text selection
    setImageResize(true);

    // Create a NodeSelection to properly select the image node in ProseMirror
    const { state, dispatch } = view;
    const tr = state.tr.setSelection(NodeSelection.create(state.doc, getPos()));
    dispatch(tr);
    view.focus(); // Set focus on the editor to avoid text input issues
  };

  return (
    <div
      className={`relative inline-block border-2 cursor-pointer w-[${
        size?.width
      }] h-[${size?.height}] ${
        imageResize ? "border-[#00d0e4]" : "border-transparent"
      }`}
      // onClick={() => setImageResize(true)}
      // onMouseDown={handleImageClick}
      ref={imgResizeRef}
    >
      <img
        src={node.attrs.src}
        width={size?.width}
        height={size?.height}
        alt={`img-${1}`}
      />
      {/* {imageResize && (
        <React.Fragment>
          <div
            class="w-2 h-2 bg-[#00d0e4] absolute top-[-4px] left-[-4px] cursor-nwse-resize"
            onMouseDown={(e) => handleResize(e, "top-left")}
          ></div>
          <div
            class="w-2 h-2 bg-[#00d0e4] absolute top-[-4px] right-[-4px] cursor-nesw-resize"
            onMouseDown={(e) => handleResize(e, "top-right")}
          ></div>
          <div
            class="w-2 h-2 bg-[#00d0e4] absolute bottom-[-4px] left-[-4px] cursor-nesw-resize"
            onMouseDown={(e) => handleResize(e, "bottom-left")}
          ></div>
          <div
            class="w-2 h-2 bg-[#00d0e4] absolute bottom-[-4px] right-[-4px] cursor-nwse-resize"
            onMouseDown={(e) => handleResize(e, "bottom-right")}
          ></div>
        </React.Fragment>
      )} */}
    </div>
  );
};

export const ProseMirrorImageResizeView = () => {
  return (node: any, view: any, getPos: any) => {
    const dom = document.createElement("div");
    dom.className = "prosemirror-react-image";

    const applyAlignmentStyle = (node: any) => {
      const figureStyle = node.attrs?.style || "";
      if (figureStyle.includes("text-align: left;")) {
        dom.style.textAlign = "left";
      } else if (figureStyle.includes("text-align: center;")) {
        dom.style.textAlign = "center";
      } else if (figureStyle.includes("text-align: right;")) {
        dom.style.textAlign = "right";
      } else {
        dom.style.textAlign = "initial"; // Reset to default if alignment is removed
      }
    };

    applyAlignmentStyle(node); // Initial alignment check

    const root = createRoot(dom);

    root.render(
      <ProseMirrorImage node={node} view={view} getPos={getPos} />
    );

    return {
      dom,
      update(updatedNode: any) {
        if (updatedNode.type !== node.type) return false;

        // Reapply alignment when node is updated
        applyAlignmentStyle(updatedNode);

        root.render(
          <ProseMirrorImage node={updatedNode} view={view} getPos={getPos} />
        );
        return true;
      },
      destroy() {
        root.unmount();
      },
    };
  };
};
