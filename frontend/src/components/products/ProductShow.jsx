import { useState, useEffect } from 'react';

const ProductShow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://i.pinimg.com/1200x/84/b4/17/84b4170c663720656a2bea411cd67061.jpg",
    "https://i.pinimg.com/736x/e8/d8/3d/e8d83dc27cee4ae2f8d5fc1cd88b9d15.jpg",
    "https://i.pinimg.com/1200x/db/9d/90/db9d90ddb0e9aecaf48216b9e2b58661.jpg",
    "https://i.pinimg.com/1200x/4f/a1/34/4fa134f5e5316ca5755485ee82e7e80a.jpg"
  ];

  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className='w-full p-4 sm:p-10 md:px-14 md:py-10'>
      <div className='relative w-full h-56 sm:h-72 md:h-110 overflow-hidden rounded-lg group'>
       
        {images.map((image, index) => (
          <img
            key={index}
            className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            src={image}
            alt={`Product ${index + 1}`}
          />
        ))}

        
        <button
          onClick={goToPrevious}
          className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100'
          aria-label="Previous image"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

       
        <button
          onClick={goToNext}
          className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100'
          aria-label="Next image"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-6 sm:w-8' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShow;