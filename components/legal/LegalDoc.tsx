import React from 'react';

export type LegalSection = {
  id: string;
  num: string;
  title: string;
  body: React.ReactNode;
};

type LegalDocProps = {
  /** Big title at the top, e.g. "General Terms & Conditions". */
  title: string;
  /** Short paragraph(s) shown under the title. */
  intro: React.ReactNode;
  /** Effective date shown in the breadcrumb pill, e.g. "11 May 2026". */
  effectiveDate: string;
  /** Document tag for the breadcrumb, e.g. "Terms", "Privacy", "Cookies". */
  documentTag: 'Terms' | 'Privacy' | 'Cookies';
  /** Numbered sections rendered as cards with sticky table of contents. */
  sections: LegalSection[];
};

/**
 * Shared layout for the legal documents on both goods.gsgbrands.com.gh and
 * shopper.gsgbrands.com.gh. Mirrors the GSG Brands umbrella site
 * (gsgbrands.com.gh/terms etc.) so all three properties stay visually
 * consistent and the legal text is sourced from one place.
 */
export default function LegalDoc({
  title,
  intro,
  effectiveDate,
  documentTag,
  sections,
}: LegalDocProps) {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
        {/* Breadcrumb + effective date */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Legal · {documentTag} · GSG Brands
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-100">
            Effective {effectiveDate}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gsg-black mb-5 tracking-tight">
          {title}
        </h1>
        <div className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed mb-12">
          {intro}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of contents */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                On this page
              </h2>
              <ol className="space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-start gap-2 text-gray-600 hover:text-gsg-purple transition-colors"
                    >
                      <span className="text-[11px] font-bold text-purple-400 mt-0.5 shrink-0 w-5">
                        {s.num}
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Sections */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            {sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-700 rounded-xl flex items-center justify-center font-bold text-sm md:text-base">
                    {s.num}
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-gsg-black">
                    {s.title}
                  </h2>
                </div>
                <div className="prose prose-gray max-w-none text-gray-600 prose-strong:text-gsg-black prose-a:text-gsg-purple prose-a:font-bold prose-headings:font-bold prose-headings:text-gsg-black prose-li:my-1 prose-p:leading-relaxed">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Help footer */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <h3 className="text-lg font-bold text-gsg-black mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 mb-5 max-w-xl mx-auto">
            Our Customer Experience team is happy to clarify anything in this
            document.
          </p>
          <div className="inline-flex gap-3 flex-wrap justify-center">
            <a
              href="https://www.gsgbrands.com.gh/customer-experience"
              target="_blank"
              rel="noreferrer"
              className="bg-gsg-black hover:bg-gsg-purple text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              Contact Customer Experience
            </a>
            <a
              href="mailto:info@gsgbrands.com.gh"
              className="bg-white hover:bg-gray-50 text-gsg-black border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
