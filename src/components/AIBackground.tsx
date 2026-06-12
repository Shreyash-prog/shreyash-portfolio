import { useEffect, useRef } from 'react'
import { useIsDark } from '../hooks/useIsDark'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * Subtle, global, AI-themed interactive background.
 *
 * A fixed full-viewport canvas rendered BEHIND all content (z-index -1,
 * pointer-events: none) showing a slow neural/particle field. Clicking anywhere
 * emits a reaction at the cursor, and the effect type + accent hue vary by the
 * section the click landed in.
 *
 * Deliberately fainter than — and visually distinct from — the Tech Stack
 * constellation: tiny unlabeled points and hairline links at low global opacity.
 *
 * Accessibility/perf: FPS- and count-capped, single rAF loop, pauses when the
 * tab is hidden, and degrades to a single static faint field under
 * prefers-reduced-motion (no drift, no click effects).
 */

const MAX_FPS = 38
const FRAME_MS = 1000 / MAX_FPS
const LINK_DIST = 132
const MAX_EFFECTS = 24

type EffectKind = 'ripple' | 'burst' | 'streak' | 'pulse'

/** Section id → reaction effect + accent hue, so repeated clicks feel varied. */
const SECTION_EFFECT: Record<string, { kind: EffectKind; color: string }> = {
  hero: { kind: 'ripple', color: '#22D3EE' }, // cyan
  about: { kind: 'burst', color: '#6366F1' }, // indigo
  stack: { kind: 'pulse', color: '#2DD4BF' }, // teal
  experience: { kind: 'streak', color: '#38BDF8' }, // sky
  research: { kind: 'ripple', color: '#A78BFA' }, // violet
  projects: { kind: 'burst', color: '#818CF8' }, // soft indigo
  contact: { kind: 'pulse', color: '#6366F1' }, // indigo
  footer: { kind: 'streak', color: '#22D3EE' }, // cyan
  default: { kind: 'ripple', color: '#22D3EE' },
}

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  color: string
}

interface BurstPart {
  x: number
  y: number
  vx: number
  vy: number
}

interface Effect {
  kind: EffectKind
  x: number
  y: number
  age: number
  max: number
  color: string
  parts?: BurstPart[]
  vx?: number
  vy?: number
}

const CYAN = [0x22, 0xd3, 0xee]
const INDIGO = [0x63, 0x66, 0xf1]

function fieldColor(t: number): string {
  const r = Math.round(CYAN[0] + (INDIGO[0] - CYAN[0]) * t)
  const g = Math.round(CYAN[1] + (INDIGO[1] - CYAN[1]) * t)
  const b = Math.round(CYAN[2] + (INDIGO[2] - CYAN[2]) * t)
  return `${r},${g},${b}`
}

function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

