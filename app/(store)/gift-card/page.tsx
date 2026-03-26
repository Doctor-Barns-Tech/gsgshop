'use client';

import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function GiftCardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Gift Cards" 
        subtitle="Give the gift of convenience. GSG Convenience Goods & More gift cards coming soon."
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full -ml-24 -mb-24 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
              <i className="ri-gift-2-line text-5xl text-gsg-purple"></i>
            </div>
            
            <h2 className="text-3xl font-bold text-gsg-black mb-4">Coming Soon!</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              We're working on bringing you the perfect gift for your friends and family. 
              Stay tuned for our digital and physical gift cards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-gsg-purple hover:bg-gsg-purple-dark text-white px-8 py-4 rounded-xl font-bold transition-colors shadow-lg shadow-purple-200"
              >
                <i className="ri-shopping-bag-line"></i>
                Continue Shopping
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gsg-purple hover:text-gsg-purple text-gray-600 px-8 py-4 rounded-xl font-bold transition-colors"
              >
                <i className="ri-mail-send-line"></i>
                Notify Me When Available
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
