import React from "react";
import useSearch from "../hooks/useSearch";

interface GroupedResult {
  name: string;
  count: number;
}

interface SearchParams {
  term: string;
  limit: number;
  filterBy: Array<{ category: string }>;
}

interface FacetTabsProps {
  groupedResults: GroupedResult[];
  selectedTab?: string | null;
  searchTerm: string;
  tabClassName?: string;
  selectedTabClassName?: string;
  onSearch: (params: SearchParams) => void;
  limit?: number;
  className?: string;
  buttonClassName?: string;
}

const FacetTabs: React.FC<FacetTabsProps> = ({
  groupedResults,
  searchTerm,
  onSearch,
  selectedTab,
  selectedTabClassName,
  className,
  limit = 10,
  tabClassName,
}) => {
  if (!groupedResults || groupedResults.length === 0) {
    return null;
  }

  const handleTabClick = (groupName: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("search:facet-tab-click", {
          detail: { groupName, searchTerm },
        }),
      );
    }
    onSearch({
      term: searchTerm,
      limit,
      filterBy: [{ category: groupName }],
    });
  };

  return (
    <div className={className}>
      {groupedResults.map((group) => (
        <button
          key={group.name}
          aria-selected={selectedTab === group.name}
          className={`${tabClassName} ${
            selectedTab === group.name ? selectedTabClassName : ""
          }`}
          onClick={() => handleTabClick(group.name)}
        >
          {group.name} ({group.count})
        </button>
      ))}
    </div>
  );
};

export default FacetTabs;
