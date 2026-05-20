export function AboutHero() {
  return (
    <section className="about-hero">
      <div className="about-hero-grid">
        <div>
          <p className="eyebrow">About</p>
          <h1 className="about-h1">Lead UE5 developer from Lahore.</h1>
          <p className="about-lede">
            Seven years in engine. Six studios. Ten shipped titles. Currently leading engineering at SwiftNine.
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
              <div className="num">06</div>
              <div className="lbl">Studios</div>
            </div>
          </div>
        </div>
        <div className="about-portrait" aria-hidden="true">
          <div className="pwm">
            <div className="nm">SARIB</div>
            <div className="ro">Lead UE5 Developer</div>
          </div>
        </div>
      </div>
    </section>
  )
}
