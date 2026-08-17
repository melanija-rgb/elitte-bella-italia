import ReservationSection from "@/components/ReservationSection";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function ReservationPage() {
  return (
    <div className="bg-page text-dark">
      <SiteHeader variant="solid" />
      <ReservationSection />
      <SiteFooter />
    </div>
  );
}
