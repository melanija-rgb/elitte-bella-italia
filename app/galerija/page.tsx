import GallerySection from "@/components/GallerySection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function GalleryPage() {
  return (
    <div className="bg-page text-dark">
      <SiteHeader variant="solid" />
      <GallerySection />
      <SiteFooter />
    </div>
  );
}
