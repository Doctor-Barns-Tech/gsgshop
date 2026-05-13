import LegalDoc from '@/components/legal/LegalDoc';
import { TERMS_INTRO, TERMS_SECTIONS } from '@/components/legal/terms-sections';

export const metadata = {
  title: 'General Terms & Conditions | GSG Personal Shopper',
  description:
    'The contract that governs how you use every GSG Brands service — including Personal Shopper. Plain Ghanaian English, but legally binding.',
};

export default function ShopperTerms() {
  return (
    <LegalDoc
      title="General Terms & Conditions"
      intro={TERMS_INTRO}
      effectiveDate="11 May 2026"
      documentTag="Terms"
      sections={TERMS_SECTIONS}
    />
  );
}
