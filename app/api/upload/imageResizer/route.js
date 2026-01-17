// app/api/upload/imageResizer/route.js (or .ts)
import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file"); // use 'files' even for single image
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (!files || files.length === 0) {
      return new Response(JSON.stringify({ error: "No files uploaded" }), { status: 400 });
    }
    if (!width || !height) {
      return new Response(JSON.stringify({ error: "Width and height required" }), { status: 400 });
    }

    // Resize all images
    const resizedBuffers = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return sharp(buffer)
          .resize(width, height)
          .toBuffer();
      })
    );

    // If single file, return that directly
    if (resizedBuffers.length === 1) {
      return new Response(resizedBuffers[0], {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="resized.png"`,
        },
      });
    }

    // If multiple files, return JSON with base64 or later zip
    const base64Images = resizedBuffers.map((buf, index) => ({
      name: `resized_${index + 1}.png`,
      data: buf.toString("base64"),
    }));

    return new Response(JSON.stringify({ images: base64Images }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Resizing failed", details: error.message }),
      { status: 500 }
    );
  }
}
