import { PDFDocument } from "pdf-lib";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files"); // get all uploaded files
    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: "Please upload at least 1 PDF file" }),
        { status: 400 }
      );
    }

    // Only handle 1 PDF at a time for compression
    const file = files[0];
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // Optional: remove unnecessary metadata / objects
    pdfDoc.setTitle(pdfDoc.getTitle() || "");
    pdfDoc.setAuthor(pdfDoc.getAuthor() || "");

    // Save PDF with lower quality options
    const compressedBytes = await pdfDoc.save({ useObjectStreams: false, updateMetadata: false });

    return new Response(Buffer.from(compressedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="compressed-${file.name}"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "PDF compression failed", details: error.message }),
      { status: 500 }
    );
  }
}
