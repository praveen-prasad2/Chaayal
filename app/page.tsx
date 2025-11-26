import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Products />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
