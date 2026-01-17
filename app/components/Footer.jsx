"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Footer() {
  const router = useRouter();
  return (
    <footer className="w-full pt-8 px-6 bg-linear-to-r from-[#8ee3f9] via-[#fbc7d4] to-[#d7f5d9] rounded-lg flex items-end justify-between max-w-5xl mx-auto mb-10">
      {/* Changed items-center to items-end */}

      <div className="max-w-md">
        <h2 className="text-xl font-extrabold text-black mb-2">
          Get more with Swifttools Premium
        </h2>
        <p className="text-sm text-gray-700 mb-1">
          Accès complet aux outils Swifttools
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Traitement de documents illimité
        </p>
        <p className="text-sm text-gray-700 mb-6">Sans publicité</p>
        <button
          onClick={() => router.push('/login')}
         className="bg-black text-white text-sm font-semibold py-2 px-4 rounded hover:bg-gray-800 transition mb-6">
          {/* Added mb-6 here for bottom margin */}
          Get Premium
        </button>
      </div>

      <div className="relative flex items-end">
        <Image
          src="/tabler_crown.png"
          alt="Crown Icon"
          style={{ objectFit: "contain" }}
          priority
          width={300}
          height={300}
        />
      </div>
    </footer>
  );
}
