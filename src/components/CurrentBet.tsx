import { useState } from 'react'
import { ArrowUpRight, FileText, Github } from 'lucide-react'
import { currentBet } from '../data/content'
import { useAvailableImages } from '../hooks/useAvailableImages'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { Lightbox, type LightboxImage } from './Lightbox'

/** Turn "01-architecture.png" into "Architecture". */
function captionFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  const base = file.replace(/\.[a-z]+$/i, '').replace(/^\d+[-_]?/, '')
  const words = base.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Icon per button, keyed by label so the data stays icon-agnostic. */
function buttonIcon(label: string) {
  if (/github/i.test(label)) return <Github size={15} aria-hidden="true" />
  if (/whitepaper|paper|doc/i.test(label)) return <FileText size={15} aria-hidden="true" />
  return <ArrowUpRight size={15} aria-hidden="true" />
}

/**
 * The Current Bet — a single full-width spotlight panel, deliberately distinct
 * from the Novel Builds card grid. Uses a section-only teal→emerald accent.
 */
export function CurrentBet() {
  const images = useAvailableImages(currentBet.screenshots)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lightboxImages: LightboxImage[] = images.map((src) => ({
    src,
    caption: captionFromPath(src),
  }))

  return (
    <section id="bet" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 03 — The Current Bet" title="The Current Bet" />

      <Reveal>
        <article
          className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 md:p-10"
          style={{
            borderColor: 'rgba(45, 212, 191, 0.35)',
            backgroundColor: 'var(--surface)',
          }}
        >
          {/* Deeper panel wash + faint topology/grid motif */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                'radial-gradient(120% 120% at 85% 0%, rgba(16, 185, 129, 0.10), transparent 55%), radial-gradient(90% 90% at 0% 100%, rgba(45, 212, 191, 0.08), transparent 55%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(45,212,191,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.10) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(140% 120% at 80% 10%, #000 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(140% 120% at 80% 10%, #000 20%, transparent 80%)',
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 200 100"
            preserveAspectRatio="xMidYMid slice"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.12]"
          >
            <line x1="20" y1="24" x2="70" y2="52" stroke="#2DD4BF" strokeWidth="0.5" />
            <line x1="70" y1="52" x2="130" y2="30" stroke="#10B981" strokeWidth="0.5" />
            <line x1="130" y1="30" x2="182" y2="60" stroke="#2DD4BF" strokeWidth="0.5" />
            <line x1="70" y1="52" x2="120" y2="82" stroke="#10B981" strokeWidth="0.5" />
            <circle cx="20" cy="24" r="1.6" fill="#2DD4BF" />
            <circle cx="70" cy="52" r="2" fill="#10B981" />
            <circle cx="130" cy="30" r="1.6" fill="#2DD4BF" />
            <circle cx="182" cy="60" r="1.6" fill="#10B981" />
            <circle cx="120" cy="82" r="1.6" fill="#2DD4BF" />
          </svg>

          {/* Content sits above the motif */}
          <div className="relative z-10">
            {/* Status pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1"
              style={{ borderColor: 'rgba(45, 212, 191, 0.4)' }}
            >
              <span className="relative grid h-2.5 w-2.5 place-items-center">
                <span
                  className="bet-pulse-dot absolute h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: 'rgba(45, 212, 191, 0.5)' }}
                />
                <span
                  className="relative h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: '#2DD4BF' }}
                />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                {currentBet.statusPill}
              </span>
            </div>

            {/* Name + subtitle */}
            <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h3 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                <span className="bet-accent-text">{currentBet.name}</span>
              </h3>
            </div>
            <p className="mt-2 max-w-3xl font-display text-lg font-medium leading-snug md:text-xl">
              {currentBet.subtitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{currentBet.statusLine}</p>

            {/* Two-column: narrative + chips + buttons | architecture highlights */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
              {/* Left column */}
              <div>
                <p className="text-[15px] leading-relaxed text-muted">{currentBet.description}</p>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {currentBet.chips.map((chip) => (
                    <li key={chip} className="tech-chip">
                      {chip}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  {currentBet.buttons.map((btn, i) => (
                    <a
                      key={btn.href + btn.label}
                      href={btn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        i === 0
                          ? 'bet-gradient inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5'
                          : 'inline-flex items-center gap-1.5 rounded-lg border bg-[color:var(--bg)] px-4 py-2.5 text-sm font-medium transition-colors'
                      }
                      style={
                        i === 0
                          ? undefined
                          : { borderColor: 'rgba(45, 212, 191, 0.4)', color: 'var(--text)' }
                      }
                    >
                      {buttonIcon(btn.label)}
                      {btn.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right column — architecture highlights */}
              <div>
                <p className="kicker mb-4">Architecture highlights</p>
                <ul className="space-y-3.5">
                  {currentBet.highlights.map((h) => (
                    <li key={h.title} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: '#2DD4BF' }}
                      />
                      <span className="text-sm leading-relaxed text-muted">
                        <span className="font-semibold text-[color:var(--text)]">{h.title}</span>
                        {' — '}
                        {h.detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Phase roadmap strip */}
            <div className="mt-10 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
              <p className="kicker mb-5">Roadmap</p>
              <ol className="flex flex-col gap-5 sm:flex-row sm:gap-3">
                {currentBet.phases.map((phase, i) => (
                  <li key={phase.label} className="relative flex flex-1 items-start gap-3 sm:block">
                    <div className="flex items-center sm:mb-3">
                      <span
                        aria-hidden="true"
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold text-black bet-gradient"
                      >
                        {i}
                      </span>
                      {i < currentBet.phases.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="mx-2 hidden h-px flex-1 sm:block"
                          style={{
                            background:
                              'linear-gradient(90deg, rgba(45,212,191,0.5), rgba(16,185,129,0.15))',
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.14em] bet-accent-text">
                        {phase.label}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-muted">{phase.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Optional screenshots — hidden gracefully when the folder is empty */}
            {images.length > 0 && (
              <div className="mt-10 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
                <p className="kicker mb-4">Screens</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={`Open ${currentBet.name} screenshot: ${captionFromPath(src)}`}
                      className="group relative block aspect-[16/10] overflow-hidden rounded-lg border bg-[color:var(--bg)]"
                      style={{ borderColor: 'rgba(45, 212, 191, 0.25)' }}
                    >
                      <img
                        src={src}
                        alt={`${currentBet.name} — ${captionFromPath(src)}`}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </Reveal>

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          projectTitle={currentBet.name}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  )
}
