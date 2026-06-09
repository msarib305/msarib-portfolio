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
        <circle className="atm-b1" cx="180"  cy="140"  r="110" fill="rgba(0,217,196,0.40)" />
        <circle className="atm-b2" cx="950"  cy="440"  r="95"  fill="rgba(0,217,196,0.32)" />
        <circle className="atm-b3" cx="580"  cy="320"  r="85"  fill="rgba(0,217,196,0.26)" />
        <circle className="atm-b4" cx="120"  cy="520"  r="70"  fill="rgba(0,217,196,0.22)" />
        <circle className="atm-b5" cx="1080" cy="100"  r="60"  fill="rgba(0,217,196,0.18)" />
      </svg>
    </div>
  )
}
