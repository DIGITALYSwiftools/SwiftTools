import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400 }
      );
    }

    // Optional: quality parameter (1-100), default 70
    const quality = Number(formData.get("quality")) || 70;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Compress image keeping original format
    const metadata = await sharp(buffer).metadata();
    let output;

    if (metadata.format === "jpeg" || metadata.format === "jpg") {
      output = await sharp(buffer).jpeg({ quality }).toBuffer();
    } else if (metadata.format === "png") {
      output = await sharp(buffer).png({ quality }).toBuffer();
    } else if (metadata.format === "webp") {
      output = await sharp(buffer).webp({ quality }).toBuffer();
    } else {
      return new Response(
        JSON.stringify({ error: "Unsupported image format" }),
        { status: 400 }
      );
    }

    return new Response(output, {
      status: 200,
      headers: {
        "Content-Type": `image/${metadata.format}`,
        "Content-Disposition": `attachment; filename="compressed.${metadata.format === "jpeg" ? "jpg" : metadata.format}"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Compression failed", details: error.message }),
      { status: 500 }
    );
  }
}
