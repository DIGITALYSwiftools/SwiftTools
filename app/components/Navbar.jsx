"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="fixed top-6 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl pxa-4"> 
        <div className="flex items-center justify-between rounded-full bg-white/80 backdrop-blur-md shadow-lg px-6 py-3">
          
          {/* Logo */}
          <div className="flex items-center gap-2"  onClick={() => router.push('/')}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
            />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
            <a className="hover:text-black" href="#">Tools</a>
            <a className="hover:text-black" href="#">Use cases</a>
            <a className="hover:text-black" href="#">Pricing</a>
            <a className="hover:text-black" href="#">API</a>
            <a className="hover:text-black" href="#">Docs</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="text-sm text-gray-700 hover:text-black bg-transparent border-none cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-gray-900"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
