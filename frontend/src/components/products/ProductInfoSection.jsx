const ProductInfoSection = ({ product }) => {
  const detailSections = [
    { title: "Benefits", content: product?.productDetails?.benefits },
    { title: "How to use", content: product?.productDetails?.howToUse },
    { title: "Ingredients", content: product?.productDetails?.ingredients },
    { title: "Warning and caution", content: product?.productDetails?.warningCaution },
  ].filter((section) => section.content?.trim());

  if (detailSections.length === 0) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 pb-12">
      <div className="divide-y divide-gray-100 border-y border-gray-100">
        {detailSections.map((section) => (
          <details key={section.title} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-gray-900">
              {section.title}
              <span className="text-xl font-light text-gray-400 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="pb-4 text-sm leading-6 text-gray-500 whitespace-pre-line">
              {section.content}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default ProductInfoSection;
