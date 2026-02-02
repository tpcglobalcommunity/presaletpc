import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

async function svgToPng(svgPath, size) {
  const pngPath = svgPath.replace('.svg', `-${size}.png`);
  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(pngPath);
  return pngPath;
}

async function generateFavicon() {
  try {
    const svg16Path = path.join(process.cwd(), 'public/favicon-16x16.svg');
    const svg32Path = path.join(process.cwd(), 'public/favicon-32x32.svg');
    const icoPath = path.join(process.cwd(), 'public/favicon.ico');

    // Check if SVG files exist
    if (!fs.existsSync(svg16Path)) {
      throw new Error('favicon-16x16.svg not found');
    }
    if (!fs.existsSync(svg32Path)) {
      throw new Error('favicon-32x32.svg not found');
    }

    // Convert SVG to PNG
    console.log('🔄 Converting SVG to PNG...');
    const png16Path = await svgToPng(svg16Path, 16);
    const png32Path = await svgToPng(svg32Path, 32);

    // Read PNG files
    const png16Buffer = fs.readFileSync(png16Path);
    const png32Buffer = fs.readFileSync(png32Path);

    // Generate ICO with multiple sizes
    console.log('🔄 Generating ICO file...');
    const icoBuffer = await pngToIco([png16Buffer, png32Buffer]);
    
    // Write ICO file
    fs.writeFileSync(icoPath, icoBuffer);
    
    // Clean up temporary PNG files
    fs.unlinkSync(png16Path);
    fs.unlinkSync(png32Path);
    
    console.log('✅ favicon.ico generated successfully!');
    console.log('📦 Contains: 16x16, 32x32 sizes');
    console.log('🎨 Using TPC emblem design');
    
  } catch (error) {
    console.error('❌ Error generating favicon.ico:', error.message);
    process.exit(1);
  }
}

generateFavicon();
