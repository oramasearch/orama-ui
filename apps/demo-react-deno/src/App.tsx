import reactLogo from './assets/react.svg'
import { SearchRoot, SearchInput, SearchResults } from '@orama/ui/components'
import { OramaCloud } from '@orama/core'
import viteLogo from '/vite.svg'
import './App.css'

const orama = new OramaCloud({
  projectId: '2a3aa11e-d61b-4f2a-8074-1ca6367effdd',
  apiKey: 'c1__3JLIc4IXk34Quz4ISb4RujxqiyJVnWQvbdeUALR-wMRukh0iiCo0KQkptN'
})

function App() {
  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
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
    </>
  )
}

export default App
