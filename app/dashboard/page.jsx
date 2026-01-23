"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, User, Cpu, FileText, ArrowRight, Pen } from "lucide-react";
import { Cardsections, CardiconMap } from "../lib/tools";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true); // same as account

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm">
        Loading dashboard...
      </div>
    );
  }

  if (!session) return null;

  const iconMap = CardiconMap;

  const quickTools = Cardsections[0].tools
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <main className="min-h-screen flex bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5]">

      {/* Sidebar — SAME AS ACCOUNT */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/50 backdrop-blur-md shadow-lg p-4 transition-all duration-300 z-30
          ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
      >
        <div className="flex items-center justify-between mb-6 mt-16">
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ArrowRight
              className={`w-4 h-4 transform transition-transform duration-300 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Home</span>}
          </Link>

          <Link
            href="/account"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Account</span>}
          </Link>

          <Link
            href="/tools"
            className= "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Cpu className="w-5 h-5" />
            {sidebarOpen && <span>Tools</span>}
          </Link>

          <a
            href="/api"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Pen className="w-5 h-5" />
            {sidebarOpen && <span>API</span>}
          </a>

          <a
            href="/docs"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <FileText className="w-5 h-5" />
            {sidebarOpen && <span>Docs</span>}
          </a>
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer text-sm bg-black text-white px-3 py-2 rounded-lg hover:text-gray-200 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main Content — SAME MARGIN LOGIC */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "sm:ml-64" : "sm:ml-16"
        }`}
      >
        {/* Navbar — SAME STYLE */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={120} height={30} />
          </div>

          <div className="cursor-pointer flex items-center gap-4">
            <Link
              href="/dashboard"
              className="cursor-pointer w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold"
            >
              {session.user?.name?.charAt(0) || "U"}
            </Link>
          </div>
        </header>

        {/* Content */}
        <section className="mt-20 px-4 py-6 mb-14">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center sm:text-left  text-gray-900 mb-2">
            Welcome, {session.user?.name || "User"} 👋
          </h2>
          <p className="text-sm text-gray-500 mb-6 text-center sm:text-left">
            Manage your tools & account
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div className=" ml-15 sm:ml-2 rounded-xl bg-white p-4 shadow-sm sm:w-[80%] w-[70%] flex flex-col ">
              <h3 className="font-medium text-gray-900">Account</h3>
              <p className="text-xs text-gray-500 mt-1">
                Name: {session.user?.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Email: {session.user?.email}
              </p>
            </div>

            <div className=" ml-15 sm:ml-2 rounded-xl bg-gray-100 p-4 shadow-sm flex flex-col sm:w-[80%] w-[70%] justify-between">
              <h3 className="font-medium text-gray-900">Subscription</h3>
              <p className="text-sm text-gray-600">Plan: Free</p>
              <p className="text-sm text-gray-600">
                Limited access – Upgrade to Premium to unlock all tools ✨ 
              </p>
              <Link href="/pricing" className="mt-3 px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-black w-max">
                Upgrade Now
              </Link>
            </div>

          </div>

          {/* Quick Tools */}
          <h3 className="text-xl text-center sm:text-left font-semibold text-gray-900 mt-8 mb-4">
            Quick Tools
          </h3>

          <div className="ml-15 sm:ml-2  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/images/${tool.slug}`}
                className="group sm:w-[90%] w-[80%] rounded-xl bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  {iconMap[tool.name] ?? "⚙️"}
                  <h3 className="font-medium text-gray-900">{tool.name}</h3>
                </div>
                <p className="text-xs text-gray-500">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
