import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No valid image uploaded" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);

    const metadata = await image.metadata();
    const format = metadata.format || "png";

    // Output image without EXIF metadata
    const outputBuffer = await image.toBuffer();

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename="no-exif.${format}"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to remove EXIF metadata", details: error.message }),
      { status: 500 }
    );
  }
}
