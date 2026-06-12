import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface LightboxImage {
  src: string
  caption: string
}

interface LightboxProps {
  images: LightboxImage[]
  startIndex: number
  /** Human label for the project, used in aria text. */
  projectTitle: string
  onClose: () => void
}

/** Accessible image carousel: arrow keys navigate, Esc closes, focus is trapped. */
export function Lightbox({ images, startIndex, projectTitle, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  )
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  // Move focus into the dialog on open; restore it to the trigger on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => previouslyFocused?.focus?.()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      } else if (e.key === 'Tab') {
        // Trap focus within the dialog.
        const root = dialogRef.current
        if (!root) return
        const focusable = root.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement
        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, prev, next])

  const current = images[index]
  const multiple = images.length > 1

  // Rendered via a portal into <body> so a transformed/animated ancestor (the
  // project card's Framer Motion hover-lift / scroll-reveal) can't become the
  // containing block for this position:fixed overlay and box it inside the card.
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} screenshots`}
      className="fixed inset-0 z-[200] flex flex-col bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
        <span className="font-mono text-xs text-white/70">
          {projectTitle} · {index + 1} / {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close image viewer"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex flex-1 items-center justify-center px-4 pb-2 sm:px-16">
        {multiple && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <img
          src={current.src}
          alt={current.caption || `${projectTitle} screenshot ${index + 1}`}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {multiple && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Caption + dots */}
      <div className="px-4 pb-6 pt-1 text-center sm:px-6">
        {current.caption && (
          <p className="mx-auto max-w-2xl text-sm text-white/80">{current.caption}</p>
        )}
        {multiple && (
          <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label="Choose image">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex(i)
                }}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-accent-cyan' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