export function AIBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDark = useIsDark()
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const points: Point[] = []
    const effects: Effect[] = []

    const buildField = () => {
      points.length = 0
      // Density scaled to area, hard-capped for performance.
      const target = Math.min(Math.floor((width * height) / 26000), 80)
      for (let i = 0; i < target; i++) {
        const x = pseudoRand(i * 2.17) * width
        const y = pseudoRand(i * 3.91 + 1) * height
        points.push({
          x,
          y,
          vx: (pseudoRand(i * 5.3) - 0.5) * 0.22,
          vy: (pseudoRand(i * 7.7) - 0.5) * 0.22,
          color: fieldColor(x / width),
        })
      }
    }

    const drawField = (alpha: number) => {
      // Hairline links between nearby points (the synapse motif).
      for (let i = 0; i < points.length; i++) {
        const a = points[i]
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK_DIST * LINK_DIST) continue
          const d = Math.sqrt(d2)
          const la = (1 - d / LINK_DIST) * 0.5 * alpha
          ctx.strokeStyle = `rgba(${a.color},${la})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      // Points
      for (const p of points) {
        ctx.fillStyle = `rgba(${p.color},${0.8 * alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const stepField = (dt: number) => {
      const f = dt / 16
      for (const p of points) {
        p.x += p.vx * f
        p.y += p.vy * f
        // Wrap around the viewport edges.
        if (p.x < -20) p.x = width + 20
        else if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        else if (p.y > height + 20) p.y = -20
      }
    }

    // ---- Effects -----------------------------------------------------------
    const spawn = (x: number, y: number, kind: EffectKind, color: string) => {
      if (effects.length >= MAX_EFFECTS) effects.shift()
      const e: Effect = { kind, x, y, age: 0, color, max: 900 }
      if (kind === 'burst') {
        e.max = 850
        e.parts = []
        const n = 14
        for (let i = 0; i < n; i++) {
          const ang = (i / n) * Math.PI * 2 + pseudoRand(i + x) * 0.5
          const sp = 1.6 + pseudoRand(i * 1.7 + y) * 2.2
          e.parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp })
        }
      } else if (kind === 'streak') {
        e.max = 720
        const ang = pseudoRand(x + y) * Math.PI * 2
        const sp = 6
        e.vx = Math.cos(ang) * sp
        e.vy = Math.sin(ang) * sp
      } else if (kind === 'pulse') {
        e.max = 1100
      }
      effects.push(e)
    }

    const stepAndDrawEffects = (dt: number, alpha: number) => {
      const f = dt / 16
      for (let i = effects.length - 1; i >= 0; i--) {
        const e = effects[i]
        e.age += dt
        const t = e.age / e.max
        if (t >= 1) {
          effects.splice(i, 1)
          continue
        }
        const rgb = hexToRgb(e.color)
        const fade = 1 - t

        if (e.kind === 'ripple') {
          const radius = t * 150
          ctx.strokeStyle = `rgba(${rgb},${0.55 * fade * alpha})`
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.arc(e.x, e.y, radius, 0, Math.PI * 2)
          ctx.stroke()
          // a faint inner echo
          ctx.strokeStyle = `rgba(${rgb},${0.3 * fade * alpha})`
          ctx.beginPath()
          ctx.arc(e.x, e.y, radius * 0.6, 0, Math.PI * 2)
          ctx.stroke()
        } else if (e.kind === 'burst' && e.parts) {
          for (const p of e.parts) {
            p.x += p.vx * f
            p.y += p.vy * f
            p.vx *= 0.96
            p.vy *= 0.96
          }
          // burst particles
          for (const p of e.parts) {
            ctx.fillStyle = `rgba(${rgb},${0.85 * fade * alpha})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
            ctx.fill()
          }
          // briefly form synapse links to nearby field points
          ctx.lineWidth = 1
          for (const p of e.parts) {
            for (const q of points) {
              const dx = p.x - q.x
              const dy = p.y - q.y
              const d2 = dx * dx + dy * dy
              if (d2 > 70 * 70) continue
              const la = (1 - Math.sqrt(d2) / 70) * 0.4 * fade * alpha
              ctx.strokeStyle = `rgba(${rgb},${la})`
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.stroke()
            }
          }
        } else if (e.kind === 'streak') {
          e.x += (e.vx ?? 0) * f
          e.y += (e.vy ?? 0) * f
          const len = 26
          const tailX = e.x - (e.vx ?? 0) * (len / 6)
          const tailY = e.y - (e.vy ?? 0) * (len / 6)
          const grad = ctx.createLinearGradient(tailX, tailY, e.x, e.y)
          grad.addColorStop(0, `rgba(${rgb},0)`)
          grad.addColorStop(1, `rgba(${rgb},${0.8 * fade * alpha})`)
          ctx.strokeStyle = grad
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(e.x, e.y)
          ctx.stroke()
          // packet head
          ctx.fillStyle = `rgba(${rgb},${0.9 * fade * alpha})`
          ctx.beginPath()
          ctx.arc(e.x, e.y, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (e.kind === 'pulse') {
          // localized energize: soft glow + gentle attraction of nearby points
          const radius = 18 + t * 92
          const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, radius)
          g.addColorStop(0, `rgba(${rgb},${0.32 * fade * alpha})`)
          g.addColorStop(1, `rgba(${rgb},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(e.x, e.y, radius, 0, Math.PI * 2)
          ctx.fill()
          // attract field points inward early in the pulse's life
          if (t < 0.6) {
            for (const q of points) {
              const dx = e.x - q.x
              const dy = e.y - q.y
              const d2 = dx * dx + dy * dy
              if (d2 > 150 * 150 || d2 < 1) continue
              const d = Math.sqrt(d2)
              const pull = (0.04 * (1 - d / 150)) * f
              q.vx += (dx / d) * pull
              q.vy += (dy / d) * pull
            }
          }
        }
      }
    }

    // ---- Loop --------------------------------------------------------------
    let rafId = 0
    let last = 0
    let running = false

    const fieldAlpha = () => (isDarkRef.current ? 0.16 : 0.08)

    const frame = (ts: number) => {
      if (!running) return
      rafId = requestAnimationFrame(frame)
      const dt = last ? ts - last : 16
      if (dt < FRAME_MS) return
      last = ts
      // Clamp dt so a backgrounded-then-resumed tab doesn't jump.
      const cdt = Math.min(dt, 48)
      const alpha = fieldAlpha()
      ctx.clearRect(0, 0, width, height)
      stepField(cdt)
      drawField(alpha)
      stepAndDrawEffects(cdt, alpha)
    }

    const start = () => {
      if (running) return
      running = true
      last = 0
      rafId = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(rafId)
    }

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height)
      drawField(fieldAlpha())
    }

    // ---- Sizing ------------------------------------------------------------
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildField()
      if (reduceMotion) renderStatic()
    }
    window.addEventListener('resize', resize)
    resize()

    // ---- Reduced motion: one static faint field, no interaction ------------
    if (reduceMotion) {
      renderStatic()
      return () => {
        window.removeEventListener('resize', resize)
      }
    }

    // ---- Click reactions (vary by section) ---------------------------------
    const sectionAt = (x: number, y: number): string => {
      const el = document.elementFromPoint(x, y)
      if (!el) return 'default'
      const sec = el.closest('section[id]')
      if (sec?.id && SECTION_EFFECT[sec.id]) return sec.id
      if (el.closest('footer')) return 'footer'
      return 'default'
    }
    const onClick = (e: MouseEvent) => {
      const cfg = SECTION_EFFECT[sectionAt(e.clientX, e.clientY)] ?? SECTION_EFFECT.default
      spawn(e.clientX, e.clientY, cfg.kind, cfg.color)
      if (!running && !document.hidden) start()
    }
    window.addEventListener('click', onClick)

    // ---- Visibility + viewport gating --------------------------------------
    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    start()

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  )
}

/** Deterministic pseudo-random in [0,1) — avoids Math.random for stable layout. */
function pseudoRand(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
