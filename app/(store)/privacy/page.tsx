'use client';

import PageHero from '@/components/PageHero';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Privacy Policy" 
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your personal information."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-lg prose-headings:font-bold prose-headings:text-gsg-black prose-p:text-gray-600 prose-a:text-gsg-purple prose-a:font-bold prose-strong:text-gsg-black max-w-none">
          <p className="text-sm text-gray-500 mb-8 font-medium bg-gray-50 inline-block px-4 py-2 rounded-full">Last updated: February 2026</p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">1</span>
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">1.1 Information You Provide</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account, place an order, or contact us, we collect:
            </p>
            <ul className="space-y-3 text-gray-600 mb-6 list-none pl-0">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Personal Details:</strong> Name, email address, phone number, date of birth</span>
              </li>
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Delivery Information:</strong> Shipping and billing addresses</span>
              </li>
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Payment Details:</strong> Payment method information (securely processed by third-party providers)</span>
              </li>
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Communications:</strong> Messages, reviews, and feedback you submit</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-gsg-black mb-4 mt-8">1.2 Information Collected Automatically</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you visit our website, we automatically collect:
            </p>
            <ul className="space-y-3 text-gray-600 mb-6 list-none pl-0">
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</span>
              </li>
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Usage Data:</strong> Pages viewed, products browsed, search queries, time spent on site</span>
              </li>
              <li className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <i className="ri-checkbox-circle-line text-gsg-purple mt-1 text-xl"></i>
                <span><strong>Cookies:</strong> Small data files stored on your device to improve your experience</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">2</span>
              How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We use your personal information for the following purposes:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-shopping-bag-line text-gsg-purple text-xl"></i>
                  Order Processing
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Process your orders, arrange delivery, send order confirmations and updates, handle returns and refunds, and provide customer support.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-line-chart-line text-gsg-purple text-xl"></i>
                  Service Improvement
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Analyse website usage to improve our products, services, and user experience. Conduct research and development for new features and offerings.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-mail-line text-gsg-purple text-xl"></i>
                  Marketing
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Send promotional emails, special offers, and product recommendations (only if you've opted in). Share relevant updates about your orders and our services.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-shield-check-line text-gsg-purple text-xl"></i>
                  Security
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Protect against fraudulent transactions, unauthorised access, and other security threats. Verify your identity for high-value purchases.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors md:col-span-2">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-scales-line text-gsg-purple text-xl"></i>
                  Legal Compliance
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Comply with legal obligations, respond to lawful requests from authorities, enforce our terms and conditions, and resolve disputes.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">3</span>
              Information Sharing & Disclosure
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We do not sell your personal information. We may share your data with:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-gsg-purple pl-6 py-2">
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Service Providers</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Trusted third parties who help us operate our business (payment processors, delivery partners, email service providers, analytics tools). They are contractually bound to protect your data.
                </p>
              </div>

              <div className="border-l-4 border-gsg-purple pl-6 py-2">
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Business Transfers</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  If we merge with or are acquired by another company, your information may be transferred as part of the transaction. We will notify you of any such change.
                </p>
              </div>

              <div className="border-l-4 border-gsg-purple pl-6 py-2">
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Legal Requirements</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  When required by law or to protect our rights, property, or safety, or that of our customers or others.
                </p>
              </div>

              <div className="border-l-4 border-gsg-purple pl-6 py-2">
                <h3 className="font-bold text-gsg-black mb-2 text-lg">With Your Consent</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Any other disclosures will be made only with your explicit consent.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">4</span>
              Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We implement robust security measures to protect your personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-6 not-prose">
              <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-gsg-purple rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                  <i className="ri-lock-line text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Encryption</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All data transmitted between your browser and our servers is encrypted using SSL/TLS technology.
                </p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-gsg-purple rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                  <i className="ri-shield-check-line text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Secure Storage</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your data is stored on secure servers with restricted access and regular security audits.
                </p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-gsg-purple rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                  <i className="ri-bank-card-line text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Payment Security</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We never store your full payment card details. All payments are processed by PCI-DSS compliant providers.
                </p>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-2xl">
                <div className="w-12 h-12 bg-gsg-purple rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                  <i className="ri-user-lock-line text-white text-xl"></i>
                </div>
                <h3 className="font-bold text-gsg-black mb-2 text-lg">Access Controls</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Only authorised personnel have access to personal data, and they are bound by strict confidentiality obligations.
                </p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mt-8">
              <p className="text-sm text-gray-600 leading-relaxed flex gap-3">
                <i className="ri-alert-line text-orange-500 text-xl flex-shrink-0"></i>
                <span>
                  <strong className="text-gsg-black">Important:</strong> While we implement strong security measures, no method of transmission or storage is 100% secure. We cannot guarantee absolute security but continually work to protect your information.
                </span>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">5</span>
              Your Rights & Choices
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              You have the following rights regarding your personal information:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8 not-prose">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 text-gsg-purple">
                  <i className="ri-eye-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-1">Access</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Request a copy of the personal information we hold about you.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 text-gsg-purple">
                  <i className="ri-pencil-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-1">Correction</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Update or correct inaccurate or incomplete information.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 text-gsg-purple">
                  <i className="ri-delete-bin-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-1">Deletion</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Request deletion of your personal information (subject to legal retention requirements).</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 text-gsg-purple">
                  <i className="ri-mail-close-line text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-1">Marketing Opt-Out</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Unsubscribe from marketing emails at any time using the link in our emails.</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
              To exercise any of these rights, please contact us at <a href="mailto:info@gsgbrands.com.gh" className="text-gsg-purple font-bold hover:underline">info@gsgbrands.com.gh</a> or through your account settings. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">6</span>
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
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
        </div>
      </div>
    </div>
  );
}
