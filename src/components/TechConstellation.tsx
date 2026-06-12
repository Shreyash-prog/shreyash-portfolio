import { useState } from 'react'
import { categoryColors, techCategories, techNodes, type TechCategory } from '../data/content'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { StaticStack } from './StaticStack'
import { ConstellationCanvas } from './ConstellationCanvas'

export function TechConstellation() {
  const [isolated, setIsolated] = useState<TechCategory | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  // Mobile or reduced-motion → static, grouped, non-animated layout.
  const useStatic = isMobile || reduceMotion

  return (
    <section id="stack" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 02 — Tech Stack" title="The Constellation" />

      <Reveal>
        <p className="mb-8 max-w-2xl text-muted">
          A working map of the tools I build with — grouped by domain, linked where they genuinely
          ship together.{' '}
          {!useStatic && (
            <span className="text-[color:var(--text)]">
              Hover a node to trace its connections, or isolate a cluster from the legend.
            </span>
          )}
        </p>
      </Reveal>

      {/* Category legend / cluster isolation */}
      <Reveal>
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {techCategories.map((cat) => {
            const isActive = isolated === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setIsolated(isActive ? null : cat)}
                aria-pressed={isActive}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
                style={{
                  borderColor: isActive ? categoryColors[cat] : 'var(--border)',
                  backgroundColor: isActive ? `${categoryColors[cat]}1f` : 'var(--surface)',
                  color: isActive ? 'var(--text)' : 'var(--muted)',
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: categoryColors[cat] }}
                  aria-hidden="true"
                />
                {cat}
              </button>
            )
          })}
          {isolated && !useStatic && (
            <button
              type="button"
              onClick={() => setIsolated(null)}
              className="rounded-full border border-[color:var(--border)] px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-[color:var(--text)]"
            >
              Reset
            </button>
          )}
        </div>
      </Reveal>

      <Reveal>
        <div className="overflow-hidden rounded-2xl surface p-2 sm:p-3">
          {useStatic ? (
            <div className="p-2">
              <StaticStack />
            </div>
          ) : (
            <ConstellationCanvas isolated={isolated} />
          )}
        </div>
      </Reveal>

      {/* Screen-reader fallback: full stack listed by category. */}
      <div className="sr-only">
        <h3>Technology stack by category</h3>
        <ul>
          {techCategories.map((cat) => (
            <li key={cat}>
              {cat}: {techNodes.filter((n) => n.category === cat).map((n) => n.id).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
