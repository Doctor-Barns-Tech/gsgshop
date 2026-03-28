'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';

export type HomeCategoryNode = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  children: { id: string; name: string; slug: string }[];
};

const ICON_MAP: Record<string, string> = {
  food: 'ri-restaurant-2-line',
  grocery: 'ri-shopping-basket-2-line',
  convenience: 'ri-store-2-line',
  personal: 'ri-heart-pulse-line',
  care: 'ri-heart-pulse-line',
  health: 'ri-heart-pulse-line',
  beauty: 'ri-palette-line',
  nonfood: 'ri-home-4-line',
  household: 'ri-home-4-line',
  home: 'ri-home-smile-2-line',
  occasion: 'ri-gift-line',
  gift: 'ri-gift-line',
  medicine: 'ri-capsule-line',
  pharma: 'ri-capsule-line',
  mobile: 'ri-smartphone-line',
  electronic: 'ri-computer-line',
  charger: 'ri-charging-pile-line',
  stationery: 'ri-pencil-ruler-2-line',
  frozen: 'ri-fridge-line',
  dairy: 'ri-cup-line',
  beverage: 'ri-goblet-line',
  drink: 'ri-goblet-line',
  snack: 'ri-cake-3-line',
  bakery: 'ri-cake-2-line',
  meat: 'ri-knife-line',
  fish: 'ri-fish-line',
  fruit: 'ri-apple-line',
  vegetable: 'ri-leaf-line',
  rice: 'ri-bowl-line',
  cereal: 'ri-seedling-line',
  oil: 'ri-drop-line',
  spice: 'ri-fire-line',
  sauce: 'ri-flask-line',
  can: 'ri-inbox-archive-line',
  baby: 'ri-baby-line',
  pet: 'ri-bear-smile-line',
  clean: 'ri-recycle-line',
  laundry: 'ri-t-shirt-air-line',
  tool: 'ri-tools-line',
  hardware: 'ri-hammer-line',
  building: 'ri-building-2-line',
  ceiling: 'ri-building-4-line',
  cement: 'ri-stack-line',
  paint: 'ri-paint-brush-line',
  plumbing: 'ri-drop-line',
  lighting: 'ri-lightbulb-line',
  battery: 'ri-battery-charge-line',
  fashion: 'ri-shirt-line',
  jean: 'ri-shirt-line',
  cloth: 'ri-shirt-line',
  shoe: 'ri-footprint-line',
  sport: 'ri-basketball-line',
  fitness: 'ri-run-line',
  furniture: 'ri-sofa-line',
  entertainment: 'ri-film-line',
  digital: 'ri-cloud-line',
  solar: 'ri-sun-line',
  security: 'ri-lock-line',
  smart: 'ri-cpu-line',
  car: 'ri-car-line',
  auto: 'ri-car-line',
  kitchen: 'ri-knife-line',
  appliance: 'ri-fridge-line',
};

function iconForSlug(slug: string): string {
  const s = slug.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (s.includes(key)) return icon;
  }
  return 'ri-layout-grid-line';
}

function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  if (items.length === 0) return [];
  const cols: T[][] = Array.from({ length: Math.min(columnCount, Math.max(1, items.length)) }, () => []);
  items.forEach((item, i) => {
    cols[i % cols.length].push(item);
  });
  return cols;
}

export default function HomeHeroCategoryNav({ categories }: { categories: HomeCategoryNode[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  }, []);

  const onEnterParent = useCallback(
    (id: string) => {
      clearTimer();
      setActiveId(id);
    },
    [clearTimer]
  );

  const onLeaveNav = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveId(null), 200);
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const active = activeId ? categories.find((c) => c.id === activeId) : null;

  if (categories.length === 0) return null;

  return (
    <aside
      className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white border border-gray-200 border-t-0 rounded-b-2xl shadow-sm overflow-visible z-[60] self-stretch"
      onMouseLeave={onLeaveNav}
    >
      {/* Category List */}
      <nav className="flex-1 flex flex-col py-2">
        {categories.map((cat) => {
          const isActive = activeId === cat.id;
          const hasChildren = cat.children.length > 0;
          return (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => onEnterParent(cat.id)}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors border-l-3 ${
                  isActive
                    ? 'bg-purple-50 text-gsg-purple border-l-gsg-purple'
                    : 'text-gray-700 hover:bg-gray-50 border-l-transparent'
                }`}
              >
                <i className={`${iconForSlug(cat.slug)} text-base ${isActive ? 'text-gsg-purple' : 'text-gray-400'}`} />
                <span className="flex-1 text-left leading-snug truncate">{cat.name}</span>
                {hasChildren && (
                  <i className={`ri-arrow-right-s-line text-sm ${isActive ? 'text-gsg-purple' : 'text-gray-300'}`} />
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Flyout mega panel */}
      {active && active.children.length > 0 && (
        <div
          className="absolute left-full top-0 ml-0 z-[70] pl-px min-h-full"
          onMouseEnter={clearTimer}
          onMouseLeave={onLeaveNav}
        >
          <div className="min-w-[520px] max-w-[680px] min-h-[420px] rounded-r-2xl rounded-br-2xl border border-l-0 border-gray-200 bg-white shadow-2xl py-6 px-8 relative z-[70]">
            {/* Flyout header */}
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gsg-black">{active.name}</h3>
              <Link
                href={`/shop?category=${active.slug}`}
                className="text-sm font-bold text-gsg-purple hover:text-gsg-purple-dark flex items-center gap-1 shrink-0"
              >
                View all <i className="ri-arrow-right-line" />
              </Link>
            </div>

            {/* Subcategories in columns */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0">
              {splitIntoColumns(active.children, 3).map((col, colIdx) => (
                <ul key={colIdx} className="space-y-0">
                  {col.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/shop?category=${sub.slug}`}
                        className="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-gsg-purple hover:pl-0.5 transition-all group"
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-gsg-purple shrink-0 transition-colors" />
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            {/* Shop button */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href={`/shop?category=${active.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gsg-purple px-5 py-2.5 rounded-lg hover:bg-gsg-purple-dark transition-colors"
              >
                Shop {active.name}
                <i className="ri-shopping-bag-line" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
