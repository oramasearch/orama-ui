"use client";
import React from "react";
import { CollectionManager } from "@orama/core";
import {
  FacetTabs,
  SearchInput,
  SearchRoot,
  SearchResults,
} from "@orama/ui/components";
import { useSearchContext } from "@orama/ui/contexts";

const collectionManager = new CollectionManager({
  url: "https://collections.orama.com",
  collectionID: "q126p2tuxl69ylzhx2twjobw",
  readAPIKey: "uXAoFvHnNZfvbR4GmXdRjTHSvfMPb45y",
});

export const InnerSearchBox = () => {
  const { selectedFacet } = useSearchContext();

  return (
    <div>
      <SearchInput.Wrapper>
        <SearchInput.Input
          inputId="product-search"
          ariaLabel="Search for products"
          placeholder="Find your next favorite thing..."
          searchParams={{
            groupBy: "category",
          }}
        />
      </SearchInput.Wrapper>

      <FacetTabs.Wrapper>
        <FacetTabs.List>
          {(
            group, // TODO: consider to pass isSelected as second boolean argument, so I would not need to use useSearchContext
          ) => (
            <FacetTabs.Item
              isSelected={group.name === selectedFacet}
              filterBy={"category"}
              group={group}
            >
              {group.name} ({group.count})
            </FacetTabs.Item>
          )}
        </FacetTabs.List>
      </FacetTabs.Wrapper>

      <SearchResults.NoResults>
        {(searchTerm) => (
          <>
            {searchTerm ? (
              <p>
                {`No results found for "${searchTerm}". Please try a different search term.`}
              </p>
            ) : (
              <p>Your custom empty state component here</p>
            )}
          </>
        )}
      </SearchResults.NoResults>

      <SearchResults.GroupsWrapper groupBy="category">
        {(group) => (
          <div key={group.name}>
            <h2>{group.name}</h2>
            <SearchResults.GroupList group={group}>
              {(hit) => (
                <SearchResults.Item>
                  {/* CUSTOM ITEM CONTENT */}
                  <p>{hit.document.title as string}</p>
                </SearchResults.Item>
              )}
            </SearchResults.GroupList>
          </div>
        )}
      </SearchResults.GroupsWrapper>
    </div>
  );
};

export const SearchBox = () => {
  return (
    <SearchRoot client={collectionManager}>
      <InnerSearchBox />
    </SearchRoot>
  );
};
