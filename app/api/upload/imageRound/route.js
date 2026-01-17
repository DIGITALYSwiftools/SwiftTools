// app/api/upload/socialMediaCrop/route.js
import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file"); // single image
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }
    if (!width || !height) {
      return new Response(JSON.stringify({ error: "Width and height required" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize first
    let img = sharp(buffer).resize(width, height, { fit: "cover" });

    // Create a circular mask
    const circle = Buffer.from(
      `<svg><circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2}" /></svg>`
    );

    const output = await img
      .composite([
        {
          input: circle,
          blend: "dest-in",
        },
      ])
      .png()
      .toBuffer();

    return new Response(output, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="social-media-crop.png"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Cropping failed", details: error.message }),
      { status: 500 }
    );
  }
}
