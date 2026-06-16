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
    tagline: existing?.tagline ?? "",
    description: existing?.description ?? "",
    amount: existing?.price?.amount ?? "",
    currency: existing?.price?.currency ?? "INR",
    stock: existing?.stock ?? "",
    size: existing?.size ?? "",
    categoryId: existing?.categoryId?._id ?? existing?.categoryId ?? "",
    subCategory: existing?.subCategory ?? "unisex",
    benefits: existing?.productDetails?.benefits ?? "",
    howToUse: existing?.productDetails?.howToUse ?? "",
    ingredients: existing?.productDetails?.ingredients ?? "",
    warningCaution: existing?.productDetails?.warningCaution ?? "",
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

  const buildProductPayload = () => ({
    title: form.title.trim(),
    tagline: form.tagline.trim(),
    description: form.description.trim(),
    priceAmount: Number(form.amount),
    priceCurrency: form.currency,
    stock: Number(form.stock),
    size: form.size.trim(),
    categoryId: form.categoryId,
    subCategory: form.subCategory,
    benefits: form.benefits.trim(),
    howToUse: form.howToUse.trim(),
    ingredients: form.ingredients.trim(),
    warningCaution: form.warningCaution.trim(),
  });

  const buildProductFormData = () => {
    const payload = buildProductPayload();
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    images.forEach((image) => formData.append("imagesUrls", image));
    if (video) formData.append("videoUrl", video);

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Please enter a product title");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a product description");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category");
      return;
    }

    if (!form.subCategory) {
      setError("Please select a sub-category");
      return;
    }

    const priceAmount = Number(form.amount);
    if (!Number.isFinite(priceAmount) || priceAmount <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a whole number 0 or greater");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        const result = await dispatch(
          updateProduct({
            id: existing._id,
            data: buildProductPayload(),
          }),
        );

        if (updateProduct.rejected.match(result)) {
          throw new Error(result.payload?.message);
        }
      } else {
        const result = await dispatch(createProduct(buildProductFormData()));
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              Tagline
            </label>
            <input
              value={form.tagline}
              onChange={set("tagline")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              placeholder="e.g. Glow naturally, every day"
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

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
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

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Size
              </label>
              <input
                value={form.size}
                onChange={set("size")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                placeholder="e.g. 100 ml"
              />
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
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Benefits
              </label>
              <textarea
                rows={4}
                value={form.benefits}
                onChange={set("benefits")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="Key benefits..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                How to use
              </label>
              <textarea
                rows={4}
                value={form.howToUse}
                onChange={set("howToUse")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="Usage directions..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Ingredients
              </label>
              <textarea
                rows={4}
                value={form.ingredients}
                onChange={set("ingredients")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="Ingredients list..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Warning and caution
              </label>
              <textarea
                rows={4}
                value={form.warningCaution}
                onChange={set("warningCaution")}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="Warnings or cautions..."
              />
            </div>
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
