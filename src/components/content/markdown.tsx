import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { CodeBlock } from "@/components/code/code-block";
import { cn } from "@/lib/utils";

/** Markdown for lesson text and AI answers. R code fences become runnable code blocks. */
export function Markdown({ children, className, runnableCode = true, workspace }: { children: string; className?: string; runnableCode?: boolean; workspace?: string }) {
  return (
    <div className={cn("prose-ra", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) =>
            href?.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noreferrer noopener">
                {children}
              </a>
            ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className: cls, children }) => {
            const text = String(children ?? "");
            const lang = /language-(\w+)/.exec(cls ?? "")?.[1];
            const isBlock = Boolean(lang) || text.includes("\n");
            if (!isBlock) return <code>{children}</code>;
            const isR = !lang || lang.toLowerCase() === "r";
            return <CodeBlock code={text.replace(/\n$/, "")} runnable={isR && runnableCode} label={isR ? "R" : lang} workspace={workspace} />;
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
