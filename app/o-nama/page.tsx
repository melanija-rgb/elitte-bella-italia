import AboutSection from "@/components/AboutSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function AboutPage() {
  return (
    <div className="bg-page text-dark">
      <SiteHeader variant="solid" />
      <AboutSection />
      <SiteFooter />
    </div>
  );
}
