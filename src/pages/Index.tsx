import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import GamesGallery from "@/components/Games";
import AIChatModal from "@/components/AIchatModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CTA />
        <GamesGallery />
        <div className="flex justify-end  ">
          <AIChatModal/>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
