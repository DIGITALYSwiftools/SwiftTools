"use client";
import CardsPage from "../components/Cards";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fff7f7] to-[#fffdf5]">
      <Navbar />

      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center ">

        <span className="mb-6 rounded-full bg-white px-4 py-1 text-sm shadow">
          ✨ Introducing SwiftTools 1.0
        </span>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-gray-900 md:text-6xl">
         <img src="/h1.png" className="w-150" />
        </h1>

        <p className="mt-6 max-w-2xl text-gray-500  text-sm">
          The all-in-one toolbox that fits your daily workflow.
          Incredibly fast, privacy-focused, and built to handle
          every digital task in seconds.
        </p>

        {/* Search */}
        <div className="mt-10 w-full max-w-md">
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow">
            <svg
              className="h-5 w-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Search for Privacy Blur"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

      </section>
      <CardsPage />
    </main>
  );
}