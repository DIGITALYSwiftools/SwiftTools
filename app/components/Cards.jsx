"use client";

import Link from "next/link";
import {
  ArrowRight
} from "lucide-react";
import { CardiconMap, Cardsections } from "../lib/tools";
import Footer from "./Footer";

/* ================= ICON MAP ================= */

const iconMap = CardiconMap;

/* ================= SECTIONS ================= */

const sections = Cardsections;

/* ================= PAGE ================= */

export default function CardsPage({ mtop }) {
  return (
    <div className={`min-h-screen bg-linear-to-br ${mtop}`}>
      <div className="mx-auto max-w-7xl px-4 py-12">
        {sections.map((section) => (
          <section key={section.title} className="mb-14">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              <p className="mt-1 text-gray-600">{section.subtitle}</p>
            </div>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${section.basePath}/${tool.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-3 sm:p-3 md:p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                >
                  <div className="mb-2 sm:mb-3 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-100 to-blue-100">
                    {iconMap[tool.name] ?? "⚙️"}
                  </div>

                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900">{tool.name}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">{tool.desc}</p>

                  <div className="mt-2 sm:mt-3 flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Open tool <ArrowRight size={12} />
                  </div>
                </Link>
              ))}


            </div>
          </section>
        ))}
      </div>
      <Footer />
    </div>
  );
}
