import { ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const image = product.images?.[0]?.url;
  console.log(product);
  return (
    <div 
    onClick={()=> navigate(`/product/${product._id}`)}
    className="border rounded-xl p-3 shadow-sm hover:shadow-md transition">
      <Link to={`/product/${product._id}`}>
        <img
          src={image || "/placeholder.png"}
          alt={product.title}
          className="w-full h-52 object-cover rounded-lg"
        />
      </Link>

      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description || "No description"}
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">₹{product.price?.amount}</span>

            {product.stock > 0 ? (
              <span className="text-green-600 text-sm font-medium">
                In Stock
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">
                Out of Stock
              </span>
            )}
          </div>

          <button
            disabled={product.stock === 0}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
