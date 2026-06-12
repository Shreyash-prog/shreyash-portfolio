import { about } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 01 — About" title="About" />
      <Reveal>
        <p className="max-w-3xl text-lg leading-relaxed text-muted md:text-xl md:leading-relaxed">
          {about.paragraph}
        </p>
      </Reveal>
    </section>
  )
}
