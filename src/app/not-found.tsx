import { PillButton } from '@/components/PillButton'

export const metadata = {
  title: '404: Page not found · msarib.dev',
}

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page-inner">
        <span className="error-page-code" aria-hidden="true">404</span>
        <h1 className="error-page-heading">Page not found</h1>
        <p className="error-page-body">
          That URL does not exist. Check the address or go back to the home page.
        </p>
        <PillButton href="/" variant="primary" size="lg">
          Back to home
        </PillButton>
      </div>
    </div>
  )
}
