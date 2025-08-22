import DOMPurify from "dompurify";

type SafeHtmlProps = { html: string };

export const HtmlParser = ({ html }: SafeHtmlProps) => {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true }, // strips scripts, event handlers, etc.
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
