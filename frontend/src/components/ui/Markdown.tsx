import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn('prose prose-invert max-w-none', className)}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          const codeString = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return (
              <div className="relative group my-4">
                <div className="flex items-center justify-between bg-card-hover/50 px-4 py-2 rounded-t-xl border-b border-card-hover">
                  <span className="text-xs text-text-secondary font-mono">{language}</span>
                  <button
                    onClick={() => copyToClipboard(codeString)}
                    className="text-text-secondary hover:text-text transition-colors"
                  >
                    {copiedCode === codeString ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: '0.75rem',
                    borderBottomRightRadius: '0.75rem',
                  }}
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }

          return (
            <code
              className={cn(
                'bg-card-hover/50 px-1.5 py-0.5 rounded-lg text-sm font-mono',
                className
              )}
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return <p className="mb-4 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-text">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="text-2xl font-bold mb-4 text-text">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-xl font-bold mb-3 text-text">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-lg font-bold mb-2 text-text">{children}</h3>;
        },
        a({ children, href }) {
          return (
            <a
              href={href}
              className="text-primary hover:text-primary/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-text-secondary">
              {children}
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
