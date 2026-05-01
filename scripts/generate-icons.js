/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Regenerate every site icon (favicons, PWA, maskable, og fallback)
 * from public/fgfg.png. Run after replacing fgfg.png:
 *
 *   npm install --no-save png-to-ico
 *   node scripts/generate-icons.js
 *
 * sharp is already a project dependency. png-to-ico is only needed
 * locally to produce the multi-resolution favicon.ico, so we keep it
 * out of package.json.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default;

const SRC = path.join(__dirname, '..', 'public', 'fgfg.png');
const PUB = path.join(__dirname, '..', 'public');
const ICONS = path.join(PUB, 'icons');

if (!fs.existsSync(SRC)) {
    console.error('Source not found:', SRC);
    process.exit(1);
}

if (!fs.existsSync(ICONS)) {
    fs.mkdirSync(ICONS, { recursive: true });
}

// Helper: create a square icon centered on white background.
// safeZoneRatio: fraction of canvas the actual logo should occupy (1.0 = fill, 0.7 = 70% with padding).
async function squareIcon(size, safeZoneRatio = 0.85, background = { r: 255, g: 255, b: 255, alpha: 1 }) {
    const innerSize = Math.round(size * safeZoneRatio);
    const resized = await sharp(SRC)
        .resize(innerSize, innerSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();

    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background,
        },
    })
        .composite([{ input: resized, gravity: 'center' }])
        .png({ compressionLevel: 9 })
        .toBuffer();
}

// Transparent variant for browser favicons (looks better on dark/light tabs)
async function transparentIcon(size, safeZoneRatio = 0.95) {
    const innerSize = Math.round(size * safeZoneRatio);
    const resized = await sharp(SRC)
        .resize(innerSize, innerSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();

    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 },
        },
    })
        .composite([{ input: resized, gravity: 'center' }])
        .png({ compressionLevel: 9 })
        .toBuffer();
}

async function writeIcon(filepath, buffer) {
    fs.writeFileSync(filepath, buffer);
    console.log('  ', path.relative(path.join(__dirname, '..'), filepath), `(${buffer.length} bytes)`);
}

async function run() {
    console.log('Generating PWA / app icons (white square background, 85% safe zone)...');
    const pwaSizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
    for (const size of pwaSizes) {
        const buf = await squareIcon(size, 0.85);
        await writeIcon(path.join(ICONS, `icon-${size}x${size}.png`), buf);
    }

    console.log('\nGenerating maskable icons (white square background, 70% safe zone)...');
    for (const size of [192, 512]) {
        const buf = await squareIcon(size, 0.7);
        await writeIcon(path.join(ICONS, `icon-maskable-${size}x${size}.png`), buf);
    }

    console.log('\nGenerating browser favicons (transparent square background)...');
    const fav32 = await transparentIcon(32, 0.95);
    await writeIcon(path.join(PUB, 'favicon.png'), fav32);

    console.log('\nGenerating multi-resolution favicon.ico (16, 32, 48)...');
    const ico16 = await transparentIcon(16, 0.95);
    const ico32 = await transparentIcon(32, 0.95);
    const ico48 = await transparentIcon(48, 0.95);
    const tmpDir = path.join(__dirname, '..', '.ico-tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, '16.png'), ico16);
    fs.writeFileSync(path.join(tmpDir, '32.png'), ico32);
    fs.writeFileSync(path.join(tmpDir, '48.png'), ico48);
    const icoBuf = await pngToIco([
        path.join(tmpDir, '16.png'),
        path.join(tmpDir, '32.png'),
        path.join(tmpDir, '48.png'),
    ]);
    fs.writeFileSync(path.join(PUB, 'favicon.ico'), icoBuf);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    console.log('  ', 'public/favicon.ico', `(${icoBuf.length} bytes)`);

    console.log('\nGenerating og-image fallback (1200x630, white background)...');
    const og = await sharp({
        create: {
            width: 1200,
            height: 630,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
    })
        .composite([
            {
                input: await sharp(SRC)
                    .resize(800, 400, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
                    .png()
                    .toBuffer(),
                gravity: 'center',
            },
        ])
        .png({ compressionLevel: 9 })
        .toBuffer();
    await writeIcon(path.join(PUB, 'og-image.png'), og);

    console.log('\nDone.');
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
