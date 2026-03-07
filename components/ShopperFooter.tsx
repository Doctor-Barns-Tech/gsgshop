import Link from 'next/link';

export default function ShopperFooter() {
  return (
    <footer className="bg-gsg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">My Personal Shopper by GSG</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              List Them — We Shop For You... Quality/Fresh/Yummy For You AT THE SAME SOURCE PRICE. Time & Money Saver For Value.
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/233246033792" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gsg-purple transition-colors">
                <i className="ri-whatsapp-line text-xl"></i>
              </a>
              <a href="https://t.me/gsgbrandsgh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gsg-purple transition-colors">
                <i className="ri-telegram-line text-xl"></i>
              </a>
              <a href="https://instagram.com/gsgbrandsgh" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gsg-purple transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="/shopping-list" className="text-gray-400 hover:text-white transition-colors">Create List</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-white transition-colors">Track Request</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/customer-experience" className="text-gray-400 hover:text-white transition-colors">Customer Experience</Link></li>
              <li><Link href="/faqs" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GSG Convenience Goods. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>Call: +233 246 033 792</span>
            <span className="hidden sm:inline">•</span>
            <span>Email: shopper@gsgbrands.com.gh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
