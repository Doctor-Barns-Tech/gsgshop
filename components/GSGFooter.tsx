'use client';

import Link from 'next/link';
import Image from 'next/image';
import { shopperUrl } from '@/lib/site-urls';

const SUPPORT_PHONES = ['+233 (0) 246 033 792', '+233 (0) 579 033 792'];
const TELEGRAM = 'https://t.me/gsgbrandsgh';
const SOCIAL_HANDLE = '@gsgbrandsgh';

const BUSINESS_UNITS = [
  { name: 'Convenience Goods & More', icon: 'ri-shopping-cart-2-line' },
  { name: 'My Personal Shopper', icon: 'ri-vip-crown-line' },
  { name: 'Sell-Safe Buy-Safe', icon: 'ri-shield-check-line' },
  { name: 'StreetCuisine', icon: 'ri-restaurant-line' },
  { name: 'Courier', icon: 'ri-truck-line' },
  { name: 'Affiliates', icon: 'ri-links-line' },
];

export default function GSGFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gsg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="relative w-[82px] h-[28px]">
                    <Image src="/fgfg.png" alt="GSG Wordmark" fill className="object-contain object-left" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider leading-none">Convenience Goods & More</span>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Premium, trustworthy convenience shopping in Ghana. We bring quality goods right to your doorstep with modern e-commerce reliability.
            </p>
            <div className="flex gap-4 mb-6">
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gsg-purple hover:scale-110 transition-all duration-300" aria-label="Telegram">
                <i className="ri-telegram-fill text-xl" />
              </a>
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 cursor-default" title="@gsgbrandsgh">
                <i className="ri-instagram-line text-xl" />
              </span>
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 cursor-default" title="@gsgbrandsgh">
                <i className="ri-twitter-x-line text-xl" />
              </span>
              <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 cursor-default" title="@gsgbrandsgh">
                <i className="ri-facebook-fill text-xl" />
              </span>
            </div>
            <p className="text-xs text-gray-500">Social: <span className="text-gray-400 font-medium">{SOCIAL_HANDLE}</span></p>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg text-white mb-6">Shop</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-gsg-accent transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-gsg-accent transition-colors">Categories</Link></li>
              <li><Link href="/shipping#sole-express" className="hover:text-gsg-accent transition-colors">Sole Express</Link></li>
              <li><Link href="/gift-card" className="hover:text-gsg-accent transition-colors">Gift Cards</Link></li>
              <li><a href={shopperUrl('/')} className="hover:text-gsg-accent transition-colors">Personal Shopper</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg text-white mb-6">Support</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/order-tracking" className="hover:text-gsg-accent transition-colors">Track Order</Link></li>
              <li><Link href="/account" className="hover:text-gsg-accent transition-colors">My Account</Link></li>
              <li><Link href="/help" className="hover:text-gsg-accent transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-gsg-accent transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/contact" className="hover:text-gsg-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter + Payment */}
          <div className="lg:col-span-4">
            <h3 className="font-bold text-lg text-white mb-6">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gsg-purple focus:ring-1 focus:ring-gsg-purple transition-all"
              />
              <button
                type="submit"
                className="bg-gsg-purple text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-gsg-purple-dark transition-colors"
              >
                Join
              </button>
            </form>
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">We Accept</p>
              <div className="flex gap-3 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><i className="ri-visa-line text-2xl text-blue-900" /></div>
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><i className="ri-mastercard-fill text-2xl text-red-600" /></div>
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center font-bold text-xs text-black">MOMO</div>
              </div>
            </div>
          </div>
        </div>

        {/* GSG Business Units */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">GSG Brands Business Units</h4>
          <div className="flex flex-wrap gap-3">
            {BUSINESS_UNITS.map((unit) => (
              <span
                key={unit.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 cursor-default"
              >
                <i className={`${unit.icon} text-base text-gray-500`}></i>
                {unit.name}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Row */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            {SUPPORT_PHONES.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/[\s()]/g, '')}`} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                <i className="ri-phone-line text-gsg-purple"></i> {phone}
              </a>
            ))}
            <a href="mailto:info@gsgbrands.com.gh" className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <i className="ri-mail-line text-gsg-purple"></i> info@gsgbrands.com.gh
            </a>
            <a href={`https://wa.me/233246033792`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
              <i className="ri-whatsapp-line text-gsg-purple"></i> WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} GSG Convenience Goods & More. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
