import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata = {
  title: "Contact",
  description:
    "Studio visits, commissions, and inquiries — Kohinoor, Kathmandu.",
};

export default function ContactPage() {
  return (
    <div className="pb-24 pt-12 md:pt-16">
      <div className="container-narrow grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="label-caps text-[var(--gold-deep)]">
            Contact
          </p>
          <h1 className="font-display mt-4 text-4xl font-light leading-tight md:text-5xl lg:text-6xl">
            Let&apos;s connect
          </h1>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-[var(--secondary)] md:text-base">
            For commissions, studio visits, or collection inquiries — write
            through the form or reach the studio directly.
          </p>
          <div className="mt-12">
            <ContactInfo />
          </div>
        </div>
        <div className="lg:pt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
