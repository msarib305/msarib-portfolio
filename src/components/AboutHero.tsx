import { CldImage }          from '@/components/CldImageClient'
import { cloudinaryPublicId } from '@/lib/cloudinary'

const PORTRAIT_ID = cloudinaryPublicId(
  'https://res.cloudinary.com/ddgwzcrim/image/upload/v1780686320/Self_Portrait_bpeyny.jpg'
)

const PORTRAIT_GLOW_SRC =
  'https://res.cloudinary.com/ddgwzcrim/image/upload/w_200,q_auto:low/Self_Portrait_bpeyny.jpg'

export function AboutHero() {
  return (
    <section className="about-hero section-container section-container--hero">
      <div className="about-hero-grid">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="about-h1">Lead UE5 developer.</h1>
          <p className="about-lede">
            Seven years in engine. Five studios. Ten shipped titles. Currently leading engineering at SwiftNine.
          </p>
          <div className="about-stats">
            <div className="about-stat">
              <div className="num">07</div>
              <div className="lbl">Years in engine</div>
            </div>
            <div className="about-stat">
              <div className="num">10</div>
              <div className="lbl">Shipped titles</div>
            </div>
            <div className="about-stat">
              <div className="num">05</div>
              <div className="lbl">Studios</div>
            </div>
          </div>
        </div>
        <div className="about-portrait-outer">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative blur glow, aria-hidden */}
          <img
            src={PORTRAIT_GLOW_SRC}
            aria-hidden="true"
            alt=""
            className="about-portrait-glow"
          />
          <div className="about-portrait">
            <CldImage
              src={PORTRAIT_ID}
              alt="Portrait of Sarib, Lead Unreal Engine 5 Developer based in Lahore"
              fill
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 600px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
