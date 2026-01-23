"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Get user's initial
  const userInitial = session?.user?.name?.charAt(0).toUpperCase();

  return (
    <header className="absolute top-3 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 rounded-full bg-white/80 backdrop-blur-md shadow-lg px-4">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <Image src="/logo.png" alt="Logo" width={120} height={120} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
            <Link href={"/tools"} onClick={() => setIsOpen(false)} className="hover:text-black transition">Tools</Link>
            <Link className="hover:text-black transition" href="usecase">Use cases</Link>
            <Link className="hover:text-black transition" href="pricing">Pricing</Link>
            <Link className="hover:text-black transition" href="api">API</Link>
            <Link className="hover:text-black transition" href="docs">Docs</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!session?.user ? (
              <>
                <button onClick={() => router.push('/login')} className="text-sm text-gray-700 hover:text-black transition">Log in</button>
                <button onClick={() => router.push('/signup')} className="rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-gray-900 transition">Register</button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                {/* Logout (text only) */}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-gray-700 hover:text-black transition">
                  Logout
                </button>
                {/* User Avatar */}
                <Link href="/dashboard" className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold uppercase">
                  {userInitial}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-black focus:outline-none transition">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 w-full h-full z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

        {/* Overlay */}
        <div className="absolute inset-0" onClick={toggleMenu} />

        {/* Sidebar */}
        <div className={`flex flex-col justify-between fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-md shadow-xl p-5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          <div>
            {/* Logo */}
            <div className="flex items-center justify-between mb-6">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={150}
                className="cursor-pointer"
                onClick={() => { router.push('/'); setIsOpen(false); }}
              />
              <button onClick={toggleMenu} className="text-gray-600 hover:text-black p-1">
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <nav className="mt-15 flex flex-col gap-4 text-gray-700 text-sm">
              <Link href={"/tools"} onClick={() => setIsOpen(false)} className="hover:text-black transition">Tools</Link>
              <Link onClick={() => setIsOpen(false)} href="usecase" className="hover:text-black transition">Use cases</Link>
              <Link onClick={() => setIsOpen(false)} href="pricing" className="hover:text-black transition">Pricing</Link>
              <Link onClick={() => setIsOpen(false)} href="api" className="hover:text-black transition">API</Link>
              <Link onClick={() => setIsOpen(false)} href="docs" className="hover:text-black transition">Docs</Link>
            </nav>
          </div>

          {/* Actions */}
          <div className="mb-2 flex flex-col gap-3">
            <div className="bg-gray-200 w-full h-px"></div>

            {!session?.user ? (
              <>
                <button
                  onClick={() => { router.push('/login'); setIsOpen(false); }}
                  className="text-gray-600 hover:text-black text-sm transition"
                >
                  Log in
                </button>

                <button
                  onClick={() => { router.push('/signup'); setIsOpen(false); }}
                  className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 transition"
                >
                  Register
                </button>
              </>
            ) : (
              <Link href="/dashboard" className="flex flex-row items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold uppercase">
                  {userInitial}
                </span>
                <span className="text-gray-600 text-sm">
                  {session.user.name}
                </span>
              </Link>
            
            )}
          </div>

        </div>
      </div>

    </header>
  );
}
