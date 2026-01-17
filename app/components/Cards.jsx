"use client";

import Link from "next/link";
import {
  ArrowRight
} from "lucide-react";
import { CardiconMap, Cardsections } from "../lib/tools";

/* ================= ICON MAP ================= */

const iconMap = CardiconMap;

/* ================= SECTIONS ================= */

const sections = Cardsections;

/* ================= PAGE ================= */

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8f7ff] via-[#fff7f7] to-[#fffdf5]">
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
                  className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-100 to-blue-100">
                    {iconMap[tool.name] ?? "⚙️"}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{tool.desc}</p>

                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    Open tool <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
