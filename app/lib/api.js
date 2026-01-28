
// app/lib/api.js
export async function convertFilePdf(files, slug ,password=0 ,rotation=0) {
  if (!files || !files.length) throw new Error("No files provided");

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file)); // append all files
  formData.append("conversionType", slug);

  // Your API endpoint
let endpoint;
if(slug == "pdf-merger"){
    endpoint = "/api/pdf/merge";
}else if(slug == "pdf-compressor"){
 endpoint = "/api/pdf/compress";
}else if (slug == "pdf-splitter"){
     endpoint = "/api/pdf/split";
}else if(slug == "pdf-to-image"){
  endpoint = "/api/pdf/pdf-to-image";
}else if(slug == "image-to-pdf"){
  endpoint="/api/pdf/image-to-pdf";
}else if(slug == "pdf-protector"){
    endpoint="/api/pdf/password";
     formData.append("password", password);
}else if(slug == "pdf-metadata-remover"){
  endpoint="/api/pdf/remove-metadata";
} else if(slug == "pdf-rotator"){
  console.log("slug",slug);
  formData.append("rotation", rotation);
  endpoint="/api/pdf/rotate";
}

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Conversion failed");
  }
  return res; // Return the Response object
}

export async function convertFileImage(
  file,
  slug,
  width = 0,
  height = 0,
  { fromFormat = "", toFormat = "", watermarkType = "text", watermarkText = "", watermarkLogo = null, position = "top" } = {}
) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);

  // Determine endpoint
  let endpoint;
  if (["image-resizer", "bulk-image-resizer", "image-cropper"].includes(slug)) {
    endpoint = `/api/upload/imageResizer`;
    formData.append("width", width);
    formData.append("height", height);
    formData.append("conversionType", slug);
  } else if (slug === "social-media-image-cropper") {
    endpoint = `/api/upload/imageRound`;
    formData.append("width", width);
    formData.append("height", height);
    formData.append("conversionType", slug);
  } else if (slug === "image-compressor") {
    endpoint = `/api/upload/imageCompressor`;
    formData.append("conversionType", slug);
  } else if (slug === "watermark-adder") {
    endpoint = `/api/upload/image-watermark`;
    formData.append("conversionType", slug);
    if (watermarkType === "text") {
      formData.append("watermarkType", watermarkType);
      formData.append("watermarkText", watermarkText);
      formData.append("watermarkLogo", "");
    } else {
      formData.append("watermarkLogo", watermarkLogo);
      formData.append("watermarkType", watermarkType);
      formData.append("watermarkText", "");
    }
    formData.append("position", position);
  } else if (slug == "image-blur-pixelate") {
    endpoint = `/api/upload/imageBlur`;
    formData.append("blur", 5);
    formData.append("conversionType", slug);
  } else if (slug === "exif-metadata-remover") {
    endpoint = `/api/upload/remove-exif`;
    formData.append("conversionType", slug);
  } else if (slug === "favicon-generator") {
    endpoint = `/api/upload/favicon`;
    formData.append("conversionType", slug);
  } else {
    endpoint = `/api/upload/imageConversion`;
    const type = `${fromFormat.toLowerCase()}-to-${toFormat.toLowerCase()}`;
    formData.append("conversionType", type);
  }

  const res = await fetch(endpoint, { method: "POST", body: formData });

  // Read the response as a blob immediately
  const blob = await res.blob();

  if (!res.ok) {
    // Try to extract text from the blob for error message
    let errorMessage = "Image conversion failed";
    try {
      const text = await blob.text();
      if (text && text.length < 1000) errorMessage = text;
    } catch (e) {
      errorMessage = res.statusText || errorMessage;
    }  }

  // Handle favicon generator separately
  if (slug === "favicon-generator") {
    if (!blob || blob.size === 0) throw new Error("Failed to generate favicons - empty response");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favicons.zip";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
    return null;
  }

  if (!blob || blob.size === 0) throw new Error("Image conversion failed: empty response");
  return blob; // <-- safe to return now
}

// app/lib/api/designApi.js

export async function runDesignTool({
  slug,
  file = null,
}) {
  const formData = new FormData();

  // attach file if exists
  if (file) {
    formData.append("file", file);
  }

  

  // tool identifier
  formData.append("toolType", slug);

  // ===== Endpoint Routing =====
  let endpoint;

  if (slug === "color-palette-generator") {
    endpoint = "/api/design/color-palette";
    
  } 
  else if (slug === "gradient-generator") {
    endpoint = "/api/design/gradient";
  } 
  else if (slug === "mockup-generator") {
    endpoint = "/api/design/mockup";
    // file + params
  } 
  else if (slug === "social-media-templates") {
    endpoint = "/api/design/social-template";
    // params only
  } 
  else if (slug === "font-pairing-tool") {
    endpoint = "/api/design/font-pairing";
    // params only
  } 
  else {
    throw new Error("Invalid design tool type");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  // ===== Response Handling =====
  if (!res.ok) {
    let msg = "Design tool processing failed";
    try {
      const err = await res.json();
      msg = err?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  // JSON response for most tools
  const contentType = res.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await res.json();
  }

  // Blob response fallback (mockups, templates, exports, etc.)
  const blob = await res.blob();
  if (!blob || blob.size === 0) throw new Error("Empty response from server");
  return blob;
}
   