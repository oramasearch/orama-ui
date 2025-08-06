import { AnyObject, Interaction } from "@orama/core";
import React, {
  ComponentPropsWithRef,
  JSX,
  ReactNode,
  useEffect,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Highlight, {
  defaultProps,
  Language,
  PrismTheme,
} from "prism-react-renderer";
import theme from "prism-react-renderer/themes/vsDark";
import { useChat, useClipboard, useLastInteractionMinHeight } from "../hooks";
import { useChatContext, useChatDispatch } from "../contexts";

export interface ChatInteractionsWrapperProps
  extends Omit<ComponentPropsWithRef<"div">, "children"> {
  children: (
    interaction: Interaction,
    index?: number,
    totalInteractions?: number,
  ) => ReactNode;
  className?: string;
  "aria-label"?: string;
  onNewInteraction?: (interaction: Interaction) => void;
  onStreaming?: (interaction: Interaction) => void;
  beforeInteractions?: React.ReactNode;
}

export interface UserPromptProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface AssistantMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  markdownClassnames?: Partial<Record<keyof JSX.IntrinsicElements, string>>;
  theme?: PrismTheme;
}

export interface UserActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface SourcesProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  interaction: Interaction;
  children: (document: AnyObject, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
}

export interface ScrollToBottomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const ChatInteractionsWrapper: React.FC<ChatInteractionsWrapperProps> = ({
  children,
  className = "",
  onNewInteraction,
  onStreaming,
  beforeInteractions,
  ...rest
}) => {
  const { interactions } = useChatContext();
  const [lastInteraction, setLastInteraction] = useState<number | undefined>(
    undefined,
  );
  const { containerRef, minHeight } = useLastInteractionMinHeight(
    interactions?.length ?? 0,
  );

  useEffect(() => {
    if (interactions && interactions.length > 0) {
      setLastInteraction(interactions.length - 1);
    } else {
      setLastInteraction(undefined);
    }
  }, [interactions, interactions?.length]);

  useEffect(() => {
    if (
      typeof lastInteraction === "number" &&
      interactions &&
      interactions[lastInteraction]
    ) {
      onNewInteraction?.(interactions[lastInteraction]!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastInteraction]);

  useEffect(() => {
    if (interactions && interactions.length > 0) {
      const last = interactions[interactions.length - 1];
      if (last?.response && last.loading) {
        onStreaming?.(last);
      }
    }
  }, [interactions, onStreaming]);

  const hasInteractions = interactions && interactions.length > 0;

  if (!hasInteractions && !beforeInteractions) return null;

  return (
    <div
      className={className}
      ref={containerRef}
      {...rest}
      style={{ height: "100%" }}
    >
      {beforeInteractions}
      {interactions?.map((interaction, index) => {
        if (!interaction) return null;

        const isLast = index === lastInteraction;

        return (
          <div
            key={interaction.id}
            style={{
              minHeight: isLast ? `${minHeight}px` : 0,
            }}
          >
            {children(interaction, index, lastInteraction)}
          </div>
        );
      })}
    </div>
  );
};

const UserPrompt: React.FC<UserPromptProps> = ({
  children,
  className = "",
  "aria-label": ariaLabel = "User message",
  ...rest
}) => (
  <div className={className} aria-label={ariaLabel} {...rest}>
    {children}
  </div>
);

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  children,
  theme: customTheme,
  markdownClassnames = {},
  className = "",
  ...rest
}) => {
  if (!children) {
    return null;
  }

  const currentTheme = customTheme || theme;

  return (
    <div className={className} {...rest}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            if (!match) {
              return (
                <code className={markdownClassnames.code || ""} {...props}>
                  {children}
                </code>
              );
            }

            const language = match[1];

            return (
              <div className={markdownClassnames.div || ""}>
                <Highlight
                  {...defaultProps}
                  code={String(children).trim()}
                  language={language as Language}
                  theme={currentTheme}
                >
                  {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre className={className} style={style}>
                      {tokens.map((line, i) => {
                        const lineProps = getLineProps({ line });
                        const { key, ...restLineProps } = lineProps;
                        return (
                          <div key={i} {...restLineProps}>
                            {line.map((token, j) => {
                              const tokenProps = getTokenProps({ token });
                              const { key, ...restTokenProps } = tokenProps;
                              return <span key={j} {...restTokenProps} />;
                            })}
                          </div>
                        );
                      })}
                    </pre>
                  )}
                </Highlight>
              </div>
            );
          },
          h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
            <h1 className={markdownClassnames.h1 || ""} {...props} />
          ),
          h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
            <h2 className={markdownClassnames.h2 || ""} {...props} />
          ),
          h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
            <h3 className={markdownClassnames.h3 || ""} {...props} />
          ),
          h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
            <h4 className={markdownClassnames.h4 || ""} {...props} />
          ),
          h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
            <h5 className={markdownClassnames.h5 || ""} {...props} />
          ),
          h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
            <h6 className={markdownClassnames.h6 || ""} {...props} />
          ),
          p: (props: React.HTMLProps<HTMLParagraphElement>) => (
            <p className={markdownClassnames.p || ""} {...props} />
          ),
          ul: (props: React.HTMLProps<HTMLUListElement>) => (
            <ul className={markdownClassnames.ul || ""} {...props} />
          ),
          ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
            <ol className={markdownClassnames.ol || ""} {...props} />
          ),
          li: (props: React.HTMLProps<HTMLLIElement>) => (
            <li className={markdownClassnames.li || ""} {...props} />
          ),
          blockquote: (props: React.HTMLProps<HTMLQuoteElement>) => (
            <blockquote
              className={markdownClassnames.blockquote || ""}
              {...props}
            />
          ),
          pre: (props: React.HTMLProps<HTMLPreElement>) => (
            <pre className={markdownClassnames.pre || ""} {...props} />
          ),
          a: (props: React.HTMLProps<HTMLAnchorElement>) => (
            <a className={markdownClassnames.a || ""} {...props} />
          ),
          strong: (props: React.HTMLAttributes<HTMLElement>) => (
            <strong className={markdownClassnames.strong || ""} {...props} />
          ),
          em: (props: React.HTMLProps<HTMLElement>) => (
            <em className={markdownClassnames.em || ""} {...props} />
          ),
          del: (props: React.HTMLProps<HTMLModElement>) => (
            <del className={markdownClassnames.del || ""} {...props} />
          ),
          img: (props: React.HTMLProps<HTMLImageElement>) => (
            <img className={markdownClassnames.img || ""} {...props} />
          ),
          table: (props: React.HTMLProps<HTMLTableElement>) => (
            <table className={markdownClassnames.table || ""} {...props} />
          ),
          thead: (props: React.HTMLProps<HTMLTableSectionElement>) => (
            <thead className={markdownClassnames.thead || ""} {...props} />
          ),
          tbody: (props: React.HTMLProps<HTMLTableSectionElement>) => (
            <tbody className={markdownClassnames.tbody || ""} {...props} />
          ),
          tr: (props: React.HTMLProps<HTMLTableRowElement>) => (
            <tr className={markdownClassnames.tr || ""} {...props} />
          ),
          th: (props: React.HTMLProps<HTMLTableCellElement>) => (
            <th className={markdownClassnames.th || ""} {...props} />
          ),
          td: (props: React.HTMLProps<HTMLTableCellElement>) => (
            <td className={markdownClassnames.td || ""} {...props} />
          ),
          hr: (props: React.HTMLProps<HTMLHRElement>) => (
            <hr className={markdownClassnames.hr || ""} {...props} />
          ),
          sup: (props: React.HTMLProps<HTMLElement>) => (
            <sup className={markdownClassnames.sup || ""} {...props} />
          ),
          sub: (props: React.HTMLProps<HTMLElement>) => (
            <sub className={markdownClassnames.sub || ""} {...props} />
          ),
          br: (props: React.HTMLProps<HTMLBRElement>) => (
            <br className={markdownClassnames.br || ""} {...props} />
          ),
        }}
      >
        {typeof children === "string" ? children : String(children)}
      </ReactMarkdown>
    </div>
  );
};

