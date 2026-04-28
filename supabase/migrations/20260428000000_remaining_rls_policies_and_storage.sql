-- ============================================================================
-- REMAINING RLS POLICIES + STORAGE BUCKETS/POLICIES
-- ----------------------------------------------------------------------------
-- This continues the migration started on 2026-04-27 that added the missing
-- tables (orders, order_items, customers, addresses, support_tickets, etc.)
-- to the live `vlflpclhtvuyxcdvlvkt` project.
--
-- It only adds the RLS policies and storage buckets/policies. All policies
-- mirror the proven, working setup from the sister store
-- (`bskojprmfxugvkycvetc` / sarahlawson) so guest + authenticated checkout,
-- account pages, admin panel, and CMS all work the same way.
--
-- Idempotent: every policy uses DROP IF EXISTS first; every storage insert
-- uses ON CONFLICT DO NOTHING.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Orders (the policy fixing the "new row violates row-level security" error)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
CREATE POLICY "Allow order creation" ON public.orders
  FOR INSERT
  WITH CHECK ((user_id IS NULL) OR (user_id = auth.uid()));

DROP POLICY IF EXISTS "Users view own orders" ON public.orders;
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff manage all orders" ON public.orders;
CREATE POLICY "Staff manage all orders" ON public.orders
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Order Items
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Enable insert for order items" ON public.order_items;
CREATE POLICY "Enable insert for order items" ON public.order_items
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  ));

DROP POLICY IF EXISTS "Users view own order items" ON public.order_items;
CREATE POLICY "Users view own order items" ON public.order_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Staff manage order items" ON public.order_items;
CREATE POLICY "Staff manage order items" ON public.order_items
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Order Status History
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view order history" ON public.order_status_history;
CREATE POLICY "Users view order history" ON public.order_status_history
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_status_history.order_id
      AND orders.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Staff manage order history" ON public.order_status_history;
CREATE POLICY "Staff manage order history" ON public.order_status_history
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Customers
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff can view all customers" ON public.customers;
CREATE POLICY "Staff can view all customers" ON public.customers
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  ));

DROP POLICY IF EXISTS "Staff can manage customers" ON public.customers;
CREATE POLICY "Staff can manage customers" ON public.customers
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  ));

DROP POLICY IF EXISTS "Service role full access to customers" ON public.customers;
CREATE POLICY "Service role full access to customers" ON public.customers
  FOR ALL USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- Addresses
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff manage all addresses" ON public.addresses;
CREATE POLICY "Staff manage all addresses" ON public.addresses
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Coupons
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon read access to coupons" ON public.coupons;
CREATE POLICY "Allow anon read access to coupons" ON public.coupons
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated read access to coupons" ON public.coupons;
CREATE POLICY "Allow authenticated read access to coupons" ON public.coupons
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow admin insert on coupons" ON public.coupons;
CREATE POLICY "Allow admin insert on coupons" ON public.coupons
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  ));

DROP POLICY IF EXISTS "Allow admin update on coupons" ON public.coupons;
CREATE POLICY "Allow admin update on coupons" ON public.coupons
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  ));

DROP POLICY IF EXISTS "Allow admin delete on coupons" ON public.coupons;
CREATE POLICY "Allow admin delete on coupons" ON public.coupons
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  ));

-- ----------------------------------------------------------------------------
-- Store Settings
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff view settings" ON public.store_settings;
CREATE POLICY "Staff view settings" ON public.store_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff manage settings" ON public.store_settings;
CREATE POLICY "Staff manage settings" ON public.store_settings
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Audit Logs
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Staff view audit logs" ON public.audit_logs;
CREATE POLICY "Staff view audit logs" ON public.audit_logs
  FOR SELECT USING (is_admin_or_staff());

DROP POLICY IF EXISTS "Staff insert audit logs" ON public.audit_logs;
CREATE POLICY "Staff insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Cart / Wishlist (user-owned)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_items;
CREATE POLICY "Users manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own wishlist" ON public.wishlist_items;
CREATE POLICY "Users manage own wishlist" ON public.wishlist_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Reviews + Review Images
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public view approved reviews" ON public.reviews;
CREATE POLICY "Public view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved'::review_status);

DROP POLICY IF EXISTS "Users view own reviews" ON public.reviews;
CREATE POLICY "Users view own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create reviews" ON public.reviews;
CREATE POLICY "Users create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own reviews" ON public.reviews;
CREATE POLICY "Users update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff manage reviews" ON public.reviews;
CREATE POLICY "Staff manage reviews" ON public.reviews
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

DROP POLICY IF EXISTS "Public view review images" ON public.review_images;
CREATE POLICY "Public view review images" ON public.review_images
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = review_images.review_id
      AND reviews.status = 'approved'::review_status
  ));

DROP POLICY IF EXISTS "Users manage review images" ON public.review_images;
CREATE POLICY "Users manage review images" ON public.review_images
  FOR ALL USING (EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = review_images.review_id
      AND reviews.user_id = auth.uid()
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = review_images.review_id
      AND reviews.user_id = auth.uid()
  ));

-- ----------------------------------------------------------------------------
-- Blog Posts
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public view published posts" ON public.blog_posts;
CREATE POLICY "Public view published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published'::blog_status OR is_admin_or_staff());

