// app/api/pdf/rotate/route.js
import { log } from "console";
import { NextResponse } from "next/server";
import { PDFDocument, degrees } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("files");
    const rotation = formData.get("rotation") || "90";
    console.log(rotation ,"rotation");
    // Validation
    if (!file) {
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 50MB" },
        { status: 400 }
      );
    }

    // Convert rotation to degrees
    let rotationDegrees;
    switch (rotation) {
      case "90":
        rotationDegrees = degrees(90);
        break;
      case "180":
        rotationDegrees = degrees(180);
        break;
      case "270":
        rotationDegrees = degrees(270);
        break;
      default:
        rotationDegrees = degrees(90);
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get all pages
    const pages = pdfDoc.getPages();

    // Rotate all pages
    pages.forEach((page) => {
      page.setRotation(rotationDegrees);
    });

    // Save rotated PDF
    const rotatedPdfBytes = await pdfDoc.save();

    // Generate filename
    const originalName = file.name.replace(/\.pdf$/i, '');
    const rotationText = rotation === "90" ? "rotated90" : 
                         rotation === "180" ? "rotated180" : 
                         rotation === "270" ? "rotated270" : "rotated";
    const filename = `${originalName}_${rotationText}.pdf`;

    return new NextResponse(rotatedPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": rotatedPdfBytes.length.toString(),
      },
    });

  } catch (error) {
    console.error("PDF Rotation Error:", error);
    
    // Handle specific errors
    if (error.message.includes("corrupt") || error.message.includes("invalid")) {
      return NextResponse.json(
        { error: "The uploaded PDF file is corrupt or invalid" },
        { status: 400 }
      );
    }

    if (error.message.includes("password") || error.message.includes("encrypted")) {
      return NextResponse.json(
        { error: "Cannot rotate password-protected PDF files" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to rotate PDF",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint for API info
export async function GET() {
  return NextResponse.json({
    name: "PDF Rotator API",
    description: "Rotate all pages in a PDF file",
    endpoint: "POST /api/pdf/rotate",
    parameters: {
      file: "PDF file (multipart/form-data, max 50MB)",
      rotation: "Rotation angle: '90', '180', or '270' (default: '90')"
    },
    returns: "Rotated PDF file with all pages rotated"
  });
}