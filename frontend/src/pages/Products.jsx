import { useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import CategorySidebar from "../components/categories/CategorySidebar";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
      {/* Sidebar */}
      <div>
        <CategorySidebar
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          onSubCategorySelect={setSelectedSubCategory}
        />
      </div>

      {/* Main content */}
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>
        <ProductGrid
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
        />
      </div>
    </div>
  );
};

export default Products;
