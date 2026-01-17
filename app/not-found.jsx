// app/not-found.jsx or app/under-construction/page.jsx
import { Construction } from 'lucide-react';
import Link from 'next/link';

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center shadow-inner">
            <Construction className="w-12 h-12 text-pink-300" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Under Construction
          </h1>
          <p className="text-gray-600">
            This page is currently being developed. Check back soon!
          </p>
        </div>

        {/* Action */}
        <div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-pink-200 hover:bg-pink-300 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Return Home
          </Link>
        </div>

        {/* Simple Footer */}
        <div className="pt-8 border-t border-pink-100">
          <p className="text-sm text-gray-500">
            Coming soon • v1.0
          </p>
        </div>

      </div>
    </div>
  );
}