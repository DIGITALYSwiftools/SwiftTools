// app/api/design/color-palette/route.js
import { NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// RGB -> Hex
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

// Calculate relative luminance (WCAG 2.1)
function getRelativeLuminance(r, g, b) {
  const sRGB = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// RGB to HSL conversion
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Calculate color difference using Delta E
function colorDifference(rgb1, rgb2) {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  
  const [lab1, lab2] = [rgb1, rgb2].map(rgb => {
    const [r, g, b] = rgb.map(c => c / 255);
    
    const rLin = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    const gLin = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    const bLin = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    const x = rLin * 0.4124564 + gLin * 0.3575761 + bLin * 0.1804375;
    const y = rLin * 0.2126729 + gLin * 0.7151522 + bLin * 0.0721750;
    const z = rLin * 0.0193339 + gLin * 0.1191920 + bLin * 0.9503041;
    
    const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16/116);
    const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16/116);
    const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16/116);
    
    const L = (116 * fy) - 16;
    const a = 500 * (fx - fy);
    const bLab = 200 * (fy - fz);
    
    return [L, a, bLab];
  });
  
  const dL = lab1[0] - lab2[0];
  const da = lab1[1] - lab2[1];
  const db = lab1[2] - lab2[2];
  
  return Math.sqrt(dL * dL + da * da + db * db);
}

// Median Cut Algorithm
function medianCutQuantization(pixels, colorCount) {
  if (pixels.length === 0) return [];
  
  let colorBuckets = [pixels.map(pixel => ({
    r: pixel.r,
    g: pixel.g,
    b: pixel.b,
    count: pixel.count || 1
  }))];
  
  while (colorBuckets.length < colorCount && colorBuckets.some(b => b.length > 1)) {
    const newBuckets = [];
    
    for (const bucket of colorBuckets) {
      if (bucket.length <= 1) {
        newBuckets.push(bucket);
        continue;
      }
      
      let rMin = 255, rMax = 0;
      let gMin = 255, gMax = 0;
      let bMin = 255, bMax = 0;
      
      for (const color of bucket) {
        rMin = Math.min(rMin, color.r);
        rMax = Math.max(rMax, color.r);
        gMin = Math.min(gMin, color.g);
        gMax = Math.max(gMax, color.g);
        bMin = Math.min(bMin, color.b);
        bMax = Math.max(bMax, color.b);
      }
      
      const rRange = rMax - rMin;
      const gRange = gMax - gMin;
      const bRange = bMax - bMin;
      
      let sortChannel;
      if (rRange >= gRange && rRange >= bRange) {
        sortChannel = 'r';
      } else if (gRange >= rRange && gRange >= bRange) {
        sortChannel = 'g';
      } else {
        sortChannel = 'b';
      }
      
      bucket.sort((a, b) => a[sortChannel] - b[sortChannel]);
      
      const median = Math.floor(bucket.length / 2);
      newBuckets.push(bucket.slice(0, median));
      newBuckets.push(bucket.slice(median));
    }
    
    colorBuckets = newBuckets;
  }
  
  const colors = colorBuckets.map(bucket => {
    if (bucket.length === 0) return null;
    
    let totalR = 0, totalG = 0, totalB = 0, totalCount = 0;
    
    for (const color of bucket) {
      totalR += color.r * color.count;
      totalG += color.g * color.count;
      totalB += color.b * color.count;
      totalCount += color.count;
    }
    
    return {
      r: Math.round(totalR / totalCount),
      g: Math.round(totalG / totalCount),
      b: Math.round(totalB / totalCount),
      weight: bucket.length / pixels.length
    };
  }).filter(color => color !== null);
  
  return colors;
}

