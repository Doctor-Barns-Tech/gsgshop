import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ProductDetailClient from './ProductDetailClient';

// Initialize Supabase client for server-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  // Fetch product data
  let query = supabase
    .from('products')
    .select('name, description, product_images(url, position)')
    .eq('status', 'active');

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  if (isUUID) {
    query = query.or(`id.eq.${slug},slug.eq.${slug}`);
  } else {
    query = query.eq('slug', slug);
  }

  const { data: product } = await query.single();

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const mainImage = product.product_images?.sort((a: any, b: any) => a.position - b.position)[0]?.url;

  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Buy ${product.name} at GSG Convenience Goods & More.`,
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 160) || `Buy ${product.name} at GSG Convenience Goods & More.`,
      images: mainImage ? [{ url: mainImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description?.substring(0, 160) || `Buy ${product.name} at GSG Convenience Goods & More.`,
      images: mainImage ? [mainImage] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
