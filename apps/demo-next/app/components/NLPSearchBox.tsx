"use client";
import React from "react";
import { oramaDocsCollection } from "@/data";
import {
  SearchInput,
  SearchRoot,
  SearchResults,
  RecentSearches,
} from "@orama/ui/components";
import { ArrowRight } from "lucide-react";

export const InnerSearchBox = () => {
  return (
    <>
      <div className="w-full lg:max-w-xl mx-auto border-gray-200 border-1 rounded-lg p-4 bg-white flex flex-col">
        <div className="flex flex-col justify-between h-140 gap-2">
          <SearchInput.Provider mode="nlp">
            <SearchInput.Form className="flex gap-2 w-full p-2 border border-gray-300 rounded-lg focus-within::ring-1 focus-within::ring-pink-400 transition-colors">
              <SearchInput.Input
                inputId="product-search"
                searchOnType={false}
                ariaLabel="Search for products"
                placeholder="Find your next favorite thing..."
                className="w-full outline-none"
              />
              <SearchInput.Submit
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-colors"
                aria-label="Submit search"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </SearchInput.Submit>
            </SearchInput.Form>
          </SearchInput.Provider>

          <SearchResults.Provider mode="nlp">
            <SearchResults.NoResults className="mt-4">
              {(searchTerm) => (
                <>
                  {searchTerm ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {`No results found for "${searchTerm}". Please try a different search term.`}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Start typing to search for products.
                      </p>
                      <RecentSearches.Provider>
                        <div className="border-t border-slate-200 dark:border-slate-700 my-4">
                          <h3 className="mt-4 mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Your recent searches
                          </h3>
                          <RecentSearches.List
                            className="space-y-1"
                            itemClassName=""
                          >
                            {(term, index) => (
                              <RecentSearches.Item
                                key={`recent-search-${index}`}
                                term={term}
                                mode="nlp"
                                className="text-xs uppercase text-pink-500 hover:text-pink-400 cursor-pointer"
                              >
                                {term}
                              </RecentSearches.Item>
                            )}
                          </RecentSearches.List>
                          <div className="flex justify-end">
                            <RecentSearches.Clear className="text-xs text-slate-400 hover:underline cursor-pointer">
                              Clear recent searches
                            </RecentSearches.Clear>
                          </div>
                        </div>
                      </RecentSearches.Provider>
                    </>
                  )}
                </>
              )}
            </SearchResults.NoResults>
            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
              <SearchResults.Wrapper className="mt-4 overflow-y-auto">
                <SearchResults.Loading className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
                  {/* add skeleton */}
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
                  </div>
                </SearchResults.Loading>
                <SearchResults.List>
                  {(hit) => (
                    <SearchResults.Item
                      onClick={() =>
                        console.log(`Clicked on ${hit.document?.title}`)
                      }
                    >
                      {/* CUSTOM ITEM CONTENT */}
                      {typeof hit.document?.title === "string" && (
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {hit.document?.title}
                        </h3>
                      )}
                      {typeof hit.document?.content === "string" && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 text-ellipsis overflow-hidden">
                          {hit.document?.content.substring(0, 100)}
                          ...
                        </p>
                      )}
                    </SearchResults.Item>
                  )}
                </SearchResults.List>
              </SearchResults.Wrapper>
            </div>
          </SearchResults.Provider>
        </div>
      </div>
    </>
  );
};

export const NLPSearchBox = () => {
  return (
    <SearchRoot client={oramaDocsCollection} namespace="demo-nlp-search">
      <InnerSearchBox />
    </SearchRoot>
  );
};
