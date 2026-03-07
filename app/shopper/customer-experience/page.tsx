export default function CustomerExperience() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gsg-black mb-4">Customer Experience</h1>
          <p className="text-xl text-gray-600">We're here to help you with your personal shopping needs.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gsg-black mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <i className="ri-phone-line text-gsg-purple text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phone Support</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="tel:+233246033792" className="hover:text-gsg-purple block">+233 (0) 246 033 792</a>
                    <a href="tel:+233579033792" className="hover:text-gsg-purple block">+233 (0) 579 033 792</a>
                    <a href="tel:+233571303716" className="hover:text-gsg-purple block mt-2 text-sm text-gray-500">+233 (0) 571 303 716 (Evening)</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <i className="ri-whatsapp-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">WhatsApp (24/7)</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="https://wa.me/233246033792" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 block">+233 246 033 792</a>
                    <a href="https://wa.me/233579033792" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 block">+233 579 033 792</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <i className="ri-telegram-line text-blue-500 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Telegram (24/7)</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="https://t.me/gsgbrandsgh" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">@gsgbrandsgh</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <i className="ri-mail-line text-gray-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="mailto:shopper@gsgbrands.com.gh" className="hover:text-gsg-purple">shopper@gsgbrands.com.gh</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gsg-black mb-6">Support Hours</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gsg-purple mb-2">Regular Support</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span className="font-medium text-gray-900">06:00 - 15:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sat & Holidays:</span>
                    <span className="font-medium text-gray-900">06:00 - 10:00</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gsg-purple mb-2">Evening Support</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span className="font-medium text-gray-900">15:01 - 18:30</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sat & Holidays:</span>
                    <span className="font-medium text-gray-900">10:01 - 16:30</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl mt-6">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Note:</strong> WhatsApp and Telegram channels are monitored 24/7 for urgent inquiries and order adjustments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
