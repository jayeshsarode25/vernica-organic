import React from "react";

const ProductSell = () => {
  return (
    <div className="grid grid-cols-1 px-5 gap-5 lg:grid-cols-2 lg:px-16 lg:py-4">
      <div className="flex flex-col gap-5">
        <section className="w-full px-6 py-8  rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-black">
            Discover the Power of Nature with VarNika
          </h2>
          <p className="font-light text-base leading-tight pt-2">
            To be recognized globally as the most trusted herbal brand, blending
            natural purity with a luxurious experience
          </p>
        </section>

        <section className="w-full h-96 rounded-lg overflow-hidden bg-emerald-100">
          <div className="w-full h-full relative">
            <img
              className="w-full h-full object-cover"
              src="https://i.pinimg.com/1200x/53/ee/ff/53eeff14b73ee7c47a436472108cd776.jpg"
              alt="Best Selling Products"
            />

            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent" />

            <h1 className="absolute top-6 left-6 text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              Our Best
              <br /> Selling Products
            </h1>
          </div>
        </section>
      </div>

      <section className="w-full h-96 lg:h-full rounded-lg overflow-hidden bg-emerald-100">
        <div className="w-full h-full relative ">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/1200x/93/4c/cc/934ccc9fe09ab36629538fd1797a4aa4.jpg"
            alt="Featured Product"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent">
            <h1 className="absolute bottom-20 text-white left-5 text-2xl sm:text-3xl font-bold ">
              Buy Our Full Kit
            </h1>
            <button className="absolute bottom-18 right-15 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductSell;
