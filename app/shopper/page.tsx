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

const COMPARISON_OLD = [
  'Hours lost queuing at busy markets',
  'Carrying heavy bags in the heat',
  'Guessing prices, paying tourist rates',
  'Settling for what you can find',
  'No proof of what was paid',
];

const COMPARISON_NEW = [
  'Send your list — relax at home',
  'Doorstep delivery in branded bags',
  'Source price + transparent 5% fee',
  'Hand-picked produce and rare finds',
  'Detailed receipts on request',
];

const STATS = [
  { value: '5', unit: '%', label: 'Commission or less on every order' },
  { value: '24', unit: '/7', label: 'WhatsApp support, real humans' },
  { value: '100', unit: '%', label: 'Source-price guaranteed, always' },
  { value: 'Same', unit: '-day', label: 'Delivery for lists placed before 11am' },
];

const REVIEWS = [
  {
    name: 'Akosua M.',
    role: 'Busy mum, East Legon',
    avatar: '/shopper/shopper_image_10.png',
    rating: 5,
    quote:
      'I sent my Sunday market list at 7am and had everything by lunch. The receipt matched exactly. Game changer.',
    featured: true,
    image: '/shopper/shopper_image_8.png',
  },
  {
    name: 'Naa D.',
    role: 'Restaurant owner',
    avatar: '/shopper/shopper_image_3.png',
    rating: 5,
    quote:
      'My personal shopper does my produce run twice a week. The 5% fee saves me a whole afternoon.',
  },
  {
    name: 'Kwame S.',
    role: 'Site engineer',
    avatar: '/shopper/shopper_image_6.png',
    rating: 5,
    quote:
      'Got tools and PPE delivered straight to site. Zero markup, very transparent.',
  },
  {
    name: 'Ama K.',
    role: 'Working professional',
    avatar: '/shopper/shopper_image_7.png',
    rating: 5,
    quote:
      'Everything came in beautiful packaging. They even called to confirm a brand swap. So thoughtful.',
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
      <section className="relative overflow-hidden bg-gsg-black min-h-[600px] flex items-center">
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
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        
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
          OLD WAY vs OUR WAY — Comparison
          ============================================================ */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
              WHY SWITCH
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight mb-4">
              The old way vs <span className="text-gsg-purple">our way.</span>
            </h2>
            <p className="text-lg text-gray-600">
              Same goods. Better experience. Total transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-7 max-w-5xl mx-auto">
            {/* OLD WAY */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 md:p-10 relative">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-5">
                <i className="ri-time-line" />
                The Old Way
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-8">
                Doing it yourself
              </h3>
              <ul className="space-y-4">
                {COMPARISON_OLD.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                      <i className="ri-close-line text-red-500 text-base" />
                    </div>
                    <span className="text-base text-gray-500 line-through">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* OUR WAY */}
            <div className="bg-gsg-purple text-white rounded-3xl p-8 md:p-10 relative shadow-2xl ring-1 ring-gsg-purple-dark">
              <div
                className="absolute inset-0 opacity-15 rounded-3xl pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-gsg-accent uppercase mb-5">
                  <i className="ri-magic-line" />
                  With My Personal Shopper
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                  A premium personal experience
                </h3>
                <ul className="space-y-4">
                  {COMPARISON_NEW.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 rounded-full bg-gsg-accent flex items-center justify-center mt-0.5">
                        <i className="ri-check-line text-gsg-purple-dark text-base font-bold" />
                      </div>
                      <span className="text-base text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -top-3 -right-3 inline-flex items-center gap-1.5 bg-gsg-accent text-gsg-purple-dark text-[11px] font-bold uppercase tracking-[0.18em] px-4 py-2 rounded-full shadow-lg">
                <i className="ri-thumb-up-fill" />
                Recommended
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BY THE NUMBERS — Stats strip
          ============================================================ */}
      <section className="py-24 md:py-28 bg-gsg-black text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-gsg-purple/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-gsg-accent/30 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-accent mb-3">
              BY THE NUMBERS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              A service built on{' '}
              <span className="text-gsg-accent">trust.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-0">
            {STATS.map((s, idx) => (
              <div
                key={s.label}
                className={`text-left pl-5 md:pl-7 border-l-2 border-gsg-accent/40 ${
                  idx === 0 ? '' : 'lg:border-l-2'
                }`}
              >
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                    {s.value}
                  </span>
                  <span className="text-2xl md:text-4xl font-bold text-gsg-accent leading-none">
                    {s.unit}
                  </span>
                </div>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-[180px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          IN THEIR WORDS — Featured testimonial + grid
          ============================================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
              IN THEIR WORDS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight mb-4">
              People who got their{' '}
              <span className="relative inline-block">
                <span className="relative z-10">time back.</span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gsg-accent/40 rounded-full -z-0" />
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Real lists. Real receipts. Real reviews from busy people across
              Accra.
            </p>
          </div>
        </div>

        {/* Featured large testimonial */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          {(() => {
            const featured = REVIEWS.find((r) => r.featured)!;
            return (
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[420px] md:min-h-[480px]">
                <Image
                  src={featured.image!}
                  alt={featured.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20 lg:from-black/85 lg:via-black/50 lg:to-transparent" />

                <div className="relative z-10 flex flex-col justify-center max-w-2xl p-8 md:p-14 lg:p-16 min-h-[420px] md:min-h-[480px]">
                  <i className="ri-double-quotes-l text-5xl md:text-7xl text-gsg-accent mb-5 md:mb-7" />
                  <blockquote className="text-2xl md:text-4xl font-bold text-white leading-tight mb-8 md:mb-10">
                    &ldquo;{featured.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden relative ring-2 ring-white/30 shrink-0">
                      <Image
                        src={featured.avatar}
                        alt={featured.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-white">
                      <p className="font-bold text-base md:text-lg">
                        {featured.name}
                      </p>
                      <p className="text-sm text-white/80">{featured.role}</p>
                    </div>
                    <div className="hidden sm:flex ml-auto gap-1 text-gsg-accent">
                      {[...Array(featured.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-lg" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Smaller reviews grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {REVIEWS.filter((r) => !r.featured).map((r) => (
              <figure
                key={r.name}
                className="bg-gray-50 rounded-2xl p-6 md:p-7 border border-gray-100 hover:border-gsg-purple/30 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 text-gsg-accent mb-4">
                  {[...Array(r.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-base" />
                  ))}
                </div>
                <blockquote className="text-gray-800 text-base leading-relaxed mb-6 font-medium">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-gray-200/70">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                    <Image
                      src={r.avatar}
                      alt={r.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gsg-black text-sm">
                      {r.name}
                    </p>
                    <p className="text-xs text-gray-500">{r.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FREQUENTLY ASKED — Numbered card layout (no accordion)
          ============================================================ */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block text-sm font-bold tracking-[0.2em] text-gsg-purple mb-3">
              FREQUENTLY ASKED
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gsg-black tracking-tight mb-4">
              Everything you need to know.
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers — and we're a WhatsApp message away for the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mb-12">
            {FAQS.map((f, idx) => (
              <div
                key={f.q}
                className="bg-white rounded-2xl p-7 md:p-8 border border-gray-200 hover:border-gsg-purple/30 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full bg-gsg-purple/10 text-gsg-purple flex items-center justify-center font-bold text-sm">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.2em] text-gsg-purple uppercase">
                    Question
                  </span>
                </div>
                <h3 className="font-bold text-gsg-black text-lg md:text-xl mb-3 leading-snug">
                  {f.q}
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {f.a}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white border border-gray-200 rounded-full p-2 pl-6 shadow-sm">
              <span className="text-sm font-medium text-gray-700">
                Still got a question?
              </span>
              <a
                href="https://wa.me/233246033792"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gsg-purple text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gsg-purple-dark transition-colors"
              >
                <i className="ri-whatsapp-line text-lg" />
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
