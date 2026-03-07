import ShopperHeader from '@/components/ShopperHeader';
import Footer from '@/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My Personal Shopper by GSG',
    default: 'My Personal Shopper by GSG',
  },
  description: 'List Them — We Shop For You. Quality, fresh, and yummy goods at the same source price.',
};

export default function ShopperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ShopperHeader />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
