import { CodeExamples } from './components/CodeExample'
import { ComponentShowcase } from './components/ComponentShowcase'
import Header from './components/Header'
import { Hero } from './components/Hero'

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Header />
      <Hero />
      <ComponentShowcase />
      <CodeExamples />
    </main>
  )
}
