import { categoryColors, techCategories, techNodes } from '../data/content'

/**
 * Static, grouped chip layout of the tech stack.
 * Used on mobile and under prefers-reduced-motion in place of the animated
 * canvas — no motion, fully readable, keyboard- and screen-reader-friendly.
 */
export function StaticStack() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {techCategories.map((category) => {
        const nodes = techNodes.filter((n) => n.category === category)
        const color = categoryColors[category]
        return (
          <div key={category} className="rounded-xl surface p-4">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted">{category}</h3>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {nodes.map((n) => (
                <li
                  key={n.id}
                  className="tech-chip"
                  style={{ borderColor: `${color}55` }}
                >
                  {n.id}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
