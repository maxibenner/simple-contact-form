import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default async function Code({
  className,
  code,
  language,
}: {
  className?: string;
  code: string;
  language: string;
}) {
  return (
    <div className="[&_*]:text-[15px] [&_*]:!bg-primary [&>pre]:!m-0 [&>pre]:!p-8 overflow-hidden rounded-md">
      <SyntaxHighlighter language={language} style={materialDark}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
