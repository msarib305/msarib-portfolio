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
  'Seven years of C++, Blueprints, GAS, AI, and multiplayer from Lahore. ' +
  'Currently leading engineering at SwiftNine. ' +
  'Open to studio roles in Germany and Japan, and freelance contracts worldwide.'

// Showreel: 960px wide cap with eco-quality transcoding. The element
// renders at ~600px on desktop and ~375px on mobile, so 960 is comfortable
// for 2x DPR retina. Drops payload from ~9 MB (default Cloudinary auto) to
// ~4.5 MB. h264 ensures universal codec support.
const SHOWREEL_SRC    = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_auto,q_auto:eco,w_960,vc_h264/portfolio-showreel'
const SHOWREEL_POSTER = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_jpg,q_auto:eco,w_960,so_0/portfolio-showreel'

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
    <section className="hero" aria-labelledby="hero-headline">
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
              <span className="hero-meta-value">SwiftNine · Clutched</span>
            </div>
          </div>
        </div>

        <ShowreelGlow
          src={SHOWREEL_SRC}
          poster={SHOWREEL_POSTER}
          reelLabel="SHOWREEL · 2026"
          creditsTitle="Selected highlights"
          creditsBody="Samurai Saga · TGS 2024 · NVIDIA · Cesium"
        />

      </div>
    </section>
  )
}
