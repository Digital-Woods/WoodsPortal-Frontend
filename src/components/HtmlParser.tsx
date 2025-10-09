import DOMPurify from "dompurify";

type SafeHtmlProps = { html: string };

export const HtmlParser = ({ html }: SafeHtmlProps) => {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }, 
    ADD_ATTR: ['target'],
  }
);
  return <div className="ProseMirror" dangerouslySetInnerHTML={{ __html: clean }} />;
}
