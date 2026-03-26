'use client';

import PageHero from '@/components/PageHero';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Terms & Conditions" 
        subtitle="Please read these terms carefully before using our website and services."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-lg prose-headings:font-bold prose-headings:text-gsg-black prose-p:text-gray-600 prose-a:text-gsg-purple prose-a:font-bold prose-strong:text-gsg-black max-w-none">
          <p className="text-sm text-gray-500 mb-8 font-medium bg-gray-50 inline-block px-4 py-2 rounded-full">Last updated: February 2026</p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">1</span>
              Agreement to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By accessing and using this website (gsgbrands.com.gh), you accept and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services.
            </p>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
              These terms apply to all visitors, users, and customers who access or use our service. We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the website following any changes indicates your acceptance of the new terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">2</span>
              Use of Website
            </h2>
            
            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">2.1 Permitted Use</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may use our website for lawful purposes only. You agree not to:
            </p>
            <ul className="space-y-3 text-gray-600 mb-6 list-none pl-0">
              <li className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <i className="ri-close-circle-line text-red-500 mt-1 text-xl"></i>
                <span className="text-red-900 font-medium">Violate any local, national, or international law or regulation</span>
              </li>
              <li className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <i className="ri-close-circle-line text-red-500 mt-1 text-xl"></i>
                <span className="text-red-900 font-medium">Transmit any harmful code, viruses, or malicious software</span>
              </li>
              <li className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <i className="ri-close-circle-line text-red-500 mt-1 text-xl"></i>
                <span className="text-red-900 font-medium">Attempt to gain unauthorised access to our systems or networks</span>
              </li>
              <li className="flex items-start gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                <i className="ri-close-circle-line text-red-500 mt-1 text-xl"></i>
                <span className="text-red-900 font-medium">Use the website for fraudulent purposes or in connection with any criminal activity</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">2.2 Account Responsibility</h3>
            <p className="text-gray-600 leading-relaxed">
              If you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account or any other security breach.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">3</span>
              Products & Pricing
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
              <h3 className="text-xl font-bold text-gsg-black mb-4">3.1 Product Information</h3>
              <p className="text-gray-600 leading-relaxed">
                We make every effort to display our products accurately, including colours, descriptions, and specifications. However, we cannot guarantee that your device's display will accurately reflect product colours or that product descriptions are error-free.
              </p>
            </div>

            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">3.2 Pricing</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              All prices are listed in Ghana Cedis (GHS) and include VAT where applicable. We reserve the right to:
            </p>
            <ul className="space-y-3 text-gray-600 mb-6 list-none pl-0">
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span>Modify prices at any time without notice</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span>Correct pricing errors, even after an order is placed</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span>Limit quantities available for purchase</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span>Discontinue products at any time</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">4</span>
              Orders & Payment
            </h2>
            
            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">4.1 Order Acceptance</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Placing an order does not guarantee acceptance. We reserve the right to refuse or cancel any order for reasons including:
            </p>
            <ul className="space-y-3 text-gray-600 mb-6 list-none pl-0">
              <li className="flex items-start gap-3">
                <i className="ri-error-warning-line text-orange-500 mt-1 text-xl"></i>
                <span>Product unavailability or pricing errors</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-error-warning-line text-orange-500 mt-1 text-xl"></i>
                <span>Suspected fraudulent or unauthorised transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ri-error-warning-line text-orange-500 mt-1 text-xl"></i>
                <span>Inaccuracies in product or pricing information</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">4.2 Payment</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We accept the following payment methods:
            </p>
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 mb-6">
              <ul className="space-y-4 text-gray-600 list-none pl-0 mb-0">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gsg-purple shadow-sm">
                    <i className="ri-smartphone-line text-xl"></i>
                  </div>
                  <span className="font-medium text-gsg-black">Mobile Money (MTN, Vodafone, AirtelTigo) via Moolre</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gsg-purple shadow-sm">
                    <i className="ri-bank-card-line text-xl"></i>
                  </div>
                  <span className="font-medium text-gsg-black">Credit/Debit Cards (Visa, Mastercard) via Moolre</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">5</span>
              Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              For questions about these Terms and Conditions, please contact us:
            </p>

            <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl not-prose">
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <i className="ri-mail-line text-gsg-purple text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gsg-black text-lg">Email</p>
                    <a href="mailto:info@gsgbrands.com.gh" className="text-gsg-purple hover:underline font-medium">info@gsgbrands.com.gh</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <i className="ri-phone-line text-gsg-purple text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gsg-black text-lg">Phone</p>
                    <a href="tel:+233209597443" className="text-gsg-purple hover:underline font-medium">+233 20 959 7443</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <i className="ri-map-pin-line text-gsg-purple text-2xl"></i>
                  </div>
                  <div>
                    <p className="font-bold text-gsg-black text-lg">Address</p>
                    <p className="text-gray-600 font-medium">GSG Convenience Goods & More<br />Accra, Ghana</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-purple-50 border-2 border-purple-100 p-8 rounded-2xl text-center not-prose">
            <div className="w-16 h-16 bg-gsg-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
              <i className="ri-checkbox-circle-line text-3xl text-white"></i>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
              By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
