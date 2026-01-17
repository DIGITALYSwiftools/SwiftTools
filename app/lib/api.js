export async function convertFile(
  file,
  slug,
  width = 0,
  height = 0,
  { watermarkType = "text", watermarkText = "", watermarkLogo = null, position = "top" } = {}
) {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("conversionType", slug);

  // Determine endpoint based on slug
  let endpoint;

  if (["image-resizer", "bulk-image-resizer", "image-cropper"].includes(slug)) {
    endpoint = `/api/upload/imageResizer`;
    formData.append("width", width);
    formData.append("height", height);
  } else if (slug === "social-media-image-cropper") {
    endpoint = `/api/upload/imageRound`;
    formData.append("width", width);
    formData.append("height", height);
  } else if (slug === "image-compressor") {
    endpoint = `/api/upload/imageCompressor`;
  } else if (slug === "watermark-adder") {
    endpoint = `/api/upload/image-watermark`;
    if (watermarkType == "text") {
      formData.append("watermarkType", watermarkType);
      formData.append("watermarkText", watermarkText);
      formData.append("watermarkLogo", "")
    } else {
      formData.append("watermarkLogo", watermarkLogo);
      formData.append("watermarkType", watermarkType);
      formData.append("watermarkText", "");
    }
    formData.append("position", position);
  } else if (slug === "image-blur-pixelate") {
    endpoint = `/api/upload/imageBlur`;
    formData.append("blur", 5);
  } else if (slug === "exif-metadata-remover") {
    endpoint = `/api/upload/remove-exif`;
  } else if (slug === "favicon-generator") {
    endpoint = `/api/upload/favicon`;
  } else {
    endpoint = `/api/upload/imageConversion`;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    // First try to get error as JSON
    let errorMessage = "Image conversion failed";
    
    try {
      // Check content type before parsing
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        // If not JSON, try to get text
        const text = await res.text();
        if (text && text.length < 1000) { // Don't try to parse large binary as text
          errorMessage = text;
        }
      }
    } catch (e) {
      // If parsing fails, use status text
      errorMessage = res.statusText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  // Handle favicon generator separately - it auto-downloads ZIP
  if (slug === "favicon-generator") {
    const blob = await res.blob();
    
    if (!blob || blob.size === 0) {
      throw new Error("Failed to generate favicons - empty response");
    }
    
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
    
    return null; // Return null since we already downloaded the file
  }

  // For other endpoints, return the blob
  return await res.blob();
}