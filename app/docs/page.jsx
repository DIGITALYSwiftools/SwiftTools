"use client";

import Link from "next/link";
import {
  Code,
  Image,
  Palette,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { tools } from "../lib/docs";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Cardsections, CardiconMap } from "../lib/tools";

export default function DocumentationPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Auto-close sidebar on mobile
      } else {
        setSidebarOpen(true); // Auto-open on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categories = [
    {
      id: "image",
      name: "Image Tools",
      icon: <Image className="w-5 h-5" />,
      count: 10,
      color: "blue",
    },
    {
      id: "pdf",
      name: "PDF Tools",
      icon: <FileText className="w-5 h-5" />,
      count: 6,
      color: "red",
    },
    {
      id: "design",
      name: "Design Tools",
      icon: <Palette className="w-5 h-5" />,
      count: 5,
      color: "purple",
    },
    {
      id: "developer",
      name: "Developer Tools",
      icon: <Code className="w-5 h-5" />,
      count: 5,
      color: "green",
    },
  ];

  const iconMap = CardiconMap;
  const quickTools = Cardsections[3].tools
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  const activeTool = selectedTool ? tools.find((t) => t.id === selectedTool) : null;

  return (
    <div className="flex min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fff7f7] to-[#fffdf5]">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed for mobile, relative for desktop */}
      <aside
        className={`
          bg-linear-to-r from-[#f8f7ff] via-[#fff7f7] to-[#fffdf5]  backdrop-blur-md flex flex-col min-h-screen 
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-0 md:w-16"}
          ${isMobile 
            ? "fixed top-0 left-0 z-50 h-full" 
            : "relative"
          }
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
       

        {/* Sidebar Content */}
        <div className={`flex-1 overflow-y-auto ${sidebarOpen ? "px-3 py-4" : "py-4"} ${!sidebarOpen && !isMobile ? "flex flex-col items-center" : ""}`}>
          {/* Section Header */}
          {sidebarOpen && (
            <div className="py-4 px-5 border-b border-gray-200">
              <h2 className=" mt-16 w-auto text-lg font-semibold text-black uppercase tracking-wide">
                Introduction
              </h2>
            </div>
          )}

          {/* Categories */}
          <nav className={`space-y-3 ${sidebarOpen ? "w-full" : "w-12"}`}>
            {categories.map((cat) => (
              <div key={cat.id} className="w-full">
                <button
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.id ? null : cat.id)
                  }
                  className={`flex items-center text-black justify-between w-full ${
                    sidebarOpen ? "px-3 py-2" : "px-2 py-2 justify-center"
                  } rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-gray-100 shadow-inner"
                      : "text-black hover:bg-gray-100 "
                  }`}
                  aria-expanded={activeCategory === cat.id}
                >
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    {sidebarOpen && (
                      <span className="text-base font-semibold">{cat.name}</span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span className="text-xs text-black">{cat.count}</span>
                  )}
                </button>

                {activeCategory === cat.id && sidebarOpen && (
                  <div className="mt-2 flex flex-col gap-1 pl-6">
                    {tools
                      .filter((tool) => tool.category === cat.id)
                      .map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            setSelectedTool(tool.id);
                            if (isMobile) setSidebarOpen(false); // Close sidebar on mobile when selecting a tool
                          }}
                          className={`flex items-center gap-2 px-2 text-xs py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                            selectedTool === tool.id
                              ? "bg-gray-100  text-black font-medium"
                              : " hover:bg-gray-100  text-black"
                          }`}
                        >
                          <span className="text-transparent">---</span>
                          {tool.icon}
                          <span>{tool.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 sm:p-8 p-1  transition-all duration-300 ${
        sidebarOpen && !isMobile ? "mt-24" :""
      }`}>
        <Navbar />
        
        {/* Mobile Toggle Button - Outside sidebar */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="relative mt-20  w-10 h-10 text-black mb-1 bg-white border border-gray-300 rounded-full flex items-center justify-center z-30 shadow-lg"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}

        {selectedTool ? (
          <div className="rounded-2xl px-6 mt-2  space-y-12">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-xl font-bold text-gray-800">{activeTool.name}</h2>
              <p className="text-gray-500 text-sm sm:text-md max-w-3xl">
                {activeTool.description}
              </p>
            </div>

            {/* Key Features */}
            {activeTool.features?.length > 0 && (
              <div className="p-6 mt-1 mb-3 rounded-xl bg-white backdrop-blur-sm">
                <h3 className="text-sm font-semibold mb-2 text-black">Key Features</h3>
                <ul className="space-y-0">
                  {activeTool.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-0.5  rounded-lg hover:bg-gray-100/50"
                    >
                      <span className="font-bold text-gray-700">*</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* API Endpoint */}
            {activeTool.apiEndpoint && (
              <div className="max-w-2xl">
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-1">
                  API Endpoint
                </h3>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
                  <p className="font-mono text-sm text-gray-800 truncate flex-1">
                    {activeTool.apiEndpoint}
                  </p>
                  <button
                    className="bg-gray-200 px-3 py-2 text-black cursor-pointer rounded text-xs hover:bg-gray-300"
                    onClick={() =>
                      navigator.clipboard.writeText(activeTool.apiEndpoint)
                    }
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Request Format */}
            {activeTool.requestFormat && (
              <div className=" rounded-xl bg-gray-50/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-3 text-black">Request Format</h3>
                <p className="text-sm text-gray-600 mb-1">
                 <span className="font-bold"> Type:</span> <span className="text-sm ">{activeTool.requestFormat.type}</span>
                </p>
                <ul className="space-y-1">
                  {Object.entries(activeTool.requestFormat.fields).map(
                    ([key, value]) => (
                      <li key={key} className="text-sm">
                        <span className=" font-bold text-gray-800">{key}</span>
                        <span className="text-gray-500"> — {value}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

      

            {/* Premium Benefits */}
            {activeTool.premiumBenefits?.length > 0 && (
              <div className=" rounded-xl bg-gray-50/50 backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Premium Benefits</h3>
                <ul className="space-y-1">
                  {activeTool.premiumBenefits.map((item, idx) => (
                    <li key={idx} className="flex text-sm gap-2 text-gray-700">
                      <span className="text-gray-800 font-bold">★</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Guide */}
            {activeTool.detailedGuide && (
              <div className="p-6 mb-3 rounded-xl bg-gray-200/25 backdrop-blur-md shadow-lg shadow-gray-500/5">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">How It Works</h3>
                <div className="text-gray-600 text-xs max-w-none ">
                  <ReactMarkdown>{activeTool.detailedGuide}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          <section className={`${ sidebarOpen && !isMobile ? "mt-11" :""} flex min-h-screen flex-col items-start px-4 text-left max-w-6xl mx-auto `}>
            {/* Badge */}
            <div className="mb-4">
              <span className="text-black rounded-full bg-white/80 backdrop-blur px-5 py-1.5 text-sm font-medium shadow-md border border-gray-200">
                ✨ Introducing SwiftTools 1.0
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-black md:text-5xl">
              Welcome to the Developer Portal
            </h1>

            {/* Subheading */}
            <p className="mt-6 max-w-2xl text-base text-gray-600 md:text-lg">
              Everything you need to build, integrate, and scale with SwiftTools.
              Clean APIs, powerful tools, and developer-first documentation.
            </p>

            {/* Divider */}
            <div className="mt-1" />

            {/* Introduction */}
            <div className="mt-12 max-w-3xl space-y-6 text-left">
              <h2 className="text-xl font-semibold text-gray-800 md:text-2xl">
                Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed text-md">
                SwiftTools is your all-in-one digital toolbox designed to simplify
                everyday workflows. Fast, secure, privacy-focused, and built for
                performance — everything you need in one platform.
              </p>
            </div>

            {/* Base URL Card */}
            <div className="mt-10 w-full max-w-2xl">
              <h3 className="text-xl  font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Base URL
              </h3>
              <div className="relative group">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white/90 backdrop-blur shadow-lg p-4 pl-5 hover:border-indigo-300 transition-all duration-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-gray-800 text-sm md:text-base truncate">
                      https://swift-tools-lemon.vercel.app/
                    </p>
                  </div>
                  <button
                    className="text-black bg-gray-200 cursor-pointer rounded-lg p-2 text-xs hover:bg-gray-300"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "https://swift-tools-lemon.vercel.app/"
                      );
                    }}
                  >
                    <span>Copy URL</span>
                  </button>
                </div>
                <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded">
                    Click to copy
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Use this URL as the base for all API endpoints
              </p>
            </div>

            {/* Quick Tools */}
            <h3 className="text-xl text-center sm:text-left font-semibold text-gray-800 mt-8 mb-4">
              Quick Tools
            </h3>
           <div className=" mx-auto grid place-items-center grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
  {quickTools.map((tool) => (
    <Link
      key={tool.slug}
      href={`/developer-tools/${tool.slug}`}
      className="group w-full rounded-xl bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 "
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600">
          {iconMap[tool.name] ?? "⚙️"}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{tool.name}</h3>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tool.desc}</p>
    </Link>
  ))}
</div>
          </section>
        )}
        <Footer />
      </main>
    </div>
  );
}