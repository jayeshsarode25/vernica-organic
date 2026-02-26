import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { featchProductById } from "../../redux/reducer/productSlice";
import ProductInfoSection from "./ProductInfoSection";
import TestimonialSection from "../TestimonialSection";
import Footer from "../../pages/Footer";
import { addToCart } from "../../redux/reducer/cartSlice";

const ProdectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { single, loading } = useSelector((s) => s.products);

  const [qty, setQty] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    dispatch(featchProductById(id));
  }, [id]);

  if (loading || !single)
    return <p className="text-center mt-20">Loading...</p>;

  const gallery = [
    ...(single.images || []).map((img) => ({
      type: "image",
      url: img.url,
      thumb: img.thumbnail || img.url,
    })),
    ...(single.video?.url
      ? [
          {
            type: "video",
            url: single.video.url,
            thumb: single.video.thumbnail,
          },
        ]
      : []),
  ];

  const activeItem = gallery[activeIndex];

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-100 rounded-2xl p-6 flex justify-center items-center">
            {activeItem?.type === "image" ? (
              <img src={activeItem.url} className="h-[450px] object-contain" />
            ) : (
              <video
                src={activeItem.url}
                controls
                className="h-[450px] rounded-xl"
              />
            )}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            {gallery.map((item, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative cursor-pointer border rounded-lg overflow-hidden
                ${activeIndex === i ? "border-black" : "border-gray-300"}
              `}
              >
                <img src={item.thumb} className="w-20 h-20 object-cover" />

                {item.type === "video" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg">
                    ▶
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold">{single.title}</h1>

          <p className="text-2xl font-semibold mt-4">₹{single.price.amount}</p>

          <p className="text-gray-600 mt-6">{single.description}</p>

          <div className="mt-8">
            <p className="font-medium mb-2">Quantity</p>

            <div className="flex items-center border rounded-lg w-44 justify-between px-4 py-2">
              <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button 
            onClick={() => {
              console.log("Adding to cart:", single._id);
              dispatch(addToCart({productId: single._id, qty}))}}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold">
              Add to Cart
            </button>

            <button className="w-full border py-4 rounded-xl font-semibold">
              Buy it now
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500">Stock: {single.stock}</p>
        </div>
      </div>

      <ProductInfoSection product={single} />

      <TestimonialSection />

      <Footer />
    </>
  );
};

export default ProdectDetail;
