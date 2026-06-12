import { experience } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Experience() {
  return (
    <section
      id="experience"
      className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28"
    >
      <SectionHeading kicker="// 03 — Experience" title="Experience" />

      <ol className="relative ml-1.5 border-l border-[color:var(--border)]">
        {experience.map((item, i) => (
          <Reveal as="li" key={item.org} delay={i * 0.08} className="relative pl-8 pb-12 last:pb-0">
            {/* Timeline node */}
            <span
              className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-accent-gradient ring-4"
              style={{ boxShadow: '0 0 0 4px var(--bg)' }}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-xl font-semibold">
                {item.org}
                {item.sub && (
                  <span className="text-muted">
                    {' — '}
                    {item.sub}
                  </span>
                )}
              </h3>
              <span className="kicker shrink-0">{item.dates}</span>
            </div>

            <p className="mt-1 font-mono text-sm text-accent-cyan">{item.role}</p>

            <p className="mt-4 max-w-3xl leading-relaxed text-muted">{item.description}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
