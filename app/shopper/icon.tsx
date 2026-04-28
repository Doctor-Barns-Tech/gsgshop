import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6B21A8 0%, #4c1d95 100%)',
          borderRadius: 14,
          color: 'white',
          fontFamily: 'sans-serif',
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: '-0.04em',
          position: 'relative',
        }}
      >
        {/* Small accent dot for the "shopper" mark */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#FB923C',
          }}
        />
        S
      </div>
    ),
    { ...size }
  );
}
