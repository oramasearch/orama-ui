"use client";
import React, { useState } from "react";

const examples = [
  {
    title: "Basic Setup",
    description: "Get started with a simple search interface",
    code: `import { SearchRoot, SearchInput, SearchResults } from '@orama/ui/components';

export function MySearch() {
return (
  <SearchRoot client={orama}>
    <SearchInput.Wrapper>
      <SearchInput.Input 
        placeholder="Search..."
        className="w-full px-4 py-2 border rounded-lg"
      />
    </SearchInput.Wrapper>
    
    <SearchResults.Wrapper>
      <SearchResults.List>
        {(result) => (
          <SearchResults.Item>
            <h3>{result.title}</h3>
            <p>{result.description}</p>
          </SearchResults.Item>
        )}
      </SearchResults.List>
    </SearchResults.Wrapper>
  </SearchRoot>
);
}`,
  },
  {
    title: "With Chat Integration",
    description: "Add AI-powered chat to your search",
    code: `import { SearchRoot, ChatRoot, ChatInteractions } from '@orama/ui/components';

export function SearchWithChat() {
return (
  <SearchRoot client={orama}>
    <ChatRoot client={orama}>
      <div className="space-y-4">
        <SearchInput.Wrapper>
          <SearchInput.Input />
        </SearchInput.Wrapper>
        
        <ChatInteractions.Wrapper>
          {(interaction) => (
            <>
              <ChatInteractions.UserPrompt>
                {interaction.query}
              </ChatInteractions.UserPrompt>
              
              <ChatInteractions.AssistantMessage>
                {interaction.response}
              </ChatInteractions.AssistantMessage>
            </>
          )}
        </ChatInteractions.Wrapper>
      </div>
    </ChatRoot>
  </SearchRoot>
);
}`,
  },
  {
    title: "Custom Styling",
    description: "Apply your own design system",
    code: `// Custom theme with Tailwind
const customTheme = {
input: "bg-purple-50 border-purple-200 focus:ring-purple-500",
button: "bg-gradient-to-r from-purple-600 to-pink-600",
result: "hover:bg-purple-50 border-l-4 border-purple-500"
};

export function ThemedSearch() {
return (
  <SearchRoot>
    <SearchInput.Wrapper>
      <SearchInput.Input 
        className={customTheme.input}
        placeholder="Search with style..."
      />
    </SearchInput.Wrapper>
    
    <SearchResults.List 
      itemClassName={customTheme.result}
    >
      {(result) => (
        <SearchResults.Item>
          {/* Your custom result layout */}
        </SearchResults.Item>
      )}
    </SearchResults.List>
  </SearchRoot>
);
}`,
  },
];

export const CodeExamples = () => {
  const [activeTab, setActiveTab] = useState(0);

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log("Code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  return (
    <section className="py-20 px-4" id="code-examples">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Code Examples
          </h2>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === index
                    ? "bg-white shadow-md text-purple-700"
                    : "text-gray-600 hover:text-purple-700"
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>
        </div>

        {/* Code example */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-gray-400 text-sm font-medium">
                  {examples?.[activeTab]?.title}
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => copyToClipboard(examples?.[activeTab]?.code)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">
                  {examples?.[activeTab]?.description}
                </p>
              </div>

              <pre className="text-sm overflow-x-auto">
                <code className="text-gray-300 whitespace-pre-wrap">
                  {examples?.[activeTab]?.code}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
