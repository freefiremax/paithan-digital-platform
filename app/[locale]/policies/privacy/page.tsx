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
  return { title: messages.policies?.privacyTitle || "Privacy Policy" };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  return (
    <PolicyLayout titleKey="privacyTitle" lastUpdated="2025-01-15">
      <section aria-labelledby="intro">
        <h2 id="intro" className="text-xl font-semibold text-slate-900 mb-3">
          {p.privacyIntroTitle}
        </h2>
        <p className="mb-4">{p.privacyIntro}</p>
      </section>

      <section aria-labelledby="dataCollected">
        <h2 id="dataCollected" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyDataCollectedTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.privacyDataGrievance}</li>
          <li>{p.privacyDataFeedback}</li>
          <li>{p.privacyDataAnalytics}</li>
          <li>{p.privacyDataCookies}</li>
        </ul>
      </section>

      <section aria-labelledby="purpose">
        <h2 id="purpose" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyPurposeTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.privacyPurposeGrievance}</li>
          <li>{p.privacyPurposeFeedback}</li>
          <li>{p.privacyPurposeLegal}</li>
          <li>{p.privacyPurposeAnalytics}</li>
        </ul>
      </section>

      <section aria-labelledby="legalBasis">
        <h2 id="legalBasis" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyLegalBasisTitle}
        </h2>
        <p className="mb-4">{p.privacyLegalBasis}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.privacyLegalConsent}</li>
          <li>{p.privacyLegalObligation}</li>
          <li>{p.privacyLegalLegitimate}</li>
        </ul>
      </section>

      <section aria-labelledby="retention">
        <h2 id="retention" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyRetentionTitle}
        </h2>
        <p className="mb-4">{p.privacyRetention}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.privacyRetentionGrievance}</li>
          <li>{p.privacyRetentionFeedback}</li>
          <li>{p.privacyRetentionAnalytics}</li>
        </ul>
      </section>

      <section aria-labelledby="rights">
        <h2 id="rights" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyRightsTitle}
        </h2>
        <p className="mb-4">{p.privacyRights}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.privacyRightAccess}</li>
          <li>{p.privacyRightCorrection}</li>
          <li>{p.privacyRightDeletion}</li>
          <li>{p.privacyRightPortability}</li>
          <li>{p.privacyRightObjection}</li>
          <li>{p.privacyRightWithdraw}</li>
        </ul>
      </section>

      <section aria-labelledby="grievanceOfficer">
        <h2 id="grievanceOfficer" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyGrievanceOfficerTitle}
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-amber-800 font-semibold mb-2">{p.privacyPlaceholderNotice}</p>
          <dl className="space-y-1 text-sm text-amber-900">
            <dt className="font-medium">{p.privacyOfficerName}:</dt>
            <dd>{p.privacyOfficerNamePlaceholder}</dd>
            <dt className="font-medium">{p.privacyOfficerDesignation}:</dt>
            <dd>{p.privacyOfficerDesignationPlaceholder}</dd>
            <dt className="font-medium">{p.privacyOfficerEmail}:</dt>
            <dd>{p.privacyOfficerEmailPlaceholder}</dd>
            <dt className="font-medium">{p.privacyOfficerPhone}:</dt>
            <dd>{p.privacyOfficerPhonePlaceholder}</dd>
          </dl>
        </div>
      </section>

      <section aria-labelledby="security">
        <h2 id="security" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacySecurityTitle}
        </h2>
        <p className="mb-4">{p.privacySecurity}</p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyChangesTitle}
        </h2>
        <p className="mb-4">{p.privacyChanges}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.privacyContactTitle}
        </h2>
        <p className="mb-4">{p.privacyContact}</p>
      </section>
    </PolicyLayout>
  );
}