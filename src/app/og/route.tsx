import { ImageResponse }   from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title   = searchParams.get('title')   ?? 'Lead UE5 Developer'
  const eyebrow = searchParams.get('eyebrow') ?? 'msarib.dev'

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width:           '100%',
            height:          '100%',
            display:         'flex',
            flexDirection:   'column',
            justifyContent:  'space-between',
            backgroundColor: '#101014',
            padding:         '60px',
            position:        'relative',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex' }}>
            <span
              style={{
                fontSize:      14,
                color:         '#00d9c4',
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontFamily:    'system-ui, sans-serif',
                fontWeight:    500,
              }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: '20px' }}>
            <span
              style={{
                fontSize:   title.length > 30 ? 56 : 72,
                color:      '#ffffff',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 900,
                lineHeight: 1.1,
                maxWidth:   '900px',
                wordBreak:  'break-word' as const,
              }}
            >
              {title}
            </span>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display:        'flex',
              justifyContent: 'space-between',
              alignItems:     'flex-end',
              width:          '100%',
              paddingBottom:  '20px',
            }}
          >
            <span
              style={{
                fontSize:   13,
                color:      'rgba(255,255,255,0.35)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              msarib.dev
            </span>
            <span
              style={{
                fontSize:   60,
                color:      '#00d9c4',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              S
            </span>
          </div>

          {/* Teal bottom border */}
          <div
            style={{
              position:        'absolute',
              bottom:          0,
              left:            0,
              right:           0,
              height:          3,
              backgroundColor: '#00d9c4',
            }}
          />
        </div>
      ),
      {
        width:  1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
    )
  } catch (err) {
    console.error('[og] ImageResponse failed:', err)
    return new Response('Failed to generate image', { status: 500 })
  }
}
