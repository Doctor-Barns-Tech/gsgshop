import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  {
    step: '01',
    title: 'Create your list',
    text: 'Add item names, quantities, and your estimated prices. Add notes for anything specific. You can drop everything in our easy-to-use list builder.',
    image: '/shopper/shopper_image_5.png',
  },
  {
    step: '02',
    title: 'We source for you',
    text: 'We buy at the exact source price with 5% commission or less. No hidden markups. Our professional shoppers confirm the quality and totals before purchasing.',
    image: '/shopper/shopper_image_9.png',
  },
  {
    step: '03',
    title: 'Pay & receive',
    text: 'Confirm your final totals, pay securely, and get delivery straight to your preferred location. We provide real-time updates via WhatsApp every step of the way.',
    image: '/shopper/shopper_image_4.png',
  },
];

const SOURCE_CATEGORIES = [
  {
    name: 'Convenience Goods',
    desc: 'Everyday essentials from trusted shops and markets across the city.',
    examples: ['Groceries', 'Toiletries', 'Drinks'],
    image: '/shopper/shopper_image_8.png',
  },
  {
    name: 'Specialty Goods',
    desc: 'Unique, imported, and brand-specific items hard to find elsewhere.',
    examples: ['Imported brands', 'Gifts', 'Custom finds'],
    image: '/shopper/shopper_image_7.png',
  },
  {
    name: 'Urgent Runs',
    desc: 'Medicines and urgent essentials that just need to arrive — fast.',
    examples: ['Pharmacy items', 'First-aid', 'Emergency'],
    image: '/shopper/shopper_image_1.png',
  },
  {
    name: 'Building Materials',
    desc: 'Construction and renovation supplies sourced and delivered to site.',
    examples: ['Cement & blocks', 'Tools', 'Finishing'],
    image: '/shopper/shopper_image_6.png',
  },
];

const BENEFITS = [
  {
    icon: 'ri-price-tag-3-line',
    title: 'Source price guarantee',
    text: 'You pay what we pay at the market. We show receipts on request.',
  },
  {
    icon: 'ri-percent-line',
    title: '5% commission or less',
    text: 'Transparent fee on the item subtotal. No surprise charges, ever.',
  },
  {
    icon: 'ri-time-line',
    title: 'Same-day where possible',
    text: 'Place your list early in the day for the freshest pick and delivery.',
  },
  {
    icon: 'ri-customer-service-2-line',
    title: 'WhatsApp support, 24/7',
    text: 'Real humans, real updates. We confirm every list before shopping.',
  },
];

const FAQS = [
  {
    q: 'How is the price calculated?',
    a: 'You pay the market source price for each item, plus 5% commission or less on the subtotal, plus a delivery fee based on distance. We confirm totals before you pay.',
  },
  {
    q: 'What if an item is unavailable?',
    a: 'We message you on WhatsApp with the closest substitute or refund that line item. Nothing is bought without your nod.',
  },
  {
    q: 'How fast is delivery?',
    a: 'Lists placed before 11am are typically delivered same-day in Accra. Out-of-Accra and bulk runs are scheduled in advance.',
  },
];

