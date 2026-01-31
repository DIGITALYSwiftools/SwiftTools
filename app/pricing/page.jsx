"use client";

import Link from "next/link";
import { Check, Star, Zap } from "lucide-react";

export default function PricingPage() {
  return (

        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-end p-10 bg-linear-to-br from-sky-200 via-purple-200 to-pink-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome to SwiftTools <span className="font-normal">1.0</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-700">
          The all-in-one toolbox that fits your daily workflow.
        </p>
      </div>
     <main className="min-h-screen w-screen bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5] px-4 py-6 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-6 max-w-4xl">
        <Link href="/">
          <img src="/logo.png" className="w-40 md:w-44 mx-auto mt-2" /> {/* wider on desktop */}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
          Pricing
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          Simple plans for Swift Tools users
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto gap-4 md:gap-2 w-4/5 md:w-full items-stretch">

        {/* Free Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col shadow-sm h-full ">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm md:text-base font-semibold text-gray-900">Free</h2>
            <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              Current
            </span>
          </div>

          <div className="text-[11px] md:text-[12px] text-gray-500 mb-1">
            Start exploring Swift Tools
          </div>

          <div className="mb-2">
            <span className="text-xl md:text-2xl font-bold text-gray-900">$0</span>
            <span className="text-[10px] md:text-[11px] text-gray-500"> /month</span>
          </div>

          <ul className="space-y-1 md:space-y-2 text-[11px] md:text-[12px] flex-1">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              Limited documents
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              Basic PDF tools
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              Web access
            </li>
          </ul>

          <button
            disabled
            className="mt-2 md:mt-3 w-full py-2 md:py-3 rounded-lg text-[11px] md:text-[12px] bg-gray-100 text-gray-400 cursor-not-allowed font-medium"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Card */}
        <div className="bg-gray-50 rounded-xl border border-gray-900 p-6 md:p-8 flex flex-col shadow-md h-full ">
          <span className="text-[9px] md:text-[10px] w-fit mb-1 md:mb-2 px-2 py-0.5 rounded-full bg-black text-white flex items-center gap-1 font-medium">
            <Star className="w-3 h-3 md:w-4 md:h-4" />
            Popular
          </span>

          <div className="text-[11px] md:text-[12px] text-gray-500 mb-1">
            Unlock full power of Swift Tools
          </div>

          <div className="mb-2">
            <span className="text-xl md:text-2xl font-bold text-gray-900">$5</span>
            <span className="text-[10px] md:text-[11px] text-gray-500"> /month</span>
          </div>

          <ul className="space-y-1 md:space-y-2 text-[11px] md:text-[12px] flex-1">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              Unlimited documents
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              All Swift tools
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              Web + Mobile + Desktop
            </li>
          </ul>

          <Link
            href="/checkout"
            className="mt-2 md:mt-3 w-full py-2 md:py-3 rounded-lg text-[11px] md:text-[12px] bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-900 transition font-medium"
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            Upgrade to Premium
          </Link>

          <p className="text-[9px] md:text-[10px] text-gray-400 mt-1 md:mt-2 text-center">
            Secure • Private • In your control
          </p>
        </div>

      </div>

      {/* Footer */}
      <p className="text-[10px] md:text-[11px] text-gray-400 text-center mt-4 md:mt-6 max-w-md">
        Get more done faster with Swift Tools
      </p>

    </main>
  </div>
  );
}
