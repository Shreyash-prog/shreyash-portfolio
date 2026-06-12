import { useEffect, useRef } from 'react'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force'
import {
  categoryColors,
  techCategories,
  techEdges,
  techNodes,
  type TechCategory,
} from '../data/content'
import { useIsDark } from '../hooks/useIsDark'

interface SimNode extends SimulationNodeDatum {
  id: string
  category: TechCategory
  r: number
  /** category cluster anchor */
  ax: number
  ay: number
}

type SimLink = SimulationLinkDatum<SimNode>

const MAX_FPS = 40
const FRAME_MS = 1000 / MAX_FPS

interface ConstellationCanvasProps {
  /** Category to isolate, or null to show all. */
  isolated: TechCategory | null
}

export function ConstellationCanvas({ isolated }: ConstellationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isDark = useIsDark()

  // Keep latest `isolated` available to the render loop without restarting it.
  const isolatedRef = useRef(isolated)
  isolatedRef.current = isolated
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const tooltip = tooltipRef.current
    if (!container || !canvas || !tooltip) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = container.clientWidth
    let height = container.clientHeight

    // Node degree drives radius slightly.
    const degree = new Map<string, number>()
    for (const e of techEdges) {
      degree.set(e.source, (degree.get(e.source) ?? 0) + 1)
      degree.set(e.target, (degree.get(e.target) ?? 0) + 1)
    }

    // Cluster anchors arranged on a ring so categories separate visually.
    const anchorOf = (category: TechCategory) => {
      const idx = techCategories.indexOf(category)
      const angle = (idx / techCategories.length) * Math.PI * 2 - Math.PI / 2
      const radius = Math.min(width, height) * 0.3
      return {
        ax: width / 2 + Math.cos(angle) * radius,
        ay: height / 2 + Math.sin(angle) * radius,
      }
    }

    const nodes: SimNode[] = techNodes.map((n) => {
      const a = anchorOf(n.category)
      return {
        id: n.id,
        category: n.category,
        r: 4 + Math.min((degree.get(n.id) ?? 1) * 0.9, 6),
        ax: a.ax,
        ay: a.ay,
        x: a.ax + (((n.id.length * 53) % 60) - 30),
        y: a.ay + (((n.id.length * 31) % 60) - 30),
      }
    })
    const nodeById = new Map(nodes.map((n) => [n.id, n]))
    const links: SimLink[] = techEdges
      .filter((e) => nodeById.has(e.source) && nodeById.has(e.target))
      .map((e) => ({ source: e.source, target: e.target }))

    const sim: Simulation<SimNode, SimLink> = forceSimulation<SimNode>(nodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(38)
          .strength(0.25),
      )
      .force('charge', forceManyBody<SimNode>().strength(-120).distanceMax(260))
      .force('center', forceCenter(width / 2, height / 2).strength(0.04))
      .force('x', forceX<SimNode>((d) => d.ax).strength(0.12))
      .force('y', forceY<SimNode>((d) => d.ay).strength(0.12))
      .force(
        'collide',
        forceCollide<SimNode>((d) => d.r + 6).strength(0.85),
      )
      .alphaTarget(0.012) // gentle perpetual drift
      .velocityDecay(0.55)

    // Build adjacency for hover highlighting.
    const neighbors = new Map<string, Set<string>>()
    nodes.forEach((n) => neighbors.set(n.id, new Set()))
    for (const e of techEdges) {
      neighbors.get(e.source)?.add(e.target)
      neighbors.get(e.target)?.add(e.source)
    }

    let hovered: SimNode | null = null
    let mouse = { x: -1, y: -1 }

    const resolveColor = (cat: TechCategory) => categoryColors[cat]

    // ---- Render ----
    const render = () => {
      const dark = isDarkRef.current
      const iso = isolatedRef.current
      ctx.clearRect(0, 0, width, height)

      const activeId = hovered?.id ?? null
      const isHighlightMode = activeId !== null || iso !== null

      const isNodeActive = (n: SimNode) => {
        if (iso && n.category !== iso) return false
        if (activeId) return n.id === activeId || neighbors.get(activeId)?.has(n.id)
        return true
      }

      // Edges
      ctx.lineWidth = 1
      for (const link of links) {
        const s = link.source as SimNode
        const t = link.target as SimNode
        if (!s.x || !t.x) continue

        let active = true
        if (iso) active = s.category === iso && t.category === iso
        if (active && activeId) active = s.id === activeId || t.id === activeId
        const alpha = active ? (dark ? 0.4 : 0.45) : isHighlightMode ? 0.04 : dark ? 0.13 : 0.16

        const grad = ctx.createLinearGradient(s.x!, s.y!, t.x!, t.y!)
        grad.addColorStop(0, resolveColor(s.category))
        grad.addColorStop(1, resolveColor(t.category))
        ctx.strokeStyle = grad
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.moveTo(s.x!, s.y!)
        ctx.lineTo(t.x!, t.y!)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      // Nodes
      for (const n of nodes) {
        if (n.x == null || n.y == null) continue
        const active = isNodeActive(n)
        const color = resolveColor(n.category)
        const isFocus = n.id === activeId

        ctx.globalAlpha = active ? 1 : 0.16
        ctx.beginPath()
        ctx.arc(n.x, n.y, isFocus ? n.r + 2 : n.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()

        if (isFocus) {
          ctx.globalAlpha = 0.3
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r + 7, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }

        // Labels: only for active nodes when highlighting, else for larger hubs.
        const showLabel = isHighlightMode ? active : n.r > 7
        if (showLabel) {
          ctx.globalAlpha = active ? 0.92 : 0.25
          ctx.font = '500 10px "JetBrains Mono", monospace'
          ctx.fillStyle = dark ? '#E6EAF0' : '#0f172a'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          ctx.fillText(n.id, n.x, n.y + n.r + 3)
        }
      }
      ctx.globalAlpha = 1
    }

    // ---- Animation loop (FPS + visibility gated) ----
    let rafId = 0
    let lastFrame = 0
    let running = false

    const loop = (ts: number) => {
      if (!running) return
      rafId = requestAnimationFrame(loop)
      if (ts - lastFrame < FRAME_MS) return
      lastFrame = ts
      render()
    }

    const start = () => {
      if (running) return
      running = true
      sim.alphaTarget(0.012).restart()
      lastFrame = 0
      rafId = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      sim.alphaTarget(0)
      cancelAnimationFrame(rafId)
    }

    // Pause when off-screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) start()
        else stop()
      },
      { threshold: 0.05 },
    )
    io.observe(container)

    // Pause when tab hidden.
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (isElementInViewport(container)) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ---- Sizing ----
    const applySize = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Recompute anchors and recentre forces for the new size.
      nodes.forEach((n) => {
        const a = anchorOf(n.category)
        n.ax = a.ax
        n.ay = a.ay
      })
      sim.force('center', forceCenter(width / 2, height / 2).strength(0.04))
      sim.alpha(0.5).restart()
      render()
    }
    const ro = new ResizeObserver(applySize)
    ro.observe(container)
    applySize()

    // ---- Hover / tooltip ----
    const pickNode = (mx: number, my: number): SimNode | null => {
      let best: SimNode | null = null
      let bestDist = Infinity
      for (const n of nodes) {
        if (n.x == null || n.y == null) continue
        const d = Math.hypot(n.x - mx, n.y - my)
        const hit = n.r + 8
        if (d < hit && d < bestDist) {
          bestDist = d
          best = n
        }
      }
      return best
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      const prev = hovered
      hovered = pickNode(mouse.x, mouse.y)
      canvas.style.cursor = hovered ? 'pointer' : 'default'

      if (hovered) {
        tooltip.style.opacity = '1'
        tooltip.style.transform = `translate(${mouse.x + 14}px, ${mouse.y + 14}px)`
        tooltip.innerHTML = `<span class="block font-mono text-xs font-medium">${escapeHtml(
          hovered.id,
        )}</span><span class="block font-mono text-[10px]" style="color:${resolveColor(
          hovered.category,
        )}">${escapeHtml(hovered.category)}</span>`
      } else {
        tooltip.style.opacity = '0'
      }

      if (prev !== hovered && !running) render()
    }
    const onPointerLeave = () => {
      hovered = null
      tooltip.style.opacity = '0'
      canvas.style.cursor = 'default'
      if (!running) render()
    }
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    sim.on('tick', () => {
      if (!running) render()
    })

    return () => {
      stop()
      sim.on('tick', null)
      sim.stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
    // Re-run only on mount; `isolated`/`isDark` flow through refs + their own redraw effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className="relative h-[460px] w-full sm:h-[560px]">
      <canvas ref={canvasRef} className="block h-full w-full" role="presentation" />
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-0 top-0 z-10 rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-2.5 py-1.5 opacity-0 shadow-lift transition-opacity"
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      />
    </div>
  )
}

function isElementInViewport(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < (window.innerHeight || document.documentElement.clientHeight)
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}
