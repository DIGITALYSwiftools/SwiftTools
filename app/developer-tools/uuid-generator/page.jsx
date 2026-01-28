"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// UUID generators
const generateUUIDv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

const generateShortId = () => Math.random().toString(36).substring(2, 10);

const generateNumericId = (len = 10) => {
  let id = "";
  for (let i = 0; i < len; i++) id += Math.floor(Math.random() * 10);
  return id;
};

const generateCustomId = (prefix = "", len = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = prefix;
  for (let i = 0; i < len; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
};

export default function UUIDGenerator() {
  const [count, setCount] = useState(5);
  const [prefix, setPrefix] = useState("app_");
  const [type, setType] = useState("uuid"); // uuid | short | numeric | custom
  const [ids, setIds] = useState([]);

  const generate = () => {
    const list = [];
    for (let i = 0; i < count; i++) {
      if (type === "uuid") list.push(generateUUIDv4());
      if (type === "short") list.push(generateShortId());
      if (type === "numeric") list.push(generateNumericId(10));
      if (type === "custom") list.push(generateCustomId(prefix, 8));
    }
    setIds(list);
  };

  const copyAll = async () => {
    if (!ids.length) return;
    try {
      await navigator.clipboard.writeText(ids.join("\n"));
      alert("IDs copied!");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] min-h-screen">
      <div className="mx-auto max-w-md px-3 py-4">
        <Navbar />

        {/* Header */}
        <div className="text-center mb-3 mt-24">
          <h1 className="text-lg sm:text-2xl font-bold">UUID / ID Generator</h1>
          <p className="text-[11px] sm:text-sm text-gray-600">
            Generate secure unique IDs for apps, databases & APIs
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl p-3 shadow-sm bg-white space-y-4">

          {/* Type Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {["uuid", "short", "numeric", "custom"].map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-2 text-xs rounded-lg border transition
                  ${type === t ? "bg-black text-white border-dotted border-black" : "bg-gray-50 border-dotted border-gray-300"}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <label className="mb-1">Count</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={e => setCount(+e.target.value)}
                className="border-dotted border-gray-400 border rounded-lg p-2"
              />
            </div>

            {type === "custom" && (
              <div className="flex flex-col">
                <label className="mb-1">Prefix</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={e => setPrefix(e.target.value)}
                  className="border-dotted border-gray-400 border rounded-lg p-2"
                />
              </div>
            )}
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Generate IDs
          </button>

          {/* Output */}
          {ids.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium">Generated IDs</span>
                <button
                  onClick={copyAll}
                  className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition border-dotted border-gray-400"
                >
                  Copy All
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto border-dotted border-gray-400 rounded-lg p-2 bg-gray-50 text-[11px] font-mono space-y-1">
                {ids.map((id, i) => (
                  <div key={i} className="p-1 bg-white rounded border-dotted border-gray-300">{id}</div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
