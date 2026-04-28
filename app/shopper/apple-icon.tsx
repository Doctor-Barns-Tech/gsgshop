import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
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
          background: 'linear-gradient(135deg, #6B21A8 0%, #4c1d95 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          position: 'relative',
        }}
      >
        {/* Accent dot */}
        <div
          style={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#FB923C',
          }}
        />
        <div
          style={{
            fontSize: 90,
            lineHeight: 1,
            display: 'flex',
          }}
        >
          GSG
        </div>
        <div
          style={{
            fontSize: 18,
            opacity: 0.85,
            marginTop: 8,
            letterSpacing: '0.18em',
            fontWeight: 600,
            display: 'flex',
          }}
        >
          SHOPPER
        </div>
      </div>
    ),
    { ...size }
  );
}
