"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomFooter from "../../components/CustomFooter";

export default function CodeMinifierTool() {
  const [activeTab, setActiveTab] = useState("upload"); // upload | paste
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);

  const detectType = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (["html", "css", "js"].includes(ext)) return ext;
    return "";
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = detectType(file.name);
    if (!type) return;

    setFileType(type);
    setCode(await file.text());
    setOutput("");
  };

  const minify = (content, type) => {
    if (type === "html") {
      return content
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ")
        .trim();
    }
    if (type === "css") {
      return content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,])\s*/g, "$1")
        .trim();
    }
    if (type === "js") {
      return content
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .replace(/\s*([=+\-*/{}();,:<>])\s*/g, "$1")
        .trim();
    }
    return content;
  };

  const handleMinify = () => {
    if (!code || !fileType) return;
    setLoading(true);
    setOutput(minify(code, fileType));
    setLoading(false);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.min.${fileType}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] text-black">
      <div className="mx-auto max-w-2xl px-2 py-4 min-h-screen">
        <Navbar />

        {/* Header */}
        <div className="text-center mt-20 mb-2">
          <h1 className="text-lg sm:text-xl font-bold">Code Minifier</h1>
          <p className="text-[10px] sm:text-xs text-gray-600">
            Minify HTML, CSS & JavaScript
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm p-2 space-y-2">

          {/* Tabs */}
          <div className="flex border-b text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-2 py-1 ${
                activeTab === "upload" ? "border-b-2 border-black font-semibold" : "text-gray-500"
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab("paste")}
              className={`px-2 py-1 ${
                activeTab === "paste" ? "border-b-2 border-black font-semibold" : "text-gray-500"
              }`}
            >
              Paste
            </button>
          </div>

          {/* Upload */}
          {activeTab === "upload" && (
            <label className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[150px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer p-2">
              <img src="/cloud-logo.png" alt="upload" className="w-16 h-16 sm:w-20 sm:h-20 opacity-80" />
              <p className="font-semibold text-xs sm:text-sm">Tap or drag files</p>
              <p className="text-[9px] sm:text-xs text-gray-500">HTML, CSS, JS</p>
              <input type="file" accept=".html,.css,.js" hidden onChange={handleFileChange} />
            </label>
          )}

          {/* Paste */}
          {activeTab === "paste" && (
            <>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="border rounded px-2 py-1 text-xs sm:text-sm w-full"
              >
                <option value="">Select language</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
              </select>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full min-h-[100px] sm:min-h-[150px] rounded-lg border border-gray-300 p-2 font-mono text-[10px] sm:text-xs"
              />
            </>
          )}

          {/* Action */}
          <button
            onClick={handleMinify}
            disabled={loading || !fileType || !code}
            className="w-full rounded-lg bg-black text-white py-1.5 text-xs sm:text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Minifying..." : "Minify"}
          </button>

          {/* Output */}
          {output && (
            <>
              <textarea
                value={output}
                readOnly
                className="w-full min-h-[100px] sm:min-h-[150px] rounded-lg border border-gray-300 p-2 font-mono text-[10px] sm:text-xs bg-gray-50"
              />
              <button
                onClick={downloadFile}
                className="w-full rounded-lg border border-gray-300 py-1.5 text-xs sm:text-sm font-semibold"
              >
                Download
              </button>
            </>
          )}
        </div>
      </div>

      <Footer />
      <CustomFooter />
    </div>
  );
}
