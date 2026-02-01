"use client";

import { useState, use } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {  Lock, RotateCw } from "lucide-react";
import { pdfTool } from "../../lib/tools";
import { convertFilePdf } from "../../lib/api";

export default function PDFToolPage({ params }) {
  const { slug } = use(params);
  const detail = pdfTool[slug];

  const isImageToPdf = slug === "image-to-pdf";
  const isPdfRotator = slug === "pdf-rotator";
  const MAX_FILES = 5;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rotation, setRotation] = useState("90");

  const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

  // Tools that require password
  const requiresPassword = slug === "pdf-protector";
  const requiresConfirmPassword = slug === "pdf-protector";

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setError("");

    if (selected.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    if (isImageToPdf) {
      const invalidImages = selected.filter(
        (f) => !IMAGE_TYPES.includes(f.type)
      );
      if (invalidImages.length) {
        setError("Only JPG, PNG, or WEBP images allowed");
        return;
      }
    } else {
      const invalidFiles = selected.filter(
        (f) => !f.type.includes("pdf") && !f.name.toLowerCase().endsWith(".pdf")
      );
      if (invalidFiles.length) {
        setError("Only PDF files allowed");
        return;
      }
    }

    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (i) =>
    setFiles((prev) => prev.filter((_, index) => index !== i));

  const clearAll = () => {
    setFiles([]);
    setPassword("");
    setConfirmPassword("");
    setRotation("90");
    setError("");
  };

  const handleDownload = async (res) => {
    const blob = await res.blob();
    if (!blob || blob.size === 0) throw new Error("Empty response from server");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const contentType = res.headers.get("content-type");
    let filename = "converted.pdf";
    if (contentType?.includes("zip")) filename = "converted.zip";
    if (contentType?.includes("pdf")) filename = "converted.pdf";

    if (slug === "pdf-protector") {
      const originalName = files[0]?.name || "document";
      filename = `${originalName.replace(".pdf", "")}_protected.pdf`;
    }

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  };

  const handleConvert = async () => {
    if (!files.length) {
      setError(
        isImageToPdf
          ? "Select at least one image"
          : "Select at least one PDF file"
      );
      return;
    }

    if (requiresPassword) {
      if (!password) {
        setError("Please enter a password");
        return;
      }
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        return;
      }
      if (requiresConfirmPassword && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await convertFilePdf(
        files,
        slug,
        password,
        isPdfRotator ? rotation : undefined
      );
      await handleDownload(res);
      setSuccess(true);
      clearAll();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5]">
      <div className="mx-auto max-w-md px-3 py-4 min-h-screen">
        <Navbar />

        {/* Header */}
        <div className="text-center mb-2 mt-24">
          <h1 className="text-lg md:text-2xl font-bold">
            {detail.title || "PDF Converter"}
          </h1>
          <p className="text-[11px] md:text-sm text-gray-600">
            {detail.description || "Convert files easily"}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl p-3 shadow-sm bg-white space-y-2">
          {/* Upload */}
          <label className="flex flex-col items-center gap-1 cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 text-xs hover:bg-gray-100 transition">
            <img
              src="/cloud-logo.png"
              alt="upload"
              className="w-24 h-24 md:w-40 md:h-40"
            />
            <span className="font-semibold text-sm md:text-base text-center">
              {isImageToPdf
                ? "Drag and drop your Images here"
                : "Drag and drop your PDFs here"}
            </span>
            <span className="text-gray-500 text-[10px] md:text-xs">
              Max {MAX_FILES} files
            </span>
            <input
              type="file"
              accept={isImageToPdf ? "image/*" : "application/pdf"}
              hidden
              multiple
              onChange={handleFileChange}
            />
          </label>

          {/* ROTATION INPUT (ONLY pdf-rotator) */}
          {isPdfRotator && (
            <div className="mt-3 mb-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <RotateCw className="w-4 h-4" />
                Rotate pages
              </label>
              <select
                value={rotation}
                onChange={(e) => setRotation(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
              >
                <option value="90">90° clockwise</option>
                <option value="180">180°</option>
                <option value="270">270° clockwise</option>
              </select>
            </div>
          )}

          {/* Password (ONLY pdf-protector) */}
          {requiresPassword && (
            <>
              <div className="relative mt-4 mb-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min 4 characters)"
                  className="w-full rounded-full border border-gray-300 pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="relative mb-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-full border border-gray-300 pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-gray-900"
                />
              </div>

              <div className="text-xs text-gray-500 mb-2">
                <p>• Password must be at least 4 characters</p>
                <p>• You'll need this password to open the PDF</p>
              </div>
            </>
          )}

          {/* Error / Success */}
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {success && (
            <p className="text-green-600 text-xs">Conversion successful!</p>
          )}

          {/* Selected files */}
          {files.length > 0 && (
            <div className="space-y-1 max-h-28 overflow-auto">
              <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                <span>Selected files ({files.length})</span>
                <button
                  onClick={clearAll}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  Clear all
                </button>
              </div>
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded p-1 text-xs"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-gray-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Convert button */}
          <button
            onClick={handleConvert}
            disabled={
              loading ||
              (requiresPassword &&
                (!password || password !== confirmPassword))
            }
            className="mt-4 w-full rounded-lg bg-black text-white py-2.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-800"
          >
            {loading
              ? "Processing..."
              : isPdfRotator
              ? "Rotate PDF"
              : requiresPassword
              ? "Protect PDF"
              : "Convert"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
