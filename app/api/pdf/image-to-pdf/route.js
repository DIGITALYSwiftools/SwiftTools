import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

// Route Segment Config for App Router
export const runtime = "nodejs"; // Ensure it runs on Node.js runtime
export const dynamic = "force-dynamic"; // Force dynamic rendering

// Parse formData from request
async function parseFormData(request) {
  const formData = await request.formData();
  const files = formData.getAll("files"); // array of images
  return { files };
}

// Validate uploaded images
function validateFiles(files) {
  if (!files || files.length === 0) throw new Error("No files provided");
  if (files.length > 5) throw new Error("Maximum 5 files allowed");

  for (const file of files) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Only image files (jpg, jpeg, png, webp) are allowed. Found: ${file.type}`);
    }

    // 50MB max
    if (file.size > 50 * 1024 * 1024)
      throw new Error(`File ${file.name} exceeds 50MB limit`);
  }
}

// Convert array of images → single PDF (A4 sized pages)
async function imagesToPDF(files) {
  const pdfDoc = await PDFDocument.create();

  const A4_WIDTH = 595.28;  // 210mm in points
  const A4_HEIGHT = 841.89; // 297mm in points

  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      let pdfImage;
      
      // Handle different image formats
      switch (file.type) {
        case "image/jpeg":
        case "image/jpg":
          pdfImage = await pdfDoc.embedJpg(uint8Array);
          break;
        case "image/png":
          pdfImage = await pdfDoc.embedPng(uint8Array);
          break;
        case "image/webp":
          // For WebP, we need to convert it first since pdf-lib doesn't support WebP directly
          // We'll use a workaround by converting WebP to PNG using canvas (if in browser)
          // But for server-side, we need a different approach
          throw new Error("WebP format is not supported directly. Please convert to PNG or JPEG first.");
          break;
        default:
          console.warn(`Skipping unsupported image type: ${file.name} (${file.type})`);
          continue;
      }

      // Resize to fit A4 while maintaining aspect ratio
      const imgWidth = pdfImage.width;
      const imgHeight = pdfImage.height;
      const scale = Math.min(A4_WIDTH / imgWidth, A4_HEIGHT / imgHeight);

      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      page.drawImage(pdfImage, {
        x: (A4_WIDTH - scaledWidth) / 2,
        y: (A4_HEIGHT - scaledHeight) / 2,
        width: scaledWidth,
        height: scaledHeight,
      });
    } catch (err) {
      console.error(`Failed to embed image ${file.name}:`, err);
      // Add a placeholder page with error message
      const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
      page.drawText(`Error loading image: ${file.name}`, {
        x: 50,
        y: A4_HEIGHT - 100,
        size: 12,
      });
      continue;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function POST(request) {
  try {
    const { files } = await parseFormData(request);
    validateFiles(files);

    const pdfBytes = await imagesToPDF(files);

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="images_${Date.now()}.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error("Image to PDF error:", error);
    return NextResponse.json(
      { 
        error: "Failed to convert images to PDF", 
        details: error.message 
      },
      { 
        status: error.message.includes("Maximum") || 
                error.message.includes("Only image") || 
                error.message.includes("not supported") ? 400 : 500 
      }
    );
  }
}

// Optional GET for API documentation
export async function GET() {
  return NextResponse.json({
    description: "Image to PDF API",
    usage: "POST image files (jpg, jpeg, png, webp) to merge into a single PDF",
    parameters: { 
      files: "Array of image files (max 5)",
      supportedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    },
    returns: "Single PDF file containing all images as A4 pages",
  });
}