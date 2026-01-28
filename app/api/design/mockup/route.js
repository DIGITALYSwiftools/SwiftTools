// app/api/design/mockup/route.js
import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Load fonts (optional - for text on mockups)
try {
  registerFont(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), { family: 'Inter' });
} catch (err) {
  console.log('Using default fonts');
}

// Mockup templates configuration
const MOCKUP_TEMPLATES = {
  // Phone mockups
  iphone15: {
    name: "iPhone 15",
    type: "phone",
    width: 800,
    height: 1600,
    screen: { x: 75, y: 245, width: 650, height: 1120, borderRadius: 40 },
    shadow: true,
    rotation: 0
  },
  iphone14: {
    name: "iPhone 14",
    type: "phone",
    width: 750,
    height: 1550,
    screen: { x: 70, y: 230, width: 610, height: 1080, borderRadius: 35 },
    shadow: true,
    rotation: 0
  },
  samsung_galaxy: {
    name: "Samsung Galaxy",
    type: "phone",
    width: 780,
    height: 1580,
    screen: { x: 72, y: 240, width: 636, height: 1100, borderRadius: 45 },
    shadow: true,
    rotation: 0
  },
  
  // Laptop mockups
  macbook_pro: {
    name: "MacBook Pro",
    type: "laptop",
    width: 1600,
    height: 1000,
    screen: { x: 180, y: 65, width: 1240, height: 780, borderRadius: 8 },
    shadow: true,
    rotation: 0
  },
  macbook_air: {
    name: "MacBook Air",
    type: "laptop",
    width: 1550,
    height: 950,
    screen: { x: 175, y: 60, width: 1200, height: 750, borderRadius: 6 },
    shadow: true,
    rotation: 0
  },
  windows_laptop: {
    name: "Windows Laptop",
    type: "laptop",
    width: 1500,
    height: 920,
    screen: { x: 170, y: 58, width: 1160, height: 720, borderRadius: 4 },
    shadow: true,
    rotation: 0
  },
  
  // Tablet mockups
  ipad_pro: {
    name: "iPad Pro",
    type: "tablet",
    width: 1200,
    height: 900,
    screen: { x: 90, y: 85, width: 1020, height: 730, borderRadius: 12 },
    shadow: true,
    rotation: 0
  },
  android_tablet: {
    name: "Android Tablet",
    type: "tablet",
    width: 1150,
    height: 850,
    screen: { x: 85, y: 80, width: 980, height: 690, borderRadius: 10 },
    shadow: true,
    rotation: 0
  },
  
  // Display mockups
  imac: {
    name: "iMac",
    type: "display",
    width: 1400,
    height: 1100,
    screen: { x: 150, y: 80, width: 1100, height: 690, borderRadius: 8 },
    shadow: true,
    rotation: 0
  },
  monitor: {
    name: "Desktop Monitor",
    type: "display",
    width: 1300,
    height: 1050,
    screen: { x: 140, y: 75, width: 1020, height: 660, borderRadius: 6 },
    shadow: true,
    rotation: 0
  },
  
  // Print mockups
  t_shirt: {
    name: "T-Shirt",
    type: "apparel",
    width: 1200,
    height: 1400,
    screen: { x: 300, y: 350, width: 600, height: 450, borderRadius: 0 },
    shadow: true,
    rotation: 0,
    background: "#f0f0f0"
  },
  coffee_mug: {
    name: "Coffee Mug",
    type: "apparel",
    width: 1000,
    height: 1200,
    screen: { x: 300, y: 250, width: 400, height: 300, borderRadius: 0 },
    shadow: true,
    rotation: 0,
    background: "#f8f8f8"
  },
  business_card: {
    name: "Business Card",
    type: "print",
    width: 1000,
    height: 600,
    screen: { x: 200, y: 100, width: 600, height: 400, borderRadius: 8 },
    shadow: true,
    rotation: 0,
    background: "#ffffff"
  },
  poster: {
    name: "Poster",
    type: "print",
    width: 1000,
    height: 1400,
    screen: { x: 100, y: 100, width: 800, height: 1200, borderRadius: 0 },
    shadow: true,
    rotation: 0,
    background: "#f5f5f5"
  }
};

