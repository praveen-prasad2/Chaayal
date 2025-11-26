import Hero from "@/components/home/Hero";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <Products />
      <About />
      <Contact />
    </main>
  );
}
