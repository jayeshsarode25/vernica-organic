import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { featchProducts } from "../../redux/reducer/productSlice";
import ProductCard from "./ProductCart";
import ProductLoader from "./ProductLoader";

const ProductGrid = () => {
  const dispatch = useDispatch();

  const q = useSelector((state) => state.search.query) || "";

  const {
    list = [],
    loading,
    error,
    pagination = {},
  } = useSelector((state) => state.products || {});

  const { skip = 0, limit = 10, total = 0 } = pagination;

  useEffect(() => {
    dispatch(featchProducts({ skip, limit }));
  }, [dispatch, skip, limit]);

  const filteredProducts = !q?.trim()
    ? list
    : list.filter((p) => p?.title?.toLowerCase().includes(q.toLowerCase()));

  if (loading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductLoader key={i} />
        ))}
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10 font-medium">{error}</p>
    );

  if (!list.length)
    return <p className="text-center mt-10 text-gray-500">No products found</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>

      <div className="flex justify-center items-center mt-12 gap-4">
        <button
          onClick={() =>
            dispatch(featchProducts({ skip: skip - limit, limit }))
          }
          disabled={skip === 0}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm text-gray-500">
          Page {Math.floor(skip / limit) + 1}
        </span>

        <button
          onClick={() =>
            dispatch(featchProducts({ skip: skip + limit, limit }))
          }
          disabled={skip + limit >= total}
          className="px-5 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ProductGrid;
