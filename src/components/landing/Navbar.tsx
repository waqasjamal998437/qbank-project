import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">MedQBank</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Pricing
            </Link>
            <Link href="#reviews" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              Reviews
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/signin" 
              className="hidden sm:block text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