const UserActions: React.FC<UserActionsProps> = ({
  children,
  className = "",
  ...rest
}) => (
  <div className={className} {...rest}>
    {children}
  </div>
);

const Sources: React.FC<SourcesProps> = ({
  children,
  interaction,
  className,
  itemClassName,
  ...rest
}) => {
  const { sources, response } = interaction;

  if (!sources || sources.length === 0) {
    return null;
  }

  const hasDocument =
    Array.isArray(sources) &&
    sources.some((source) => source && source.document);
  if (!hasDocument) {
    return null;
  }

  if (!response) {
    return null;
  }

  return (
    <ul className={className} {...rest}>
      {sources.map((source, index) => (
        <React.Fragment key={index}>
          {source && source.document ? (
            <li key={index} className={itemClassName}>
              {children(source.document as AnyObject, index)}
            </li>
          ) : null}
        </React.Fragment>
      ))}
    </ul>
  );
};

const ScrollToBottomButton: React.FC<ScrollToBottomButtonProps> = ({
  className = "",
  onClick,
  children,
  ...rest
}) => {
  const dispatch = useChatDispatch();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch({
      type: "SET_SCROLL_TO_LAST_INTERACTION",
      payload: { scrollToLastInteraction: true },
    });

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      aria-label="Scroll to bottom"
      {...rest}
    >
      {children}
    </button>
  );
};

