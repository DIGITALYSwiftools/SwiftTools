"use client";

import { useState, useCallback, use } from "react";
import Navbar from "../../components/Navbar";
import { ImageIcon } from "lucide-react";
import { tools } from "../../lib/tools";
import { convertFile } from "../../lib/api";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../lib/cropImage";

export default function ToolDetailPage({ params }) {
  const { slug } = use(params);
  const detail = tools[slug];

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cropData, setCropData] = useState([]);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);

  /* ===== WATERMARK STATES ===== */
  const [watermarkType, setWatermarkType] = useState("text");
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkLogo, setWatermarkLogo] = useState(null);
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");

  /* ===== EXIF DATA STATE ===== */
  const [exifData, setExifData] = useState(null);

  if (!detail || detail.type !== "image") {
    return (
      <div className="min-h-screen flex items-center justify-center text-black text-sm">
        Image tool not found
      </div>
    );
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setSelectedFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    setCropData(files.map(() => ({ crop: { x: 0, y: 0 }, zoom: 1 })));

    const img = new Image();
    img.src = urls[0];
    img.onload = () => {
      setCropWidth(img.width);
      setCropHeight(img.height);
    };

    /* ===== READ EXIF IF slug === exif-metadata-remover ===== */
    if (slug === "exif-metadata-remover") {
      import("exifr").then(async (exifr) => {
        const data = await exifr.parse(files[0]);
        setExifData(data);
      });
    }
  }

  const onCropComplete = useCallback(
    (index) => (_, croppedAreaPixels) => {
      setCropData((prev) => {
        const newData = [...prev];
        newData[index].croppedAreaPixels = croppedAreaPixels;
        return newData;
      });

      if (index === 0 && croppedAreaPixels) {
        setCropWidth(Math.round(croppedAreaPixels.width));
        setCropHeight(Math.round(croppedAreaPixels.height));
      }
    },
    []
  );

const handleConvert = async () => {
  if (!selectedFiles.length) return alert("Please select images");

  setLoading(true);
  try {
    const blobs = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      let finalFile = selectedFiles[i];

      // Crop/Resize logic remains intact
      if (
        ["image-cropper", "image-resizer", "bulk-image-resizer", "social-media-image-cropper"].includes(
          slug
        )
      ) {
        finalFile = await getCroppedImg(
          previewUrls[i],
          cropData[i].croppedAreaPixels,
          cropWidth,
          cropHeight,
          slug
        );
      }

      // Call convertFile
      const result = await convertFile(finalFile, slug, cropWidth, cropHeight, {
        watermarkType,
        watermarkText,
        watermarkLogo,
        position: watermarkPosition,
      });

      // Only push to blobs if result is not null (favicon returns null)
      if (result !== null) {
        blobs.push(result);
      }
    }

    // Download result for non-favicon tools
    if (slug !== "favicon-generator") {
      blobs.forEach((blob, i) => {
        if (blob) { // Check blob exists
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = selectedFiles[i].name;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  } finally {
    setLoading(false);
  }
};

  const showGridTools = [
    "image-resizer",
    "bulk-image-resizer",
    "image-cropper",
    "social-media-image-cropper",
  ];

  return (
    <div className="text-black">
      <Navbar />

      <div className="mx-auto max-w-4xl px-3 py-6 mt-24">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">{detail.title}</h1>
          <p className="text-xs">{detail.description}</p>
        </div>

        {/* Main Box */}
        <div className="rounded-xl p-3 shadow-sm">
          {/* Upload */}
          <label className="flex flex-col items-center gap-1 cursor-pointer rounded-lg border border-dashed border-pink-200 bg-[#fff1f4] px-3 py-4 text-xs hover:bg-[#ffe9ee] transition">
            <ImageIcon className="h-5 w-5" />
            <span className="font-semibold">{detail.uploadLabel}</span>
            <span>JPG, PNG, WebP</span>
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </label>

          {/* SHOW EXIF DATA */}
         {/* SHOW EXIF DATA */}
{slug === "exif-metadata-remover" && exifData && (
  <div className="mt-3 rounded border border-pink-200 bg-[#fffafb] p-3 text-xs">
    <h2 className="font-semibold mb-2">EXIF Metadata:</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-[11px]">
        <tbody>
          {Object.entries(exifData).map(([key, value]) => (
            <tr key={key} className="border-b border-pink-100">
              <td className="pr-2 font-medium text-pink-700">{key}</td>
              <td className="wrap-break-word">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


          {/* Width/Height inputs */}
          {previewUrls.length > 0 && showGridTools.includes(slug) && (
            <div className="mt-3 flex justify-center gap-2">
              <input
                type="number"
                value={cropWidth}
                onChange={(e) => setCropWidth(+e.target.value)}
                className="w-16 px-1 py-0.5 text-[10px] rounded border border-pink-200 bg-[#fffafb]"
                placeholder="W"
              />
              <input
                type="number"
                value={cropHeight}
                onChange={(e) => setCropHeight(+e.target.value)}
                className="w-16 px-1 py-0.5 text-[10px] rounded border border-pink-200 bg-[#fffafb]"
                placeholder="H"
              />
            </div>
          )}

          {/* Crop Boxes */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative h-28 rounded-md overflow-hidden bg-[#fff3f6] border border-pink-200"
              >
                <Cropper
                  image={url}
                  crop={cropData[index]?.crop}
                  zoom={cropData[index]?.zoom}
                  aspect={
                    slug === "social-media-image-cropper"
                      ? 1
                      : cropWidth && cropHeight
                        ? cropWidth / cropHeight
                        : undefined
                  }
                  onCropChange={(newCrop) =>
                    setCropData((prev) => {
                      const newData = [...prev];
                      newData[index].crop = newCrop;
                      return newData;
                    })
                  }
                  onZoomChange={(newZoom) =>
                    setCropData((prev) => {
                      const newData = [...prev];
                      newData[index].zoom = newZoom;
                      return newData;
                    })
                  }
                  onCropComplete={onCropComplete(index)}
                  cropShape={slug === "social-media-image-cropper" ? "round" : "rect"}
                  showGrid={showGridTools.includes(slug)}
                />
              </div>
            ))}
          </div>

          {/* Watermark Options */}
          {slug === "watermark-adder" && (
            <div className="mt-3 rounded-lg border border-pink-200 bg-[#fffafb] p-2 text-xs">
              {/* ... your watermark UI remains unchanged */}
            </div>
          )}

          {/* Convert Button */}
          {selectedFiles.length > 0 && (
            <button
              onClick={handleConvert}
              disabled={loading}
              className="mt-3 w-full rounded-lg bg-[#ffe6eb] py-1.5 text-xs font-semibold hover:bg-[#ffdce3] disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Convert"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
