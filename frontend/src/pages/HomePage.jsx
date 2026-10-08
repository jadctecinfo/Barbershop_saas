import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Benefits from "../components/landing/Benefits";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Pricing from "../components/landing/Pricing";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Benefits />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}