// Draw device mockup
async function drawMockup(template, userImage, options = {}) {
  const {
    rotation = 0,
    shadowIntensity = 0.3,
    showReflection = false,
    backgroundColor = null
  } = options;
  
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = backgroundColor || template.background || '#ffffff';
  ctx.fillRect(0, 0, template.width, template.height);
  
  // Apply rotation
  if (rotation !== 0) {
    ctx.translate(template.width / 2, template.height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-template.width / 2, -template.height / 2);
  }
  
  // Draw device body based on type
  switch (template.type) {
    case 'phone':
      await drawPhoneMockup(ctx, template, userImage, shadowIntensity);
      break;
    case 'laptop':
      await drawLaptopMockup(ctx, template, userImage, shadowIntensity);
      break;
    case 'tablet':
      await drawTabletMockup(ctx, template, userImage, shadowIntensity);
      break;
    case 'display':
      await drawDisplayMockup(ctx, template, userImage, shadowIntensity);
      break;
    case 'apparel':
      await drawApparelMockup(ctx, template, userImage, shadowIntensity);
      break;
    case 'print':
      await drawPrintMockup(ctx, template, userImage, shadowIntensity);
      break;
    default:
      await drawGenericMockup(ctx, template, userImage, shadowIntensity);
  }
  
  // Add reflection effect if enabled
  if (showReflection && template.type !== 'apparel') {
    addReflectionEffect(ctx, template);
  }
  
  return canvas;
}

// Draw phone mockup
async function drawPhoneMockup(ctx, template, userImage, shadowIntensity) {
  const { width, height, screen } = template;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Phone body
  ctx.fillStyle = '#1d1d1f';
  drawRoundedRect(ctx, centerX - screen.width/2 - 20, centerY - screen.height/2 - 40, 
                  screen.width + 40, screen.height + 80, screen.borderRadius + 20);
  ctx.fill();
  
  // Screen frame
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, centerX - screen.width/2 - 10, centerY - screen.height/2 - 30, 
                  screen.width + 20, screen.height + 60, screen.borderRadius + 10);
  ctx.fill();
  
  // Draw user image on screen
  if (userImage) {
    ctx.save();
    drawRoundedRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.borderRadius);
    ctx.clip();
    
    // Scale image to fit screen
    const scale = Math.max(screen.width / userImage.width, screen.height / userImage.height);
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = screen.x + (screen.width - scaledWidth) / 2;
    const y = screen.y + (screen.height - scaledHeight) / 2;
    
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  } else {
    // Default screen
    ctx.fillStyle = '#000000';
    drawRoundedRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.borderRadius);
    ctx.fill();
  }
  
  // Speaker
  ctx.fillStyle = '#333333';
  ctx.fillRect(centerX - 30, screen.y - 20, 60, 4);
  
  // Side buttons
  ctx.fillStyle = '#333333';
  ctx.fillRect(width - 10, centerY - 40, 6, 80);
  ctx.fillRect(width - 10, centerY - 120, 6, 40);
  ctx.fillRect(width - 10, centerY + 90, 6, 40);
  
  // Shadow
  if (template.shadow) {
    const gradient = ctx.createLinearGradient(0, height, 0, height - 50);
    gradient.addColorStop(0, `rgba(0,0,0,${shadowIntensity})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - screen.width/2 - 30, height - 50, screen.width + 60, 50);
  }
}

// Draw laptop mockup
async function drawLaptopMockup(ctx, template, userImage, shadowIntensity) {
  const { width, height, screen } = template;
  
  // Laptop base (bottom part)
  ctx.fillStyle = '#d2d2d7';
  ctx.fillRect(screen.x - 40, screen.y + screen.height + 20, screen.width + 80, 40);
  
  // Laptop body (screen part)
  ctx.fillStyle = '#1d1d1f';
  drawRoundedRect(ctx, screen.x - 20, screen.y - 20, screen.width + 40, screen.height + 40, screen.borderRadius + 5);
  ctx.fill();
  
  // Screen frame
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, screen.x - 10, screen.y - 10, screen.width + 20, screen.height + 20, screen.borderRadius + 3);
  ctx.fill();
  
  // Draw user image on screen
  if (userImage) {
    ctx.save();
    drawRoundedRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.borderRadius);
    ctx.clip();
    
    const scale = Math.max(screen.width / userImage.width, screen.height / userImage.height);
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = screen.x + (screen.width - scaledWidth) / 2;
    const y = screen.y + (screen.height - scaledHeight) / 2;
    
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  }
  
  // Hinge
  ctx.fillStyle = '#86868b';
  ctx.fillRect(screen.x - 10, screen.y + screen.height + 20, screen.width + 20, 4);
  
  // Trackpad
  ctx.fillStyle = '#1d1d1f';
  ctx.fillRect(width/2 - 60, screen.y + screen.height + 70, 120, 80);
  
  // Keyboard area
  ctx.fillStyle = '#1d1d1f';
  ctx.fillRect(screen.x, screen.y + screen.height + 60, screen.width, 30);
  
  // Shadow
  if (template.shadow) {
    const gradient = ctx.createRadialGradient(
      width/2, height, 0,
      width/2, height, height/2
    );
    gradient.addColorStop(0, `rgba(0,0,0,${shadowIntensity})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - 100, width, 100);
  }
}

