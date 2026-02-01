"use client";

import { useState, useEffect } from "react";
import CardsPage from "../components/Cards";
import Navbar from "../components/Navbar";
import Faqs from "../components/Faqs";
import Footer from "../components/Footer";
import CustomFooter from "../components/CustomFooter";

export default function Home() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // 🔁 Animated placeholder texts
  const placeholders = [
    "Image Converter",
    "Watermark Adder",
    "Bulk Image Resizer",
    "UUID Generator",
  ];

  // 🔄 Rotate placeholder (pause when typing)
  useEffect(() => {
    if (query) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [query]);

  const handleSearch = () => {
    
    const search = query.trim().toLowerCase();
    if (!search) return;

    const words = search.split(/\s+/);
    const cards = document.querySelectorAll("[data-tool-name]");

    for (const card of cards) {
      const name = card.dataset.toolName.toLowerCase();
      const matched = words.some((word) => name.includes(word));

      if (matched) {
        card.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        card.classList.add("ring-2", "ring-gray-200");
        setTimeout(() => {
          card.classList.remove("ring-2", "ring-gray-200");
        }, 1500);

        break;
      }
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fff7f7] to-[#fffdf5]">
      <Navbar />

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <span className="mb-6 rounded-full bg-white text-black px-4 py-1 text-sm shadow">
          ✨ Introducing SwiftTools 1.0
        </span>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-gray-900 md:text-6xl">
          <img src="/h1.png" className="mx-auto" />
        </h1>

        <p className="mt-6 max-w-2xl text-gray-500 text-sm">
          The all-in-one toolbox that fits your daily workflow.
          Incredibly fast, privacy-focused, and built to handle
          every digital task in seconds.
        </p>

       {/* Search */}
<div className="mt-10 w-full max-w-md">
  <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow">
    <svg
      className="h-5 w-5 text-gray-800 cursor-pointer"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      onClick={handleSearch} // click triggers search
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>

    <input
  type="text"
  placeholder={query ? query : `Search for ${placeholders[placeholderIndex]}`}
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") handleSearch();
  }}
  className="w-full bg-transparent text-sm outline-none text-black placeholder-gray-400"
/>

  </div>
</div>

      </section>
      <CardsPage />
      <Faqs />
      <Footer />
      <CustomFooter/>
    </main>
  );
}
