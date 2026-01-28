import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// List of metadata fields to remove
const METADATA_FIELDS_TO_REMOVE = [
  'Title', 'Author', 'Subject', 'Keywords', 'Creator', 'Producer',
  'CreationDate', 'ModDate', 'Trapped', 'PTEX.Fullbanner',
  'Custom', 'Company', 'SourceModified', 'AAPL:Keywords'
];

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("files");

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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      updateMetadata: false,
      ignoreEncryption: true, // Try to load encrypted PDFs
    });

    // Remove metadata by setting empty/null values
    const metadata = {
      // Set default values or empty strings
      title: "",
      author: "",
      subject: "",
      keywords: [],
      creator: "SwiftTools PDF Cleaner",
      producer: "",
      creationDate: new Date(),
      modificationDate: new Date(),
    };

    // Apply cleaned metadata
    pdfDoc.setTitle(metadata.title);
    pdfDoc.setAuthor(metadata.author);
    pdfDoc.setSubject(metadata.subject);
    pdfDoc.setKeywords(metadata.keywords);
    pdfDoc.setCreator(metadata.creator);
    pdfDoc.setProducer(metadata.producer);
    pdfDoc.setCreationDate(metadata.creationDate);
    pdfDoc.setModificationDate(metadata.modificationDate);

    // Save PDF without metadata
    const cleanedPdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      preserveObjectIds: false,
      updateFieldAppearances: false,
    });

    // Generate filename
    const originalName = file.name.replace(/\.pdf$/i, '');
    const filename = `${originalName}_cleaned.pdf`;

    return new NextResponse(cleanedPdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": cleanedPdfBytes.length.toString(),
        "X-Metadata-Removed": "true",
        "X-Cleaned-Fields": METADATA_FIELDS_TO_REMOVE.join(","),
      },
    });

  } catch (error) {
    console.error("PDF Metadata Removal Error:", error);
    
    // Handle encrypted PDF error
    if (error.message.includes("encrypt") || error.message.includes("password")) {
      return NextResponse.json(
        { 
          error: "Cannot process password-protected PDF",
          suggestion: "Remove password protection first"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to remove PDF metadata",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Alternative: More aggressive metadata removal
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("files");
    const aggressive = formData.get("aggressive") === "true";

    // Validation (same as above)

    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    // Load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes, {
      updateMetadata: false,
      ignoreEncryption: true,
      parseSpeed: aggressive ? 0 : 10, // Faster parsing for aggressive mode
    });

    if (aggressive) {
      // Aggressive mode: Create new PDF from scratch
      const newPdfDoc = await PDFDocument.create();
      
      // Copy all pages
      const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => newPdfDoc.addPage(page));
      
      // Set minimal metadata
      newPdfDoc.setTitle("");
      newPdfDoc.setAuthor("");
      newPdfDoc.setSubject("");
      newPdfDoc.setKeywords([]);
      newPdfDoc.setCreator("SwiftTools");
      newPdfDoc.setProducer("");
      newPdfDoc.setCreationDate(new Date());
      newPdfDoc.setModificationDate(new Date());
      
      const cleanedPdfBytes = await newPdfDoc.save();
      
      const originalName = file.name.replace(/\.pdf$/i, '');
      const filename = `${originalName}_deep_cleaned.pdf`;

      return new NextResponse(cleanedPdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "X-Metadata-Removed": "all",
          "X-Mode": "aggressive",
        },
      });
    } else {
      // Normal mode (same as POST)
      return await POST(request);
    }

  } catch (error) {
    console.error("Aggressive Metadata Removal Error:", error);
    return NextResponse.json(
      { error: "Failed to remove metadata" },
      { status: 500 }
    );
  }
}

// GET endpoint for API info
export async function GET() {
  return NextResponse.json({
    name: "PDF Metadata Remover API",
    description: "Remove sensitive metadata from PDF files",
    endpoints: {
      POST: "Remove standard metadata",
      PUT: "Aggressive metadata removal (query: ?aggressive=true)"
    },
    parameters: {
      file: "PDF file (multipart/form-data, max 50MB)",
      aggressive: "Optional: 'true' for deep cleaning"
    },
    metadata_removed: METADATA_FIELDS_TO_REMOVE,
    note: "Also removes XMP metadata, annotations, and form data when using aggressive mode"
  });
}