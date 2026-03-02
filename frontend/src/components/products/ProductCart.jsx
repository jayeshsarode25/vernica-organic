import { ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/reducer/cartSlice";

const ProductCart = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const image = product.images?.[0]?.url;
  const items = useSelector((state) => state.cart.items);

 
  const isInCart = items.some(
    (item) =>
      (item.productId?._id?.toString() || item.productId?.toString()) ===
      product._id?.toString()
  );

  const handleAddToCart = () => {
    if (isInCart) return;
    dispatch(
      addToCart({
        productId: product._id,
        qty: 1,
      }),
    );
  };

  return (
    <div className="group border rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      <Link to={`/product/${product._id}`}>
        <img
          src={image || "/placeholder.png"}
          alt={product.title}
          className="w-full h-56 object-cover rounded-xl group-hover:scale-105 transition"
        />
      </Link>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>

        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description || "No description"}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-xl">₹{product.price?.amount}</span>

          {product.stock > 0 ? (
            <span className="text-green-600 text-sm font-medium">In Stock</span>
          ) : (
            <span className="text-red-500 text-sm font-medium">
              Out of Stock
            </span>
          )}
        </div>

        <button
          disabled={isInCart || product.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className={`w-full mt-3 py-3 rounded-xl font-semibold transition-all duration-200 ${
            isInCart
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-900 active:scale-95"
          }`}
        >
          {product.stock === 0
            ? "Out of Stock"
            : isInCart
              ? "Already in Cart"
              : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCart;