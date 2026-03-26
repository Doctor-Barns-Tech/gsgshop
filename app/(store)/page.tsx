'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import ProductCard, { type ColorVariant, getColorHex } from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import AnimatedSection, { AnimatedGrid } from '@/components/AnimatedSection';
import { usePageTitle } from '@/hooks/usePageTitle';
import HomeHeroCategoryNav, { type HomeCategoryNode } from '@/components/HomeHeroCategoryNav';

const MAIN_GOODS_SLUGS = [
  'grocery', 'mobile', 'stationery', 'lighting-battery', 'food-items', 'nonfood-items',
  'personal-household-care', 'occasions-holidays', 'medicine',
];
const ESSENTIALS_SECTIONS = [
  { label: 'Pantry & Dry Goods', slug: 'pantry-dry-goods' },
  { label: 'Snacks & Confectionery', slug: 'snacks-confectionery' },
  { label: 'Beverages', slug: 'beverages' },
  { label: 'Personal Care', slug: 'personal-care' },
  { label: 'Household Essentials', slug: 'household-essentials' },
  { label: 'Health & Wellness', slug: 'medicine' },
];

const DELIVERY_OPTIONS = [
  { id: 'pickup', title: 'Pickup', desc: 'Within 72hrs (excluding Sunday) after confirmation.', href: '/shipping#pickup', icon: 'ri-store-2-line' },
  { id: 'free', title: 'Free Delivery', desc: 'Tue/Fri only. Min 5% discount as Free Delivery Discount.', href: '/shipping#free-delivery', icon: 'ri-truck-line' },
  { id: 'sole', title: 'Sole Express', desc: 'Daily. Fresh/perishable must use Express. 2hr–48hr slots.', href: '/shipping#sole-express', icon: 'ri-time-line' },
  { id: 'joint', title: 'Joint Express', desc: 'Share fee with neighbor. Same perishable rule. 2hr–48hr.', href: '/shipping#joint-express', icon: 'ri-group-line' },
];

export default function Home() {
  usePageTitle('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const HERO_IMAGES = ['/hero-1.png', '/hero-2.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, allCatRes] = await Promise.all([
          supabase.from('products').select('*, product_variants(*), product_images(*)').eq('status', 'active').eq('featured', true).order('created_at', { ascending: false }).limit(12),
          supabase.from('categories').select('id, name, slug, image_url, metadata').eq('status', 'active').order('position').order('name'),
          supabase.from('categories').select('id, name, slug, image_url, parent_id').eq('status', 'active').order('position').order('name'),
        ]);
        if (!productsRes.error) setFeaturedProducts(productsRes.data || []);
        const featured = (categoriesRes.data || []).filter((c: any) => c.metadata?.featured === true);
        setCategories(featured.length > 0 ? featured : (categoriesRes.data || []).slice(0, 8));
        setAllCategories(allCatRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const mainGoods = allCategories.filter((c) => MAIN_GOODS_SLUGS.some((s) => (c.slug || '').toLowerCase().includes(s))).slice(0, 11);
  const showMainGoods = mainGoods.length > 0 ? mainGoods : allCategories.slice(0, 10);

  const categoryTree: HomeCategoryNode[] = useMemo(() => {
    const parents = allCategories.filter((c: any) => !c.parent_id);
    return parents
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image_url: p.image_url,
        children: allCategories
          .filter((c: any) => c.parent_id === p.id)
          .map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })),
      }))
      .slice(0, 12);
  }, [allCategories]);

  const featuredRailRef = useRef<HTMLDivElement>(null);
  const scrollFeatured = (dir: number) => {
    featuredRailRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Mobile Background Slider */}
        <div className="lg:hidden absolute inset-0 z-0">
          {HERO_IMAGES.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={img}
                alt="Hero Background"
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-white/30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#6B21A8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-gsg-purple/5 to-transparent rounded-bl-[100px] -z-0"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-gsg-accent/10 to-transparent rounded-tr-[100px] -z-0"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 lg:pb-28 pt-0 z-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-stretch">
            {categoryTree.length > 0 && (
              <div className="hidden lg:block shrink-0 relative">
                <HomeHeroCategoryNav categories={categoryTree} />
              </div>
            )}
            <div className="flex-1 min-w-0 pt-8 lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-2xl animate-fade-in-up relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gsg-purple/10 text-gsg-purple text-sm font-bold mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gsg-purple opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gsg-purple"></span>
                </span>
                Now delivering to all regions
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gsg-black mb-6 leading-[1.1] tracking-tight">
                Premium Convenience <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gsg-purple to-gsg-accent">Delivered to You.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Experience the new standard of online shopping in Ghana. 
                Trustworthy service, premium goods, and delivery that fits your schedule.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-gsg-purple text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gsg-purple-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Start Shopping
                  <i className="ri-arrow-right-line ml-2" />
                </Link>
                <Link
                  href="/shipping"
                  className="inline-flex items-center justify-center bg-white text-gsg-purple border-2 border-gsg-purple/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-gsg-purple/5 hover:border-gsg-purple transition-all duration-300"
                >
                  Delivery Options
                </Link>
              </div>
              
              <div className="w-full border-t border-gray-200 pt-6">
                <div className="flex flex-nowrap overflow-x-auto pb-2 md:pb-0 gap-3 md:gap-6 text-sm font-medium text-gray-500 scrollbar-hide snap-x">
                  <div className="flex-none snap-start flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full md:bg-transparent md:p-0 border border-gray-100 md:border-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <i className="ri-shield-check-line" />
                    </div>
                    <span className="whitespace-nowrap">Secure Payment</span>
                  </div>
                  <div className="flex-none snap-start flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full md:bg-transparent md:p-0 border border-gray-100 md:border-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <i className="ri-truck-line" />
                    </div>
                    <span className="whitespace-nowrap">Fast Delivery</span>
                  </div>
                  <div className="flex-none snap-start flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full md:bg-transparent md:p-0 border border-gray-100 md:border-0">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <i className="ri-customer-service-2-line" />
                    </div>
                    <span className="whitespace-nowrap">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block h-[500px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-gsg-purple/5 to-transparent rounded-full blur-3xl -z-10"></div>
              
              {/* Main Image Card */}
              <div className="absolute top-0 right-0 w-3/4 h-[85%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500 z-10">
                <Image 
                  src="/hero-1.png" 
                  alt="GSG Shopping Experience" 
                  fill 
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-lg">Fresh Groceries</p>
                  <p className="text-sm opacity-90">Farm to table</p>
                </div>
              </div>

              {/* Secondary Image Card */}
              <div className="absolute bottom-0 left-0 w-2/3 h-[60%] rounded-3xl overflow-hidden shadow-xl border-4 border-white transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-20">
                <Image 
                  src="/hero-2.png" 
                  alt="GSG Delivery" 
                  fill 
                  className="object-cover"
                  priority
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-bold text-lg">Fast Delivery</p>
                  <p className="text-sm opacity-90">Right to your door</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-10 left-10 bg-white p-4 rounded-2xl shadow-xl z-30 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <i className="ri-star-fill text-xl" />
                  </div>
                  <div>
                    <p className="font-bold text-gsg-black leading-none">4.9/5</p>
                    <p className="text-xs text-gray-500 mt-1">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery options strip */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELIVERY_OPTIONS.map((opt) => (
              <Link
                key={opt.id}
                href={opt.href}
                className="group p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gsg-purple/5 border border-transparent hover:border-gsg-purple/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white text-gsg-purple shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gsg-purple group-hover:text-white transition-all duration-300">
                  <i className={`${opt.icon} text-2xl`} />
                </div>
                <h3 className="font-bold text-gsg-black mb-2 group-hover:text-gsg-purple transition-colors">{opt.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{opt.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category showcase – horizontal featured rail (Anjaro-style) */}
      <section className="py-16 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gsg-black">Featured categories</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollFeatured(-1)}
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gsg-purple hover:text-white hover:border-gsg-purple transition-colors shadow-sm"
                aria-label="Scroll categories left"
              >
                <i className="ri-arrow-left-s-line text-xl" />
              </button>
              <button
                type="button"
                onClick={() => scrollFeatured(1)}
                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gsg-purple hover:text-white hover:border-gsg-purple transition-colors shadow-sm"
                aria-label="Scroll categories right"
              >
                <i className="ri-arrow-right-s-line text-xl" />
              </button>
              <Link href="/categories" className="text-gsg-purple font-medium hover:text-gsg-purple-dark flex items-center gap-1 text-sm sm:text-base whitespace-nowrap">
                View all <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>

          <div
            ref={featuredRailRef}
            className="flex flex-nowrap gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-1 px-1"
          >
            <Link href="/shop" className="group relative flex-none w-[140px] sm:w-[160px] aspect-[4/5] snap-start rounded-2xl overflow-hidden bg-violet-50 shadow-sm border border-violet-100/80 hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gray-100 group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" 
                  alt="Grocery" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="font-bold text-white text-center text-sm">Grocery</p>
              </div>
            </Link>

            <Link href="/shopper" className="group relative flex-none w-[140px] sm:w-[160px] aspect-[4/5] snap-start rounded-2xl overflow-hidden bg-amber-50 shadow-sm border border-amber-100/80 hover:shadow-md transition-all block">
              <div className="absolute inset-0 bg-orange-50 group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop" 
                  alt="Personal Shopper" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <p className="font-bold text-white text-center text-sm">Personal Shopper</p>
              </div>
            </Link>

            {showMainGoods.slice(0, 12).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative flex-none w-[140px] sm:w-[160px] aspect-[4/5] snap-start rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="absolute inset-0 bg-gray-100 group-hover:scale-105 transition-transform duration-500">
                  {cat.image_url ? (
                    <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 16vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ri-archive-line text-4xl text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="font-bold text-white text-center text-xs sm:text-sm leading-tight line-clamp-2">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gsg-black mb-4">Trending Now</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Discover our most popular products, handpicked for quality and value.</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.slice(0, 8).map((product) => {
                const variants = product.product_variants || [];
                const hasVariants = variants.length > 0;
                const minVariantPrice = hasVariants ? Math.min(...variants.map((v: any) => v.price || product.price)) : undefined;
                const totalVariantStock = hasVariants ? variants.reduce((s: number, v: any) => s + (v.quantity || 0), 0) : 0;
                const effectiveStock = hasVariants ? totalVariantStock : product.quantity;
                const colorVariants: ColorVariant[] = [];
                const seen = new Set<string>();
                for (const v of variants) {
                  const name = (v as any).option2;
                  if (name && !seen.has(name.toLowerCase().trim())) {
                    const hex = getColorHex(name);
                    if (hex) {
                      seen.add(name.toLowerCase().trim());
                      colorVariants.push({ name: name.trim(), hex });
                    }
                  }
                }
                return (
                  <div key={product.id} className="w-full">
                    <ProductCard
                      id={product.id}
                      slug={product.slug}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.compare_at_price}
                      image={product.product_images?.[0]?.url || 'https://via.placeholder.com/400x500'}
                      rating={product.rating_avg || 5}
                      reviewCount={product.review_count || 0}
                      badge={product.featured ? 'Featured' : undefined}
                      inStock={effectiveStock > 0}
                      maxStock={effectiveStock || 50}
                      moq={product.moq || 1}
                      hasVariants={hasVariants}
                      minVariantPrice={minVariantPrice}
                      colorVariants={colorVariants}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-flex items-center justify-center bg-white text-gsg-black border-2 border-gsg-black px-8 py-3 rounded-full font-bold hover:bg-gsg-black hover:text-white transition-all duration-300">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Essentials */}
      <section className="py-16 bg-gsg-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gsg-black mb-8">Shop by Essentials</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ESSENTIALS_SECTIONS.map((s) => {
              const cat = allCategories.find((c) => (c.slug || '').toLowerCase().includes(s.slug) || (c.name || '').toLowerCase().includes(s.label.toLowerCase().split(' ')[0]));
              const href = cat ? `/shop?category=${cat.slug}` : `/shop?category=${s.slug}`;
              return (
                <Link key={s.slug} href={href} className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 mx-auto bg-gsg-purple/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-gsg-purple group-hover:text-white transition-colors">
                    <i className="ri-shopping-cart-2-line text-2xl text-gsg-purple group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-bold text-gsg-black text-sm group-hover:text-gsg-purple transition-colors">{s.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo + Track order */}
      <section className="py-16 bg-gsg-purple text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">🎁 Free gift for every purchase</h3>
                <p className="text-white/80">Shop now and get a special surprise in your delivery box.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="inline-flex items-center justify-center bg-white text-gsg-purple px-8 py-3 rounded-full font-bold hover:bg-gsg-accent hover:text-gsg-black transition-colors shadow-lg">
                  Shop Now
                </Link>
                <Link href="/order-tracking" className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                  Track Order
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* GSG Business Units */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gsg-black mb-3">GSG Brands Business Units</h2>
            <p className="text-gray-500">Our growing ecosystem of services across Ghana.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Convenience Goods & More', icon: 'ri-shopping-cart-2-line', color: 'bg-purple-50 text-gsg-purple' },
              { name: 'My Personal Shopper', icon: 'ri-vip-crown-line', color: 'bg-orange-50 text-orange-600' },
              { name: 'Sell-Safe Buy-Safe', icon: 'ri-shield-check-line', color: 'bg-green-50 text-green-600' },
              { name: 'StreetCuisine', icon: 'ri-restaurant-line', color: 'bg-red-50 text-red-500' },
              { name: 'Courier', icon: 'ri-truck-line', color: 'bg-blue-50 text-blue-600' },
              { name: 'Affiliates', icon: 'ri-links-line', color: 'bg-teal-50 text-teal-600' },
            ].map((unit) => (
              <div
                key={unit.name}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-gray-50 border border-gray-100 cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${unit.color} flex items-center justify-center mb-3`}>
                  <i className={`${unit.icon} text-2xl`}></i>
                </div>
                <span className="text-sm font-bold text-gsg-black leading-tight">{unit.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gsg-black text-white text-center border-t border-white/10">
        <p className="text-lg font-medium mb-2">Need help? WhatsApp & Telegram Active 24/7</p>
        <p className="text-white/80 text-sm">+233 (0) 246 033 792 · +233 (0) 579 033 792 · <a href="https://t.me/gsgbrandsgh" target="_blank" rel="noopener noreferrer" className="text-gsg-accent hover:underline">t.me/gsgbrandsgh</a></p>
      </section>
    </main>
  );
}
