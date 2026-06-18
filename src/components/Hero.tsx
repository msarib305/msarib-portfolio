import { Fragment }     from 'react'
import { ShowreelGlow } from '@/components/ShowreelGlow'
import { PillButton }   from '@/components/PillButton'

const HEADLINE_LINE_1 = ['I', 'build', 'gameplay', 'systems.']
const HEADLINE_LINE_2 = ['You', 'ship', 'the', 'next', 'one.']

// Precompute each word's starting character offset across both lines so the
// per-character stagger is continuous. Done at module scope to keep the render
// free of mutation (react-hooks/immutability).
interface AnnotatedWord { word: string; start: number }
function annotate(words: string[], start: number): { words: AnnotatedWord[]; next: number } {
  const out: AnnotatedWord[] = []
  let offset = start
  for (const word of words) {
    out.push({ word, start: offset })
    offset += word.length
  }
  return { words: out, next: offset }
}
const LINE_1 = annotate(HEADLINE_LINE_1, 0)
const LINE_2 = annotate(HEADLINE_LINE_2, LINE_1.next)

const SUBHEAD =
  'Seven years of C++, Blueprints, GAS, AI, and multiplayer. ' +
  'Currently leading engineering at SwiftNine. ' +
  'Open to studio roles in Germany and Japan, and freelance contracts worldwide.'

// Showreel (Phase 21.1): portfolio-showreel-new, 720p source. 1280px wide cap
// with eco-quality transcoding; f_auto serves WebM/VP9 to Chrome and MP4 to
// Safari, so no explicit codec is needed. Served ~2.9 MB WebM to Chrome.
const SHOWREEL_SRC    = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_auto,q_auto:eco,w_1280/portfolio-showreel-new.mp4'
const SHOWREEL_POSTER = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_jpg,q_auto:eco,w_1280,so_0/portfolio-showreel-new'

function renderWord(word: string, charOffset: number) {
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      {word.split('').map((char, ci) => (
        <span
          key={ci}
          className="hero-char"
          style={{ animationDelay: `${(charOffset + ci) * 10}ms` }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  return (
    <section className="hero section-container section-container--hero" aria-labelledby="hero-headline">
      <div className="hero-grid">

        <div className="hero-text">
          <h1 id="hero-headline" className="hero-headline">
            {LINE_1.words.map(({ word, start }, i, arr) => (
              <Fragment key={i}>
                {renderWord(word, start)}
                {i < arr.length - 1 && ' '}
              </Fragment>
            ))}
            <span className="hero-headline-accent">
              {LINE_2.words.map(({ word, start }, i, arr) => (
                <Fragment key={i}>
                  {renderWord(word, start)}
                  {i < arr.length - 1 && ' '}
                </Fragment>
              ))}
            </span>
          </h1>

          <p className="hero-subhead">{SUBHEAD}</p>

          <div className="hero-actions">
            <PillButton variant="primary" size="lg" href="/contact">
              Get in touch
            </PillButton>
            <PillButton variant="secondary" size="lg" href="/work">
              View my work
            </PillButton>
          </div>

          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-label">Years in engine</span>
              <span className="hero-meta-value">07 · UE4 to UE5</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">Shipped projects</span>
              <span className="hero-meta-value">10 · Five studios</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">Currently</span>
              <span className="hero-meta-value" translate="no">SwiftNine · Clutched</span>
            </div>
          </div>
        </div>

        <ShowreelGlow
          src={SHOWREEL_SRC}
          poster={SHOWREEL_POSTER}
          reelLabel="SHOWREEL · 2026"
          creditsTitle="Selected highlights"
          creditsBody="Samurai Saga · NVIDIA · Valayt · TRESverse · Character Creator"
        />

      </div>
    </section>
  )
}
