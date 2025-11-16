import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import FeatureSection from "@/components/landing/FeatureSection";
import GumroadWay from "@/components/landing/GumroadWay";
import Statistics from "@/components/landing/Statistics";
import Testimonials from "@/components/landing/Testimonials";
import Categories from "@/components/landing/Categories";
import SmallBets from "@/components/landing/SmallBets";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      <Header />
      <Hero />
      <ProductShowcase />
      <FeatureSection />
      <GumroadWay />
      {/* <Statistics /> */}
      {/* <Testimonials /> */}
      <Categories />
      <SmallBets />
      {/* <Newsletter /> */}
      <Footer />
    </main>
  );
}
