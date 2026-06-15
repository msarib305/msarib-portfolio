interface AtmosphericGradientProps {
  className?: string
}

export function AtmosphericGradient({ className }: AtmosphericGradientProps) {
  return (
    <div className={`atm-wrapper${className ? ` ${className}` : ''}`} aria-hidden="true">
      <svg
        className="atm-blobs"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Phase 21.3 palette (Option A: teal / purple / pink, T-P-K-T-P).
            Each circle keeps its prior alpha for the depth falloff; only the hue
            changes. teal #55D4C4, purple #C075E9, pink #F9B7BF. */}
        <circle className="atm-b1" cx="180"  cy="140"  r="110" fill="rgba(85,212,196,0.40)" />
        <circle className="atm-b2" cx="950"  cy="440"  r="95"  fill="rgba(192,117,233,0.32)" />
        <circle className="atm-b3" cx="580"  cy="320"  r="85"  fill="rgba(249,183,191,0.26)" />
        <circle className="atm-b4" cx="120"  cy="520"  r="70"  fill="rgba(85,212,196,0.22)" />
        <circle className="atm-b5" cx="1080" cy="100"  r="60"  fill="rgba(192,117,233,0.18)" />
      </svg>
    </div>
  )
}
