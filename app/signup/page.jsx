"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User, Mail, Eye, EyeOff } from "lucide-react";


export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const[name, setName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
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
      <div className="hidden md:flex flex-col justify-end p-10 bg-linear-to-br from-sky-200 via-purple-200 to-pink-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome to SwiftTools <span className="font-normal">1.0</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm text-gray-700">
          The all-in-one toolbox that fits your daily workflow.
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="mb-8 text-center">
            <Image
              src="/logo.png"
              alt="SwiftTools"
              width={180}
              height={180}
              className="mx-auto cursor-pointer"
              onClick={() => router.push("/")}
            />
            <h1 className="mt-5 text-lg font-semibold text-gray-900">
              Create an account
            </h1>
             <h1 className="mt-5 text-lg font-semibold text-gray-900">
              Ready to get things done?
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Access your tools and manage your digital tasks in seconds.
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
  <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-gray-300 pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            </div>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-gray-300 pl-11 pr-4 py-2 text-sm focus:outline-none focus:border-gray-900"
              />
            </div>

           
            {/* Password */}
<div className="relative">
  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-full border border-gray-300 pl-11 pr-10 py-2 text-sm focus:outline-none focus:border-gray-900"
  />
  <button
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>


            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full rounded-full py-2.5 text-sm font-medium text-white bg-black hover:bg-black transition "
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
<button
  type="button"
  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
  className="w-full flex items-center justify-center gap-3 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
>
  {/* Google SVG */}
  <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
    <path
      fill="#4285F4"
      d="M533.5 278.4c0-17.7-1.5-34.8-4.4-51.4H272v97.2h146.9c-6.3 34.1-25.2 63-53.9 82.2v68h87.1c50.9-46.9 80.4-116 80.4-196z"
    />
    <path
      fill="#34A853"
      d="M272 544.3c72.6 0 133.5-24 178-65.1l-87.1-68c-24.1 16.2-55 25.6-90.9 25.6-69.8 0-129-47-150.2-110.1h-89v69.5c44.7 88.2 136.7 148.1 239.2 148.1z"
    />
    <path
      fill="#FBBC05"
      d="M121.8 326.7c-10.4-31-10.4-64.6 0-95.6v-69.5h-89c-39.3 77.5-39.3 168.8 0 246.3l89-69.2z"
    />
    <path
      fill="#EA4335"
      d="M272 107.9c37.4 0 70.9 12.9 97.4 34.1l73-73C405.5 24 344.6 0 272 0 169.5 0 77.5 59.9 32.8 148.1l89 69.5C143 154.9 202.2 107.9 272 107.9z"
    />
  </svg>
  Continue with Google
</button>

            {/* Login */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-gray-900">
                Log in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
