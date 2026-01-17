"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
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

    try {
      // 1️⃣ Call register API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: email.split("@")[0], // simple name fallback
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // 2️⃣ Auto login with NextAuth
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
      });

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-end p-10 bg-linear-to-br from-sky-300 via-purple-300 to-pink-300">
        <h2 className="text-3xl text-gray-900">
          <span className="font-semibold">Welcome to SwiftTools</span> 1.0
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-700">
          The all-in-one toolbox that fits your daily workflow.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-8 text-center">
            <Image src="/logo.png" alt="Logo" width={150} height={150} className="mx-auto cursor-pointer"  onClick={() => router.push('/')} />
            <h1 className="mt-4 text-xl font-semibold">
              Create an account
            </h1>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-3 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border px-4 py-2 text-sm outline-none focus:border-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border px-4 py-2 text-sm outline-none focus:border-black"
            />

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full rounded-full py-2 text-sm text-white transition
                ${!isFormValid || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black"
                }`}
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-medium">
                Log in
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}
