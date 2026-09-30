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
  return { title: messages.policies?.disclaimerTitle || "Disclaimer" };
}

export default async function DisclaimerPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  return (
    <PolicyLayout titleKey="disclaimerTitle" lastUpdated="2025-01-15">
      <section aria-labelledby="intro">
        <h2 id="intro" className="text-xl font-semibold text-slate-900 mb-3">
          {p.disclaimerIntroTitle}
        </h2>
        <p className="mb-4">{p.disclaimerIntro}</p>
      </section>

      <section aria-labelledby="general">
        <h2 id="general" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerGeneralTitle}
        </h2>
        <p className="mb-4">{p.disclaimerGeneral}</p>
      </section>

      <section aria-labelledby="accuracy">
        <h2 id="accuracy" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerAccuracyTitle}
        </h2>
        <p className="mb-4">{p.disclaimerAccuracy}</p>
      </section>

      <section aria-labelledby="official">
        <h2 id="official" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerOfficialTitle}
        </h2>
        <p className="mb-4">{p.disclaimerOfficial}</p>
      </section>

      <section aria-labelledby="emergency">
        <h2 id="emergency" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerEmergencyTitle}
        </h2>
        <p className="mb-4">{p.disclaimerEmergency}</p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <ul className="list-disc list-inside space-y-1 text-red-800">
            <li>{p.disclaimerEmergencyPolice}</li>
            <li>{p.disclaimerEmergencyFire}</li>
            <li>{p.disclaimerEmergencyAmbulance}</li>
            <li>{p.disclaimerEmergencyDisaster}</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="external">
        <h2 id="external" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerExternalTitle}
        </h2>
        <p className="mb-4">{p.disclaimerExternal}</p>
      </section>

      <section aria-labelledby="chatbot">
        <h2 id="chatbot" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerChatbotTitle}
        </h2>
        <p className="mb-4">{p.disclaimerChatbot}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.disclaimerContactTitle}
        </h2>
        <p className="mb-4">{p.disclaimerContact}</p>
      </section>
    </PolicyLayout>
  );
}