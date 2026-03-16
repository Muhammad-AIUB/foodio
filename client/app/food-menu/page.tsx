import Navbar from "@/components/Navbar";
import FoodMenuSection from "@/components/FoodMenuSection";
import Footer from "@/components/Footer";

export default function FoodMenuPage() {
  return (
    <main className="min-h-screen flex flex-col flex-1 bg-white">
      <Navbar />
      <div className="flex-1">
        <FoodMenuSection />
      </div>
      <Footer />
    </main>
  );
}
