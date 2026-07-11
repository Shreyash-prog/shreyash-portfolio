import { useState } from 'react'
import { ArrowUpRight, Check, Copy, Eye, EyeOff, ImageIcon } from 'lucide-react'
import type { Project } from '../data/content'
import { useAvailableImages } from '../hooks/useAvailableImages'
import { Lightbox, type LightboxImage } from './Lightbox'

/** Turn "01-finding-detail.png" into "Finding detail". */
function captionFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  const base = file.replace(/\.[a-z]+$/i, '').replace(/^\d+[-_]?/, '')
  const words = base.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function RevealToken({ value, label }: { value: string; label: string }) {
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <div className="mt-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] p-3">
      {!shown ? (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-cyan"
        >
          <Eye size={15} aria-hidden="true" />
          Reveal access token
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto whitespace-nowrap rounded bg-[color:var(--surface)] px-2 py-1.5 font-mono text-xs text-[color:var(--text)]">
              {value}
            </code>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy token to clipboard"
              className="grid h-8 w-8 shrink-0 place-items-center rounded surface text-muted transition-colors hover:text-[color:var(--text)]"
            >
              {copied ? <Check size={15} className="text-accent-cyan" /> : <Copy size={15} />}
            </button>
            <button
              type="button"
              onClick={() => setShown(false)}
              aria-label="Hide token"
              className="grid h-8 w-8 shrink-0 place-items-center rounded surface text-muted transition-colors hover:text-[color:var(--text)]"
            >
              <EyeOff size={15} />
            </button>
          </div>
        </div>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted">{label}</p>
    </div>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const images = useAvailableImages(project.screenshots)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lightboxImages: LightboxImage[] = images.map((src) => ({
    src,
    caption: captionFromPath(src),
  }))

  const hasLead = images.length > 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl surface transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan hover:shadow-lift">
      {/* Lead screenshot */}
      {hasLead ? (
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`Open ${project.title} screenshots`}
          className="relative block aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--bg)]"
        >
          <img
            src={images[0]}
            alt={`${project.title} — ${captionFromPath(images[0])}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 font-mono text-[11px] text-white">
              +{images.length} shots
            </span>
          )}
        </button>
      ) : (
        // Graceful placeholder when no screenshots are available yet.
        <div className="flex aspect-[16/10] w-full items-center justify-center border-b border-[color:var(--border)] bg-[color:var(--bg)] text-muted">
          <ImageIcon size={28} aria-hidden="true" />
          <span className="sr-only">Screenshots coming soon</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h3 className="font-mono text-lg font-semibold tracking-tight">{project.title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>

        {/* Tech chips */}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.chips.map((chip) => (
            <li key={chip} className="tech-chip">
              {chip}
            </li>
          ))}
        </ul>

        {/* Reveal-token control */}
        {project.revealToken && (
          <RevealToken value={project.revealToken.value} label={project.revealToken.label} />
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.buttons.map((btn, i) => (
            <a
              key={btn.href + btn.label}
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                i === 0
                  ? 'inline-flex items-center gap-1.5 rounded-lg bg-accent-gradient px-3.5 py-2 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5'
                  : 'inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg)] px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent-cyan'
              }
            >
              {btn.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ))}
        </div>

        {project.caption && (
          <p className="mt-4 text-xs leading-relaxed text-muted">{project.caption}</p>
        )}
      </div>

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          projectTitle={project.title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </article>
  )
}
