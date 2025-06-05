"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { CollectionManager, Hit } from "@orama/core";
import SearchInput from "@repo/ui/components/SearchInput";
import useSearch from "@repo/ui/hooks/useSearch";
import SearchResultsItem from "@repo/ui/components/SearchResultsItem";
import SearchResultsList from "@repo/ui/components//SearchResultsList";

const collectionManager = new CollectionManager({
  url: "https://collections.orama.com",
  collectionID: "q126p2tuxl69ylzhx2twjobw",
  readAPIKey: "uXAoFvHnNZfvbR4GmXdRjTHSvfMPb45y",
});

export const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { onSearch, error, count, results, groupedResults, selectedFacet } = useSearch({
    client: collectionManager,
    initialSearchTerm: searchTerm,
    onSearchTermChange: setSearchTerm
  })

  return (
    <>
      <div className="w-full max-w-xl mx-auto border-gray-200 border-1 rounded-lg p-4 bg-white min-h-100">
        <SearchInput
          inputId="product-search"
          ariaLabel="Search for products"
          placeholder="Find your next favorite thing..."
          icon={<Search className="w-5 h-5" />}
          onValueChange={term => onSearch({ term, groupBy: "category" })}
          containerClassName="w-full"
          wrapperClassName="group flex items-center bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden focus-within:shadow-lg focus-within:ring-1 focus-within:ring-pink-500 dark:focus-within:ring-pink-400 transition-all duration-200"
          iconClassName="pl-4 pr-1 text-slate-500 dark:text-slate-400 group-focus-within:text-pink-600 dark:group-focus-within:text-pink-400 transition-colors"
          inputClassName="w-full p-3 text-base text-slate-800 dark:text-slate-200 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-slate-500 dark:placeholder-slate-400"
          resetButtonClassName="mr-2 p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-full focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
          resetButtonContent={<X className="w-5 h-5" />}
        />

        {/* Display error state */}
        {error && (
          <div className="mt-3 text-sm text-red-500">
            Error: {error.message}
          </div>
        )}

        {count > 0 && (
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-semibold">{count}</span> results
          </div>
        )}

        {groupedResults.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {groupedResults.map((group) => (
              <button
                key={group.name}
                // if SelectedFacet is set and matches the group name, add a class to indicate active state, otherwise make the first button active
                className={`cursor-pointer px-3 py-1 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors ${selectedFacet === group.name ? "ring-1 ring-pink-500" : ""}`}
                onClick={() => {
                  onSearch({
                    term: searchTerm,
                    limit: 10,
                    filterBy: [{ category: group.name }]
                  });
                }}
              >
                {group.name} ({group.count})
              </button>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-3 max-h-96 overflow-y-auto">
            <SearchResultsList className="mt-5 space-y-2" results={results}>
              {(result: Hit) => (
                <SearchResultsItem
                  className="border-b-neutral-200 border-b-1 pb-4 last:border-b-0 cursor-pointer"
                  result={result}
                  as={"a"}
                  href={result.document?.path as string}
                >
                  {/* USE WHATEVER CONTENT YOU WANT HERE */}
                  {result.document?.title as string && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {result.document?.title as string}
                  </h3>}
                  {result.document?.content as string && <p className="text-sm text-slate-600 dark:text-slate-400 text-ellipsis overflow-hidden">
                    {(result.document?.content as string).substring(0, 100)}...
                  </p>}
                  {result.document?.category as string && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-pink-200 text-pink-950 rounded-full">
                      {result.document?.category as string}
                    </span>
                  )}
                </SearchResultsItem>
              )}
            </SearchResultsList>
          </div>
        )}

        {/* no results case */}
        {results.length === 0 && searchTerm && (
          <div className="mt-12 text-sm text-slate-500 text-center">
            No results found for{" "}
            <span className="font-semibold">{searchTerm}</span>
          </div>
        )}
      </div>
    </>
  );
};
