"use client";

import Link from "next/link";
import { Check, Star, Zap } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5] px-4 py-6 flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-6 max-w-4xl">
        <Link href="/">
          <img src="/logo.png" className="w-40 mx-auto mt-2" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          Pricing
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Simple plans for Swift Tools users
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto gap-4 w-2/3">

        {/* Free Card */}
        <div className="bg-white  rounded-xl border border-gray-200 p-6 flex flex-col shadow-sm h-full">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-gray-900">Free</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              Current
            </span>
          </div>

          <div className="text-[11px] text-gray-500 mb-1">
            Start exploring Swift Tools
          </div>

          <div className="mb-2">
            <span className="text-xl font-bold text-gray-900">$0</span>
            <span className="text-[10px] text-gray-500"> /month</span>
          </div>

          <ul className="space-y-1 text-[11px] flex-1">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 text-green-500" />
              Limited documents
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 text-green-500" />
              Basic PDF tools
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 text-green-500" />
              Web access
            </li>
          </ul>

          <button
            disabled
            className="mt-2 w-full py-2 rounded-lg text-[11px] bg-gray-100 text-gray-400 cursor-not-allowed font-medium"
          >
            Current Plan
          </button>
        </div>

        {/* Premium Card */}
        <div className="bg-gray-50  rounded-xl border border-gray-900 p-6 flex flex-col shadow-md h-full">
          <span className="text-[9px] w-fit mb-1 px-2 py-0.5 rounded-full bg-black text-white flex items-center gap-1 font-medium">
            <Star className="w-3 h-3" />
            Popular
          </span>

          <div className="text-[11px] text-gray-500 mb-1">
            Unlock full power of Swift Tools
          </div>

          <div className="mb-2">
            <span className="text-xl font-bold text-gray-900">$5</span>
            <span className="text-[10px] text-gray-500"> /month</span>
          </div>

          <ul className="space-y-1 text-[11px] flex-1">
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 text-green-500" />
              Unlimited documents
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 text-green-500" />
              All Swift tools
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 text-green-500" />
              Web + Mobile + Desktop
            </li>
          </ul>

          <Link
            href="/checkout"
            className="mt-2 w-full py-2 rounded-lg text-[11px] bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-900 transition font-medium"
          >
            <Zap className="w-4 h-4" />
            Upgrade to Premium
          </Link>

          <p className="text-[9px] text-gray-400 mt-1 text-center">
            Secure • Private • In your control
          </p>
        </div>

      </div>

      {/* Footer */}
      <p className="text-[10px] text-gray-400 text-center mt-4 max-w-md">
        Get more done faster with Swift Tools
      </p>

    </main>
  );
}