// Get color name
function getColorName(r, g, b) {
  const hsl = rgbToHsl(r, g, b);
  const { h, s, l } = hsl;
  
  if (l < 15) return "Black";
  if (l > 95 && s < 10) return "White";
  if (s < 20) {
    if (l < 35) return "Dark Gray";
    if (l > 65) return "Light Gray";
    return "Gray";
  }
  
  if (h >= 0 && h < 15) return s > 50 ? "Red" : "Pink";
  if (h >= 15 && h < 45) return "Orange";
  if (h >= 45 && h < 65) return "Yellow";
  if (h >= 65 && h < 150) {
    if (l > 70) return "Light Green";
    if (l < 40) return "Dark Green";
    return "Green";
  }
  if (h >= 150 && h < 195) return "Cyan";
  if (h >= 195 && h < 240) {
    if (l > 70) return "Light Blue";
    if (l < 40) return "Dark Blue";
    return "Blue";
  }
  if (h >= 240 && h < 280) {
    if (s < 40) return "Lavender";
    return "Purple";
  }
  if (h >= 280 && h < 330) return "Magenta";
  return "Red";
}

// Analyze image and suggest dark/light/medium colors
function analyzeImageTones(image) {
  const width = image.width;
  const height = image.height;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, width, height);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  
  const tones = {
    dark: { r: 0, g: 0, b: 0, count: 0 },
    light: { r: 0, g: 0, b: 0, count: 0 },
    medium: { r: 0, g: 0, b: 0, count: 0 }
  };
  
  const brightnessThresholds = {
    dark: 85,    // 0-85: dark
    medium: 170  // 86-170: medium, 171-255: light
  };
  
  // Analyze brightness distribution
  for (let i = 0; i < pixels.length; i += 16) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];
    
    if (alpha < 128) continue;
    
    const brightness = Math.round((r + g + b) / 3);
    
    if (brightness <= brightnessThresholds.dark) {
      tones.dark.r += r;
      tones.dark.g += g;
      tones.dark.b += b;
      tones.dark.count++;
    } else if (brightness <= brightnessThresholds.medium) {
      tones.medium.r += r;
      tones.medium.g += g;
      tones.medium.b += b;
      tones.medium.count++;
    } else {
      tones.light.r += r;
      tones.light.g += g;
      tones.light.b += b;
      tones.light.count++;
    }
  }
  
  // Calculate average colors for each tone category
  const result = {};
  for (const [tone, data] of Object.entries(tones)) {
    if (data.count > 0) {
      result[tone] = {
        r: Math.round(data.r / data.count),
        g: Math.round(data.g / data.count),
        b: Math.round(data.b / data.count),
        percentage: (data.count / (pixels.length / 16)) * 100
      };
    } else {
      // Default fallback colors
      result[tone] = {
        r: tone === 'dark' ? 30 : tone === 'medium' ? 150 : 230,
        g: tone === 'dark' ? 30 : tone === 'medium' ? 150 : 230,
        b: tone === 'dark' ? 30 : tone === 'medium' ? 150 : 230,
        percentage: 0
      };
    }
  }
  
  return result;
}

