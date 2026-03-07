export default function ShopperCookies() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gsg-black mb-8">Cookie Policy</h1>
        <div className="prose prose-purple max-w-none text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>My Personal Shopper by GSG uses cookies to improve your experience on our website.</p>
          
          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">What are cookies?</h2>
          <p>Cookies are small text files placed on your device when you visit a website. They help the website remember your actions and preferences.</p>
          
          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">How we use cookies</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., maintaining your session).</li>
            <li><strong>Functional Cookies:</strong> Used to remember your preferences and settings.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website so we can improve it.</li>
          </ul>

          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">Managing Cookies</h2>
          <p>You can control and/or delete cookies as you wish using your browser settings. However, disabling certain cookies may affect the functionality of our website.</p>
        </div>
      </div>
    </div>
  );
}
