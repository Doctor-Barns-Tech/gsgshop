import LegalDoc from '@/components/legal/LegalDoc';
import {
  COOKIES_INTRO,
  COOKIES_SECTIONS,
} from '@/components/legal/cookies-sections';

export const metadata = {
  title: 'Cookie Policy | GSG Personal Shopper',
  description:
    'How GSG Brands uses cookies and similar technologies on our service domains, and how you can manage them.',
};

export default function ShopperCookies() {
  return (
    <LegalDoc
      title="Cookie Policy"
      intro={COOKIES_INTRO}
      effectiveDate="11 May 2026"
      documentTag="Cookies"
      sections={COOKIES_SECTIONS}
    />
  );
}
