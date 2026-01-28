import { PDFDocument } from "pdf-lib";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files"); // match frontend field name
    if (!files || files.length < 2) {
      return new Response(
        JSON.stringify({ error: "Please upload at least 2 PDF files" }),
        { status: 400 }
      );
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();

    return new Response(Buffer.from(mergedBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="merged.pdf"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "PDF merge failed", details: error.message }),
      { status: 500 }
    );
  }
}
