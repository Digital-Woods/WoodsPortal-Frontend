import DOMPurify from "dompurify";
import { HtmlParser } from "@/components/HtmlParser";

export const ViewEmail = ({ html }: { html: string }) => {
  return (
    <HtmlParser
      html={DOMPurify.sanitize(html, { ADD_ATTR: ["target"] })}
      className="ProseMirror"
    />
  );
};