// Draw tablet mockup
async function drawTabletMockup(ctx, template, userImage, shadowIntensity) {
  const { width, height, screen } = template;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Tablet body
  ctx.fillStyle = '#1d1d1f';
  drawRoundedRect(ctx, centerX - screen.width/2 - 30, centerY - screen.height/2 - 30, 
                  screen.width + 60, screen.height + 60, screen.borderRadius + 15);
  ctx.fill();
  
  // Screen frame
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, centerX - screen.width/2 - 15, centerY - screen.height/2 - 15, 
                  screen.width + 30, screen.height + 30, screen.borderRadius + 8);
  ctx.fill();
  
  // Draw user image on screen
  if (userImage) {
    ctx.save();
    drawRoundedRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.borderRadius);
    ctx.clip();
    
    const scale = Math.max(screen.width / userImage.width, screen.height / userImage.height);
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = screen.x + (screen.width - scaledWidth) / 2;
    const y = screen.y + (screen.height - scaledHeight) / 2;
    
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  }
  
  // Home button/camera
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.arc(centerX, screen.y - 10, 4, 0, Math.PI * 2);
  ctx.fill();
  
  // Shadow
  if (template.shadow) {
    const gradient = ctx.createLinearGradient(0, height, 0, height - 40);
    gradient.addColorStop(0, `rgba(0,0,0,${shadowIntensity})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - screen.width/2 - 40, height - 40, screen.width + 80, 40);
  }
}

// Draw display mockup
async function drawDisplayMockup(ctx, template, userImage, shadowIntensity) {
  const { width, height, screen } = template;
  
  // Display stand
  ctx.fillStyle = '#d2d2d7';
  ctx.fillRect(width/2 - 50, screen.y + screen.height + 30, 100, 150);
  ctx.fillRect(width/2 - 120, screen.y + screen.height + 180, 240, 30);
  
  // Display body
  ctx.fillStyle = '#1d1d1f';
  ctx.fillRect(screen.x - 30, screen.y - 30, screen.width + 60, screen.height + 60);
  
  // Screen bezel
  ctx.fillStyle = '#000000';
  ctx.fillRect(screen.x - 15, screen.y - 15, screen.width + 30, screen.height + 30);
  
  // Draw user image on screen
  if (userImage) {
    ctx.save();
    ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
    ctx.clip();
    
    const scale = Math.min(screen.width / userImage.width, screen.height / userImage.height);
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = screen.x + (screen.width - scaledWidth) / 2;
    const y = screen.y + (screen.height - scaledHeight) / 2;
    
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  }
  
  // Logo
  ctx.fillStyle = '#86868b';
  ctx.font = 'bold 24px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DISPLAY', width/2, screen.y + screen.height + 20);
  
  // Shadow
  if (template.shadow) {
    const gradient = ctx.createRadialGradient(
      width/2, height, 0,
      width/2, height, 100
    );
    gradient.addColorStop(0, `rgba(0,0,0,${shadowIntensity})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(width/2 - 150, height - 50, 300, 50);
  }
}

