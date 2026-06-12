import { Reveal } from './Reveal'

interface SectionHeadingProps {
  kicker: string
  title: string
}

/** Mono kicker with an accent marker, followed by a display-font title. */
export function SectionHeading({ kicker, title }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-accent-gradient" aria-hidden="true" />
        <span className="kicker">{kicker}</span>
      </div>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
    </Reveal>
  )
}
