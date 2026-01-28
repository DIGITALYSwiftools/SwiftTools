"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function Base64ToolCompact() {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setTextInput(ev.target.result);
    reader.readAsText(f);
  };

  const encodeText = () => {
    if (!textInput) return toast.error("No input to encode!");
    try {
      setOutput(btoa(textInput));
      toast.success("Encoded!");
    } catch {
      toast.error("Invalid input!");
    }
  };

  const decodeText = () => {
    if (!textInput) return toast.error("No input to decode!");
    try {
      setOutput(atob(textInput));
      toast.success("Decoded!");
    } catch {
      toast.error("Invalid Base64 string!");
    }
  };

  const copyText = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied!");
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] min-h-screen">
      <Toaster position="top-center" />
      <div className="mx-auto max-w-sm px-3 py-4">
        <Navbar />

        {/* Header */}
        <div className="text-center mb-4 mt-20">
          <h1 className="text-lg font-bold">Base64 Encoder / Decoder</h1>
          <p className="text-[10px] text-gray-600">Encode or decode text/files</p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl p-3 shadow-sm bg-white space-y-3">

          {/* Upload Section */}
          <label className="flex flex-col items-center cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs sm:text-sm space-y-1 hover:bg-gray-100 transition">
            <img src="/cloud-logo.png" alt="upload" className="w-16 h-16 sm:w-24 sm:h-24" />
            <span className="font-semibold">{file ? file.name : "Upload a file"}</span>
            <span className="text-gray-500 text-[9px] sm:text-xs">Supported: TXT files</span>
            <input type="file" hidden onChange={handleFileChange} />
          </label>

          {/* Text Input */}
          <input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste text here..."
            className="w-full px-2 py-1 border border-gray-400 rounded text-xs bg-gray-50"
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={encodeText}
              className="flex-1 py-1 text-xs font-semibold border border-black rounded bg-black text-white hover:bg-gray-800 transition"
            >
              Encode
            </button>
            <button
              onClick={decodeText}
              className="flex-1 py-1 text-xs font-semibold border border-black rounded bg-black text-white hover:bg-gray-800 transition"
            >
              Decode
            </button>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold">Output</span>
              <button
                onClick={copyText}
                className="px-2 py-0.5 text-[9px] border border-gray-400 rounded hover:bg-gray-200 transition cursor-pointer"
              >
                Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-20 p-1 border border-gray-400 rounded text-xs resize-none bg-gray-50"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
