'use client';

import Link from 'next/link';
import { useState } from 'react';
import PageHero from '@/components/PageHero';

export default function ShippingPage() {
  const [selectedZone, setSelectedZone] = useState('');

  const deliveryOptions = [
    {
      id: 'pickup',
      type: 'Pickup',
      time: 'Within 72hrs (excl. Sunday)',
      cost: 'As quoted',
      description: 'Available after order confirmation. Pickup location will be displayed at the confirmation stage. Collect your items at your convenience within the pickup window.',
      icon: 'ri-store-2-line',
      highlight: false,
    },
    {
      id: 'free-delivery',
      type: 'Free Delivery',
      time: 'Tuesday & Friday only',
      cost: 'FREE',
      description: 'Minimum 5% discount on total applied as Free Delivery Discount. Orders confirmed before noon of the preceding delivery day ship next available day; orders confirmed after noon ship the following delivery day.',
      icon: 'ri-truck-line',
      highlight: true,
    },
    {
      id: 'sole-express',
      type: 'Sole Express',
      time: 'Daily',
      cost: 'As quoted',
      description: 'Fresh produce, bakery, meat, frozen food, seafood, fish, and poultry MUST use Sole Express or Joint Express. Delivery within 2hr, 6hr, 12hr, 24hr, or 48hr after confirmation.',
      icon: 'ri-flashlight-line',
      highlight: false,
    },
    {
      id: 'joint-express',
      type: 'Joint Express',
      time: 'Daily',
      cost: 'Shared fee',
      description: 'Share the delivery fee with a neighbor or colleague — items remain completely private. Same perishable product rule applies. Available in 2hr, 6hr, 12hr, 24hr, or 48hr windows after confirmation.',
      icon: 'ri-group-line',
      highlight: false,
    },
  ];

  const zones = [
    {
      zone: 'Zone 1 — Accra Metro',
      areas: 'East Legon, Osu, Labone, Airport Residential, Dzorwulu, Cantonments, Adabraka, Tema',
      freeDelivery: 'Tue & Fri',
      express: '2hr–48hr windows',
    },
    {
      zone: 'Zone 2 — Greater Accra',
      areas: 'Madina, Legon, Haatso, Achimota, Dansoman, Spintex, Teshie, Kasoa',
      freeDelivery: 'Tue & Fri',
      express: '6hr–48hr windows',
    },
    {
      zone: 'Zone 3 — Major Cities',
      areas: 'Kumasi, Takoradi, Cape Coast, Tamale, Sunyani, Ho, Koforidua',
      freeDelivery: 'Fri only',
      express: '24hr–48hr windows',
    },
    {
      zone: 'Zone 4 — Other Areas',
      areas: 'All other locations within Ghana',
      freeDelivery: 'Contact us',
      express: 'Contact us',
    },
  ];

  const pickupLocations = [
    { name: 'GSG Hub — Accra Central', address: 'Exact address provided at confirmation', hours: 'Mon–Sat, 8am–6pm' },
    { name: 'GSG Hub — East Legon', address: 'Exact address provided at confirmation', hours: 'Mon–Sat, 9am–5pm' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Shipping & Delivery"
        subtitle="Pickup, Free Delivery (Tue/Fri), Sole Express, and Joint Express — across Ghana."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Delivery Options */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-3">Delivery Options</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Choose the delivery method that works best for you. Perishable items require Express delivery for freshness.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option) => (
              <div
                key={option.id}
                id={option.id}
                className={`scroll-mt-24 bg-white border p-8 rounded-2xl hover:shadow-xl transition-all group relative overflow-hidden ${
                  option.highlight ? 'border-gsg-purple ring-2 ring-gsg-purple/10' : 'border-gray-100 hover:border-gsg-purple'
                }`}
              >
                {option.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gsg-purple text-white text-xs font-bold">
                      <i className="ri-star-fill text-[10px]"></i> Popular
                    </span>
                  </div>
                )}
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                  <i className={`${option.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gsg-black mb-2">{option.type}</h3>
                <div className="text-gsg-purple font-bold mb-2">{option.cost}</div>
                <div className="text-gray-500 font-medium mb-4 text-sm bg-gray-50 inline-block px-3 py-1 rounded-full">{option.time}</div>
                <p className="text-gray-600 leading-relaxed text-sm">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free Standard Shipping - Coming Soon */}
        <div className="bg-white border border-gray-100 rounded-2xl p-10 mb-20 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full -ml-24 -mb-24 opacity-50"></div>
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-4">
              <i className="ri-time-line"></i> Coming Soon
            </span>
            <div className="w-20 h-20 bg-gsg-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
              <i className="ri-gift-line text-4xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gsg-black mb-3">Free Standard Shipping</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're working on a free standard shipping option for qualifying orders. Stay tuned for updates on minimum spend thresholds and eligible areas.
            </p>
          </div>
        </div>

        {/* Zone Delivery Dropdown */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-3">Delivery Zones & Timeframes</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Select your zone to see available delivery options and timeframes.</p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-white text-gsg-black font-medium focus:border-gsg-purple focus:ring-2 focus:ring-gsg-purple/20 transition-all cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B21A8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              <option value="">Select your delivery zone...</option>
              {zones.map((z, i) => (
                <option key={i} value={z.zone}>{z.zone}</option>
              ))}
            </select>
          </div>

          {selectedZone ? (
            <div className="max-w-2xl mx-auto animate-fade-in-up">
              {zones.filter(z => z.zone === selectedZone).map((zone) => (
                <div key={zone.zone} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gsg-black mb-4">{zone.zone}</h3>
                  <p className="text-gray-600 mb-6"><strong>Areas:</strong> {zone.areas}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <p className="text-sm font-medium text-gray-500 mb-1">Free Delivery</p>
                      <p className="text-lg font-bold text-green-700">{zone.freeDelivery}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                      <p className="text-sm font-medium text-gray-500 mb-1">Express</p>
                      <p className="text-lg font-bold text-gsg-purple">{zone.express}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Zone</th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Areas Covered</th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Free Delivery</th>
                      <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Express</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {zones.map((zone, index) => (
                      <tr key={index} className="hover:bg-purple-50/30 transition-colors">
                        <td className="px-8 py-6 font-bold text-gsg-black whitespace-nowrap">{zone.zone}</td>
                        <td className="px-8 py-6 text-gray-600 text-sm leading-relaxed">{zone.areas}</td>
                        <td className="px-8 py-6 text-green-700 font-medium">{zone.freeDelivery}</td>
                        <td className="px-8 py-6 text-gsg-purple font-medium">{zone.express}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pickup Locations */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gsg-black mb-8">Pickup Locations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pickupLocations.map((loc, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                    <i className="ri-map-pin-2-fill text-xl text-gsg-purple"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gsg-black mb-1">{loc.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{loc.address}</p>
                    <div className="inline-flex items-center gap-1.5 text-sm text-gsg-purple font-medium">
                      <i className="ri-time-line"></i> {loc.hours}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Shipping Works + Important Information */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gsg-black mb-8">How Shipping Works</h2>
            <div className="space-y-8">
              {[
                {
                  step: '1',
                  title: 'Order Processing',
                  text: 'Orders confirmed before noon are processed same day. We carefully inspect and pack your items for safe transit.',
                },
                {
                  step: '2',
                  title: 'Dispatch',
                  text: 'Your order is dispatched via your chosen delivery method. You receive a confirmation with tracking details via email/SMS.',
                },
                {
                  step: '3',
                  title: 'Track Your Order',
                  text: 'Use your order number to monitor delivery in real-time. You get status updates at each stage.',
                },
                {
                  step: '4',
                  title: 'Delivery',
                  text: 'Our delivery partner contacts you before arrival. Verify your package and enjoy your purchase!',
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-gsg-purple transition-colors">
                    <span className="font-bold text-gsg-purple text-lg">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gsg-black mb-2 text-lg">{s.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gsg-black mb-8">Important Information</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-time-line text-gsg-purple text-xl"></i>
                  Cut-off Times
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  Orders confirmed before noon are dispatched same day. Orders confirmed after noon are dispatched next business day.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-calendar-line text-gsg-purple text-xl"></i>
                  Business Days
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  Delivery timeframes exclude Sundays and public holidays. We process orders Monday to Saturday.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-phone-line text-gsg-purple text-xl"></i>
                  Delivery Contact
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  Our delivery partner will call you before arrival. Ensure your phone number is correct and reachable during the delivery window.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-home-line text-gsg-purple text-xl"></i>
                  Failed Deliveries
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  If you are unavailable, we will attempt delivery twice. After two failed attempts, the package is held at a pickup point for 5 business days before being returned.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-secure-payment-line text-gsg-purple text-xl"></i>
                  Package Security
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  All packages are handled with care during transit. Report any damage or missing items within 48 hours of delivery for resolution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white border border-gray-100 rounded-2xl p-10 mb-20 shadow-sm">
          <h2 className="text-3xl font-bold text-gsg-black mb-6">Order Tracking</h2>
          <p className="text-gray-600 mb-10 leading-relaxed max-w-3xl">
            Track your order anytime using your order number. You'll see real-time updates at each stage:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: 'ri-checkbox-circle-line', label: 'Confirmed' },
              { icon: 'ri-package-line', label: 'Processing' },
              { icon: 'ri-truck-line', label: 'Out for Delivery' },
              { icon: 'ri-check-double-line', label: 'Delivered' },
            ].map((step) => (
              <div key={step.label} className="text-center group">
                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                  <i className={`${step.icon} text-3xl`}></i>
                </div>
                <p className="font-bold text-gsg-black">{step.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/order-tracking"
              className="inline-flex items-center gap-2 bg-gsg-purple text-white px-8 py-4 rounded-xl font-bold hover:bg-gsg-purple-dark transition-colors shadow-lg shadow-purple-200"
            >
              <i className="ri-map-pin-line"></i>
              Track Your Order
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gsg-black rounded-2xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Delivery?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
              Questions about shipping costs, delivery times, or tracking? Our customer service team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-gsg-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
