import React from 'react';

export default function MovingOffersBar() {
  const offers = [
    { icon: "🎉", text: "Get 50% OFF on all products - Limited time only!" },
    { icon: "🚚", text: "Free shipping on orders over 1500 INR india" },
    { icon: "⭐", text: "New customers get an extra 20% discount with code WELCOME15" },
    { icon: "⭐", text: "New Products get an extra 15% discount with code NEWLAUNCH20" }
  ];

  return (
    <div className="w-full bg-linear-to-r from-emerald-200 via-emerald-100 to-emerald-200 text-black overflow-hidden shadow-lg">
      <div className="flex animate-scroll hover:pause">
        {[...Array(4)].map((_, setIndex) => (
          <div key={setIndex} className="flex whitespace-nowrap">
            {offers.map((offer, index) => (
              <div key={`${setIndex}-${index}`} className="inline-flex items-center px-10 py-2 text-base font-medium tracking-wide">
                <span className="mr-3">{offer.icon}</span>
                <span>{offer.text}</span>
                <span className="mx-8 opacity-60">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .hover\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}