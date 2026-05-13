import LegalDoc from '@/components/legal/LegalDoc';
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
} from '@/components/legal/privacy-sections';

export const metadata = {
  title: 'Privacy Policy | GSG Personal Shopper',
  description:
    'How GSG Brands collects, uses, shares, and protects your personal information — in compliance with the Data Protection Act, 2012 (Act 843) of Ghana.',
};

export default function ShopperPrivacyPolicy() {
  return (
    <LegalDoc
      title="Privacy Policy"
      intro={PRIVACY_INTRO}
      effectiveDate="11 May 2026"
      documentTag="Privacy"
      sections={PRIVACY_SECTIONS}
    />
  );
}
