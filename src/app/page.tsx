import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import MinimalBuddy from '@/components/MinimalBuddy';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <ThemeToggle />
      <Navbar />
      <Hero />
      <MinimalBuddy />
      <Benefits />
      <Pricing />
      <Testimonials />
      <Footer />
    </main>
  );
}
