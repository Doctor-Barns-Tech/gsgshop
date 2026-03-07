export default function ShopperPrivacyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gsg-black mb-8">Privacy Policy</h1>
        <div className="prose prose-purple max-w-none text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Welcome to My Personal Shopper by GSG. We respect your privacy and are committed to protecting your personal data.</p>
          
          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as your name, phone number, email address, delivery address, and the contents of your shopping lists.</p>
          
          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Process and fulfill your personal shopper requests.</li>
            <li>Communicate with you regarding your orders (e.g., via WhatsApp, phone, or email).</li>
            <li>Improve our services and customer experience.</li>
          </ul>

          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">3. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <ul className="list-none space-y-2">
            <li>Email: shopper@gsgbrands.com.gh</li>
            <li>Phone: +233 (0) 246 033 792</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
