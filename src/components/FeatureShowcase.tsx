import { PillButton } from '@/components/PillButton'

// TODO: replace with real TGS 2024 photo once uploaded to Cloudinary (msarib/feature-showcase/tgs-2024)
const SHOWCASE_IMG    = 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_fill,g_auto,w_1200/sample'
const SHOWCASE_ALT    = 'Anime Action — TGS 2024 floor demo, Vmmersion'
const SHOWCASE_CREDIT = 'Anime Action · TGS 2024 · Vmmersion'

export function FeatureShowcase() {
  return (
    <section className="feature-showcase" aria-labelledby="leadership-heading">
      <div className="feature-text">
        <p className="eyebrow">Engineering leadership</p>
        <h2 id="leadership-heading">
          The systems other engineers will inherit.
        </h2>
        <p>
          I write the Blueprint coding standards. I set the per-device draw
          call budgets. I run the hiring rubrics and the code reviews. The
          work I do is the work nobody sees until it ships, which is the work
          that makes everything else possible.
        </p>
        <PillButton variant="primary" size="lg" href="/about">
          More about me
        </PillButton>
      </div>

      <div className="feature-visual-wrap">
        {/* Blurred glow sits behind the frame at z-index 0.
            Same src as the main image; one HTTP request total. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SHOWCASE_IMG}
          alt=""
          className="feature-img-glow"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
        <div className="feature-visual-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SHOWCASE_IMG}
            alt={SHOWCASE_ALT}
            className="feature-img"
            loading="lazy"
            decoding="async"
          />
          <span className="feature-credit" aria-hidden="true">
            {SHOWCASE_CREDIT}
          </span>
        </div>
      </div>
    </section>
  )
}
