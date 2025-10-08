import { OramaCloud } from '@orama/core'
import { SearchInput, SearchResults, SearchRoot } from '@orama/ui/components'

const orama = new OramaCloud({
  projectId: '2a3aa11e-d61b-4f2a-8074-1ca6367effdd',
  apiKey: 'c1__3JLIc4IXk34Quz4ISb4RujxqiyJVnWQvbdeUALR-wMRukh0iiCo0KQkptN'
})

interface SearchProps {}

export default function Search(props: SearchProps) {
  return (
    <SearchRoot client={orama}>
      <SearchInput.Input
        placeholder='Search...'
        searchParams={{
          limit: 5
        }}
      />
      <SearchResults.List>
        {(item) => (
          <div key={item.id} className='search-item'>
            {(item.document as { item_name: string }).item_name}
          </div>
        )}
      </SearchResults.List>
    </SearchRoot>
  )
}
