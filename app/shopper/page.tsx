import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  {
    step: '01',
    title: 'Create your list',
    text: 'Add item names, quantities, and your estimated prices. Add notes for anything specific.',
    icon: 'ri-list-check-2',
  },
  {
    step: '02',
    title: 'We source for you',
    text: 'We buy at the exact source price with 5% commission or less. No hidden markups.',
    icon: 'ri-shopping-basket-2-line',
  },
  {
    step: '03',
    title: 'Pay & receive',
    text: 'Confirm totals, pay securely, and get delivery to your preferred location and time.',
    icon: 'ri-truck-line',
  },
];

const SOURCE_CATEGORIES = [
  {
    name: 'Convenience Goods',
    icon: 'ri-shopping-cart-2-line',
    accent: 'from-purple-500/10 to-purple-500/0',
    iconBg: 'bg-purple-100 text-gsg-purple',
    desc: 'Everyday essentials from trusted shops and markets across the city.',
    examples: ['Groceries', 'Toiletries', 'Drinks'],
  },
  {
    name: 'Specialty Goods',
    icon: 'ri-vip-diamond-line',
    accent: 'from-amber-500/10 to-amber-500/0',
    iconBg: 'bg-amber-100 text-amber-600',
    desc: 'Unique, imported, and brand-specific items hard to find elsewhere.',
    examples: ['Imported brands', 'Gifts', 'Custom finds'],
  },
  {
    name: 'Unsought Goods',
    icon: 'ri-capsule-line',
    accent: 'from-teal-500/10 to-teal-500/0',
    iconBg: 'bg-teal-100 text-teal-600',
    desc: 'Medicines and urgent essentials that just need to arrive — fast.',
    examples: ['Pharmacy items', 'First-aid', 'Urgent runs'],
  },
  {
    name: 'Building Materials',
    icon: 'ri-building-2-line',
    accent: 'from-orange-500/10 to-orange-500/0',
    iconBg: 'bg-orange-100 text-orange-600',
    desc: 'Construction and renovation supplies sourced and delivered to site.',
    examples: ['Cement & blocks', 'Tools', 'Finishing'],
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

const TESTIMONIALS = [
  {
    name: 'Akosua M.',
    role: 'Busy mum, East Legon',
    quote:
      'I sent my Sunday market list at 7am and had everything by lunch. The receipt matched exactly. Game changer.',
    initial: 'A',
  },
  {
    name: 'Kwesi A.',
    role: 'Site engineer',
    quote:
      'They sourced PPE and a few specialty fittings I had been hunting for weeks. Delivered straight to site.',
    initial: 'K',
  },
  {
    name: 'Naa D.',
    role: 'Restaurant owner',
    quote:
      'My personal shopper does my produce run twice a week. The 5% fee saves me a whole afternoon.',
    initial: 'N',
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
      <section className="relative overflow-hidden bg-gsg-purple min-h-[520px] md:min-h-[600px]">
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
        <div className="absolute inset-0 bg-gradient-to-br from-gsg-purple-dark/85 via-gsg-purple/70 to-gsg-purple-dark/85 z-[1]" />
        <div
          className="absolute inset-0 opacity-15 z-[2]"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-8 ring-1 ring-white/20">
            <i className="ri-shopping-basket-line" />
            <span>Your Personal Shopper Service</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.05] tracking-tight">
            List them.{' '}
            <span className="relative inline-block">
              <span className="relative z-10">We shop</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gsg-accent/40 rounded-full -z-0" />
            </span>{' '}
            for you.
          </h1>

          <p className="text-lg md:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto font-light leading-relaxed">
            Quality, fresh, hard-to-find — delivered{' '}
            <strong className="font-semibold text-white">at the exact source price</strong>. Time
            and money saved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/shopper/shopping-list"
              className="inline-flex items-center justify-center gap-2 bg-white text-gsg-purple px-8 py-4 rounded-full text-lg font-bold hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              <i className="ri-list-check-2" />
              Create Shopping List
            </Link>
            <Link
              href="/shopper/how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all border border-white/30"
            >
              <i className="ri-information-line" />
              How it works
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/85">
            <div className="inline-flex items-center gap-1.5">
              <i className="ri-shield-check-line text-gsg-accent" />
              <span>Source-price guarantee</span>
            </div>
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="inline-flex items-center gap-1.5">
              <i className="ri-percent-line text-gsg-accent" />
              <span>5% commission or less</span>
            </div>
            <span className="hidden sm:inline text-white/30">•</span>
            <div className="inline-flex items-center gap-1.5">
              <i className="ri-whatsapp-line text-gsg-accent" />
              <span>WhatsApp updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS — 3-step preview, lifted out of hero
          ============================================================ */}
      <section className="relative -mt-12 md:-mt-16 pb-16 md:pb-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {STEPS.map((s, idx) => (
              <div
                key={s.step}
                className="relative bg-white rounded-2xl border border-gray-200/80 p-6 md:p-7 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* connecting arrow on desktop */}
                {idx < STEPS.length - 1 && (
                  <i className="ri-arrow-right-line hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-2xl text-gray-300 z-10" />
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gsg-purple/10 text-gsg-purple flex items-center justify-center group-hover:bg-gsg-purple group-hover:text-white transition-colors">
                    <i className={`${s.icon} text-xl`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold tracking-[0.22em] text-gsg-purple mb-1.5">
                      STEP {s.step}
                    </p>
                    <h3 className="font-bold text-gsg-black text-xl mb-1.5">{s.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT WE SOURCE
          ============================================================ */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-[0.22em] text-gsg-purple mb-3">
              WHAT WE SOURCE
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gsg-black mb-4 tracking-tight">
              Anything on your list. <span className="text-gsg-purple">Anywhere</span> in the
              city.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Four broad categories, one trusted service. If it's for sale, we'll find it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SOURCE_CATEGORIES.map((category) => (
              <div
                key={category.name}
                className="relative bg-white p-7 rounded-2xl border border-gray-200 hover:border-gsg-purple/30 hover:shadow-xl transition-all duration-300 group overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-2xl ${category.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <i className={`${category.icon} text-3xl`} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-gsg-purple transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{category.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {category.examples.map((ex) => (
                      <span
                        key={ex}
                        className="inline-block text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
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
          PRICING TRANSPARENCY CALLOUT
          ============================================================ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-gsg-purple to-gsg-purple-dark rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            />
            <div className="relative grid md:grid-cols-2 gap-10 p-8 md:p-12 lg:p-16 items-center">
              <div>
                <span className="inline-block text-xs font-bold tracking-[0.22em] text-gsg-accent mb-3">
                  TRANSPARENT PRICING
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  You pay the source price. <br />
                  Plus a fair, flat commission.
                </h2>
                <p className="text-purple-100 text-lg mb-6 leading-relaxed">
                  No hidden markups on goods. We charge{' '}
                  <strong className="text-white">5% commission or less</strong> on the item
                  subtotal, plus delivery based on distance. That's it.
                </p>
                <Link
                  href="/shopper/shopping-list"
                  className="inline-flex items-center gap-2 bg-white text-gsg-purple px-7 py-3.5 rounded-full font-bold hover:bg-purple-50 transition-colors shadow-lg"
                >
                  <i className="ri-list-check-2" />
                  Start your list
                </Link>
              </div>

              {/* Sample receipt */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold tracking-[0.22em] text-gsg-purple">
                    SAMPLE TOTAL
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-md font-semibold">
                    <i className="ri-checkbox-circle-fill" />
                    Receipts on request
                  </span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Items at source price</span>
                    <span className="font-semibold">GH₵ 200.00</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Commission (5%)</span>
                    <span className="font-semibold">GH₵ 10.00</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery (in Accra)</span>
                    <span className="font-semibold">GH₵ 25.00</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 my-3" />
                  <div className="flex justify-between text-gsg-black text-base">
                    <span className="font-bold">You pay</span>
                    <span className="font-bold text-xl text-gsg-purple">GH₵ 235.00</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                  Illustrative only. Real totals are confirmed with you on WhatsApp before
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFITS / USPS
          ============================================================ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.22em] text-gsg-purple mb-3">
              WHY MY PERSONAL SHOPPER
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gsg-black tracking-tight">
              Built for people who'd rather not queue at the market.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gsg-purple/30 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-gsg-purple/10 text-gsg-purple flex items-center justify-center mb-4">
                  <i className={`${b.icon} text-xl`} />
                </div>
                <h3 className="font-bold text-gsg-black text-base mb-1.5">{b.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.22em] text-gsg-purple mb-3">
              WHAT PEOPLE SAY
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gsg-black tracking-tight">
              Loved by busy households and businesses.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-7 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-base" />
                  ))}
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-5 text-[15px]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gsg-purple text-white flex items-center justify-center font-bold">
                    {t.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-gsg-black text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ TEASER
          ============================================================ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-[0.22em] text-gsg-purple mb-3">
              FREQUENTLY ASKED
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gsg-black tracking-tight">
              Quick answers, before you start.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details
                key={f.q}
                className="group bg-white border border-gray-200 rounded-2xl p-5 md:p-6 hover:border-gsg-purple/30 transition-colors"
                open={i === 0}
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                  <span className="font-semibold text-gsg-black text-base md:text-lg">
                    {f.q}
                  </span>
                  <i className="ri-add-line text-2xl text-gsg-purple shrink-0 group-open:rotate-45 transition-transform" />
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed text-sm md:text-base">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shopper/faqs"
              className="inline-flex items-center gap-2 text-gsg-purple font-semibold hover:underline"
            >
              See all FAQs
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA — split: list / WhatsApp
          ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {/* Create List CTA */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gsg-purple to-gsg-purple-dark p-8 md:p-10 text-white shadow-xl">
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }}
              />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5">
                  <i className="ri-list-check-2 text-3xl text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  Ready when you are.
                </h3>
                <p className="text-purple-100 mb-6 leading-relaxed">
                  Drop your items in our shopping list builder. We'll quote, confirm, and shop.
                </p>
                <Link
                  href="/shopper/shopping-list"
                  className="inline-flex items-center gap-2 bg-white text-gsg-purple px-7 py-3.5 rounded-full font-bold hover:bg-purple-50 transition-colors shadow-lg"
                >
                  Create shopping list
                  <i className="ri-arrow-right-line" />
                </Link>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#128C7E] to-[#075E54] p-8 md:p-10 text-white shadow-xl">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-5">
                  <i className="ri-whatsapp-line text-3xl text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  Prefer to chat first?
                </h3>
                <p className="text-emerald-50 mb-6 leading-relaxed">
                  Send your list, photos, or questions on WhatsApp. We reply fast — every day.
                </p>
                <a
                  href="https://wa.me/233246033792"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#128C7E] px-7 py-3.5 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Chat with us
                  <i className="ri-arrow-right-line" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
