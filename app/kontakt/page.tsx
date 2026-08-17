import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function ContactPage() {
  return (
    <div className="bg-page text-dark">
      <SiteHeader variant="solid" />
      <ContactSection />
      <SiteFooter />
    </div>
  );
}
