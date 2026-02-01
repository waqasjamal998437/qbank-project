'use client';

import { BookOpen, BarChart, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: BookOpen,
    title: 'High-Yield Content',
    description: 'Curated questions covering all NBME shelf topics with detailed explanations from trusted medical references.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart,
    title: 'Exam-Like Interface',
    description: 'Practice with our realistic interface that mimics actual exam conditions for the best preparation experience.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description: 'Track your progress with detailed performance insights and identify weak areas for focused study.',
    color: 'from-orange-500 to-red-500',
  },
];

export default function Benefits() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600">
            Our comprehensive platform provides all the tools medical students need to excel in their exams.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
