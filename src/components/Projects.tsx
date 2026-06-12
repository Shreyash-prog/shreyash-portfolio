import { Github } from 'lucide-react'
import { projects, research } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 04 — Projects" title="Selected Work" />

      {/* Tier 1 — Novel Builds */}
      <Reveal>
        <div className="mb-7 flex items-center gap-3">
          <h3 className="font-display text-xl font-semibold">Novel Builds</h3>
          <span className="h-px flex-1 bg-[color:var(--border)]" aria-hidden="true" />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08} className="flex">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {/* Tier 2 — Research & Concepts */}
      <Reveal>
        <div className="mb-7 mt-20 flex items-center gap-3">
          <h3 className="font-display text-xl font-semibold">Concepts &amp; Experiments</h3>
          <span className="h-px flex-1 bg-[color:var(--border)]" aria-hidden="true" />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {research.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08} className="flex">
            <article className="group flex flex-1 flex-col rounded-2xl surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan hover:shadow-lift sm:p-6">
              <h4 className="font-display text-lg font-semibold tracking-tight">{item.title}</h4>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {item.chips.map((chip) => (
                  <li key={chip} className="tech-chip">
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <a
                  href={item.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent-cyan"
                >
                  <Github size={15} aria-hidden="true" />
                  GitHub
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
