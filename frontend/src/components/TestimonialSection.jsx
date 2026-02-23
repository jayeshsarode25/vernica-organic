import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      text: "My buying experience is so nice, and received me very politely. Riding experience is also very good. Very good performance. I never experienced such a kind of performance. Very good service.",
      author: "Karan",
      timeAgo: "1 week ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5
    },
    {
      id: 2,
      text: "I love my e-bike and the customer service is excellent. They respond in a timely manner with loads of information about e-bikes, accessories and maintenance information.",
      author: "Catherine",
      timeAgo: "10 days ago",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 4
    },
    {
      id: 3,
      text: "Visited to EO store. Product is particularly welds, looked at my wife and I took small test ride in parking lot area. We bought the bike with customization after we went over all the options. Very satisfied.",
      author: "Peter",
      timeAgo: "2 weeks ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 5
    },
    {
      id: 4,
      text: "Amazing product quality and the delivery was super fast. The team was very helpful in answering all my questions. Highly recommend!",
      author: "Sarah",
      timeAgo: "3 weeks ago",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      rating: 4
    },
    {
      id: 5,
      text: "Best investment I've made this year. The bike performs excellently and customer support is top-notch. Will definitely buy again!",
      author: "Michael",
      timeAgo: "1 month ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 5
    },
    {
      id: 5,
      text: "Best investment I've made this year. The bike performs excellently and customer support is top-notch. Will definitely buy again!",
      author: "Michael",
      timeAgo: "1 month ago",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 4
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, testimonials.length - getVisibleCards()));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getVisibleCards = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg 
      if (window.innerWidth >= 768) return 2;  // md 
      return 1;
    }
    return 3;
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Read reviews,
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            ride with confidence.
          </h2>
          
          
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-gray-900">4.2/5</span>
              <Star className="w-8 h-8 fill-green-500 text-green-500" />
              <span className="text-xl font-bold text-gray-900">Trustpilot</span>
            </div>
            <span className="text-gray-600">Based on 2210 reviews</span>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1 flex lg:flex-col items-center lg:items-start gap-8">
            <div className="text-gray-300 hidden lg:block">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="currentColor">
                <path d="M0 60h30V30C30 13.5 16.5 0 0 0v15c7.5 0 15 7.5 15 15v30zm45 0h30V30C75 13.5 61.5 0 45 0v15c7.5 0 15 7.5 15 15v30z"/>
              </svg>
            </div>

            
            <div className="text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                What our<br />customers are<br />saying
              </h3>
              
              
              <div className="flex items-center gap-4">
                <button
                  onClick={prevTestimonial}
                  disabled={currentIndex === 0}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                
                
                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gray-900 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / testimonials.length) * 100}%` }}
                  />
                </div>
                
                <button
                  onClick={nextTestimonial}
                  disabled={currentIndex >= testimonials.length - getVisibleCards()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-3 overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / getVisibleCards())}%)`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>

        
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 h-full">
      <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
        {testimonial.text}
      </p>


      <div className="flex gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
        ))}
      </div>

      
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-900">{testimonial.author}</p>
          <p className="text-sm text-gray-500">{testimonial.timeAgo}</p>
        </div>
      </div>
    </div>
  );
}