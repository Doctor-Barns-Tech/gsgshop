import LegalDoc from '@/components/legal/LegalDoc';
import { TERMS_INTRO, TERMS_SECTIONS } from '@/components/legal/terms-sections';

export const metadata = {
  title: 'General Terms & Conditions | GSG Brands',
  description:
    'The contract that governs how you use every GSG Brands service — Convenience Goods & More, Personal Shopper, Sell-Safe Buy-Safe, StreetCuisine, Courier, GSG-AID, and Affiliates.',
};

export default function TermsPage() {
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
