"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomFooter from "../components/CustomFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5] text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-12">
        <h1 className="text-3xl sm:text-4xl mt-16 font-bold text-center text-gray-900 mb-8">
          Privacy Policy
        </h1>

        {/* Card Container */}
        <section className="space-y-8">

          {/* Intro */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              At <strong>SwiftTools</strong>, your privacy is our top priority. We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard it.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Information We Collect</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We only collect information necessary to provide our services, such as email addresses for account creation or usage data to improve our tools. We do not sell or share your personal data with third parties except when legally required.
            </p>
          </div>

          {/* How We Use Information */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">How We Use Your Information</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Collected information is used to provide, maintain, and improve our services, communicate important updates, and personalize your experience. We implement strict security measures to keep your data safe.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Rights</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              You can request access, modification, or deletion of your personal data at any time. We respect your privacy rights and will respond promptly to any requests.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Contact Us</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              If you have any questions, concerns, or complaints regarding your privacy, please contact us at:{" "}
             <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=swiftoolsio@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  swiftoolsio@gmail.com
</a>

              . We take every concern seriously and strive to respond within 48 hours.
            </p>
          </div>

          {/* Updates */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-200 space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Updates to This Policy</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Any updates will be posted on this page with the revised date. Please review this page periodically to stay informed about our privacy practices.
            </p>
          </div>

        </section>
      </main>

      <Footer />
      <CustomFooter />
    </div>
  );
}
