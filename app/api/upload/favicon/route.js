import { NextResponse } from "next/server";
import favicons from "favicons";
import JSZip from "jszip";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Uploaded file must be an image" }, 
        { status: 400 }
      );
    }

    // Convert file → buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const configuration = {
      path: "/",
      appName: file.name.split('.')[0] || "My App",
      appShortName: "App",
      background: "#ffffff",
      theme_color: "#ffffff",
      icons: {
        favicons: true,
        android: true,
        appleIcon: true,
        appleStartup: false,
        windows: true,
        yandex: false,
      },
    };

    // Generate favicon assets
    const result = await favicons(buffer, configuration);

    // Create ZIP
    const zip = new JSZip();

    result.images.forEach((img) => {
      zip.file(img.name, img.contents);
    });

    result.files.forEach((fileItem) => {
      zip.file(fileItem.name, fileItem.contents);
    });

    zip.file("favicon.html", result.html.join("\n"));

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Return ZIP as blob - THIS IS WHAT YOUR FRONTEND EXPECTS
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="favicons.zip"',
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}