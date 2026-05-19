-- Recategorize categories so the right sub-categories sit under the right parents.
--
-- This migration is the implementation of the proposal in
-- canvases/category-reorganization.canvas.tsx (live snapshot pulled from
-- production on 2026-05-18).
--
-- Goals:
--   1. Surface fresh produce, frozen foods, Ghana dishes, pharmacy and
--      everyday electronics that are currently buried 3 levels deep under
--      "My Personal Shopper > Convenience Goods" / "Shopping Goods".
--   2. Merge the standalone "Mobile Phones & Accessories" root with the
--      Personal-Shopper Electronics branch into a single "Phones & Electronics".
--   3. Fold the orphan "JeansWear" root into a unified "Fashion & Clothing".
--   4. Soft-delete the 5 empty placeholder roots
--      (More / Food Essentials / Non-food Essentials / Personal & Household
--      Care / Occasions & Holidays) plus the now-empty intermediates.
--   5. One typo fix: "Stapling & Punching Cutting" → "Stapling & Punching".
--   6. Re-parent the misplaced "Reinforcement Materials" so it is a direct
--      child of Structural alongside its siblings (instead of a grandchild
--      of Cement & Concrete).
--
-- Slugs are preserved wherever possible to keep existing product URLs alive.
-- All status changes are soft-deletes (status='inactive') so this migration
-- is fully reversible.

BEGIN;

-- ============================================================
-- 1. Create the four brand-new top-level roots
-- ============================================================

INSERT INTO public.categories (id, name, slug, description, parent_id, position, status, metadata)
VALUES
  (gen_random_uuid(), 'Fresh & Frozen Foods', 'fresh-frozen-foods',
   'Fresh produce, frozen foods, and traditional Ghanaian dishes & ingredients.',
   NULL, 2, 'active', jsonb_build_object('featured', false)),
  (gen_random_uuid(), 'Phones & Electronics', 'phones-electronics',
   'Smartphones, laptops, televisions, audio devices, accessories and chargers.',
   NULL, 6, 'active', jsonb_build_object('featured', false)),
  (gen_random_uuid(), 'Home Appliances & Furniture', 'home-appliances-furniture',
   'Refrigerators, washing machines, gas cookers, and home furniture.',
   NULL, 7, 'active', jsonb_build_object('featured', false)),
  (gen_random_uuid(), 'Special-Order Services', 'special-order-services',
   'High-touch services arranged via Personal Shopper: automobiles, insurance, funeral.',
   NULL, 11, 'active', jsonb_build_object('featured', false))
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 2. Rename existing top-level roots (slugs unchanged)
-- ============================================================

UPDATE public.categories SET name = 'Groceries & Pantry'      WHERE slug = 'grocery';
UPDATE public.categories SET name = 'Stationery & Office'     WHERE slug = 'stationery';
UPDATE public.categories SET name = 'Building & Construction' WHERE slug = 'building-materials';

-- ============================================================
-- 3. Promote existing sub-categories to top-level
-- ============================================================

UPDATE public.categories SET parent_id = NULL, position = 3, status = 'active'
  WHERE slug = 'personal-care';

UPDATE public.categories SET parent_id = NULL, position = 4, status = 'active'
  WHERE slug = 'household-essentials';

UPDATE public.categories SET parent_id = NULL, position = 5, status = 'active'
  WHERE slug = 'health-wellness';

UPDATE public.categories SET parent_id = NULL, position = 8, status = 'active'
  WHERE slug = 'fashion-clothing';

UPDATE public.categories SET parent_id = NULL, position = 10, status = 'active'
  WHERE slug = 'building-materials';

-- Reposition the existing top-levels we are keeping
UPDATE public.categories SET position = 1 WHERE slug = 'grocery';
UPDATE public.categories SET position = 9 WHERE slug = 'stationery';

-- ============================================================
-- 4. Re-parent leaf categories under the new / promoted roots
-- ============================================================

-- Bakery, Pastries & Cakes  →  Groceries & Pantry
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'grocery' AND parent_id IS NULL)
 WHERE slug = 'bakery-pastries-cakes';

