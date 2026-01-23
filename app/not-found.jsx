"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Predefined consistent values for animations
const FLOATING_DOTS = [
  { width: 40, height: 40, left: 10, top: 25, duration: 20 },
  { width: 32, height: 32, left: 15, top: 65, duration: 18 },
  { width: 24, height: 24, left: 25, top: 15, duration: 22 },
  { width: 36, height: 36, left: 40, top: 45, duration: 16 },
  { width: 28, height: 28, left: 60, top: 75, duration: 19 },
  { width: 32, height: 32, left: 75, top: 25, duration: 21 },
  { width: 20, height: 20, left: 85, top: 55, duration: 17 },
  { width: 44, height: 44, left: 90, top: 85, duration: 23 },
];

const FLOATING_ORBS = [
  { size: 3, left: 25, top: 20 },
  { size: 4, left: 66, top: 40 },
  { size: 2, left: 20, top: 50 },
];

export default function UnderConstruction() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const text = "COMING SOON";
  const subtitle = "Something amazing is on the way";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-50 via-white to-gray-100 p-6 relative overflow-hidden">
      
      {/* Animated background elements with consistent values */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric patterns - consistent positioning */}
        <div className="absolute top-1/4 left-10 w-24 h-24 border border-gray-200/50 rounded-full animate-spin-slow" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 border-2 border-gray-300/30 rounded-lg animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-gray-200/30 rotate-45" />
        
        {/* Floating orbs - using predefined consistent values */}
        {FLOATING_ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gray-400/20"
            style={{
              width: `${orb.size * 4}px`,
              height: `${orb.size * 4}px`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
            }}
          />
        ))}
        
        {/* Floating dots - using predefined consistent values */}
        {FLOATING_DOTS.map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gray-200/30"
            style={{
              width: `${dot.width}px`,
              height: `${dot.height}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animation: `float ${dot.duration}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

   

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl text-center z-10">
        
        {/* Main animated text */}
        <div className="mb-8 overflow-hidden">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <h1 className="text-5xl md:text-5xl lg:text-6xl font-black tracking-tighter bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
              {text}
            </h1>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-gray-900/5 via-gray-700/5 to-gray-900/5 blur-2xl -z-10" />
          </motion.div>
        </div>

        {/* Animated subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-xl md:text-2xl text-gray-600 font-light tracking-wide">
            {subtitle}
          </p>
        </motion.div>

        {/* Animated dots */}
        <div className="flex space-x-3 mb-16">
          {[1, 2, 3].map((dot) => (
            <motion.div
              key={dot}
              className="w-3 h-3 rounded-full bg-linear-to-r from-gray-400 to-gray-600"
              initial={{ scale: 0 }}
              animate={isLoaded ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 1 + dot * 0.1, type: "spring" }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isLoaded ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <Link
            href="/"
            className="group relative px-8 py-4 bg-white text-gray-800 rounded-xl font-medium text-lg transition-all duration-300 hover:shadow-2xl border border-gray-200 hover:border-gray-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <span className="relative flex items-center gap-3">
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return Home
            </span>
          </Link>

          
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">99%</div>
            <div className="text-sm text-gray-500">COMPLETED</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">24/7</div>
            <div className="text-sm text-gray-500">WORKING</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">100%</div>
            <div className="text-sm text-gray-500">Premium tools</div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="mt-20 pt-8 border-t border-gray-200/50 w-full max-w-2xl text-center"
      >
        <p className="text-sm text-gray-500">
          Launching soon • Stay updated • v1.0
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="w-1 h-1 rounded-full bg-gray-400 animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </motion.footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}