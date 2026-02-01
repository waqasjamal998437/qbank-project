import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <Benefits />
      <Pricing />
      <Testimonials />
      <Footer />
    </main>
  );
}
