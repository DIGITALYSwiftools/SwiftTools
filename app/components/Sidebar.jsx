"use client";

import Link from "next/link";
import { Home, User, Cpu, FileText, ArrowRight, Pen } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-md shadow-lg p-4 transition-all duration-300 z-30
      ${sidebarOpen ? "w-64" : "w-16"} hidden sm:flex flex-col`}
    >
      {/* Toggle */}
      <div className="flex items-center justify-between mb-6 mt-16">
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <ArrowRight
            className={`w-5 h-5 transform transition-transform duration-300 ${
              sidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2">
        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <Home className="w-5 h-5" />
          {sidebarOpen && <span>Home</span>}
        </Link>

        <Link href="/account" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <User className="w-5 h-5" />
          {sidebarOpen && <span>Account</span>}
        </Link>

        <Link href="/tools" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <Cpu className="w-5 h-5" />
          {sidebarOpen && <span>Tools</span>}
        </Link>

        <a href="/api" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <Pen className="w-5 h-5" />
          {sidebarOpen && <span>API</span>}
        </a>

        <a href="/docs" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
          <FileText className="w-5 h-5" />
          {sidebarOpen && <span>Docs</span>}
        </a>
      </nav>

      {/* Logout */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm bg-black text-white px-3 py-2 rounded-lg hover:text-gray-200 transition"
      >
        {sidebarOpen ? "Logout" : "⎋"}
      </button>
    </aside>
  );
}
