"use client";

import Link from "next/link";
import { Check, Star, Zap } from "lucide-react";
import Footer from "../components/Footer";
import CustomFooter from "../components/CustomFooter";
import Navbar from "../components/Navbar";

export default function PricingPage() {
  const freeFeatures = ["Limited documents", "Basic PDF tools", "Web access"];
  const premiumFeatures = ["Unlimited documents", "All Swift tools", "Web + Mobile + Desktop"];
  const proFeatures = ["All Premium features", "Priority support", "Team collaboration"];

  function PricingCard({ type, price, features, popular, current }) {
    return (
      <div
        className={`flex flex-col rounded-xl border p-4 md:p-6 shadow-sm min-h-[250px]
          ${type === "premium" ? "bg-gray-50 border-gray-900 shadow-md" : "bg-white border-gray-200"}`}
      >
        {popular && (
          <span className="text-[9px] md:text-[10px] w-fit mb-1 md:mb-2 px-2 py-0.5 rounded-full bg-black text-white flex items-center gap-1 font-medium">
            <Star className="w-3 h-3 md:w-4 md:h-4" />
            Popular
          </span>
        )}

        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm md:text-base font-semibold text-gray-900">{type}</h2>
          {current && (
            <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
              Current
            </span>
          )}
        </div>

        <div className="text-[11px] md:text-[12px] text-gray-500 mb-2">
          {type === "free" ? "Start exploring Swift Tools" : "Unlock full power of Swift Tools"}
        </div>

        <div className="mb-2">
          <span className="text-xl md:text-2xl font-bold text-gray-900">${price}</span>
          <span className="text-[10px] md:text-[11px] text-gray-500"> /month</span>
        </div>

        <ul className="space-y-1 md:space-y-2 text-[11px] md:text-[12px] mb-2 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700">
              <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
              {f}
            </li>
          ))}
        </ul>

        {type === "free" ? (
          <button
            disabled
            className="mt-2 md:mt-3 w-full py-2 md:py-3 rounded-lg text-[11px] md:text-[12px] bg-gray-100 text-gray-400 cursor-not-allowed font-medium"
          >
            Current Plan
          </button>
        ) : (
          <Link
            href="/checkout"
            className="mt-2 md:mt-3 w-full py-2 md:py-3 rounded-lg text-[11px] md:text-[12px] bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-900 transition font-medium"
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            Upgrade to {type.charAt(0).toUpperCase() + type.slice(1)}
          </Link>
        )}

        <p className="text-[9px] md:text-[10px] text-gray-400 mt-1 md:mt-2 text-center">
          Secure • Private • In your control
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Navbar/>

      {/* LEFT PANEL 30% */}
      <div className="hidden md:flex flex-col justify-center w-[30%] p-8 bg-linear-to-br from-sky-200 via-purple-200 to-pink-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome to SwiftTools <span className="font-normal">1.0</span>
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          The all-in-one toolbox that fits your daily workflow.
        </p>
      </div>

      {/* MAIN PRICING SECTION 70% */}
      <main className="flex-1 w-[70%] bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5] px-4 py-6 flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-6 max-w-4xl mt-16">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
            Pricing
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Simple plans for Swift Tools users
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:max-w-5xl   w-[280px] lg:w-full">
          <PricingCard type="free" price="0" features={freeFeatures} current />
          <PricingCard type="premium" price="5" features={premiumFeatures} popular />
          <PricingCard type="pro" price="15" features={proFeatures} />
        </div>

        {/* Footer */}
        <p className="text-[10px] md:text-[11px] text-gray-400 text-center mt-6 max-w-md">
          Get more done faster with Swift Tools
        </p>
         <Footer/>
      <CustomFooter/>
      </main>
     
    </div>
  );
}
