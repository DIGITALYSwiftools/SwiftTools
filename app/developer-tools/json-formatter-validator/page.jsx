"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function JsonFormatterValidator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [autoFormat, setAutoFormat] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!autoFormat) return;
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("✅ Valid JSON");
    } catch {
      setError("❌ Invalid JSON");
      setOutput("");
    }
  }, [input, autoFormat]);

  // JSON Handlers
  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
      toast.success("JSON formatted ✅");
    } catch {
      setError("❌ Invalid JSON format");
      toast.error("Invalid JSON ❌");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
      toast.success("JSON minified ✅");
    } catch {
      setError("❌ Invalid JSON format");
      toast.error("Invalid JSON ❌");
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError("✅ Valid JSON");
      setOutput("");
      toast.success("JSON is valid ✅");
    } catch {
      setError("❌ Invalid JSON");
      toast.error("Invalid JSON ❌");
    }
  };

  const copyOutput = () => {
    if (!output) return toast.error("Nothing to copy ❌");
    navigator.clipboard.writeText(output)
      .then(() => toast.success("Copied to clipboard ✅"))
      .catch(() => toast.error("Failed to copy ❌"));
  };

  const downloadJSON = () => {
    if (!output) return toast.error("Nothing to download ❌");
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a); // For Safari support
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded ✅");
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).filter((f) => f.name.endsWith(".json"));
    if (!files.length) return toast.error("No JSON file selected ❌");

    setSelectedFiles(files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => setInput(event.target.result);
      reader.readAsText(file);
    });
    toast.success("File uploaded ✅");
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5]">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-auto max-w-sm sm:max-w-md px-3 py-4 min-h-screen">
        <Navbar />

        {/* Header */}
        <div className="text-center mt-24">
          <h1 className="text-2xl sm:text-3xl font-bold ">JSON Formatter & Validator</h1>
          <p className="text-sm text-gray-600 mt-2">Format, validate, minify & manage JSON easily</p>
        </div>

        <div className="bg-white p-4 rounded-lg mt-2 space-y-2 sm:space-y-4">

          {/* Controls */}
          <div className="flex flex-wrap justify-between gap-3 items-center">
            <div className="flex gap-2 flex-wrap mt-2">
              <button onClick={formatJSON} className="px-2 py-1 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Format</button>
              <button onClick={minifyJSON} className="px-2 py-1 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Minify</button>
              <button onClick={validateJSON} className="px-2 py-1 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Validate</button>
              <button onClick={copyOutput} className="px-2 py-1 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Copy</button>
              <button onClick={downloadJSON} className="px-2 py-1 text-xs bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">Download</button>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" checked={autoFormat} onChange={(e) => setAutoFormat(e.target.checked)} />
              <span className="text-sm">Auto Format</span>
            </div>
          </div>

          {/* JSON Upload Section */}
          <div>
            <label className="flex flex-col items-center cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center space-y-2 hover:bg-gray-100 transition">
              <img src="/cloud-logo.png" alt="upload" className="w-20 h-20" />
              <span className="font-semibold text-xs sm:text-lg">Drag & drop JSON file here</span>
              <span className="text-gray-500 text-[9px] sm:text-xs">Supported: .json</span>
              <input type="file" accept=".json"  hidden onChange={handleFileUpload} />
            </label>

            {/* Selected Files Info */}
            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border border-gray-200 rounded bg-gray-50 text-xs sm:text-sm">
                    <span>{file.name}</span>
                    <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
              <div className="text-sm font-medium mb-2">Input JSON</div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 w-full p-3 border rounded-lg text-xs font-mono resize-none overflow-auto"
                placeholder='{"name":"John","age":25}'
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
              <div className="text-sm font-medium mb-2">Output</div>
              <textarea
                value={output}
                readOnly
                className="flex-1 w-full p-3 border rounded-lg text-xs font-mono resize-none bg-gray-50 overflow-auto"
                placeholder="Formatted / Minified JSON will appear here"
              />
            </div>
          </div>

          {/* Status */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${error.includes("Valid") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {error}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
