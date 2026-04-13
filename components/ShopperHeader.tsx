import Link from 'next/link';
import Image from 'next/image';

export default function ShopperHeader() {
  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-gsg-purple-dark text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex gap-4">
            <span>Welcome to My Personal Shopper by GSG</span>
            <span className="text-white/40">|</span>
            <a href="tel:+233246033792" className="hover:text-gsg-accent transition-colors">Call: +233 (0) 246 033 792</a>
          </div>
          <div className="flex gap-4">
            <Link href="/shopper/faqs" className="hover:text-gsg-accent transition-colors">FAQs</Link>
            <span className="text-white/40">|</span>
            <Link href="/shopper/customer-experience" className="hover:text-gsg-accent transition-colors">Support</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <Link href="/shopper" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                 <Image src="/fgfg.png" alt="GSG Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl md:text-2xl text-gsg-purple leading-none tracking-tight group-hover:text-gsg-purple-dark transition-colors">GSG</span>
                <span className="text-[0.6rem] md:text-xs font-medium text-gray-500 uppercase tracking-wider leading-none">Personal Shopper</span>
              </div>
            </Link>

            {/* Navigation Bar - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/shopper" className="text-sm font-medium text-gray-600 hover:text-gsg-purple transition-colors">Home</Link>
              <Link href="/shopper/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gsg-purple transition-colors">How it Works</Link>
              <Link href="/shopper/track" className="text-sm font-medium text-gray-600 hover:text-gsg-purple transition-colors">Track Request</Link>
              <a href={process.env.NEXT_PUBLIC_SITE_GOODS_URL || 'https://goods.gsgbrands.com.gh'} className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
                <i className="ri-shopping-bag-line"></i> Shop Convenience Goods & More
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link 
                href="/shopper/shopping-list" 
                className="bg-gsg-purple text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gsg-purple-dark transition-colors shadow-md"
              >
                Create List
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