// Draw apparel mockup (T-shirt, mug, etc.)
async function drawApparelMockup(ctx, template, userImage, shadowIntensity) {
  const { width, height, screen } = template;
  
  if (template.name === 'T-Shirt') {
    // Draw T-shirt shape
    ctx.fillStyle = '#ffffff';
    
    // T-shirt body
    ctx.beginPath();
    ctx.moveTo(width/2, 200);
    ctx.bezierCurveTo(width/2 - 100, 200, width/2 - 300, 400, width/2 - 300, 800);
    ctx.bezierCurveTo(width/2 - 300, 1000, width/2 - 100, 1200, width/2, 1200);
    ctx.bezierCurveTo(width/2 + 100, 1200, width/2 + 300, 1000, width/2 + 300, 800);
    ctx.bezierCurveTo(width/2 + 300, 400, width/2 + 100, 200, width/2, 200);
    ctx.closePath();
    ctx.fill();
    
    // Sleeves
    ctx.beginPath();
    ctx.ellipse(width/2 - 300, 600, 100, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width/2 + 300, 600, 100, 150, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw user image on T-shirt
    if (userImage) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(width/2, 600, 200, 250, 0, 0, Math.PI * 2);
      ctx.clip();
      
      const scale = Math.min(400 / userImage.width, 500 / userImage.height);
      const scaledWidth = userImage.width * scale;
      const scaledHeight = userImage.height * scale;
      const x = width/2 - scaledWidth/2;
      const y = 600 - scaledHeight/2;
      
      ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    }
    
  } else if (template.name === 'Coffee Mug') {
    // Draw coffee mug
    ctx.fillStyle = '#ffffff';
    
    // Mug body
    ctx.beginPath();
    ctx.ellipse(width/2, 600, 200, 250, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mug handle
    ctx.beginPath();
    ctx.ellipse(width/2 + 250, 600, 50, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw user image on mug
    if (userImage) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(width/2, 600, 180, 230, 0, 0, Math.PI * 2);
      ctx.clip();
      
      const scale = Math.min(360 / userImage.width, 460 / userImage.height);
      const scaledWidth = userImage.width * scale;
      const scaledHeight = userImage.height * scale;
      const x = width/2 - scaledWidth/2;
      const y = 600 - scaledHeight/2;
      
      ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
      ctx.restore();
    }
  }
  
  // Shadow
  if (template.shadow) {
    const gradient = ctx.createRadialGradient(
      width/2, height, 0,
      width/2, height, 200
    );
    gradient.addColorStop(0, `rgba(0,0,0,${shadowIntensity})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - 100, width, 100);
  }
}

// Draw print mockup
async function drawPrintMockup(ctx, template, userImage, shadowIntensity) {
  const { width, height, screen } = template;
  
  // Print surface (paper/card)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(screen.x - 20, screen.y - 20, screen.width + 40, screen.height + 40);
  
  // Drop shadow
  ctx.fillStyle = `rgba(0,0,0,${shadowIntensity * 0.5})`;
  ctx.fillRect(screen.x - 15, screen.y - 15, screen.width + 40, screen.height + 40);
  
  // White surface on top
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(screen.x - 20, screen.y - 20, screen.width + 40, screen.height + 40);
  
  // Draw user image
  if (userImage) {
    ctx.save();
    drawRoundedRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.borderRadius);
    ctx.clip();
    
    const scale = Math.min(screen.width / userImage.width, screen.height / userImage.height);
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = screen.x + (screen.width - scaledWidth) / 2;
    const y = screen.y + (screen.height - scaledHeight) / 2;
    
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  }
  
  // Corner details for business card
  if (template.name === 'Business Card') {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(screen.x + 50, screen.y + 50, screen.width - 100, screen.height - 100);
    ctx.setLineDash([]);
  }
}

// Generic mockup for fallback
async function drawGenericMockup(ctx, template, userImage, shadowIntensity) {
  const { screen } = template;
  
  // Generic device frame
  ctx.fillStyle = '#333333';
  ctx.fillRect(screen.x - 20, screen.y - 20, screen.width + 40, screen.height + 40);
  
  // Draw user image
  if (userImage) {
    ctx.save();
    ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
    ctx.clip();
    
    const scale = Math.min(screen.width / userImage.width, screen.height / userImage.height);
    const scaledWidth = userImage.width * scale;
    const scaledHeight = userImage.height * scale;
    const x = screen.x + (screen.width - scaledWidth) / 2;
    const y = screen.y + (screen.height - scaledHeight) / 2;
    
    ctx.drawImage(userImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  }
}

// Helper function to draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Add reflection effect
function addReflectionEffect(ctx, template) {
  const { width, height, screen } = template;
  
  if (template.type === 'phone' || template.type === 'tablet') {
    const gradient = ctx.createLinearGradient(0, screen.y, 0, screen.y + 50);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(screen.x, screen.y, screen.width, 50);
  }
}

// GET endpoint to list available mockups
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  let mockups = Object.entries(MOCKUP_TEMPLATES).map(([id, config]) => ({
    id,
    name: config.name,
    type: config.type,
    category: getCategory(config.type),
    dimensions: { width: config.width, height: config.height },
    preview: `/api/design/mockup/preview?id=${id}`
  }));
  
  if (category) {
    mockups = mockups.filter(m => getCategory(m.type) === category);
  }
  
  return NextResponse.json({
    success: true,
    mockups,
    categories: ['phone', 'laptop', 'tablet', 'display', 'apparel', 'print']
  });
}

function getCategory(type) {
  switch(type) {
    case 'phone': return 'Phones';
    case 'laptop': return 'Laptops';
    case 'tablet': return 'Tablets';
    case 'display': return 'Displays';
    case 'apparel': return 'Apparel';
    case 'print': return 'Print';
    default: return 'Other';
  }
}

// Main POST endpoint to generate mockup
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const mockupId = formData.get('mockupId') || 'iphone15';
    const rotation = parseFloat(formData.get('rotation') || '0');
    const shadowIntensity = parseFloat(formData.get('shadowIntensity') || '0.3');
    const showReflection = formData.get('showReflection') === 'true';
    const backgroundColor = formData.get('backgroundColor') || null;
    
    // Validation
    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: "Valid image file is required" 
      }, { status: 400 });
    }
    
    if (!MOCKUP_TEMPLATES[mockupId]) {
      return NextResponse.json({ 
        error: "Invalid mockup template" 
      }, { status: 400 });
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File size must be less than 10MB" 
      }, { status: 400 });
    }
    
    // Load user image
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const userImage = await loadImage(buffer);
    
    // Get template
    const template = MOCKUP_TEMPLATES[mockupId];
    
    // Generate mockup
    const options = {
      rotation: Math.max(-45, Math.min(45, rotation)),
      shadowIntensity: Math.max(0, Math.min(1, shadowIntensity)),
      showReflection,
      backgroundColor
    };
    
    const canvas = await drawMockup(template, userImage, options);
    const outputBuffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    
    // Create filename
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${originalName}_${mockupId}_mockup.jpg`;
    
    // Return as downloadable image
    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": outputBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error("Mockup Generator Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate mockup",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Preview endpoint for mockup templates
export async function GET_PREVIEW(request) {
  const { searchParams } = new URL(request.url);
  const mockupId = searchParams.get('id') || 'iphone15';
  
  if (!MOCKUP_TEMPLATES[mockupId]) {
    return NextResponse.json({ error: "Invalid mockup ID" }, { status: 400 });
  }
  
  const template = MOCKUP_TEMPLATES[mockupId];
  
  // Create preview canvas
  const canvas = createCanvas(template.width / 2, template.height / 2);
  const ctx = canvas.getContext('2d');
  
  // Draw simplified preview
  ctx.fillStyle = '#f5f5f7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw device outline
  ctx.strokeStyle = '#d1d1d6';
  ctx.lineWidth = 2;
  const screenPreview = {
    x: template.screen.x / 2,
    y: template.screen.y / 2,
    width: template.screen.width / 2,
    height: template.screen.height / 2,
    borderRadius: template.screen.borderRadius / 2
  };
  
  drawRoundedRect(ctx, screenPreview.x - 10, screenPreview.y - 10, 
                  screenPreview.width + 20, screenPreview.height + 20, 
                  screenPreview.borderRadius + 5);
  ctx.stroke();
  
  // Draw screen placeholder
  ctx.fillStyle = '#000000';
  drawRoundedRect(ctx, screenPreview.x, screenPreview.y, 
                  screenPreview.width, screenPreview.height, 
                  screenPreview.borderRadius);
  ctx.fill();
  
  // Add text
  ctx.fillStyle = '#1d1d1f';
  ctx.font = 'bold 16px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(template.name, canvas.width / 2, 30);
  
  ctx.font = '12px Inter, Arial, sans-serif';
  ctx.fillStyle = '#86868b';
  ctx.fillText(`${template.type.charAt(0).toUpperCase() + template.type.slice(1)} Mockup`, 
               canvas.width / 2, canvas.height - 20);
  
  const buffer = canvas.toBuffer('image/png');
  
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400"
    },
  });
}

// Handle preview route separately
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Route handler for different methods
export async function handler(request) {
  const { method } = request;
  const url = new URL(request.url);
  
  if (method === 'GET' && url.pathname.includes('/preview')) {
    return GET_PREVIEW(request);
  }
  
  if (method === 'GET') {
    return GET(request);
  }
  
  if (method === 'POST') {
    return POST(request);
  }
  
  if (method === 'OPTIONS') {
    return OPTIONS();
  }
  
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}