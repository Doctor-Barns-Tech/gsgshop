import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'GSG Convenience Goods & More - Premium Convenience Shopping';
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #4c1d95, #7c3aed)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          {/* Logo Placeholder - simplified since we can't easily load external images in edge without fetch */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#4c1d95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <h1 style={{ fontSize: '60px', fontWeight: 'bold', margin: 0 }}>GSG Shop</h1>
        </div>
        <p style={{ fontSize: '30px', maxWidth: '800px', margin: 0, opacity: 0.9 }}>
          Premium Convenience Goods Delivered to Your Doorstep
        </p>
        <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
             <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>Fast Delivery</div>
             <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>Quality Assured</div>
             <div style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>Secure Payment</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
