import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file"); // main image
    const watermarkType = formData.get("watermarkType"); // text | logo
    const watermarkText = formData.get("watermarkText");
    const watermarkLogo = formData.get("watermarkLogo"); // FILE
    const position = formData.get("position") || "bottom-right";

    if (!file) {
      return new Response(JSON.stringify({ error: "No image uploaded" }), {
        status: 400,
      });
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    let watermarkBuffer;

    /* -------- TEXT WATERMARK -------- */
    if (watermarkType === "text") {
        console.log(watermarkText);
      const svg = `
        <svg width="${metadata.width}" height="${metadata.height}">
          <text
            x="50%"
            y="50%"
            font-size="48"
            fill="black"
            font-family="Arial"
            dominant-baseline="middle"
            text-anchor="middle"
          >
            ${watermarkText || ""}
          </text>
        </svg>
      `;
      watermarkBuffer = Buffer.from(svg);

    /* -------- LOGO WATERMARK -------- */
    } else if (watermarkType === "logo" && watermarkLogo) {
      const logoBuffer = Buffer.from(await watermarkLogo.arrayBuffer());

      watermarkBuffer = await sharp(logoBuffer)
        .resize(150, 150, { fit: "inside" })
        .png()
        .toBuffer();
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid watermark input" }),
        { status: 400 }
      );
    }

    const gravity = {
      top: "north",
      bottom: "south",
      left: "west",
      right: "east",
      center: "center",
      "top-left": "northwest",
      "top-right": "northeast",
      "bottom-left": "southwest",
      "bottom-right": "southeast",
    }[position] || "southeast";

    const output = await image
      .composite([{ input: watermarkBuffer, gravity }])
      .toBuffer();

    return new Response(output, {
      status: 200,
      headers: {
        "Content-Type": `image/${metadata.format}`,
        "Content-Disposition": `attachment; filename="watermarked.${metadata.format}"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Watermark failed", details: error.message }),
      { status: 500 }
    );
  }
}