-- Fresh produce / frozen / Ghana dishes / sourcing  →  Fresh & Frozen Foods
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'fresh-frozen-foods' AND parent_id IS NULL)
 WHERE slug IN ('fresh-produce', 'frozen-foods', 'ghana-dishes-ingredient',
                'source-of-vegetable-fruit-herb');

-- Lighting + batteries  →  Household Essentials
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'household-essentials' AND parent_id IS NULL)
 WHERE slug IN ('house-lighting', 'gadget-household-batteries');

-- Emergency-products children  →  Health & Wellness
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'health-wellness' AND parent_id IS NULL)
 WHERE slug IN ('first-aid-kits', 'fire-extinguishers');

-- Phones & Electronics children
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'phones-electronics' AND parent_id IS NULL)
 WHERE slug IN ('smartphones', 'laptops', 'televisions', 'audio-devices',
                'smart-gadgets', 'phone-accessories', 'power-charging');

-- Home Appliances & Furniture children
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'home-appliances-furniture' AND parent_id IS NULL)
 WHERE slug IN ('home-appliances', 'furniture');

-- Fashion & Clothing children (Designer Fashion + JeansWear root)
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'fashion-clothing' AND parent_id IS NULL)
 WHERE slug IN ('designer-fashion', 'jeans-wear');

-- Rename the imported "JeansWear" sub-tree to "Jeans"
UPDATE public.categories SET name = 'Jeans' WHERE slug = 'jeans-wear';

-- Special-Order Services children
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'special-order-services' AND parent_id IS NULL)
 WHERE slug IN ('automobiles', 'insurance', 'funeral-services');

-- ============================================================
-- 5. Building & Construction internal cleanup
-- ============================================================

-- Reinforcement Materials should be a direct child of Structural,
-- not a grandchild of Cement & Concrete.
UPDATE public.categories
   SET parent_id = (SELECT id FROM public.categories WHERE slug = 'structural')
 WHERE slug = 'reinforcement-materials-iron-rods-steel-bars';

-- ============================================================
-- 6. Stapling typo fix
-- ============================================================

UPDATE public.categories
   SET name = 'Stapling & Punching', slug = 'stapling-punching'
 WHERE slug = 'stapling-punching-cutting';

-- ============================================================
-- 7. Soft-delete empty placeholder roots and intermediates
-- ============================================================

-- Empty placeholder roots
UPDATE public.categories SET status = 'inactive'
 WHERE slug IN (
   'more',
   'food-essentials',
   'non-food-essentials',
   'personal-household-care',
   'occasions-holidays'
 );

-- Roots that are now empty after their children moved out
UPDATE public.categories SET status = 'inactive'
 WHERE slug IN (
   'house-lighting-gadget-batteries', -- children moved to Household Essentials
   'mobile-phones-accessories',       -- children moved to Phones & Electronics
   'my-personal-shopper'              -- children moved to multiple new roots
 );

-- Intermediate parents that are now empty
UPDATE public.categories SET status = 'inactive'
 WHERE slug IN (
   'convenience-goods',  -- MyPS > Convenience Goods (children dispersed)
   'shopping-goods',     -- MyPS > Shopping Goods    (children dispersed)
   'specialty-goods',    -- MyPS > Specialty Goods   (children dispersed)
   'unsought-goods',     -- MyPS > Unsought Goods    (children dispersed)
   'electronics',        -- MyPS > Shopping > Electronics (children moved)
   'emergency-products'  -- MyPS > Unsought > Emergency Products (children moved)
 );

-- "Gender Type" should be a product attribute, not a sub-category.
-- Soft-deleted here so it stops appearing in the storefront category nav.
-- Its children (Men / Women / Kids / Unisex) are also attributes — soft-delete
-- so they don't strand under an inactive parent.
UPDATE public.categories SET status = 'inactive' WHERE slug = 'gender-target-group';
UPDATE public.categories SET status = 'inactive'
 WHERE slug IN ('men', 'women', 'kids-boys-girls', 'unisex');

-- Audio Devices was historically inactive but its three children (Bluetooth
-- Speakers, Earphones, Headphones) are active and now sit under Phones &
-- Electronics. Reactivate the parent so the sub-tree renders correctly.
UPDATE public.categories SET status = 'active' WHERE slug = 'audio-devices';

COMMIT;
