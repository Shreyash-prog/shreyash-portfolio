import { academicResearch } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function AcademicResearch() {
  return (
    <section id="research" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 05 — Academic Research" title="Academic Research" />

      <ol className="relative ml-1.5 border-l border-[color:var(--border)]">
        {academicResearch.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={i * 0.08}
            className="relative pl-8 pb-12 last:pb-0"
          >
            {/* Timeline node */}
            <span
              className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent-gradient"
              style={{ boxShadow: '0 0 0 4px var(--bg)' }}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
              <span className="kicker shrink-0 accent-text font-semibold">{item.outcome}</span>
            </div>

            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{item.description}</p>

            <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
              <span className="text-accent-cyan">{item.advisor}</span>
              {' · '}
              {item.school}
            </p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
