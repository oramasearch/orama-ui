import React from "react";
// import { SlidingPanelChatbox } from '@/components/showcase/SlidingPanelChatbox'
// import { InlineSearch } from '@/components/showcase/InlineSearch'
// import { SearchWithDropdown } from '@/components/showcase/SearchWithDropdown'
// } from '@/components/ui/card'
import { ScrollableChatContainer } from "@/components/ScrollableChatContainer";
import { SearchBoxModal } from "@/components/SearchBoxModal";
import { SlidingPanelChatbox } from "@/components/SlidingPanelChatbox";
import { HorizontalTabsChatbox } from "@/components/HorizontalTabsChatbox";
import { VerticalTabsChatbox } from "@/components/VerticalTabsChatbox";
import { Badge } from "@/components/Badge";
import { HeroShowcase } from "@/components/HeroShowcase";
import { NLPSearchBox } from "@/components/NLPSearchBox";
import Header from "@/components/Header";

const Showcase = () => {
  const components = [
    {
      title: "Search Box Modal",
      description:
        "A modal dialog that opens when triggered, perfect for search interfaces that need to overlay the main content without losing context.",
      badge: "Interactive",
      features: [
        "Keyboard shortcut support (⌘K)",
        "Recent searches",
        "Instant search results",
        "Accessible modal implementation",
      ],
      component: <SearchBoxModal />,
      cardDescription: "Click to open the search modal",
    },
    {
      title: "Chat with Vertical Tabs",
      description:
        "A chat interface with vertical tabs for easy navigation between conversations.",
      badge: "Chat",
      features: [
        "Vertical tab layout",
        "Easy switching between chats",
        "Add and remove chats dynamically",
        "Keyboard navigation support",
      ],
      component: (
        <div className="w-full">
          <VerticalTabsChatbox />
          <HorizontalTabsChatbox />
        </div>
      ),
      cardDescription: "Type to see suggestions and use the filter",
    },
    {
      title: "Sliding Panel Chatbox",
      description:
        "A slide-out panel from the side of the screen, ideal for chat interfaces that don't interrupt the main workflow.",
      badge: "Chat",
      features: [
        "Smooth slide animation",
        "Message history",
        "Online status indicator",
        "Auto-response simulation",
      ],
      component: <SlidingPanelChatbox />,
      cardDescription: "Click to open the chat panel",
    },
    {
      title: "Inline Chat",
      description:
        "An embedded chat component that fits naturally within your page layout, great for real-time conversations and interactions.",
      badge: "Chat",
      features: [
        "Real-time messaging",
        "Smooth scrolling behavior",
        "Supports markdown formatting",
        "Goes to bottom button for long conversations",
      ],
      component: <ScrollableChatContainer />,
      cardDescription: "Try searching and filtering the content below",
    },
    {
      title: "NLP Search",
      description:
        "An advanced search component that understands natural language queries, providing more relevant results.",
      badge: "Search",
      features: [
        "Natural language processing",
        "Contextual understanding",
        "Improved search relevance",
        "Supports follow-up questions",
      ],
      component: <NLPSearchBox />,
      cardDescription: "Try searching and filtering the content below",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <HeroShowcase />

        {/* Components Section */}
        <div className="container mx-auto px-4 py-5">
          <div className="max-w-6xl mx-auto space-y-12">
            {components.map((item, index) => (
              <div key={index} className="relative">
                <div className="border border-gray-200 rounded-xl p-8 bg-card shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Component Info */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-semibold text-gray-900">
                            {item.title}
                          </h2>
                          <Badge variant="secondary" className="px-3 py-1">
                            {item.badge}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                          Features
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Component Preview */}
                    <div className="relative">
                      <div className="border border-gray-200 shadow-sm bg-background py-8 rounded-lg">
                        <div className="pb-4 px-6 border-b border-gray-200/50">
                          <h3 className="text-lg font-semibold">
                            Live Preview
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.cardDescription}
                          </p>
                        </div>
                        <div className="pt-6">
                          <div className="min-h-[120px] flex items-center justify-center">
                            {item.component}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section divider */}
                {index < components.length - 1 && (
                  <div className="flex items-center justify-center mt-8 mb-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="px-4">
                      <div className="w-2 h-2 bg-border rounded-full" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Showcase;
