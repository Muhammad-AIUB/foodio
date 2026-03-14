import Navbar from "@/components/Navbar";
import FoodMenuSection from "@/components/FoodMenuSection";
import Footer from "@/components/Footer";

export default function FoodMenuPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FoodMenuSection />
      <Footer />
    </main>
  );
}
