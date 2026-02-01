import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span>Trusted by 10,000+ medical students</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Master Your Medical Exams with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of medical students who ace their boards with our curated 
            high-yield questions, realistic simulations, and personalized analytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="/signup" 
              className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features" 
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-12">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Dashboard Preview Placeholder */}
          <div className="relative mx-auto max-w-5xl">
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b border-gray-200">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <img 
                src="https://via.placeholder.com/1000x600/f8fafc/e2e8f0?text=MedQBank+Dashboard+Preview" 
                alt="MedQBank Dashboard Preview" 
                className="w-full h-auto"
              />
            </div>
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-50 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
