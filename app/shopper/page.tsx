import Link from 'next/link';
import Image from 'next/image';

export default function ShopperHome() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gsg-purple overflow-hidden min-h-[480px] md:min-h-[560px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Overlay - 20% */}
        <div className="absolute inset-0 bg-gsg-purple/20 z-[1]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-8 animate-fade-in-up">
            <i className="ri-shopping-basket-line"></i>
            <span>Your Personal Shopper Service</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight animate-fade-in-up animate-delay-100">
            List Them — We Shop <br className="hidden md:block" /> For You...
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto animate-fade-in-up animate-delay-200 font-light">
            Quality, fresh, and yummy goods delivered to you <strong className="font-bold text-white">at the exact source price</strong>. Time & money saved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-300">
            <Link 
              href="/shopper/shopping-list" 
              className="inline-flex items-center justify-center gap-2 bg-white text-gsg-purple px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <i className="ri-list-check"></i>
              Create Shopping List
            </Link>
            <Link 
              href="/shopper/how-it-works" 
              className="inline-flex items-center justify-center gap-2 bg-gsg-purple-dark text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 border border-white/20"
            >
              <i className="ri-information-line"></i>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 bg-white border-b border-gray-100 relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
              </div>
              <div>
                <h3 className="font-bold text-gsg-black">Market Price Guarantee</h3>
                <p className="text-sm text-gray-500">No hidden markups on items</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <i className="ri-percent-line text-2xl text-gsg-purple"></i>
              </div>
              <div>
                <h3 className="font-bold text-gsg-black">5% Commission or Less</h3>
                <p className="text-sm text-gray-500">Simple, transparent pricing</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                <i className="ri-truck-line text-2xl text-orange-500"></i>
              </div>
              <div>
                <h3 className="font-bold text-gsg-black">Doorstep Delivery</h3>
                <p className="text-sm text-gray-500">Scheduled to your convenience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gsg-black mb-4">What We Source For You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">From fresh produce to prescribed medicines, we handle the hassle of shopping so you don't have to.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                name: 'Convenience Goods', 
                icon: 'ri-shopping-cart-2-line', 
                color: 'text-gsg-purple', 
                bg: 'bg-purple-50',
                desc: 'Everyday essentials — groceries, beverages, snacks, personal care, household items, and more.'
              },
              { 
                name: 'Specialty Goods', 
                icon: 'ri-vip-diamond-line', 
                color: 'text-amber-600', 
                bg: 'bg-amber-50',
                desc: 'Unique or brand-specific items — electronics, fashion, imported goods, and specialty foods.'
              },
              { 
                name: 'Unsought Goods', 
                icon: 'ri-capsule-line', 
                color: 'text-teal-600', 
                bg: 'bg-teal-50',
                desc: 'Items you need but may not think to shop for — medicines, insurance documents, emergency supplies.'
              },
              { 
                name: 'Building Materials', 
                icon: 'ri-building-2-line', 
                color: 'text-orange-600', 
                bg: 'bg-orange-50',
                desc: 'Construction and renovation needs — cement, roofing, plumbing, electrical supplies, paint, and hardware.'
              },
            ].map((category, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gsg-purple/30 transition-all group cursor-default">
                <div className={`w-14 h-14 rounded-xl ${category.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <i className={`${category.icon} text-3xl ${category.color}`}></i>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-gsg-purple transition-colors mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{category.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-gray-500 mb-6 font-medium text-lg">From fresh produce and traditional market ingredients to prescribed medicines and construction materials — we handle it all.</p>
            <Link 
              href="/shopper/shopping-list" 
              className="inline-flex items-center gap-3 bg-gsg-purple text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gsg-purple-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              <i className="ri-list-check text-xl"></i>
              Start Your Shopping List
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="ri-whatsapp-line text-4xl text-gsg-purple"></i>
          </div>
          <h2 className="text-3xl font-bold text-gsg-black mb-4">Have questions?</h2>
          <p className="text-xl text-gray-600 mb-8">Our support team is available 24/7 on WhatsApp to assist you with your shopping needs.</p>
          <a 
            href="https://wa.me/233246033792" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#128C7E] transition-colors shadow-lg"
          >
            <i className="ri-whatsapp-line text-xl"></i>
            Chat with us
          </a>
        </div>
      </section>
    </div>
  );
}
