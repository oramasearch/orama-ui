import { clsx, type ClassValue } from "clsx";
import { use } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getThemeClasses = (theme: string) => {
  switch (theme) {
    case "modern":
      return {
        wrapper: "bg-white",
        container: "bg-white border border-gray-200 rounded-xl shadow-lg",
        input: "rounded-xl border-gray-300 focus:ring-purple-400 focus:border-purple-400",
        promptButton:
          "rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
        text: "text-gray-900",
        category:
          "bg-gray-50 hover:bg-gray-100 focus:bg-purple-100 focus:text-purple-800 focus:border-purple-200",
        categorySelected: "bg-purple-100 text-purple-800 border-purple-200",
        resultsContainer: "bg-gray-50/50",
        groupHeader: "text-purple-600 border-b border-purple-100",
        resultItem:
          "bg-white hover:bg-purple-50 border-l-4 border-transparent hover:border-purple-300 hover:shadow-sm focus:border-purple-300 focus:shadow-sm focus:bg-purple-50",
        resultTitle:
          "text-gray-900 group-hover:text-purple-700 group-focus:text-purple-700",
        resultContent: "text-gray-600",
        userPrompt:
          "text-purple-700 text-purple-700",
        assistantMessage: "text-gray-600",
        chatActions: {
          resetButton:
            "px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm text-red-700 transition-colors cursor-pointer",
          actionButton:
            "px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors cursor-pointer",
          container: "flex space-x-2 pb-3 justify-between",
        },
        noResults: {
          container: "bg-gray-50/50 rounded-lg p-6 text-center",
          iconContainer:
            "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3",
          icon: "w-6 h-6 text-gray-400",
          title: "text-lg font-medium text-gray-900",
          description: "text-sm text-gray-500",
          suggestionContainer:
            "w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2",
          suggestionIcon: "w-5 h-5 text-purple-500",
          suggestionTitle: "text-lg font-medium text-gray-900",
          suggestionItem:
            "group rounded-lg border border-gray-200 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 cursor-pointer",
          suggestionText: "text-sm text-gray-700 group-hover:text-purple-700",
        },
        sources: {
          container: "flex flex-row gap-2 mb-2 mt-3 overflow-x-auto",
          item: "group inline-flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer flex-shrink-0",
          dot: "w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 group-hover:bg-purple-600 transition-colors",
          title: "text-xs font-semibold text-gray-900 truncate",
          content: "text-xs text-gray-500 truncate",
        },
      };
    case "dark":
      return {
        wrapper: "bg-gray-900",
        container: "bg-gray-900 border border-gray-700 rounded-xl shadow-2xl",
        input:
          "rounded-xl bg-gray-800 border-gray-600 text-white focus:ring-cyan-400 focus:border-cyan-400",
        promptButton:
          "rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white",
        text: "text-white",
        category:
          "text-white bg-gray-800 hover:bg-gray-700 focus:bg-cyan-900 focus:text-cyan-200 focus:border-cyan-700",
        categorySelected: "bg-cyan-900 text-cyan-200 border-cyan-700",
        resultsContainer: "bg-gray-800/50",
        groupHeader: "text-cyan-400 border-b border-gray-700",
        resultItem:
          "bg-gray-800 hover:bg-gray-700/80 border-l-4 border-transparent hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/10",
        resultTitle:
          "text-gray-100 group-hover:text-cyan-300 group-focus:text-cyan-300",
        resultContent: "text-gray-400",
        userPrompt:
          "text-cyan-300 group-focus:text-cyan-300",
        assistantMessage: "text-gray-400",
        chatActions: {
          resetButton:
            "px-3 py-1 bg-red-900/50 hover:bg-red-900/70 border border-red-700 rounded-lg text-sm text-red-300 transition-colors cursor-pointer",
          actionButton:
            "px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors cursor-pointer",
          container: "flex space-x-2 pb-3 justify-between",
        },
        noResults: {
          container: "bg-gray-800/50 rounded-lg p-6 text-center",
          iconContainer:
            "w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3",
          icon: "w-6 h-6 text-gray-500",
          title: "text-lg font-medium text-gray-100",
          description: "text-sm text-gray-400",
          suggestionContainer:
            "w-10 h-10 rounded-full bg-cyan-900/20 flex items-center justify-center mx-auto mb-2",
          suggestionIcon: "w-5 h-5 text-cyan-400",
          suggestionTitle: "text-lg font-medium text-gray-100",
          suggestionItem:
            "group rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-cyan-900/20 hover:border-cyan-700 transition-all duration-200 cursor-pointer",
          suggestionText: "text-sm text-gray-300 group-hover:text-cyan-300",
        },
        sources: {
          container: "flex flex-row gap-2 mb-2 mt-3 overflow-x-auto",
          item: "group inline-flex items-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 hover:shadow-lg hover:bg-gray-700 hover:shadow-cyan-500/10 transition-all duration-200 cursor-pointer flex-shrink-0",
          dot: "w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 group-hover:bg-cyan-400 transition-colors",
          title: "text-xs font-semibold text-gray-100 truncate",
          content: "text-xs text-gray-400 truncate",
        },
      };
    case "playful":
      return {
        wrapper:
          "bg-gradient-to-br from-yellow-100 to-pink-100",
        container:
          "bg-gradient-to-br from-yellow-100 to-pink-100 border-2 border-pink-300 rounded-3xl shadow-lg",
        input:
          "border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-full",
        promptButton:
          "bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 rounded-full text-white",
        text: "text-gray-800",
        category:
          "bg-white/70 hover:bg-white/90 focus:bg-pink-200 focus:text-pink-800 focus:border-pink-300",
        categorySelected: "bg-pink-200 text-pink-800 border-pink-300",
        resultsContainer: "bg-white/30 rounded-2xl",
        groupHeader: "text-pink-600 border-b-2 border-pink-200",
        resultItem:
          "bg-white/80 hover:bg-white rounded-2xl border-2 border-transparent hover:border-pink-200 hover:shadow-md transform hover:scale-102 focus:border-pink-200 focus:shadow-md transform focus:scale-102 transition-all mb-2",
        resultTitle:
          "text-gray-800 group-hover:text-pink-700 group-focus:text-pink-700",
        resultContent: "text-gray-600",
        userPrompt:
          "text-pink-700",
        assistantMessage: "text-gray-600",
        chatActions: {
          resetButton:
            "px-3 py-1 bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-full text-sm text-red-700 transition-all duration-200 cursor-pointer shadow-sm",
          actionButton:
            "px-3 py-1 bg-white/80 hover:bg-white border-2 border-pink-200 rounded-full text-sm text-gray-700 transition-all duration-200 cursor-pointer shadow-sm",
          container: "flex space-x-3 pb-3 justify-between",
        },
        noResults: {
          container: "bg-white/30 rounded-2xl p-6 text-center",
          iconContainer:
            "w-12 h-12 rounded-full bg-white/70 flex items-center justify-center mx-auto mb-3",
          icon: "w-6 h-6 text-pink-500",
          title: "text-lg font-medium text-gray-800",
          description: "text-sm text-gray-600",
          suggestionContainer:
            "w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-2",
          suggestionIcon: "w-5 h-5 text-pink-600",
          suggestionTitle: "text-lg font-medium text-gray-800",
          suggestionItem:
            "group rounded-2xl border-2 border-pink-200 bg-white/80 hover:bg-white hover:border-pink-300 transition-all duration-200 cursor-pointer shadow-sm",
          suggestionText: "text-sm text-gray-700 group-hover:text-pink-700",
        },
        sources: {
          container: "flex flex-row gap-3 mb-2 mt-4 overflow-x-auto",
          item: "group inline-flex items-center bg-white/90 border-2 border-orange-200 rounded-2xl px-4 py-3 hover:shadow-lg hover:bg-white hover:border-orange-300 transition-all duration-200 cursor-pointer flex-shrink-0",
          dot: "w-3 h-3 bg-orange-400 rounded-full flex-shrink-0 group-hover:bg-orange-500 transition-colors",
          title: "text-xs font-bold text-gray-800 truncate",
          content: "text-xs text-gray-600 truncate",
        },
      };
    default:
      return {
        container: "bg-white border border-gray-200 rounded-xl shadow-lg",
        input: "border-gray-300 focus:ring-purple-400 focus:border-purple-400",
        promptButton:
          "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
        text: "text-gray-900",
        category: "bg-gray-50 hover:bg-gray-100",
        categorySelected: "bg-purple-100 text-purple-800 border-purple-200",
        resultsContainer: "bg-gray-50/50",
        groupHeader: "text-purple-600 border-b border-purple-100",
        resultItem:
          "bg-white hover:bg-purple-50 border-l-4 border-transparent hover:border-purple-300 hover:shadow-sm focus:border-purple-300 focus:shadow-sm",
        resultTitle:
          "text-gray-900 group-hover:text-purple-700 group-focus:text-purple-700",
        resultContent: "text-gray-600",
        userPrompt:
          "text-purple-700",
        assistantMessage: "text-gray-600",
        chatActions: {
          resetButton:
            "px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-sm text-red-700 transition-colors cursor-pointer",
          actionButton:
            "px-3 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors cursor-pointer",
          container: "flex space-x-2 my-3 justify-between",
        },
        noResults: {
          container: "bg-gray-50/50 rounded-lg p-6 text-center",
          iconContainer:
            "w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3",
          icon: "w-6 h-6 text-gray-400",
          title: "text-lg font-medium text-gray-900",
          description: "text-sm text-gray-500",
          suggestionContainer:
            "w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-2",
          suggestionIcon: "w-5 h-5 text-purple-500",
          suggestionTitle: "text-lg font-medium text-gray-900",
          suggestionItem:
            "group rounded-lg border border-gray-200 bg-gray-50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200 cursor-pointer",
          suggestionText: "text-sm text-gray-700 group-hover:text-purple-700",
        },
        sources: {
          container: "flex flex-row gap-2 mb-2 mt-3 overflow-x-auto",
          item: "group inline-flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer flex-shrink-0",
          dot: "w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 group-hover:bg-purple-600 transition-colors",
          title: "text-xs font-semibold text-gray-900 truncate",
          content: "text-xs text-gray-500 truncate",
        },
      };
  }
};