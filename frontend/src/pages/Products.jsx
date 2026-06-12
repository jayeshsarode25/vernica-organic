import { useState } from "react";
import ProductGrid from "../components/products/ProductGrid";
import CategorySidebar from "../components/categories/CategorySidebar";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory("All");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
      {/* Sidebar */}
      <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
        <CategorySidebar
          selected={selectedCategory}
          onSelect={handleCategorySelect}
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
