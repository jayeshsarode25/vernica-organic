import { lazy, Suspense } from "react";
import ProductShow from "../components/products/ProductShow";
import HeaderBar from "../components/HeaderBar";
import ErrorBoundary from "../components/Errorboundary"; 

const CategorySection = lazy(() => import("../components/Categorysection"));
const ProductShowcase = lazy(() => import("../components/products/ProductShowcase"));
const TestimonialSection = lazy(() => import("../components/TestimonialSection"));
const ProductSell = lazy(() => import("../components/products/ProductSell"));
const DamiSell = lazy(() => import("../components/products/DamiSell"));
const Footer = lazy(() => import("./Footer"));

const SectionFallback = () => (
  <div className="mx-auto my-8 h-40 max-w-7xl animate-pulse rounded-lg bg-gray-100" />
);

const LazySection = ({ children }) => (
  <Suspense fallback={<SectionFallback />}>{children}</Suspense>
);

const Home = () => {
  return (
    <div className="h-full">
      

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
        <LazySection>
          <CategorySection />
        </LazySection>
      </ErrorBoundary>

      {/* ProductShowcase — fetches products from Redux */}
      <ErrorBoundary
        title="Products failed to load"
        message="We couldn't load the products. Please refresh the page."
      >
        <LazySection>
          <ProductShowcase />
        </LazySection>
      </ErrorBoundary>

      {/* TestimonialSection — static, low risk */}
      <ErrorBoundary title="Testimonials failed to load">
        <LazySection>
          <TestimonialSection />
        </LazySection>
      </ErrorBoundary>

      {/* ProductSell — fetches products */}
      <ErrorBoundary
        title="Featured products failed to load"
        message="We couldn't load featured products. Please refresh the page."
      >
        <LazySection>
          <ProductSell />
        </LazySection>
      </ErrorBoundary>

      {/* DamiSell — fetches products */}
      <ErrorBoundary
        title="Deals section failed to load"
        message="We couldn't load deals. Please refresh the page."
      >
        <LazySection>
          <DamiSell />
        </LazySection>
      </ErrorBoundary>

      {/* Footer — static, low risk */}
      <ErrorBoundary title="Footer failed to load">
        <LazySection>
          <Footer />
        </LazySection>
      </ErrorBoundary>

    </div>
  );
};

export default Home;