DROP POLICY IF EXISTS "Staff manage blog" ON public.blog_posts;
CREATE POLICY "Staff manage blog" ON public.blog_posts
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Support Tickets + Messages
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own tickets" ON public.support_tickets;
CREATE POLICY "Users manage own tickets" ON public.support_tickets
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Guest can create tickets" ON public.support_tickets;
CREATE POLICY "Guest can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff manage tickets" ON public.support_tickets;
CREATE POLICY "Staff manage tickets" ON public.support_tickets
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

DROP POLICY IF EXISTS "Service role full access to support_tickets" ON public.support_tickets;
CREATE POLICY "Service role full access to support_tickets" ON public.support_tickets
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users view ticket messages" ON public.support_messages;
CREATE POLICY "Users view ticket messages" ON public.support_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = support_messages.ticket_id
      AND support_tickets.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users create messages" ON public.support_messages;
CREATE POLICY "Users create messages" ON public.support_messages
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM support_tickets
    WHERE support_tickets.id = support_messages.ticket_id
      AND support_tickets.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Staff manage messages" ON public.support_messages;
CREATE POLICY "Staff manage messages" ON public.support_messages
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Returns
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users view own returns" ON public.return_requests;
CREATE POLICY "Users view own returns" ON public.return_requests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create returns" ON public.return_requests;
CREATE POLICY "Users create returns" ON public.return_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff manage returns" ON public.return_requests;
CREATE POLICY "Staff manage returns" ON public.return_requests
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

DROP POLICY IF EXISTS "Users view return items" ON public.return_items;
CREATE POLICY "Users view return items" ON public.return_items
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM return_requests
    WHERE return_requests.id = return_items.return_request_id
      AND return_requests.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Staff manage return items" ON public.return_items;
CREATE POLICY "Staff manage return items" ON public.return_items
  FOR ALL USING (is_admin_or_staff()) WITH CHECK (is_admin_or_staff());

-- ----------------------------------------------------------------------------
-- Notifications
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- CMS: Pages, Site Settings, CMS Content, Banners, Navigation
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view pages" ON public.pages;
CREATE POLICY "Public can view pages" ON public.pages
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff can manage pages" ON public.pages;
CREATE POLICY "Staff can manage pages" ON public.pages
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  ));

DROP POLICY IF EXISTS "Allow public read on site_settings" ON public.site_settings;
CREATE POLICY "Allow public read on site_settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin write on site_settings" ON public.site_settings;
CREATE POLICY "Allow admin write on site_settings" ON public.site_settings
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
  ));

DROP POLICY IF EXISTS "Allow public read on cms_content" ON public.cms_content;
CREATE POLICY "Allow public read on cms_content" ON public.cms_content
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow admin all on cms_content" ON public.cms_content;
CREATE POLICY "Allow admin all on cms_content" ON public.cms_content
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
  ));

DROP POLICY IF EXISTS "Allow public read on banners" ON public.banners;
CREATE POLICY "Allow public read on banners" ON public.banners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow admin all on banners" ON public.banners;
CREATE POLICY "Allow admin all on banners" ON public.banners
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
  ));

DROP POLICY IF EXISTS "Allow public read on navigation_menus" ON public.navigation_menus;
CREATE POLICY "Allow public read on navigation_menus" ON public.navigation_menus
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all on navigation_menus" ON public.navigation_menus;
CREATE POLICY "Allow admin all on navigation_menus" ON public.navigation_menus
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
  ));

DROP POLICY IF EXISTS "Allow public read on navigation_items" ON public.navigation_items;
CREATE POLICY "Allow public read on navigation_items" ON public.navigation_items
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow admin all on navigation_items" ON public.navigation_items;
CREATE POLICY "Allow admin all on navigation_items" ON public.navigation_items
  FOR ALL USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
  ));

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('reviews', 'reviews', true) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================
DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;
CREATE POLICY "Public read access for products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin upload access for products" ON storage.objects;
CREATE POLICY "Admin upload access for products" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products' AND is_admin_or_staff() = true);

DROP POLICY IF EXISTS "Admin update access for products" ON storage.objects;
CREATE POLICY "Admin update access for products" ON storage.objects
  FOR UPDATE USING (bucket_id = 'products' AND is_admin_or_staff() = true);

DROP POLICY IF EXISTS "Admin delete access for products" ON storage.objects;
CREATE POLICY "Admin delete access for products" ON storage.objects
  FOR DELETE USING (bucket_id = 'products' AND is_admin_or_staff() = true);

DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
CREATE POLICY "Public read access for media" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Admin upload access for media" ON storage.objects;
CREATE POLICY "Admin upload access for media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND is_admin_or_staff() = true);

DROP POLICY IF EXISTS "Admin delete access for media" ON storage.objects;
CREATE POLICY "Admin delete access for media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND is_admin_or_staff() = true);

DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
CREATE POLICY "Public read access for avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public read access for blog" ON storage.objects;
CREATE POLICY "Public read access for blog" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog');

DROP POLICY IF EXISTS "Public read access for reviews" ON storage.objects;
CREATE POLICY "Public read access for reviews" ON storage.objects
  FOR SELECT USING (bucket_id = 'reviews');
