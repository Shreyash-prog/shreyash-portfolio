import { Github, Linkedin, Mail, Phone } from 'lucide-react'
import { contact, profile } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading kicker="// 07 — Contact" title={contact.heading} />

      <Reveal>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">{contact.invitation}</p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-gradient px-5 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
          >
            <Mail size={17} aria-hidden="true" />
            {profile.email}
          </a>
          <a
            href={profile.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-5 py-3 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <Phone size={17} aria-hidden="true" />
            {profile.phone}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-5 py-3 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <Github size={17} aria-hidden="true" />
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border)] surface px-5 py-3 text-sm font-medium transition-colors hover:border-accent-cyan"
          >
            <Linkedin size={17} aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </Reveal>
    </section>
  )
}
