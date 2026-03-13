import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  featchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/reducer/productSlice";

/* ─── Add / Edit Modal ─────────────────────────────────────────── */
const ProductModal = ({ onClose, existing }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(existing);

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    amount: existing?.price?.amount ?? "",
    currency: existing?.price?.currency ?? "INR",
    stock: existing?.stock ?? "",
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        const result = await dispatch(
          updateProduct({
            id: existing._id,
            data: {
              title: form.title,
              description: form.description,
              price: { amount: Number(form.amount), currency: form.currency },
              stock: Number(form.stock),
            },
          }),
        );
        if (updateProduct.rejected.match(result))
          throw new Error(result.payload?.message);
      } else {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("price[amount]", form.amount);
        fd.append("price[currency]", form.currency);
        fd.append("stock", form.stock);
        images.forEach((img) => fd.append("imagesUrls", img));
        if (video) fd.append("videoUrl", video);
        const result = await dispatch(createProduct(fd));
        if (createProduct.rejected.match(result))
          throw new Error(result.payload?.message);
      }
      onClose();
    } catch (err) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input required value={form.title} onChange={set("title")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="e.g. Vitamin C Serum" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
            <textarea required rows={3} value={form.description} onChange={set("description")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
              placeholder="Product description..." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
              <input required type="number" min="0" value={form.amount} onChange={set("amount")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="799" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
              <select value={form.currency} onChange={set("currency")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400">
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
            <input required type="number" min="0" value={form.stock} onChange={set("stock")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="10" />
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Images (max 2)</label>
                <input type="file" accept="image/*" multiple
                  onChange={(e) => setImages(Array.from(e.target.files).slice(0, 2))}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
                {images.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{images.length} image(s) selected</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Video (max 1)</label>
                <input type="file" accept="video/*"
                  onChange={(e) => setVideo(e.target.files[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100" />
                {video && <p className="text-xs text-gray-400 mt-1">{video.name}</p>}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Page ────────────────────────────────────────────────── */
const AdminProducts = () => {
  const dispatch = useDispatch();
  // ✅ reading from Redux store — no local state for products
  const { items: products, loading, error } = useSelector((state) => state.admin);
  const [modal, setModal] = useState(null); // null | "add" | product object
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(featchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeletingId(id);
    await dispatch(deleteProduct(id));
    setDeletingId(null);
  };

  if (loading)
    return <div className="text-sm text-gray-400 mt-10 text-center">Loading products...</div>;

  if (error)
    return (
      <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
        {error}
      </div>
    );

  return (
    <div>
      {modal && (
        <ProductModal existing={modal === "add" ? null : modal} onClose={() => setModal(null)} />
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={() => setModal("add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <span className="text-lg leading-none">+</span> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Price</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Stock</th>
              <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Media</th>
              <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">No products found</td>
              </tr>
            )}
            {products.map((product) => {
              const isDeleting = deletingId === product._id;
              const firstImage = product.images?.[0]?.url;
              return (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {firstImage ? (
                        <img src={firstImage} alt={product.title}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">?</div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{product.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">
                    {product.price?.currency === "INR" ? "₹" : product.price?.currency}{" "}
                    {product.price?.amount ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400">
                    <span className="mr-3">🖼 {product.images?.length ?? 0} img</span>
                    <span>{product.video?.url ? "🎥 1 vid" : "—"}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button disabled={isDeleting} onClick={() => setModal(product)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50">
                        Edit
                      </button>
                      <button disabled={isDeleting} onClick={() => handleDelete(product._id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50">
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