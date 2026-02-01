'use client';

import { Star, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    university: 'Johns Hopkins University',
    year: 'MS3',
    image: 'https://i.pravatar.cc/150?img=1',
    quote: 'MedQBank was instrumental in helping me score in the 95th percentile on my shelf exams. The explanations are incredibly detailed and the analytics helped me identify exactly where to focus my study time.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    university: 'Stanford University',
    year: 'MS4',
    image: 'https://i.pravatar.cc/150?img=3',
    quote: 'The mock exams felt exactly like the real thing. I went into my Step 1 feeling completely prepared, and the results reflected that confidence. Best investment I made in my medical education.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    university: 'UCLA David Geffen School of Medicine',
    year: 'MS2',
    image: 'https://i.pravatar.cc/150?img=5',
    quote: 'As a non-traditional student, I was worried about keeping up with my peers. MedQBank gave me the structure and content I needed to not only catch up but exceed expectations.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by Medical Students
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied students who have transformed their exam preparation.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {testimonial.university} • {testimonial.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
