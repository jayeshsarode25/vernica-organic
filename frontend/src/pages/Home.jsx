import React from "react";

import ProductShow from "../components/products/ProductShow";
import ProductShowcase from "../components/products/ProductShowcase";
import TestimonialSection from "../components/TestimonialSection";
import ProductSell from "../components/products/ProductSell";
import DamiSell from "../components/products/DamiSell";
import Footer from "./Footer";
import HeaderBar from "../components/HeaderBar";
import CategorySection from "../components/Categorysection";

const Home = () => {
  return (
    <div className="h-full ">
      <HeaderBar />
      <ProductShow />
      <CategorySection />
      <ProductShowcase />
      <TestimonialSection />
      <ProductSell />
      <DamiSell />
      <Footer />
    </div>
  );
};

export default Home;