// Extract dominant colors and categorize by tone
function getDominantColorsWithTones(image, colorCount = 6) {
  const width = image.width;
  const height = image.height;
  
  const sampleWidth = Math.min(width, 200);
  const sampleHeight = Math.min(height, 200);
  const scale = Math.min(sampleWidth / width, sampleHeight / height);
  
  const canvas = createCanvas(sampleWidth, sampleHeight);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height, 0, 0, sampleWidth, sampleHeight);
  
  const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  const pixels = imageData.data;
  
  // Analyze image tones first
  const imageTones = analyzeImageTones(image);
  
  // Extract colors with quantization
  const colorMap = new Map();
  const quantizationLevel = 16;
  
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];
    
    if (alpha < 128) continue;
    
    const brightness = (r + g + b) / 3;
    if (brightness < 5 || brightness > 250) continue;
    
    const qr = Math.round(r / quantizationLevel) * quantizationLevel;
    const qg = Math.round(g / quantizationLevel) * quantizationLevel;
    const qb = Math.round(b / quantizationLevel) * quantizationLevel;
    
    const key = `${qr},${qg},${qb}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  
  const pixelArray = Array.from(colorMap.entries()).map(([key, count]) => {
    const [r, g, b] = key.split(',').map(Number);
    return { r, g, b, count };
  });
  
  const quantizedColors = medianCutQuantization(pixelArray, colorCount * 2);
  
  // Categorize colors by tone and deduplicate
  const categorizedColors = {
    dark: [],
    medium: [],
    light: [],
    vibrant: [] // High saturation colors
  };
  
  const colorThreshold = 15;
  
  for (const color of quantizedColors) {
    const { r, g, b, weight } = color;
    const hsl = rgbToHsl(r, g, b);
    const brightness = (r + g + b) / 3;
    
    // Categorize by brightness
    let category;
    if (brightness <= 85) {
      category = 'dark';
    } else if (brightness <= 170) {
      category = 'medium';
    } else {
      category = 'light';
    }
    
    // Also check for vibrant colors (high saturation)
    if (hsl.s > 60) {
      // Check if not already in vibrant
      let isDuplicate = false;
      for (const vibrantColor of categorizedColors.vibrant) {
        const diff = colorDifference([r, g, b], [vibrantColor.r, vibrantColor.g, vibrantColor.b]);
        if (diff < colorThreshold) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        categorizedColors.vibrant.push({ ...color, hsl });
      }
    }
    
    // Check if color is too similar to already selected colors in its category
    let isUnique = true;
    for (const selected of categorizedColors[category]) {
      const diff = colorDifference([r, g, b], [selected.r, selected.g, selected.b]);
      if (diff < colorThreshold) {
        isUnique = false;
        break;
      }
    }
    
    if (isUnique) {
      categorizedColors[category].push({ ...color, hsl });
    }
  }
  
  // Sort each category by importance and limit
  Object.keys(categorizedColors).forEach(category => {
    categorizedColors[category].sort((a, b) => b.weight - a.weight);
    categorizedColors[category] = categorizedColors[category].slice(0, Math.ceil(colorCount / 3));
  });
  
  // Combine all colors, prioritizing vibrant ones
  const allColors = [
    ...categorizedColors.vibrant,
    ...categorizedColors.dark,
    ...categorizedColors.medium,
    ...categorizedColors.light
  ].slice(0, colorCount);
  
  // Sort final colors by brightness for better visual presentation
  allColors.sort((a, b) => {
    const brightnessA = (a.r + a.g + a.b) / 3;
    const brightnessB = (b.r + b.g + b.b) / 3;
    return brightnessA - brightnessB;
  });
  
  return {
    colors: allColors,
    toneAnalysis: imageTones,
    categories: {
      dark: categorizedColors.dark.slice(0, 2),
      medium: categorizedColors.medium.slice(0, 2),
      light: categorizedColors.light.slice(0, 2),
      vibrant: categorizedColors.vibrant.slice(0, 2)
    }
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const colorCount = parseInt(formData.get("colorCount") || "6");

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid image file" }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 20MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const img = await loadImage(imageBuffer);

    const { colors, toneAnalysis, categories } = getDominantColorsWithTones(img, Math.min(Math.max(colorCount, 3), 12));

    // Calculate dynamic dimensions based on content
    const blockSize = 100;
    const spacing = 8;
    const textHeight = 45;
    
    // Main palette section
    const mainPaletteWidth = colors.length * (blockSize + spacing) - spacing;
    const mainPaletteHeight = blockSize + textHeight + 30;
    
    // Tone analysis section
    const toneBlockWidth = 90;
    const toneBlockHeight = 40;
    const toneSpacing = 15;
    const toneLabelsWidth = 3 * toneBlockWidth + 2 * toneSpacing;
    const toneAnalysisHeight = 140;
    
    // Category suggestions section
    const categoryBlockSize = 30;
    const categorySpacing = 10;
    const categoryRowHeight = 80;
    
    // Calculate total dimensions
    const sectionPadding = 30;
    const sectionSpacing = 25;
    
    const totalWidth = Math.max(mainPaletteWidth, toneLabelsWidth) + (sectionPadding * 2);
    const totalHeight = 
      sectionPadding + // Top padding
      mainPaletteHeight + 
      sectionSpacing +
      toneAnalysisHeight +
      sectionSpacing +
      categoryRowHeight +
      sectionPadding + 30; // Bottom padding + footer space
    
    const canvas = createCanvas(totalWidth, totalHeight);
    const ctx = canvas.getContext("2d");

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
    bgGradient.addColorStop(0, '#ffffff');
    bgGradient.addColorStop(0.5, '#f8f9fa');
    bgGradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    let currentY = sectionPadding;

    // Title
    ctx.fillStyle = '#2c3e50';
    // Use system fonts that work on Vercel/Linux
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Color Palette Analysis', totalWidth / 2, currentY);
    currentY += 40;

    // Main Palette Section
    const mainPaletteX = (totalWidth - mainPaletteWidth) / 2;
    
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
    ctx.fillStyle = '#34495e';
    ctx.textAlign = 'center';
    ctx.fillText('Dominant Colors', totalWidth / 2, currentY);
    currentY += 25;

    colors.forEach((color, i) => {
      const x = mainPaletteX + i * (blockSize + spacing);
      const { r, g, b } = color;
      
      // Color block with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, currentY, blockSize, blockSize);
      
      ctx.shadowColor = 'transparent';
      
      // Block border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, currentY, blockSize, blockSize);
      
      // Color info
      const hex = rgbToHex(r, g, b);
      const name = getColorName(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      const textColor = brightness > 150 ? '#000000' : '#FFFFFF';
      const bgAlpha = brightness > 150 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)';
      
      // Info background
      ctx.fillStyle = bgAlpha;
      const infoY = currentY + blockSize + 5;
      ctx.fillRect(x - 2, infoY - 5, blockSize + 4, 40);
      
      // Text - using system fonts
      ctx.fillStyle = textColor;
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(hex, x + blockSize / 2, infoY);
      
      ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(name, x + blockSize / 2, infoY + 15);
      
      ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(`L:${hsl.l}%`, x + blockSize / 2, infoY + 28);
    });

    currentY += blockSize + textHeight + 15;
    currentY += sectionSpacing;

    // Tone Analysis Section
    ctx.fillStyle = '#34495e';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Image Tone Analysis', totalWidth / 2, currentY);
    currentY += 25;
    
    const toneSectionX = (totalWidth - toneLabelsWidth) / 2;
    
    // Draw tone categories
    const toneCategories = [
      { label: 'Dark Tones', color: toneAnalysis.dark, key: 'dark' },
      { label: 'Medium Tones', color: toneAnalysis.medium, key: 'medium' },
      { label: 'Light Tones', color: toneAnalysis.light, key: 'light' }
    ];
    
    toneCategories.forEach((tone, i) => {
      const x = toneSectionX + i * (toneBlockWidth + toneSpacing);
      const color = tone.color;
      const toneY = currentY;
      
      // Tone color block
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(x, toneY, toneBlockWidth, toneBlockHeight);
      
      // Border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, toneY, toneBlockWidth, toneBlockHeight);
      
      // Tone label
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tone.label, x + toneBlockWidth / 2, toneY + toneBlockHeight + 15);
      
      // Percentage
      ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(`${color.percentage.toFixed(1)}% of image`, x + toneBlockWidth / 2, toneY + toneBlockHeight + 28);
      
      // Suggested uses (with proper line spacing)
      const suggestions = {
        dark: ['Background', 'Text', 'Borders'],
        medium: ['Secondary', 'Buttons', 'Cards'],
        light: ['Background', 'Highlight', 'Spacing']
      };
      
      ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = '#7f8c8d';
      suggestions[tone.key].forEach((suggestion, idx) => {
        ctx.fillText(suggestion, x + toneBlockWidth / 2, toneY + toneBlockHeight + 42 + (idx * 11));
      });
    });

    currentY += toneBlockHeight + 80; // Enough space for text below blocks
    currentY += sectionSpacing;

    // Color Category Suggestions Section
    ctx.fillStyle = '#34495e';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Suggested Color Categories', totalWidth / 2, currentY);
    currentY += 25;
    
    // Create vertical layout for categories instead of horizontal
    const categoryLabels = [
      { 
        label: 'Vibrant Accents', 
        colors: categories.vibrant, 
        usage: ['Primary CTAs', 'Highlights', 'Icons'],
        description: 'High saturation colors for attention'
      },
      { 
        label: 'Dark Elements', 
        colors: categories.dark, 
        usage: ['Text', 'Headers', 'Footers'],
        description: 'Contrast and readability'
      },
      { 
        label: 'Medium Elements', 
        colors: categories.medium, 
        usage: ['Cards', 'Forms', 'Secondary'],
        description: 'Balanced mid-tones'
      },
      { 
        label: 'Light Elements', 
        colors: categories.light, 
        usage: ['Backgrounds', 'Spacing', 'Borders'],
        description: 'Light backgrounds and spacing'
      }
    ];
    
    // Layout categories in a 2x2 grid
    const categoryWidth = totalWidth / 2 - 40;
    const categoryHeight = 80;
    
    categoryLabels.forEach((category, catIdx) => {
      const row = Math.floor(catIdx / 2);
      const col = catIdx % 2;
      
      const catX = 30 + col * (categoryWidth + 20);
      const catY = currentY + row * (categoryHeight + 15);
      
      // Category label
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(category.label, catX, catY);
      
      // Category description
      ctx.fillStyle = '#7f8c8d';
      ctx.font = 'italic 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(category.description, catX, catY + 14);
      
      // Category color blocks
      const colorsStartY = catY + 25;
      category.colors.forEach((color, idx) => {
        if (color) {
          const x = catX + idx * (categoryBlockSize + 8);
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
          ctx.fillRect(x, colorsStartY, categoryBlockSize, categoryBlockSize);
          
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, colorsStartY, categoryBlockSize, categoryBlockSize);
          
          // Hex code on block
          const hex = rgbToHex(color.r, color.g, color.b);
          const brightness = (color.r + color.g + color.b) / 3;
          ctx.fillStyle = brightness > 128 ? '#000' : '#fff';
          ctx.font = '8px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(hex.substring(0, 4) + '...', 
                      x + categoryBlockSize / 2, 
                      colorsStartY + categoryBlockSize / 2);
        }
      });
      
      // Usage suggestions
      const usageStartY = colorsStartY + categoryBlockSize + 10;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText('Best for:', catX, usageStartY);
      
      ctx.fillStyle = '#7f8c8d';
      ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
      category.usage.forEach((use, idx) => {
        ctx.fillText(`• ${use}`, catX, usageStartY + 12 + (idx * 11));
      });
    });

    currentY += (Math.ceil(categoryLabels.length / 2) * (categoryHeight + 15)) + 10;

    // Footer
    ctx.fillStyle = '#95a5a6';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Generated with advanced color analysis • Based on image tone distribution', 
                 totalWidth / 2, 
                 currentY + 15);

    const buffer = canvas.toBuffer("image/jpeg", { 
      quality: 0.95,
      chromaSubsampling: false
    });
    
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${originalName}_palette_analysis.jpg`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Color Palette Error:", err);
    return NextResponse.json(
      { 
        error: "Failed to generate color palette", 
        details: err.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Intelligent Color Palette Generator with Tone Analysis",
    description: "Generates professional color palettes with dark/light/medium tone analysis and usage suggestions",
    endpoint: "POST /api/design/color-palette",
    parameters: {
      file: "Image file (multipart/form-data, JPG/PNG/WebP, max 20MB)",
      colorCount: "Number of colors to extract (3-12, optional, default: 6)"
    },
    returns: "JPG image with color palette, tone analysis, and usage suggestions",
    features: [
      "Dominant color extraction using median cut quantization",
      "Image tone analysis (dark/medium/light)",
      "Color categorization by brightness",
      "Usage suggestions for each tone category",
      "Vibrant accent color identification"
    ]
  });
}