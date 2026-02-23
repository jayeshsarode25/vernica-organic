const ProductInfoSection = ({ product }) => {
  const benefits = [
    "Removes dead skin cells & impurities",
    "Evens out skin tone & reduces dullness",
    "Hydrates & nourishes for a soft, smooth texture",
    "Soothes and calms sensitive skin",
    "Promotes a radiant, refreshed complexion",
  ];

  const howToUse =
    "Apply to a clean face using a cotton pad, avoiding eye area. Use once daily or as directed. Follow with moisturizer and sunscreen during the day.";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-semibold text-pink-700 mb-6">
        {product.title}
      </h1>

      <h2 className="font-semibold text-lg mb-2">Description:</h2>
      <p className="text-gray-700 mb-8 leading-relaxed">
        {product.description}
      </p>

      <h2 className="font-semibold text-lg mb-4">Benefits:</h2>
      <ul className="space-y-3 mb-10">
        {benefits.map((item, i) => (
          <li key={i} className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold text-lg mb-2 text-pink-700">How to Use:</h2>
      <p className="text-gray-700 leading-relaxed">{howToUse}</p>
    </div>
  );
};

export default ProductInfoSection;
