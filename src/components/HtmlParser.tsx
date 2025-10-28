import DOMPurify from "dompurify";

type SafeHtmlProps = {
  html: string;
  className?: string;
};

export const HtmlParser = ({ html, className }: SafeHtmlProps) => {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target"],
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
};
