import Navbar from "@/components/Navbar";
import MyOrdersSection from "@/components/MyOrdersSection";
import Footer from "@/components/Footer";

export default function MyOrdersPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <MyOrdersSection />
      <Footer />
    </main>
  );
}
