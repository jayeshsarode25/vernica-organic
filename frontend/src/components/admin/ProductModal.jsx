import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../../redux/reducer/productSlice";
import { fetchCategories } from "../../redux/reducer/Categoryslice";

const ProductModal = ({ onClose, existing }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(existing);

  const { categories, subCategories } = useSelector((state) => state.categories);

  const [form, setForm] = useState({
    title: existing?.title ?? "",
    description: existing?.description ?? "",
    amount: existing?.price?.amount ?? "",
    currency: existing?.price?.currency ?? "INR",
    stock: existing?.stock ?? "",
    categoryId: existing?.categoryId?._id ?? existing?.categoryId ?? "",
    subCategory: existing?.subCategory ?? "male",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const set = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.categoryId) {
      setError("Please select a category");
      return;
    }

    if (!form.subCategory) {
      setError("Please select a sub-category");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        const result = await dispatch(
          updateProduct({
            id: existing._id,
            data: {
              title: form.title,
              description: form.description,
              priceAmount: Number(form.amount),
              priceCurrency: form.currency,
              stock: Number(form.stock),
              categoryId: form.categoryId,
              subCategory: form.subCategory,
            },
          }),
        );

        if (updateProduct.rejected.match(result)) {
          throw new Error(result.payload?.message);
        }
      } else {
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("priceAmount", form.amount);
        formData.append("priceCurrency", form.currency);
        formData.append("stock", form.stock);
        formData.append("categoryId", form.categoryId);
        formData.append("subCategory", form.subCategory);
        images.forEach((image) => formData.append("imagesUrls", image));
        if (video) formData.append("videoUrl", video);

        const result = await dispatch(createProduct(formData));
        if (createProduct.rejected.match(result)) {
          throw new Error(result.payload?.message);
        }
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            type="button"
          >
            x
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={set("title")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="e.g. Vitamin C Serum"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={set("description")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
              placeholder="Product description..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Category *
            </label>
            <select
              required
              value={form.categoryId}
              onChange={set("categoryId")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Sub-category *
            </label>
            <select
              required
              value={form.subCategory}
              onChange={set("subCategory")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              {Array.isArray(subCategories) &&
                subCategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Price *
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.amount}
                onChange={set("amount")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="799"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={set("currency")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option>INR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Stock *
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={set("stock")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="10"
            />
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Images (max 2)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setImages(Array.from(event.target.files).slice(0, 2))
                  }
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                />
                {images.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {images.length} image(s) selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Video (max 1)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setVideo(event.target.files[0] ?? null)}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100"
                />
                {video && <p className="text-xs text-gray-400 mt-1">{video.name}</p>}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
