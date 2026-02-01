"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CustomFooter from "../components/CustomFooter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-linear-to-r from-[#f8f7ff] via-[#fffbfb] to-[#fffdf5] text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 space-y-12 mt-16">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm sm:text-base text-gray-600">Effective Date: February 2, 2026</p>
        </div>

        {/* Terms Sections */}
        <section className="space-y-8">
          {/* Section Card */}
          {[
            {
              title: "1. Use of Services",
              content: "You may use our tools for personal or commercial purposes within the limits of the law. You agree not to misuse our services, upload harmful content, or violate any applicable laws while using SwiftTools."
            },
            {
              title: "2. Account Responsibility",
              content: "If you create an account, you are responsible for maintaining the confidentiality of your login information and for all activities that occur under your account."
            },
            {
              title: "3. Subscription and Payments",
              content: "Some features require a paid subscription. All payments are processed securely, and refunds are handled according to our refund policy. You agree to provide accurate billing information."
            },
            {
              title: "4. Intellectual Property",
              content: "All content, tools, and materials on SwiftTools are owned by us or our licensors. You may not copy, distribute, modify, or create derivative works without our explicit permission."
            },
            {
              title: "5. Limitation of Liability",
              content: "SwiftTools is provided 'as-is' without warranties. We are not liable for any direct or indirect damages resulting from the use of our services."
            },
            {
              title: "6. Termination",
              content: "We may suspend or terminate access to your account or services at any time for violations of these Terms of Service or for other legitimate reasons."
            },
            {
              title: "7. Contact Us",
              content: "If you have any questions or concerns about these Terms, you can contact us at: ",
              link: { email: "swiftoolsio@gmail.com", text: "swiftoolsio@gmail.com" }
            },
            {
              title: "8. Updates to Terms",
              content: "We may update these Terms of Service occasionally. The updated version will be posted on this page, and your continued use of SwiftTools constitutes acceptance of the changes."
            }
          ].map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {section.content}{" "}
                {section.link && (
                  <a
                    href={`mailto:${section.link.email}`}
                    className="text-blue-600 underline hover:text-blue-700 transition"
                  >
                    {section.link.text}
                  </a>
                )}
              </p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
      <CustomFooter />
    </div>
  );
}
