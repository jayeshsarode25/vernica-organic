import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { featchProductById } from "../../redux/reducer/productSlice";
import ProductInfoSection from "./ProductInfoSection";
import TestimonialSection from "../TestimonialSection";
import Footer from "../../pages/Footer";
import { addToCart } from "../../redux/reducer/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { single, loading } = useSelector((s) => s.products);
  const items = useSelector((state) => state.cart?.items || []);

  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    dispatch(featchProductById(id));
  }, [id]);

  // ✅ Build gallery BEFORE the useEffect that uses activeItem
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

  // ✅ activeItem defined before the useEffect that references it
  const activeItem = gallery[activeIndex];

  // ✅ Now safe to use activeItem here
  useEffect(() => {
    if (activeItem?.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeIndex, activeItem]);

  if (loading || !single)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );

  const isInCart = items.some(
    (item) =>
      (item.productId?._id?.toString() || item.productId?.toString()) ===
      single?._id?.toString()
  );

  const handleAddToCart = () => {
    if (isInCart) return;
    dispatch(addToCart({ productId: single._id, qty }));
  };

  const categoryName = single.categoryId?.name;
  const subCategoryLabel = single.subCategory
    ? single.subCategory.charAt(0).toUpperCase() + single.subCategory.slice(1)
    : null;

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: Gallery ─────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Main viewer */}
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden aspect-square flex items-center justify-center">
              {activeItem?.type === "image" ? (
                <img
                  src={activeItem.url}
                  alt={single.title}
                  className="w-full h-full object-contain p-6 transition-opacity duration-300"
                  style={{ animation: "fadeIn 0.3s ease" }}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={activeItem?.url}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover rounded-3xl"
                  style={{ animation: "fadeIn 0.3s ease" }}
                />
              )}

              {/* Counter badge */}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-xs font-semibold text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
                {activeIndex + 1} / {gallery.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 flex-wrap">
              {gallery.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-200 flex-shrink-0
                    ${activeIndex === i
                      ? "ring-2 ring-gray-900 ring-offset-2 scale-105"
                      : "ring-1 ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100"
                    }`}
                  style={{ width: 72, height: 72 }}
                >
                  <img src={item.thumb} alt="" className="w-full h-full object-cover" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ────────────────────── */}
          <div className="flex flex-col gap-0 pt-2">

            {(categoryName || subCategoryLabel) && (
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-green-500 mb-3">
                {[categoryName, subCategoryLabel].filter(Boolean).join(" / ")}
              </span>
            )}

            <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              {single.title}
            </h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{single.price.amount.toLocaleString("en-IN")}
              </span>
              {single.price.mrp && single.price.mrp > single.price.amount && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{single.price.mrp.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-semibold text-green-500">
                    {Math.round((1 - single.price.amount / single.price.mrp) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-gray-100 my-6" />

            <p className="text-gray-500 text-[15px] leading-relaxed">
              {single.description}
            </p>

            <div className="border-t border-gray-100 my-6" />

            {/* Quantity */}
            <div className="flex flex-col gap-2.5">
              <p className="text-sm font-semibold text-gray-900 tracking-wide uppercase">
                Quantity
              </p>
              <div className="flex items-center w-fit border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-light"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold text-gray-900 border-x border-gray-200 h-11 flex items-center justify-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg font-light"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-full py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200
                  ${isInCart
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]"
                  }`}
              >
                {isInCart ? "✓  Already in Cart" : "Add to Cart"}
              </button>

              <button className="w-full border border-gray-900 py-4 rounded-2xl text-sm font-semibold tracking-wide text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-200 active:scale-[0.98]">
                Buy it now
              </button>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mt-5">
              <div className={`w-2 h-2 rounded-full ${
                single.stock > 10 ? "bg-green-400" : single.stock > 0 ? "bg-amber-400" : "bg-red-400"
              }`} />
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
      </div>

      <ProductInfoSection product={single} />
      <TestimonialSection />
      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ProductDetail;
