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
        <circle className="atm-b1" cx="160"  cy="120"  r="340" fill="rgba(0,217,196,0.35)" />
        <circle className="atm-b2" cx="950"  cy="440"  r="290" fill="rgba(0,217,196,0.25)" />
        <circle className="atm-b3" cx="580"  cy="320"  r="250" fill="rgba(0,217,196,0.20)" />
        <circle className="atm-b4" cx="100"  cy="520"  r="210" fill="rgba(0,217,196,0.15)" />
        <circle className="atm-b5" cx="1080" cy="80"   r="180" fill="rgba(0,217,196,0.12)" />
      </svg>
    </div>
  )
}