export default function ShopperHome() {
  return (
    <div className="bg-white">
      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative overflow-hidden bg-gsg-purple min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/shopper/shopper_image_2.png"
            alt="Professional personal shopper"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gsg-purple-dark/95 via-gsg-purple-dark/80 to-transparent z-[1]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-8 ring-1 ring-white/30 shadow-lg">
              <i className="ri-shopping-basket-line text-gsg-accent" />
              <span>Your Premium Personal Shopper</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
              List them.<br />
              <span className="text-gsg-accent">We shop</span> for you.
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-white/90 font-light leading-relaxed max-w-xl">
              Quality, fresh, hard-to-find — delivered <strong className="font-semibold text-white">at the exact source price</strong>. Time and money saved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/shopper/shopping-list"
                className="inline-flex items-center justify-center gap-2 bg-gsg-accent text-gsg-purple-dark px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-400 transition-all shadow-xl hover:-translate-y-1"
              >
                <i className="ri-list-check-2" />
                Create Shopping List
              </Link>
              <Link
                href="/shopper/how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all border border-white/20 hover:-translate-y-1"
              >
                <i className="ri-information-line" />
                How it works
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <i className="ri-shield-check-fill text-xl text-green-400" />
                <span>Source-price guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-percent-fill text-xl text-green-400" />
                <span>5% commission or less</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS — Alternating Layout
          ============================================================ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
              THE PROCESS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight">
              How your shopping gets done
            </h2>
          </div>

          <div className="space-y-24">
            {STEPS.map((s, idx) => (
              <div key={s.step} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}>
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[2rem]" />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="text-6xl font-black text-gray-100 mb-4 tracking-tighter">
                    {s.step}
                  </p>
                  <h3 className="font-bold text-gsg-black text-3xl md:text-4xl mb-6">{s.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">{s.text}</p>
                  
                  {idx === STEPS.length - 1 && (
                    <Link
                      href="/shopper/shopping-list"
                      className="inline-flex items-center gap-2 text-gsg-purple font-bold text-lg hover:text-gsg-accent transition-colors"
                    >
                      Start your list now <i className="ri-arrow-right-line" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT WE SOURCE — Large Image Cards
          ============================================================ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
                WHAT WE SOURCE
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight mb-4">
                Anything on your list.<br />Anywhere in the city.
              </h2>
              <p className="text-xl text-gray-600">
                Four broad categories, one trusted service. If it's for sale, we'll find it.
              </p>
            </div>
            <Link
              href="/shopper/how-it-works"
              className="shrink-0 inline-flex items-center gap-2 text-gsg-purple font-bold hover:underline text-lg"
            >
              See our full catalogue <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {SOURCE_CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="group relative h-[400px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-bold text-3xl text-white mb-3 group-hover:text-gsg-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 text-lg mb-6 max-w-md">
                    {category.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((ex) => (
                      <span
                        key={ex}
                        className="backdrop-blur-md bg-white/20 text-white border border-white/30 text-sm font-medium px-3 py-1.5 rounded-full"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING TRANSPARENCY CALLOUT WITH LIFESTYLE IMAGE
          ============================================================ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gsg-purple rounded-[2.5rem] relative shadow-2xl flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Content */}
            <div className="p-10 md:p-16 lg:w-3/5 z-10">
              <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-accent mb-4">
                TRANSPARENT PRICING
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                You pay the source price.<br />
                Plus a fair commission.
              </h2>
              <p className="text-xl text-purple-100 mb-10 max-w-lg leading-relaxed">
                No hidden markups on goods. We charge <strong className="text-white">5% commission or less</strong> on the item subtotal, plus delivery based on distance. That's it.
              </p>
              
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-bold tracking-[0.2em] text-white">
                    SAMPLE RECEIPT
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gsg-purple bg-gsg-accent px-3 py-1.5 rounded-full font-bold">
                    <i className="ri-file-list-3-line" />
                    Receipts on request
                  </span>
                </div>
                <div className="space-y-4 text-base">
                  <div className="flex justify-between text-purple-50">
                    <span>Items at source price</span>
                    <span className="font-semibold">GH₵ 200.00</span>
                  </div>
                  <div className="flex justify-between text-purple-50">
                    <span>Commission (5%)</span>
                    <span className="font-semibold">GH₵ 10.00</span>
                  </div>
                  <div className="flex justify-between text-purple-50">
                    <span>Delivery (in Accra)</span>
                    <span className="font-semibold">GH₵ 25.00</span>
                  </div>
                  <div className="border-t border-white/20 my-4" />
                  <div className="flex justify-between text-white text-xl">
                    <span className="font-bold">You pay</span>
                    <span className="font-bold text-gsg-accent">GH₵ 235.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-2/5 min-h-[400px] relative">
              <Image
                src="/shopper/shopper_image_3.png"
                alt="Businesswoman checking receipt"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-gsg-purple via-transparent to-transparent" />
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFITS / USPS
          ============================================================ */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
              WHY US
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight">
              Built for people who'd rather<br />not queue at the market.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((b) => (
              <div key={b.title} className="text-center group">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-sm border border-gray-100 text-gsg-purple flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-xl transition-all duration-300">
                  <i className={`${b.icon} text-4xl`} />
                </div>
                <h3 className="font-bold text-gsg-black text-xl mb-3">{b.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS (Visual Layout)
          ============================================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
                TESTIMONIALS
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight mb-10">
                Loved by busy households and businesses.
              </h2>
              
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm relative">
                  <i className="ri-double-quotes-l text-6xl text-gsg-purple/10 absolute top-4 left-6" />
                  <div className="flex gap-1 text-gsg-accent mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-xl" />
                    ))}
                  </div>
                  <blockquote className="text-gray-800 text-lg leading-relaxed mb-6 relative z-10 font-medium">
                    &ldquo;I sent my Sunday market list at 7am and had everything by lunch. The receipt matched exactly. Game changer.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <Image src="/shopper/shopper_image_10.png" alt="Akosua M." fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gsg-black">Akosua M.</p>
                      <p className="text-sm text-gray-500">Busy mum, East Legon</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm relative">
                  <i className="ri-double-quotes-l text-6xl text-gsg-purple/10 absolute top-4 left-6" />
                  <div className="flex gap-1 text-gsg-accent mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="ri-star-fill text-xl" />
                    ))}
                  </div>
                  <blockquote className="text-gray-800 text-lg leading-relaxed mb-6 relative z-10 font-medium">
                    &ldquo;My personal shopper does my produce run twice a week. The 5% fee saves me a whole afternoon to focus on the restaurant.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                      <Image src="/shopper/shopper_image_3.png" alt="Naa D." fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gsg-black">Naa D.</p>
                      <p className="text-sm text-gray-500">Restaurant owner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl hidden lg:block">
              <Image
                src="/shopper/shopper_image_10.png"
                alt="Relaxing while we shop"
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gsg-purple/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <h3 className="text-3xl font-bold mb-2">Reclaim your weekends</h3>
                <p className="text-lg text-white/90">Let us handle the crowded markets while you relax.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ TEASER
          ============================================================ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-4">
                FAQS
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight mb-6">
                Got questions?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                Everything you need to know about the service. Can't find the answer you're looking for? We're just a message away.
              </p>
              <a
                href="https://wa.me/233246033792"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gsg-purple font-bold text-lg hover:text-gsg-accent transition-colors"
              >
                Chat with us on WhatsApp <i className="ri-arrow-right-line" />
              </a>
            </div>

            <div className="lg:col-span-7">
              <div className="divide-y divide-gray-200 border-t border-b lg:border-t-0 border-gray-200">
                {FAQS.map((f, i) => (
                  <details
                    key={f.q}
                    className="group py-6 md:py-8"
                    open={i === 0}
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none outline-none">
                      <span className="font-bold text-gsg-black text-xl md:text-2xl group-hover:text-gsg-purple transition-colors">
                        {f.q}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-gsg-purple group-open:border-gsg-purple group-open:bg-gsg-purple group-open:text-white text-gray-400 transition-all duration-300">
                        <i className="ri-add-line text-xl group-open:rotate-45 transition-transform" />
                      </div>
                    </summary>
                    <p className="mt-5 text-gray-600 leading-relaxed text-lg pr-8 md:pr-12">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
