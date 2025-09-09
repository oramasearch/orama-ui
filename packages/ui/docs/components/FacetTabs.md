# `FacetTabs` component

`FacetTabs` is a compound UI component for rendering and managing a set of tabs, typically used for filtering or navigating between different facets or categories in a search interface. It provides keyboard navigation, accessibility, and integration with Orama search context.

## Composition

`FacetTabs` exposes three subcomponents:

- **FacetTabs.Wrapper**: Provides keyboard navigation and context for the tabs.
- **FacetTabs.List**: Renders a list of facet tabs.
- **FacetTabs.Item**: Represents an individual tab (facet) with selection and click handling.

## Usage

`FacetTabs` requires a connected search context to function. Make sure to use it with the [SearchInput](./SearchInput.md) component, or ensure your own input triggers the `search` function from the [useSearch](./../hooks/useSearch.md) hook. If you skip this step, `FacetTabs` will not work. Always pass the correct `searchParams` as in the example below.

```tsx
<SearchInput.Input
  searchParams={{
    groupBy: {
      properties: ["category"], // Replace 'category' with the name of your property
    },
    facets: {
      category: {},
    },
  }}
/>
```

```tsx
import { FacetTabs } from "@orama/ui/components";

function Example() {
  return (
    <FacetTabs.Wrapper className="facet-tabs">
      <FacetTabs.List
        className="facet-tabs-list"
        itemClassName="facet-tab-item"
      >
        {(group, isSelected) => (
          <FacetTabs.Item
            group={group}
            filterBy="category"
            isSelected={isSelected}
            className={isSelected ? "active" : ""}
          >
            {group.name} ({group.count})
          </FacetTabs.Item>
        )}
      </FacetTabs.List>
    </FacetTabs.Wrapper>
  );
}
```

## API Reference

### FacetTabs.Wrapper

| Prop        | Type      | Description                        |
| ----------- | --------- | ---------------------------------- |
| `children`  | ReactNode | The tab list and items.            |
| `className` | string    | (Optional) Additional CSS classes. |

- Handles keyboard navigation (left/right arrows).
- Only renders if there are search results.

### FacetTabs.List

| Prop            | Type                             | Description                              |
| --------------- | -------------------------------- | ---------------------------------------- |
| `children`      | (group, isSelected) => ReactNode | Render function for each tab.            |
| `className`     | string                           | (Optional) CSS class for the list.       |
| `itemClassName` | string                           | (Optional) CSS class for each list item. |

- Only renders if there are facet groups.

### FacetTabs.Item

| Prop           | Type         | Description                                                 |
| -------------- | ------------ | ----------------------------------------------------------- |
| `children`     | ReactNode    | Tab label/content.                                          |
| `group`        | GroupCount   | The facet group object (`{ name: string, count: number }`). |
| `filterBy`     | string       | The field to filter by when this tab is selected.           |
| `isSelected`   | boolean      | (Optional) If the tab is currently selected.                |
| `onClick`      | function     | (Optional) Called when the tab is clicked.                  |
| `className`    | string       | (Optional) Additional CSS classes.                          |
| `disabled`     | boolean      | (Optional) If true, disables the tab.                       |
| `searchParams` | SearchParams | (Optional) Additional search parameters.                    |

- Triggers a search and updates the selected facet on click.
- Applies ARIA and data attributes for accessibility and navigation.

## Accessibility

- Tabs are focusable and support left/right arrow keyboard navigation.
- Data attributes are used for focus management.
- Only renders when there are results or groups to display.

## Example

```tsx
<FacetTabs.Wrapper>
  <FacetTabs.List>
    {(group, isSelected) => (
      <FacetTabs.Item group={group} filterBy="type" isSelected={isSelected}>
        {group.name} ({group.count})
      </FacetTabs.Item>
    )}
  </FacetTabs.List>
</FacetTabs.Wrapper>
```
