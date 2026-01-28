"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CodeMinifierTool() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(""); // html | css | js
  const [minifiedBlobs, setMinifiedBlobs] = useState([]);

  // --- Detect type ---
  const detectType = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "html") return "html";
    if (ext === "css") return "css";
    if (ext === "js") return "js";
    return "";
  };

  // --- Upload ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const valid = files.filter(f =>
      [".html", ".css", ".js"].some(ext => f.name.toLowerCase().endsWith(ext))
    );

    if (!valid.length) return;

    setSelectedFiles(valid);
    setFileType(detectType(valid[0].name));
  };

  // --- Minifier logic ---
  const minifyContent = (content, type) => {
    if (type === "html") {
      return content
        .replace(/>\s+</g, "><")
        .replace(/\n/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
    }

    if (type === "css") {
      return content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*{\s*/g, "{")
        .replace(/\s*}\s*/g, "}")
        .replace(/\s*;\s*/g, ";")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s*,\s*/g, ",")
        .trim();
    }

    if (type === "js") {
      return content
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\n/g, "")
        .replace(/\s{2,}/g, " ")
        .replace(/\s*([=+\-*/{}();,:<>])\s*/g, "$1")
        .trim();
    }

    return content;
  };

  // --- Convert / Download ---
  const handleConvert = async () => {
    if (!selectedFiles.length) return;
    setLoading(true);

    const blobs = [];

    for (let file of selectedFiles) {
      const type = detectType(file.name);

      const text = await file.text();
      const minified = minifyContent(text, type);

      const blob = new Blob([minified], { type: "text/plain" });
      blobs.push({ blob, name: file.name, type });
    }

    setMinifiedBlobs(blobs);

    // auto-download
    blobs.forEach((item) => {
      const url = URL.createObjectURL(item.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name.replace(/\.(html|css|js)$/, `.min.${item.type}`);
      a.click();
      URL.revokeObjectURL(url);
    });

    setLoading(false);
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5]">
      <div className="mx-auto max-w-md px-3 py-4 min-h-screen">
        <Navbar />

        {/* Header */}
        <div className="text-center mb-2 mt-24">
          <h1 className="text-lg sm:text-2xl font-bold">Code Minifier</h1>
          <p className="text-[11px] sm:text-sm text-gray-600">
            Minify HTML, CSS & JavaScript files
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl p-3 shadow-sm bg-white">

          {/* Upload */}
          <label className="flex flex-col items-center cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 text-xs space-y-1">
            <img src="/cloud-logo.png" alt="upload" className="w-20 h-20 sm:w-36 sm:h-36" />
            <span className="font-semibold text-xs sm:text-lg text-center">
              Drag & drop your code files here
            </span>
            <span className="text-gray-500 text-[9px] sm:text-xs">
              Supported: .html, .css, .js
            </span>
            <input
              type="file"
              accept=".html,.css,.js"
              hidden
              multiple
              onChange={handleFileChange}
            />
          </label>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-2 space-y-1 overflow-x-auto">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 p-1 border border-gray-200 rounded bg-gray-50 text-[10px] sm:text-xs"
                >
                  <div className="flex flex-col truncate">
                    <span className="truncate font-medium">{file.name}</span>
                    <span className="text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB • {detectType(file.name).toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Convert Button */}
          {selectedFiles.length > 0 && (
            <button
              onClick={handleConvert}
              disabled={loading}
              className="mt-4 w-full rounded-lg bg-black text-white py-2.5 text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? "Minifying..." : "Minify & Download"}
            </button>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
