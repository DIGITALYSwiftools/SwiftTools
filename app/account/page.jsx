"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Home, User, Cpu, FileText, ArrowRight, Pen } from "lucide-react";
import Footer from "../components/Footer";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import Loader from "../components/Loader";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop style
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    if (!session) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user");
        const userData = res.data.user || res.data;
        setUser(userData);
        setName(userData.name || "");
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session]);

  const handleUpdate = async () => {
    if (!name.trim()) return setMessage("Name cannot be empty");

    try {
      setUpdating(true);
      const res = await axios.patch("/api/user", { name });
      const userData = res.data.user || res.data;
      setUser(userData);
      setMessage("Name updated successfully");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update name");
    } finally {
      setUpdating(false);
    }
  };

  if (status === "loading" || loading)
    return (
      <Loader/>
    );
  if (!session || !user) return null;

  return (
    <main className="min-h-screen flex bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/80 backdrop-blur-md shadow-lg p-4 transition-all duration-300 z-30
          ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
      >
        <div className="flex items-center justify-between mb-6 mt-16">
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ArrowRight
              className={`w-4 h-4 cursor-pointer transform transition-transform duration-300 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Home</span>}
          </Link>

          <Link
            href="/account"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Account</span>}
          </Link>

          <Link
            href="/tools"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Cpu className="w-5 h-5" />
            {sidebarOpen && <span>Tools</span>}
          </Link>

          <a
            href="/docs"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <Pen className="w-5 h-5" />
            {sidebarOpen && <span>API</span>}
          </a>

          <a
            href="/docs"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <FileText className="w-5 h-5" />
            {sidebarOpen && <span>Docs</span>}
          </a>
            
        </nav>
        {sidebarOpen && 
        <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className=" cursor-pointer text-sm bg-black text-white px-3 py-2 rounded-lg hover:text-gray-200 transition"
            >
              Logout
            </button>}
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? "sm:ml-64" : "sm:ml-16"
        }`}
      >
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={120} height={30} />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold"
            >
              {session.user?.name?.charAt(0) || "U"}
            </Link>
          </div>
        </header>

        {/* Account Content */} 
        <section className="mt-20 px-4 py-6 mb-14">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-2">
            Account Settings
          </h2>
          <p className="text-xs text-center text-gray-500 mb-6">
            Manage your account & subscription
          </p>

          <div className=" gap-4 max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-between  items-center  flex-wrap ">

            {/* Account Card */}
            <div className="ml-17 rounded-xl  sm:w-3/4 w-[80%] bg-white p-4 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Name</h3>
                <button
                  onClick={() => setEditing(!editing)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Pen className="w-4 h-4" />
                </button>
              </div>
              {editing ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mt-1">{name}</p>
              )}
              <p className="text-xs text-gray-500">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Member Since:</span>{" "}
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Last Modify:</span>{" "}
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}
              </p>
            </div>

            {/* Subscription Card */}
            <div className="ml-17 rounded-xl  sm:w-3/4 w-[80%] bg-gray-100 p-4 shadow-sm flex flex-col gap-2">
              <h3 className="font-medium text-gray-900">Subscription</h3>
              <p className="text-sm text-gray-600">Plan: Free</p>
              <p className="text-sm text-gray-600">
                Limited access – Upgrade to Premium to unlock all tools ✨ 
              </p>
              <Link href="/pricing" className="mt-auto px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-black w-max">
                Upgrade Now
              </Link>
            </div>
            <div className="ml-17 rounded-xl  sm:w-3/4 w-[80%] bg-white p-4 shadow-sm flex flex-col gap-2">
              <h3 className="font-medium text-gray-900">Social links</h3>
              <p className="text-sm text-gray-600">Connect your social accounts to log in through Google.</p>
              <div className="flex items-center justify-between border rounded-lg px-3 py-2">
                <div className="flex items-center gap-3">
                  <Image src="/google.png" alt="Google" width={20} height={20} />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Google</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </section>

       <div className="ml-13 overflow-hidden sm:ml-1">
 <Footer />
       </div>
      </div>
    </main>
  );
}
