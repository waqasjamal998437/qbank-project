'use client';

import { Check, Star } from 'lucide-react';
import Link from 'next/link';

const pricingPlans = [
  {
    name: 'Standard',
    price: '$99',
    period: '/year',
    description: 'Perfect for preclinical students getting started',
    features: [
      'Access to 5,000+ questions',
      'Basic performance analytics',
      'Mobile app access',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/year',
    description: 'Best value for clinical students preparing for boards',
    features: [
      'Access to 15,000+ questions',
      'Advanced analytics & insights',
      'Priority support',
      'Mock exams & simulations',
      'Detailed explanations',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Student Life',
    price: '$599',
    period: '/lifetime',
    description: 'Complete access for the entire medical school journey',
    features: [
      'Unlimited question access',
      'Lifetime updates',
      'All future courses included',
      '1-on-1 tutoring sessions',
      'Priority support',
      'Mock exams & simulations',
    ],
    cta: 'Get Lifetime Access',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that fits your study needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 bg-white rounded-2xl transition-all duration-300 ${
                plan.popular 
                  ? 'shadow-2xl shadow-indigo-200/50 border-2 border-indigo-500 scale-105 z-10' 
                  : 'shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Best Value</span>
                  </div>
                </div>
              )}

              {/* Plan Name */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link 
                href="/signup"
                className={`block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
