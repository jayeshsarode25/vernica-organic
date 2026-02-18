import React from "react";
import videoSrc from '../assets/video/varnika logo video.mp4';

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-950">
      <section className="px-4 py-12 sm:py-16 text-center">
        <h1 className="text-3xl font-normal sm:text-4xl md:text-5xl leading-tight mb-4">
          About <span className="text-emerald-700 font-bold">Varnika Organic</span>
        </h1>
        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#916845]">
          Organic skincare inspired by nature, crafted for healthy, glowing
          skin.
        </p>
      </section>

      
      <section className="px-4 py-12 max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
            We are committed to fusing the potent efficacy of pure natural
            botanicals with rigorous scientific formulation. Our products are
            meticulously designed to solve common concerns like pigmentation,
            dryness, and lack of luster, delivering visibly radiant, healthy
            results coupled with a truly luxurious and soft sensory experience
          </p>
        </div>

        <div className="h-48 sm:h-64 rounded-2xl overflow-hidden">
          <video
            className="w-full h-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </section>

      
      <section className="px-4 py-12 bg-white">
        <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
          <div className="p-6 sm:p-8 rounded-2xl bg-green-50 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">🌱 Our Mission</h3>
            <p className="text-gray-600 text-base sm:text-lg">
              To create organic skincare products that promote healthy skin,
              conscious beauty, and environmental responsibility.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-green-50 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">🌍 Our Vision</h3>
            <p className="text-gray-600 text-base sm:text-lg">
              A world where beauty is clean, transparent, cruelty-free, and
              deeply connected to nature.
            </p>
          </div>
        </div>
      </section>

      
      <section className="px-4 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Why Choose Varnika Organic?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "90% Organic & Natural Ingredients",
            "Cruelty-Free & Vegan",
            "No Parabens or Sulfates",
            "Natural and Safe for All Skin Types",
            "Eco-Friendly Packaging",
            "Nature-Backed Formulations",
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-white shadow-sm text-gray-700 text-center"
            >
              🌿 {item}
            </div>
          ))}
        </div>
      </section>

      
      <section className="px-4 py-14 bg-emerald-600 text-center">
        <h2 className="text-2xl sm:text-3xl font-light text-white mb-4">
          Experience Organic Beauty
        </h2>
        <p className="text-green-100 mb-6 text-base sm:text-lg">
          Gentle on your skin. Kind to the planet.
        </p>

        <button className="w-full sm:w-auto px-8 py-4 bg-white text-green-700 rounded-full font-medium hover:bg-green-100 transition">
          Explore Our Products
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
