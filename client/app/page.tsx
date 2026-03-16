import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        <div className="hidden lg:block absolute top-0 right-0  bottom-[19.5%] w-[43.5%] bg-cream z-0 rounded-bl-[210px]" />
        <Navbar />
        <HeroSection />
      </div>
      <CategoriesSection />
      <Footer />
    </main>
  );
}
