
import ProductGrid from "../components/products/ProductGrid";
import CategorySidebar from '../components/categories/CategorySidebar'

const Products = () => {


  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6">
      <div>
        <CategorySidebar />
      </div>
      <div className="lg:col-span-3">
        <h1>All Products</h1>
        <ProductGrid />
      </div>
    </div>
  )
};

export default Products;
