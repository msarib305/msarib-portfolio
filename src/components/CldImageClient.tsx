'use client'
// next-cloudinary's CldImage uses useState internally but ships without a
// 'use client' directive. This wrapper establishes the client boundary so
// it can be used safely from Server Components.
export { CldImage } from 'next-cloudinary'
