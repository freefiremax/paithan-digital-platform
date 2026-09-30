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
  return { title: messages.policies?.copyrightTitle || "Copyright Policy" };
}

export default async function CopyrightPage({ params }: PageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale as "en" | "mr" | "hi");
  if (!messages.policies) notFound();

  const p = messages.policies;

  return (
    <PolicyLayout titleKey="copyrightTitle" lastUpdated="2025-01-15">
      <section aria-labelledby="intro">
        <h2 id="intro" className="text-xl font-semibold text-slate-900 mb-3">
          {p.copyrightIntroTitle}
        </h2>
        <p className="mb-4">{p.copyrightIntro}</p>
      </section>

      <section aria-labelledby="ownership">
        <h2 id="ownership" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.copyrightOwnershipTitle}
        </h2>
        <p className="mb-4">{p.copyrightOwnership}</p>
      </section>

      <section aria-labelledby="permitted">
        <h2 id="permitted" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.copyrightPermittedTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.copyrightPermittedPersonal}</li>
          <li>{p.copyrightPermittedEducational}</li>
          <li>{p.copyrightPermittedGovernment}</li>
        </ul>
      </section>

      <section aria-labelledby="restrictions">
        <h2 id="restrictions" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.copyrightRestrictionsTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{p.copyrightRestrictCommercial}</li>
          <li>{p.copyrightRestrictModify}</li>
          <li>{p.copyrightRestrictRedistribute}</li>
        </ul>
      </section>

      <section aria-labelledby="thirdParty">
        <h2 id="thirdParty" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.copyrightThirdPartyTitle}
        </h2>
        <p className="mb-4">{p.copyrightThirdParty}</p>
      </section>

      <section aria-labelledby="infringement">
        <h2 id="infringement" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.copyrightInfringementTitle}
        </h2>
        <p className="mb-4">{p.copyrightInfringement}</p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact" className="text-xl font-semibold text-slate-900 mb-3 mt-8">
          {p.copyrightContactTitle}
        </h2>
        <p className="mb-4">{p.copyrightContact}</p>
      </section>
    </PolicyLayout>
  );
}