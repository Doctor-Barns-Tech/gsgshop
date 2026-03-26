'use client';

import PageHero from '@/components/PageHero';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Cookie Policy" 
        subtitle="Learn how we use cookies to improve your experience on our website."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 prose prose-lg prose-headings:font-bold prose-headings:text-gsg-black prose-p:text-gray-600 prose-a:text-gsg-purple prose-a:font-bold prose-strong:text-gsg-black max-w-none">
          <p className="text-sm text-gray-500 mb-8 font-medium bg-gray-50 inline-block px-4 py-2 rounded-full">Last updated: February 2026</p>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">1</span>
              What Are Cookies?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100">
              Cookies enable the website to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">2</span>
              How We Use Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We use cookies for several reasons, detailed below:
            </p>
            
            <div className="space-y-6 not-prose">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-shield-check-line text-gsg-purple text-xl"></i>
                  Strictly Necessary Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site. Without these cookies, services like the shopping cart cannot be provided.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-settings-3-line text-gsg-purple text-xl"></i>
                  Functionality Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  These cookies allow the website to remember choices you make (such as your user name, language, or the region you are in) and provide enhanced, more personal features.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-line-chart-line text-gsg-purple text-xl"></i>
                  Performance & Analytics Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  These cookies collect information about how you use our website, for instance, which pages you go to most often, and if you get error messages. These cookies do not collect information that identifies you. All information these cookies collect is aggregated and therefore anonymous.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <h3 className="font-bold text-gsg-black mb-3 flex items-center gap-2 text-lg">
                  <i className="ri-advertisement-line text-gsg-purple text-xl"></i>
                  Targeting & Advertising Cookies
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">3</span>
              Managing Cookies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
            </p>
            
            <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl mb-6">
              <h3 className="font-bold text-gsg-black mb-3 text-lg">Browser Settings</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-gsg-purple font-bold hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-gsg-purple font-bold hover:underline">www.allaboutcookies.org</a>.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-gsg-purple text-xl">4</span>
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions about our use of cookies, please contact us:
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
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
