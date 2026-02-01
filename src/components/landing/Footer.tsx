import Link from 'next/link';
import { BookOpen, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">MedQBank</span>
            </Link>
            <p className="text-gray-400 dark:text-slate-500 text-sm leading-relaxed">
              Empowering medical students to achieve their best scores through smart, data-driven study tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400 dark:text-slate-500">
              <li><Link href="#features" className="hover:text-white dark:hover:text-slate-300 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white dark:hover:text-slate-300 transition-colors">Pricing</Link></li>
              <li><Link href="#reviews" className="hover:text-white dark:hover:text-slate-300 transition-colors">Reviews</Link></li>
              <li><Link href="/faq" className="hover:text-white dark:hover:text-slate-300 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400 dark:text-slate-500">
              <li><Link href="/help" className="hover:text-white dark:hover:text-slate-300 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white dark:hover:text-slate-300 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-white dark:hover:text-slate-300 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white dark:hover:text-slate-300 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Connect</h4>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-slate-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-slate-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-slate-700 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-gray-700 dark:hover:bg-slate-700 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 dark:text-slate-500 text-sm">
            © {new Date().getFullYear()} MedQBank. All rights reserved.
          </p>
          <p className="text-gray-500 dark:text-slate-500 text-sm mt-4 md:mt-0">
            Made with ❤️ for medical students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
