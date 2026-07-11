import { about, type AboutSegment } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

/** Render a paragraph's inline segments, accenting `{ accent }` spans. */
function renderSegments(segments: AboutSegment[]) {
  return segments.map((seg, i) =>
    typeof seg === 'string' ? (
      seg
    ) : (
      <span key={i} className="accent-text font-medium">
        {seg.accent}
      </span>
    ),
  )
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 01 — About" title="About" />
      <div className="max-w-3xl space-y-6">
        {about.paragraphs.map((segments, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <p className="text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed">
              {renderSegments(segments)}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
