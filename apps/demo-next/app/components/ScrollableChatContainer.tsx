"use client";
import React from "react";
import { useScrollableContainer } from "@orama/ui/hooks/useScrollableContainer";
import { ChatInteractions } from "@orama/ui/components/ChatInteractions";
import { PromptTextArea } from "@orama/ui/components/PromptTextArea";
import { ChatRoot } from "@orama/ui/components/ChatRoot";
import { oramaDocsCollection } from "@/data";
import { ArrowDown } from "lucide-react";

export const ScrollableChatContainer = () => {
  const {
    containerRef,
    showGoToBottomButton,
    scrollToBottom,
    recalculateGoToBottomButton,
  } = useScrollableContainer();

  return (
    <ChatRoot client={oramaDocsCollection}>
      <div className="flex flex-col h-[420px] w-full max-w-md mx-auto border rounded-md shadow">
        {/* TOP BLOCK */}
        <div className="p-4 border-b rounded-t-md">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Header</p>
            <ChatInteractions.Reset className="text-sm text-gray-500 text-underline hover:text-gray-700">
              Reset conversation
            </ChatInteractions.Reset>
          </div>
        </div>

        {/* SCROLLABLE BLOCK */}
        <div ref={containerRef} className="flex-1 overflow-y-auto">
          <ChatInteractions.Wrapper
            onScroll={recalculateGoToBottomButton}
            onStreaming={recalculateGoToBottomButton}
            onNewInteraction={() => {
              scrollToBottom({ animated: true });
            }}
          >
            {(interaction) => (
              <div key={interaction.id} className="p-4 flex flex-col gap-2">
                <ChatInteractions.UserPrompt className="bg-gray-100 my-1 py-2 px-4 font-semibold rounded-lg">
                  {interaction.query}
                </ChatInteractions.UserPrompt>
                <ChatInteractions.Loading
                  className="text-gray-500 text-sm"
                  interaction={interaction}
                >
                  <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded" />
                </ChatInteractions.Loading>
                <ChatInteractions.AssistantMessage
                  markdownClassnames={{
                    p: "my-2",
                    pre: "rounded-md [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:my-3 [&_pre]:text-xs [&_pre]:whitespace-break-spaces wrap-break-word",
                    code: "bg-gray-200 p-1 rounded",
                  }}
                  className="py-1 px-4 bg-gray-200 rounded-lg"
                >
                  {interaction.response}
                </ChatInteractions.AssistantMessage>
              </div>
            )}
          </ChatInteractions.Wrapper>
        </div>

        {/* BOTTOM BLOCK */}
        <div className="p-4 bg-white border-t rounded-b-md flex flex-col items-center justify-between relative">
          {showGoToBottomButton && (
            <button
              className="ml-2 px-3 py-1 bg-gray-800/70 text-white rounded text-sm absolute -top-10 right-4"
              onClick={() => scrollToBottom()}
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
          <PromptTextArea.Wrapper className="flex items-center gap-2 w-full">
            <PromptTextArea.Field
              rows={1}
              placeholder="What do you want to know?"
              className="flex-1 py-2 px-2 border border-gray-600 rounded-md"
            />
            <PromptTextArea.Button className="bg-black text-white py-2 px-4 rounded-md">
              Send
            </PromptTextArea.Button>
          </PromptTextArea.Wrapper>
        </div>
      </div>
    </ChatRoot>
  );
};
