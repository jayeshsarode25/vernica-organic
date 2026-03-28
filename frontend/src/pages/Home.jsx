import ProductShow from "../components/products/ProductShow";
import ProductShowcase from "../components/products/ProductShowcase";
import TestimonialSection from "../components/TestimonialSection";
import ProductSell from "../components/products/ProductSell";
import DamiSell from "../components/products/DamiSell";
import Footer from "./Footer";
import HeaderBar from "../components/HeaderBar";
import CategorySection from "../components/Categorysection";
import ErrorBoundary from "../components/Errorboundary"; 
import SearchResults from "../components/SearchResults";

const Home = () => {
  return (
    <div className="h-full">
      <SearchResults />

      {/* HeaderBar — no data fetch, low risk but wrap anyway */}
      <ErrorBoundary title="Header failed to load">
        <HeaderBar />
      </ErrorBoundary>

      {/* ProductShow — hero/banner section */}
      <ErrorBoundary title="Banner failed to load">
        <ProductShow />
      </ErrorBoundary>

      {/* CategorySection — fetches categories from Redux */}
      <ErrorBoundary
        title="Categories failed to load"
        message="We couldn't load the categories. Please refresh the page."
      >
        <CategorySection />
      </ErrorBoundary>

      {/* ProductShowcase — fetches products from Redux */}
      <ErrorBoundary
        title="Products failed to load"
        message="We couldn't load the products. Please refresh the page."
      >
        <ProductShowcase />
      </ErrorBoundary>

      {/* TestimonialSection — static, low risk */}
      <ErrorBoundary title="Testimonials failed to load">
        <TestimonialSection />
      </ErrorBoundary>

      {/* ProductSell — fetches products */}
      <ErrorBoundary
        title="Featured products failed to load"
        message="We couldn't load featured products. Please refresh the page."
      >
        <ProductSell />
      </ErrorBoundary>

      {/* DamiSell — fetches products */}
      <ErrorBoundary
        title="Deals section failed to load"
        message="We couldn't load deals. Please refresh the page."
      >
        <DamiSell />
      </ErrorBoundary>

      {/* Footer — static, low risk */}
      <ErrorBoundary title="Footer failed to load">
        <Footer />
      </ErrorBoundary>

    </div>
  );
};

export default Home;