import { ArrowDown, FileText, Github, Linkedin, Target } from 'lucide-react'
import { hero, profile } from '../data/content'
import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8"
    >
      <Reveal>
        <p className="kicker">{hero.kicker}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          {hero.name}
        </h1>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="mt-6 max-w-3xl font-display text-2xl font-medium leading-snug sm:text-3xl md:text-4xl">
          {hero.taglineBefore}
          <span className="accent-text">{hero.taglineAccent}</span>
          {hero.taglineAfter}
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {hero.subline.map((seg, i) =>
            typeof seg === 'string' ? (
              seg
            ) : (
              <span key={i} className="accent-text font-medium">
                {seg.accent}
              </span>
            ),
          )}
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-gradient px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            View Projects
            <ArrowDown size={16} aria-hidden="true" />
          </a>

          <a
            href="#bet"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <Target size={16} aria-hidden="true" />
            The Current Bet
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <Github size={16} aria-hidden="true" />
            GitHub
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <Linkedin size={16} aria-hidden="true" />
            LinkedIn
          </a>

          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <FileText size={16} aria-hidden="true" />
            Resume
          </a>
        </div>
      </Reveal>
    </section>
  )
}