const Reset: React.FC<ActionButtonProps> = ({ children, onClick, ...rest }) => {
  const { reset } = useChat();
  const { interactions } = useChatContext();

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    reset();
    if (onClick) {
      onClick(e);
    }
  };

  if (!interactions || interactions.length === 0) {
    return null;
  }

  return (
    <button onClick={handleReset} {...rest}>
      {children}
    </button>
  );
};

const RegenerateLatest: React.FC<
  ActionButtonProps & {
    interaction: Interaction;
  }
> = ({ children, onClick, interaction, ...rest }) => {
  const { regenerateLatest } = useChat();
  const { interactions } = useChatContext();

  const handleRegenerate = (e: React.MouseEvent<HTMLButtonElement>) => {
    regenerateLatest();
    if (onClick) {
      onClick(e);
    }
  };

  const isLatest =
    interactions && interactions[interactions.length - 1] === interaction;
  const isStreaming = interaction.loading && interaction.response;

  if (isStreaming || !isLatest) {
    return null;
  }

  return (
    <button onClick={handleRegenerate} {...rest}>
      {children}
    </button>
  );
};

export interface CopyMessageProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: (copied: boolean) => React.ReactNode;
  interaction: Interaction;
}

const CopyMessage: React.FC<CopyMessageProps> = ({
  onClick,
  children,
  interaction,
  ...rest
}) => {
  const { copyToClipboard, copied: copiedMessage } = useClipboard();
  const [copied, setCopied] = useState(false);
  const isStreaming = interaction.loading && interaction.response;

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    copyToClipboard(interaction.response || "");
    if (onClick) {
      onClick(e);
    }
  };

  useEffect(() => {
    if (copiedMessage) {
      setCopied(true);
      const timer = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [copiedMessage]);

  if (isStreaming) {
    return null;
  }

  return (
    <button onClick={handleCopy} {...rest}>
      {children(copied)}
    </button>
  );
};

const ChatInteractionsEmptyState: React.FC<EmptyStateProps> = ({
  className = "",
  children,
  ...rest
}) => {
  const { interactions } = useChatContext();

  if (interactions && interactions.length > 0) {
    return null;
  }

  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
};

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  interaction: Interaction;
  children?: React.ReactNode;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  interaction,
  children,
  className = "",
  ...rest
}) => {
  if (!interaction.loading || interaction.response) return null;
  return (
    <div className={className} {...rest}>
      {children || <span>Loading...</span>}
    </div>
  );
};

interface ErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  interaction: Interaction;
  children?: React.ReactNode;
  className?: string;
}

const Error: React.FC<ErrorProps> = ({
  interaction,
  children,
  className = "",
  ...rest
}) => {
  if (!interaction.error) return null;
  return (
    <div className={className} {...rest}>
      {children || <span className="text-red-500">Something went wrong.</span>}
    </div>
  );
};

export const ChatInteractions = {
  UserPrompt,
  AssistantMessage,
  Reset,
  RegenerateLatest,
  UserActions,
  CopyMessage,
  Sources,
  ScrollToBottomButton,
  Wrapper: ChatInteractionsWrapper,
  Empty: ChatInteractionsEmptyState,
  Loading,
  Error,
};
