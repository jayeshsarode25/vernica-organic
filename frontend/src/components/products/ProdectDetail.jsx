import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { featchProductById, featchProducts } from "../../redux/reducer/productSlice";
import { addToCart, updateCartItem } from "../../redux/reducer/cartSlice";

const ProductCart = lazy(() => import("./ProductCart"));
const TestimonialSection = lazy(() => import("../TestimonialSection"));
const Footer = lazy(() => import("../../pages/Footer"));

const BelowFoldFallback = () => (
  <div className="mx-auto my-8 h-32 max-w-3xl animate-pulse rounded-lg bg-gray-100" />
);

const getDetailSections = (product) =>
  [
    { title: "Benefits", content: product.productDetails?.benefits },
    { title: "How to use", content: product.productDetails?.howToUse },
    { title: "Ingredients", content: product.productDetails?.ingredients },
    { title: "Warning and caution", content: product.productDetails?.warningCaution },
  ].filter((section) => section.content?.trim());

const formatPrice = (price) => {
  if (!price?.amount) return "-";
  const amount = price.amount.toLocaleString("en-IN");
  return price.currency === "USD" ? `USD ${amount}` : `Rs. ${amount}`;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { single, list: products } = useSelector((state) => state.products);
  const items = useSelector((state) => state.cart?.items || []);
  const addingIds = useSelector((state) => state.cart?.addingIds || []);

  const [qty, setQty] = useState(1);
  const [actionError, setActionError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    dispatch(featchProductById(id));
  }, [dispatch, id]);

  const categoryId = single?.categoryId?._id ?? single?.categoryId;

  useEffect(() => {
    if (!categoryId) return;
    dispatch(featchProducts({ categoryId, limit: 5 }));
  }, [categoryId, dispatch]);

  const gallery = single
    ? [
        ...(single.images || []).map((img) => ({
          type: "image",
          url: img.url,
          thumb: img.thumbnail || img.url,
        })),
        ...(single.video?.url
          ? [{ type: "video", url: single.video.url, thumb: single.video.thumbnail }]
          : []),
      ]
    : [];

  const activeItem = gallery[activeIndex];

  useEffect(() => {
    if (activeItem?.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex, activeItem]);

  if (!single || single._id !== id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  const cartItem = items.find(
    (item) =>
      (item.productId?._id?.toString() || item.productId?.toString()) ===
      single?._id?.toString()
  );
  const isInCart = Boolean(cartItem);
  const isAdding = addingIds.includes(single._id);
  const maxQty = single.stock > 0 ? single.stock : 1;

  const handleGoBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/product");
  };

  const handleAddToCart = async () => {
    if (isInCart) return;
    setActionError("");
    try {
      await dispatch(addToCart({ productId: single._id, qty })).unwrap();
    } catch (error) {
      setActionError(error?.message ?? "Unable to add this product to cart");
    }
  };

  const handleBuyNow = async () => {
    setActionError("");
    try {
      if (isInCart) {
        await dispatch(updateCartItem({ productId: single._id, qty })).unwrap();
      } else {
        await dispatch(addToCart({ productId: single._id, qty })).unwrap();
      }
      navigate("/checkout");
    } catch (error) {
      setActionError(error?.message ?? "Unable to continue to checkout");
    }
  };

  const categoryName = single.categoryId?.name;
  const subCategoryLabel = single.subCategory
    ? single.subCategory.charAt(0).toUpperCase() + single.subCategory.slice(1)
    : null;
  const detailSections = getDetailSections(single);
  const suggestedProducts = products
    .filter((product) => product._id !== single._id)
    .slice(0, 4);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <button
          onClick={handleGoBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900"
          type="button"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Go back
        </button>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
              {activeItem?.type === "image" && (
                <img
                  src={activeItem.url}
                  alt={single.title}
                  className="w-full h-full object-contain p-6 transition-opacity duration-300"
                  style={{ animation: "fadeIn 0.3s ease" }}
                />
              )}

              {activeItem?.type === "video" && (
                <video
                  ref={videoRef}
                  src={activeItem.url}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover rounded-3xl"
                  style={{ animation: "fadeIn 0.3s ease" }}
                />
              )}

              {!activeItem && (
                <div className="text-sm text-gray-400">No media available</div>
              )}

              {gallery.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
                  {activeIndex + 1} / {gallery.length}
                </div>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-2.5 flex-wrap">
                {gallery.map((item, index) => (
                  <button
                    key={`${item.type}-${item.url}`}
                    onClick={() => setActiveIndex(index)}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-200 flex-shrink-0 ${
                      activeIndex === index
                        ? "ring-2 ring-gray-900 ring-offset-2 scale-105"
                        : "ring-1 ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100"
                    }`}
                    style={{ width: 72, height: 72 }}
                    type="button"
                  >
                    {item.thumb ? (
                      <img
                        src={item.thumb}
                        alt=""
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    {item.type === "video" && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                          <span className="text-xs font-bold text-gray-900 ml-0.5">&gt;</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-0 pt-2">
            {(categoryName || subCategoryLabel) && (
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-green-500 mb-3">
                {[categoryName, subCategoryLabel].filter(Boolean).join(" / ")}
              </span>
            )}

            <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              {single.title}
            </h1>

            {single.tagline && (
              <p className="text-base text-green-700 font-medium mt-3">
                {single.tagline}
              </p>
            )}

            {single.description && (
              <p className="mt-6 text-gray-500 text-[15px] leading-relaxed">
                {single.description}
              </p>
            )}

            <div className="flex items-baseline gap-3 mt-5">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(single.price)}
              </span>
              {single.price?.mrp && single.price.mrp > single.price.amount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice({ ...single.price, amount: single.price.mrp })}
                  </span>
                  <span className="text-sm font-semibold text-green-500">
                    {Math.round((1 - single.price.amount / single.price.mrp) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {single.size && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-400 tracking-[0.14em] uppercase">
                  Size
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {single.size}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 my-6" />

            <div className="flex flex-col gap-2.5">
              <p className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                Quantity
              </p>
              <div className="flex items-center w-fit border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-light disabled:opacity-40"
                  type="button"
                  disabled={single.stock === 0}
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-semibold text-gray-900 border-x border-gray-200 h-11 flex items-center justify-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((current) => Math.min(current + 1, maxQty))}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-light disabled:opacity-40"
                  type="button"
                  disabled={single.stock === 0 || qty >= maxQty}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={isInCart || isAdding || single.stock === 0}
                className={`w-full py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isInCart || single.stock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]"
                }`}
                type="button"
              >
                {single.stock === 0
                  ? "Out of Stock"
                  : isAdding
                  ? "Adding..."
                  : isInCart
                  ? "Already in Cart"
                  : "Add to Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isAdding || single.stock === 0}
                className="w-full border border-gray-900 py-4 rounded-2xl text-sm font-semibold tracking-wide text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-white"
                type="button"
              >
                {isAdding ? "Preparing..." : "Buy it now"}
              </button>
            </div>

            {actionError && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {actionError}
              </p>
            )}

            <div className="flex items-center gap-2 mt-5 mb-6">
              <div
                className={`w-2 h-2 rounded-full ${
                  single.stock > 10
                    ? "bg-green-400"
                    : single.stock > 0
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
              />
              <p className="text-xs text-gray-400">
                {single.stock > 10
                  ? "In stock"
                  : single.stock > 0
                  ? `Only ${single.stock} left`
                  : "Out of stock"}
              </p>
            </div>

          </div>
        </div>

        {detailSections.length > 0 && (
          <section className="mt-14 border-y border-gray-100">
            <div className="divide-y divide-gray-100">
              {detailSections.map((section, index) => (
                <details key={section.title} className="group py-5" open={index === 0}>
                  <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-gray-900">
                    <span>{section.title}</span>
                    <span className="text-xl font-light text-gray-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pt-4 text-sm leading-6 text-gray-500 whitespace-pre-line">
                    {section.content}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {suggestedProducts.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-green-500">
                  Suggested products
                </p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  You may also like
                </h2>
              </div>
            </div>

            <Suspense fallback={<BelowFoldFallback />}>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {suggestedProducts.map((product) => (
                  <ProductCart key={product._id} product={product} />
                ))}
              </div>
            </Suspense>
          </section>
        )}
      </div>

      <Suspense fallback={<BelowFoldFallback />}>
        <TestimonialSection />
        <Footer />
      </Suspense>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ProductDetail;
