"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-end p-10 bg-linear-to-br from-sky-300 via-purple-300 to-pink-300">
        <h2 className="text-3xl text-gray-900">
          <span className="font-semibold">Welcome to SwiftTools</span> 1.0
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-700">
          The all-in-one toolbox that fits your daily workflow.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-8 text-center">
            <Image src="/logo.png" alt="Logo" width={150} height={150} className="mx-auto cursor-pointer"  onClick={() => router.push('/')}/>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Ready to get things done?
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Access your tools in seconds.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-full border px-4 py-2 text-sm outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full rounded-full py-2 text-sm text-white transition
                ${!isFormValid || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
                }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-black font-medium">
                Sign up
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
