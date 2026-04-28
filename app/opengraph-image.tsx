import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'GSG Convenience Goods & More';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://goods.gsgbrands.com.gh';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #4c1d95 0%, #6B21A8 50%, #581c87 100%)',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: 60,
          position: 'relative',
        }}
      >
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${baseUrl}/fgfg.png`}
          width={360}
          height={360}
          alt="GSG"
          style={{
            objectFit: 'contain',
            marginBottom: 30,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            lineHeight: 1.1,
            display: 'flex',
          }}
        >
          Convenience Goods & More
        </div>

        {/* Footer URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            fontSize: 20,
            opacity: 0.7,
            letterSpacing: '0.05em',
            fontWeight: 500,
          }}
        >
          goods.gsgbrands.com.gh
        </div>
      </div>
    ),
    { ...size }
  );
}
