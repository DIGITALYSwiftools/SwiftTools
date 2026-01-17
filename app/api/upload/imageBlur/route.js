import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const blurAmount = Number(formData.get("blur")) || 5;

    if (!file || !file.arrayBuffer) {
      return new Response(JSON.stringify({ error: "No valid image uploaded" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);

    let metadata;
    try {
      metadata = await image.metadata();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid image file" }), {
        status: 400,
      });
    }

    const outputBuffer = await image.blur(blurAmount).toBuffer();

    const format = metadata.format || "png";

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": `image/${format}`,
        "Content-Disposition": `attachment; filename="blurred.${format}"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Image blur failed", details: error.message }),
      { status: 500 }
    );
  }
}
