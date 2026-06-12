import { AIBackground } from './components/AIBackground'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { TechConstellation } from './components/TechConstellation'
import { Experience } from './components/Experience'
import { AcademicResearch } from './components/AcademicResearch'
import { Projects } from './components/Projects'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <AIBackground />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-gradient focus:px-4 focus:py-2 focus:font-medium focus:text-black"
      >
        Skip to content
      </a>

      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <main id="main">
        <Hero />
        <About />
        <TechConstellation />
        <Experience />
        <Projects />
        <AcademicResearch />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
