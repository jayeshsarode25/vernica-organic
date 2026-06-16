import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  featchProducts,
} from "../../redux/reducer/productSlice";
import { fetchCategories } from "../../redux/reducer/Categoryslice";

const ProductModal = lazy(() => import("../../components/admin/ProductModal"));

const AdminProducts = () => {
  const dispatch = useDispatch();

  const { list: products, loading, error } = useSelector(
    (state) => state.products,
  );
  const { subCategories } = useSelector((state) => state.categories);

  const [modal, setModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(featchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeletingId(id);
    await dispatch(deleteProduct(id));
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="text-sm text-gray-400 mt-10 text-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      {modal && (
        <Suspense fallback={null}>
          <ProductModal
            existing={modal === "add" ? null : modal}
            onClose={() => setModal(null)}
          />
        </Suspense>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} total products
          </p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          type="button"
        >
          <span className="text-lg leading-none">+</span> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Product
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Sub-category
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Price
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Stock
              </th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Media
              </th>
              <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No products found
                </td>
              </tr>
            )}

            {products.map((product) => {
              const isDeleting = deletingId === product._id;
              const firstImage = product.images?.[0]?.url;
              const categoryName = product.categoryId?.name ?? "-";
              const subCategoryName =
                subCategories?.find((sub) => sub.slug === product.subCategory)
                  ?.name ??
                product.subCategory ??
                "-";

              return (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={product.title}
                          loading="lazy"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                          ?
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 capitalize">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {product.tagline || product.description}
                        </p>
                        {product.size && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Size: {product.size}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {categoryName}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 capitalize">
                      {subCategoryName}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-gray-700 font-medium">
                    {product.price?.currency === "INR"
                      ? "Rs."
                      : product.price?.currency}{" "}
                    {product.price?.amount ?? "-"}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    <span className="mr-3">
                      {product.images?.length ?? 0} img
                    </span>
                    <span>{product.video?.url ? "1 vid" : "-"}</span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={isDeleting}
                        onClick={() => setModal(product)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDelete(product._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        type="button"
                      >
                        {isDeleting ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
