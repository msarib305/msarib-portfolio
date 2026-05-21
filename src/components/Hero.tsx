import { Fragment }     from 'react'
import { ShowreelGlow } from '@/components/ShowreelGlow'
import { PillButton }   from '@/components/PillButton'

const HEADLINE_LINE_1 = ['I', 'build', 'gameplay', 'systems.']
const HEADLINE_LINE_2 = ['You', 'ship', 'the', 'next', 'one.']
const HEADLINE_COUNT  = HEADLINE_LINE_1.length + HEADLINE_LINE_2.length  /* 9 */

const SUBHEAD =
  'Seven years of C++, Blueprints, GAS, AI, and multiplayer from Lahore. ' +
  'Currently leading engineering at SwiftNine. ' +
  'Open to studio roles in Germany and Japan, and freelance contracts worldwide.'

const SUBHEAD_WORDS = SUBHEAD.split(/\s+/).filter(Boolean)

// Showreel: 960px wide cap with eco-quality transcoding. The element
// renders at ~600px on desktop and ~375px on mobile, so 960 is comfortable
// for 2x DPR retina. Drops payload from ~9 MB (default Cloudinary auto) to
// ~4.5 MB. h264 ensures universal codec support.
const SHOWREEL_SRC    = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_auto,q_auto:eco,w_960,vc_h264/portfolio-showreel'
const SHOWREEL_POSTER = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_jpg,q_auto:eco,w_960,so_0/portfolio-showreel'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="hero-grid">

        <div className="hero-text">
          <h1 id="hero-headline" className="hero-headline">
            {HEADLINE_LINE_1.map((word, i, arr) => (
              /* Space is a sibling text node, not inside the inline-block span.
                 Trailing space inside inline-block doesn't contribute to
                 inter-element spacing in inline flow. */
              <Fragment key={i}>
                <span
                  className="hero-headline-word"
                  style={{ animationDelay: `${100 + i * 70}ms` }}
                >
                  {word}
                </span>
                {i < arr.length - 1 && ' '}
              </Fragment>
            ))}
            <span className="hero-headline-accent">
              {HEADLINE_LINE_2.map((word, i, arr) => (
                <Fragment key={i}>
                  <span
                    className="hero-headline-word"
                    style={{
                      animationDelay: `${100 + (HEADLINE_LINE_1.length + i) * 70}ms`,
                    }}
                  >
                    {word}
                  </span>
                  {i < arr.length - 1 && ' '}
                </Fragment>
              ))}
            </span>
          </h1>

          <p className="hero-subhead">
            {SUBHEAD_WORDS.map((word, i, arr) => (
              <Fragment key={i}>
                <span
                  className="hero-subhead-word"
                  style={{
                    animationDelay: `${100 + HEADLINE_COUNT * 70 + 200 + i * 60}ms`,
                  }}
                >
                  {word}
                </span>
                {i < arr.length - 1 && ' '}
              </Fragment>
            ))}
          </p>

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
              <span className="hero-meta-value">10 · Six studios</span>
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
