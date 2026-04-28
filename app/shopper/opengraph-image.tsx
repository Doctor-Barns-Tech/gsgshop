import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'My Personal Shopper by GSG — List Them, We Shop For You. Quality, fresh, hard-to-find goods at the source price.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #4c1d95 0%, #6B21A8 50%, #581c87 100%)',
          padding: 64,
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Decorative dot pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              'radial-gradient(white 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Decorative blur orb (top right) */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: '#FB923C',
            opacity: 0.35,
            filter: 'blur(60px)',
          }}
        />

        {/* Header / Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 'auto',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
              borderRadius: 18,
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '0.02em',
            }}
          >
            GSG
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 14,
                opacity: 0.7,
                letterSpacing: '0.3em',
                fontWeight: 600,
              }}
            >
              MY PERSONAL SHOPPER
            </span>
            <span style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>
              by GSG
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            marginBottom: 50,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.025em',
            }}
          >
            List them.
          </h1>
          <h1
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: '-0.025em',
              display: 'flex',
              gap: 22,
            }}
          >
            <span style={{ color: '#FB923C' }}>We shop</span>
            <span>for you.</span>
          </h1>

          <p
            style={{
              fontSize: 28,
              opacity: 0.85,
              marginTop: 28,
              marginBottom: 0,
              maxWidth: 880,
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            Quality, fresh, hard-to-find — delivered at the{' '}
            <span style={{ fontWeight: 700, color: 'white' }}>
              exact source price
            </span>
            .
          </p>
        </div>

        {/* Trust strip */}
        <div
          style={{
            display: 'flex',
            gap: 18,
            position: 'relative',
            flexWrap: 'wrap',
          }}
        >
          {[
            'Source-price guarantee',
            '5% commission or less',
            'WhatsApp updates 24/7',
            'Same-day in Accra',
          ].map((label) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 999,
                padding: '14px 22px',
                fontSize: 20,
                fontWeight: 600,
                color: 'white',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 64,
            fontSize: 18,
            opacity: 0.7,
            fontWeight: 500,
            letterSpacing: '0.05em',
            display: 'flex',
          }}
        >
          shopper.gsgbrands.com.gh
        </div>
      </div>
    ),
    { ...size }
  );
}
