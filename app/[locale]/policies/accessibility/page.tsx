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
  return { title: messages.policies?.accessibilityTitle || "Accessibility Statement" };
}

export default async function AccessibilityPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  return (
    <PolicyLayout titleKey="accessibilityTitle" lastUpdated="2025-01-15">
      <section aria-labelledby="intro">
        <h2 id="intro" className="text-xl font-semibold text-slate-900 mb-3">
          {p.accessibilityIntroTitle}
        </h2>
        <p className="mb-4">{p.accessibilityIntro}</p>
      </section>

      <section aria-labelledby="compliance">
        <h2 id="compliance" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityComplianceTitle}
        </h2>
        <p className="mb-4">{p.accessibilityCompliance}</p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <p className="font-medium text-emerald-800">{p.accessibilityTarget}</p>
        </div>
      </section>

      <section aria-labelledby="features">
        <h2 id="features" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityFeaturesTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.accessibilityFeatureKeyboard}</li>
          <li>{p.accessibilityFeatureFocus}</li>
          <li>{p.accessibilityFeatureSemantic}</li>
          <li>{p.accessibilityFeatureContrast}</li>
          <li>{p.accessibilityFeatureTextResize}</li>
          <li>{p.accessibilityFeatureSkipLink}</li>
          <li>{p.accessibilityFeatureAltText}</li>
          <li>{p.accessibilityFeatureForms}</li>
          <li>{p.accessibilityFeatureLanguage}</li>
        </ul>
      </section>

      <section aria-labelledby="toolbar">
        <h2 id="toolbar" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityToolbarTitle}
        </h2>
        <p className="mb-4">{p.accessibilityToolbar}</p>
      </section>

      <section aria-labelledby="knownIssues">
        <h2 id="knownIssues" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityKnownIssuesTitle}
        </h2>
        <p className="mb-4">{p.accessibilityKnownIssues}</p>
      </section>

      <section aria-labelledby="testing">
        <h2 id="testing" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityTestingTitle}
        </h2>
        <p className="mb-4">{p.accessibilityTesting}</p>
      </section>

      <section aria-labelledby="feedback">
        <h2 id="feedback" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityFeedbackTitle}
        </h2>
        <p className="mb-4">{p.accessibilityFeedback}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.accessibilityContactTitle}
        </h2>
        <p className="mb-4">{p.accessibilityContact}</p>
      </section>
    </PolicyLayout>
  );
}