import sharp from "sharp";
import path from "path";

const allowedConversions = {
  "jpg-to-png": { from: ["jpg", "jpeg"], to: "png" },
  "png-to-jpg": { from: ["png"], to: "jpeg" },
  "jpg-to-webp": { from: ["jpg", "jpeg"], to: "webp" },
  "webp-to-jpg": { from: ["webp"], to: "jpeg" },
  "png-to-webp": { from: ["png"], to: "webp" },
  "webp-to-png": { from: ["webp"], to: "png" },
};

export async function POST(request) {
  try {
    const formData = await request.formData();

    const conversionType = formData.get("conversionType");
    console.log('====================================');
    console.log(conversionType);
    console.log('====================================');
    const file = formData.get("file");

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file uploaded" }),
        { status: 400 }
      );
    }

    if (!conversionType || !allowedConversions[conversionType]) {
      return new Response(
        JSON.stringify({ error: "Invalid conversion type" }),
        { status: 400 }
      );
    }

    const { from, to } = allowedConversions[conversionType];

    const originalName = file.name;
    const ext = path.extname(originalName).slice(1).toLowerCase();

    if (!from.includes(ext)) {
      return new Response(
        JSON.stringify({ error: `File must be: ${from.join(", ")}` }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let output;
    if (to === "jpeg") output = await sharp(buffer).jpeg().toBuffer();
    if (to === "png") output = await sharp(buffer).png().toBuffer();
    if (to === "webp") output = await sharp(buffer).webp().toBuffer();

    return new Response(output, {
      status: 200,
      headers: {
        "Content-Type": `image/${to}`,
        "Content-Disposition": `attachment; filename="converted.${to === "jpeg" ? "jpg" : to}"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Conversion failed", details: error.message }),
      { status: 500 }
    );
  }
}
