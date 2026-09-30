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
  return { title: messages.policies?.hyperlinkingTitle || "Hyperlinking Policy" };
}

export default async function HyperlinkingPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  return (
    <PolicyLayout titleKey="hyperlinkingTitle" lastUpdated="2025-01-15">
      <section aria-labelledby="intro">
        <h2 id="intro" className="text-xl font-semibold text-slate-900 mb-3">
          {p.hyperlinkingIntroTitle}
        </h2>
        <p className="mb-4">{p.hyperlinkingIntro}</p>
      </section>

      <section aria-labelledby="linkingToUs">
        <h2 id="linkingToUs" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.hyperlinkingToUsTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.hyperlinkingPermitted}</li>
          <li>{p.hyperlinkingNoFraming}</li>
          <li>{p.hyperlinkingNoImpliedEndorsement}</li>
          <li>{p.hyperlinkingNoMisleading}</li>
        </ul>
      </section>

      <section aria-labelledby="linkingFromUs">
        <h2 id="linkingFromUs" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.hyperlinkingFromUsTitle}
        </h2>
        <p className="mb-4">{p.hyperlinkingFromUs}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.hyperlinkingExternalDisclaimer}</li>
          <li>{p.hyperlinkingNoControl}</li>
          <li>{p.hyperlinkingNoResponsibility}</li>
        </ul>
      </section>

      <section aria-labelledby="removal">
        <h2 id="removal" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.hyperlinkingRemovalTitle}
        </h2>
        <p className="mb-4">{p.hyperlinkingRemoval}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.hyperlinkingContactTitle}
        </h2>
        <p className="mb-4">{p.hyperlinkingContact}</p>
      </section>
    </PolicyLayout>
  );
}