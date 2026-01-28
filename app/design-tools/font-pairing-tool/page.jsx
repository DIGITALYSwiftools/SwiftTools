"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast, { Toaster } from "react-hot-toast";

const fontPairs = [
  { heading: "Montserrat", body: "Open Sans", style: "modern", category: "sans-serif", mood: "professional" },
  { heading: "Poppins", body: "Inter", style: "clean", category: "sans-serif", mood: "tech" },
  { heading: "Raleway", body: "Nunito", style: "minimal", category: "sans-serif", mood: "elegant" },
  { heading: "Playfair Display", body: "Merriweather", style: "elegant", category: "serif", mood: "classic" },
  { heading: "Cinzel", body: "Crimson Text", style: "luxury", category: "serif", mood: "premium" },
  { heading: "Fredoka One", body: "Nunito Sans", style: "rounded", category: "display", mood: "playful" },
  { heading: "Space Grotesk", body: "Space Mono", style: "tech", category: "monospace", mood: "developer" },
  { heading: "Playfair Display", body: "Roboto", style: "elegant", category: "mixed", mood: "professional" },

  // Extra pairs not initially displayed
  { heading: "Bebas Neue", body: "Roboto Condensed", style: "bold", category: "sans-serif", mood: "impact" },
  { heading: "Work Sans", body: "Karla", style: "friendly", category: "sans-serif", mood: "casual" },
  { heading: "Rubik", body: "Hind", style: "rounded", category: "sans-serif", mood: "modern" },
  { heading: "Abril Fatface", body: "PT Serif", style: "vintage", category: "serif", mood: "retro" },
  { heading: "DM Serif Display", body: "Lora", style: "editorial", category: "serif", mood: "blog" },
  { heading: "Bodoni Moda", body: "Cormorant", style: "fashion", category: "serif", mood: "luxury" },
  { heading: "Pacifico", body: "Quicksand", style: "playful", category: "display", mood: "fun" },
  { heading: "Lobster", body: "Comfortaa", style: "casual", category: "display", mood: "friendly" },
];

const categories = ["all", "sans-serif", "serif", "display", "monospace", "mixed"];
const moods = ["all", "professional", "tech", "elegant", "classic", "modern", "playful", "creative", "casual", "luxury"];

export default function FontPairingTool() {
  const [category, setCategory] = useState("all");
  const [mood, setMood] = useState("all");
  const [filteredPairs, setFilteredPairs] = useState(fontPairs);
  const [selectedPair, setSelectedPair] = useState(fontPairs[0]);
  const [fontSize, setFontSize] = useState({ heading: 32, body: 16 });
  const [visibleCount, setVisibleCount] = useState(6); // Number of pairs initially shown

  // Filter fonts
  useEffect(() => {
    let filtered = fontPairs;
    if (category !== "all") filtered = filtered.filter(p => p.category === category);
    if (mood !== "all") filtered = filtered.filter(p => p.mood === mood);
    setFilteredPairs(filtered);
    if (!filtered.includes(selectedPair)) setSelectedPair(filtered[0] || null);
    setVisibleCount(6); // reset visible count on filter change
  }, [category, mood]);

  // Load Google Fonts dynamically
  useEffect(() => {
    if (!selectedPair) return;
    const fonts = new Set();
    fonts.add(selectedPair.heading.replace(/ /g, "+"));
    fonts.add(selectedPair.body.replace(/ /g, "+"));
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${Array.from(fonts).join("&family=")}:wght@300;400;500;600;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [selectedPair]);

  const copyCSS = (full = false) => {
    if (!selectedPair) return alert("No font selected!");
    const code = full
      ? `@import url('https://fonts.googleapis.com/css2?family=${selectedPair.heading.replace(/ /g, "+")}:wght@400;700&family=${selectedPair.body.replace(/ /g, "+")}:wght@400;500;600&display=swap');

h1, h2, h3, h4, h5, h6 { font-family: '${selectedPair.heading}', sans-serif; font-weight:700; }
body, p, span, div { font-family: '${selectedPair.body}', sans-serif; font-weight:400; }`
      : `@import url('https://fonts.googleapis.com/css2?family=${selectedPair.heading.replace(/ /g, "+")}:wght@400;700&family=${selectedPair.body.replace(/ /g, "+")}:wght@400;500;600&display=swap');`;
    navigator.clipboard.writeText(code);
   toast.success("Copied to clipboard ✅");
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-auto max-w-md px-3 py-4">
        <Navbar />
        <h1 className="text-xl sm:text-3xl font-bold text-center mb-4 mt-24">Font Pairing Tool</h1>
        <p className="text-center text-sm text-gray-600 mb-8">Discover perfect heading & body font combinations for your projects</p>

        <div className="max-w-md bg-white p-4 rounded-lg">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs border transition ${
                  category === cat ? "bg-black text-white" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat.replace("-", " ")}
              </button>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <select
              value={mood}
              onChange={e => setMood(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 bg-white text-sm"
            >
              {moods.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>

          {/* Font Size Sliders */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center items-center">
            <div className="flex flex-col w-full max-w-xs">
              <label className="text-xs font-medium mb-1">Heading Size: {fontSize.heading}px</label>
              <input
                type="range" min="24" max="48" step="1"
                value={fontSize.heading}
                onChange={e => setFontSize({...fontSize, heading: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-black"
              />
            </div>
            <div className="flex flex-col w-full max-w-xs">
              <label className="text-xs font-medium mb-1">Body Size: {fontSize.body}px</label>
              <input
                type="range" min="12" max="24" step="0.5"
                value={fontSize.body}
                onChange={e => setFontSize({...fontSize, body: parseFloat(e.target.value)})}
                className="w-full h-2 bg-gray-300 rounded-full appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-black"
              />
            </div>
          </div>

          {/* Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPairs.slice(0, visibleCount).map((pair, i) => (
              <div
                key={i}
                onClick={() => setSelectedPair(pair)}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedPair === pair ? "border-black bg-black text-white" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div style={{ fontFamily: pair.heading, fontSize: `${fontSize.heading}px` }} className="font-bold mb-2">
                  {pair.heading}
                </div>
                <div style={{ fontFamily: pair.body, fontSize: `${fontSize.body}px` }} className="text-gray-700">
                  {pair.body}
                </div>
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>{pair.mood}</span>
                  <span>{pair.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredPairs.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Load More
              </button>
            </div>
          )}

          {/* Copy CSS Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
              onClick={() => copyCSS(false)}
              className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Copy CSS Import
            </button>
            <button
              onClick={() => copyCSS(true)}
              className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Copy Complete CSS
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
