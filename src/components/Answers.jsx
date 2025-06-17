import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { checkHeading, replaceHeadingStarts } from "../helper";

const Answer = ({ ans, totalResult, index, type }) => {
  const [isHeading, setIsHeading] = useState(false);
  const [cleanAnswer, setCleanAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setIsHeading(true);
      setCleanAnswer(replaceHeadingStarts(ans));
    }
  }, [ans]);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="overflow-auto max-w-full">
          <SyntaxHighlighter
            {...props}
            language={match[1]}
            style={dark}
            wrapLongLines={true}
            customStyle={{
              borderRadius: '0.5rem',
              padding: '1rem',
              fontSize: '0.875rem',
              backgroundColor: '#1e1e1e'
            }}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          {...props}
          className="bg-gray-200 dark:bg-gray-800 text-red-600 dark:text-yellow-300 px-1 py-0.5 rounded text-sm"
        >
          {children}
        </code>
      );
    }
  };

  return (
    <div className={`flex ${type === 'q' ? 'justify-end' : 'justify-start'} my-2`}>
      <div
        className={`max-w-[80%] px-4  rounded-2xl  text-left 
          ${type === 'q'
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white self-end  mr-4 max-w-full shadow-md py-3'
            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-white self-start prose dark:prose-invert prose-sm max-w-full'
          }
        `}
      >
        {isHeading ? (
          <span className="text-base font-semibold">{cleanAnswer}</span>
        ) : (
          <ReactMarkdown
            components={renderer}
            remarkPlugins={[remarkGfm]}
          >
            {cleanAnswer}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default Answer;
