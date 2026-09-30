import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "@/i18n";
import { PolicyLayout } from "@/components/policies/PolicyLayout";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  return { title: messages.policies?.termsTitle || "Terms & Conditions" };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  return (
    <PolicyLayout titleKey="termsTitle" lastUpdated="2025-01-15">
      <section aria-labelledby="intro">
        <h2 id="intro" className="text-xl font-semibold text-slate-900 mb-3">
          {p.termsIntroTitle}
        </h2>
        <p className="mb-4">{p.termsIntro}</p>
      </section>

      <section aria-labelledby="acceptance">
        <h2 id="acceptance" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsAcceptanceTitle}
        </h2>
        <p className="mb-4">{p.termsAcceptance}</p>
      </section>

      <section aria-labelledby="use">
        <h2 id="use" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsUseTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.termsUsePersonal}</li>
          <li>{p.termsUseProhibited}</li>
          <li>{p.termsUseCommercial}</li>
          <li>{p.termsUseAutomated}</li>
        </ul>
      </section>

      <section aria-labelledby="ip">
        <h2 id="ip" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsIPTitle}
        </h2>
        <p className="mb-4">{p.termsIP}</p>
      </section>

      <section aria-labelledby="disclaimer">
        <h2 id="disclaimer" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsDisclaimerTitle}
        </h2>
        <p className="mb-4">{p.termsDisclaimer}</p>
      </section>

      <section aria-labelledby="liability">
        <h2 id="liability" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsLiabilityTitle}
        </h2>
        <p className="mb-4">{p.termsLiability}</p>
      </section>

      <section aria-labelledby="indemnity">
        <h2 id="indemnity" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsIndemnityTitle}
        </h2>
        <p className="mb-4">{p.termsIndemnity}</p>
      </section>

      <section aria-labelledby="governingLaw">
        <h2 id="governingLaw" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsGoverningLawTitle}
        </h2>
        <p className="mb-4">{p.termsGoverningLaw}</p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsChangesTitle}
        </h2>
        <p className="mb-4">{p.termsChanges}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.termsContactTitle}
        </h2>
        <p className="mb-4">{p.termsContact}</p>
      </section>
    </PolicyLayout>
  );
}