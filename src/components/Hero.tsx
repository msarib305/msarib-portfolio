import { ShowreelGlow } from '@/components/ShowreelGlow'
import { PillButton }   from '@/components/PillButton'

// Headline (Phase 25.7.a): rendered as two block-level sentence lines that
// reveal per-line, not per-character. The previous per-character inline-block
// split jumbled on iOS 18 Safari after a client-side route return (Safari
// failed to re-measure the inline-block boxes and wrapped one char per line).
// Per-line block elements have nothing per-character for Safari to re-measure,
// so the layout is structurally immune. See DEC-089 / 25.7.a.

const SUBHEAD =
  'Seven years of C++, Blueprints, GAS, AI, and multiplayer. ' +
  'Currently leading engineering at SwiftNine. ' +
  'Open to studio roles in Germany and Japan, and freelance contracts worldwide.'

// Showreel (Phase 21.1): portfolio-showreel-new, 720p source. 1280px wide cap
// with eco-quality transcoding; f_auto serves WebM/VP9 to Chrome and MP4 to
// Safari, so no explicit codec is needed. Served ~2.9 MB WebM to Chrome.
const SHOWREEL_SRC    = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_auto,q_auto:eco,w_1280/portfolio-showreel-new.mp4'
const SHOWREEL_POSTER = 'https://res.cloudinary.com/ddgwzcrim/video/upload/f_jpg,q_auto:eco,w_1280,so_0/portfolio-showreel-new'

export function Hero() {
  return (
    <section className="hero section-container section-container--hero" aria-labelledby="hero-headline">
      <div className="hero-grid">

        <div className="hero-text">
          <h1 id="hero-headline" className="hero-headline">
            <span className="msarib-hero-line">I build gameplay systems.</span>
            <span className="msarib-hero-line">You ship the next one.</span>
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
