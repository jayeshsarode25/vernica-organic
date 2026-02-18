import { useState, useEffect } from "react";

export default function SellBanner() {
  const [time, setTime] = useState({ h: 14, m: 27, s: 43 });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((p) => {
        let { h, m, s } = p;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

      <div
        className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >

        
        <div className="flex flex-col justify-between p-8 sm:p-10 bg-white" style={{ minHeight: 440 }}>
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-black" style={{ animation: "pulse 1.6s infinite" }} />
              <span
                className="text-xs font-medium text-black tracking-widest uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Limited Offer
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-300 text-black leading-none tracking-tight">
              Glow
            </h1>
            <h1 className="text-5xl sm:text-6xl font-600 text-black leading-none tracking-tight italic">
              Naturally.
            </h1>

            <p
              className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs font-light"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Pure organic skincare crafted from nature's finest botanicals.
            </p>
          </div>

          
          <div className="mt-auto">
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
              <div className="relative shrink-0 w-24 h-28 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src="https://i.pinimg.com/736x/ad/32/91/ad3291b7286356000fb9a5c233b18ae6.jpg"
                  alt="Rosehip Serum"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black text-white rounded-full w-11 h-11 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>35%</span>
                  <span className="text-white opacity-70 leading-none" style={{ fontFamily: "'Inter', sans-serif", fontSize: 7 }}>OFF</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Facial Serum
                </p>
                <p className="text-lg font-600 text-black">Rosehip Glow Serum</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="text-xl font-600 text-black">₹599</span>
                  <span className="text-sm text-gray-300 line-through" style={{ fontFamily: "'Inter', sans-serif" }}>₹699</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="relative bg-black flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: 440 }}>
          <div className="absolute inset-0">
            <img
              src="https://i.pinimg.com/736x/31/57/20/315720f1f3cd42cc53e0defed7a7339b.jpg"
              alt="Hero Product"
              className="w-full h-full object-cover object-top opacity-40"
            />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-end w-full h-full px-8 py-10 text-center">
            <div className="flex-1" />

            <h2 className="text-2xl font-600 text-white tracking-tight">Botanical Elixir</h2>
            <p className="text-xs text-white opacity-40 tracking-widest uppercase mt-1 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              100% Organic · Cruelty Free
            </p>

            <p className="text-xs text-white opacity-40 tracking-widest uppercase mb-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
              Offer ends in
            </p>

            <div className="flex gap-2 mb-6">
              {[
                { val: pad(time.h), label: "Hrs" },
                { val: pad(time.m), label: "Min" },
                { val: pad(time.s), label: "Sec" },
              ].map((t) => (
                <div key={t.label} className="w-14 border border-white border-opacity-20 rounded-lg px-2 py-2 text-center">
                  <p className="text-xl font-600 text-white leading-none">{t.val}</p>
                  <p className="text-white opacity-40 text-xs mt-1 uppercase tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>{t.label}</p>
                </div>
              ))}
            </div>

            <button
              className="w-full max-w-xs py-3 rounded-lg bg-white text-black text-sm font-medium tracking-wide transition-all duration-200 hover:bg-gray-100 cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Shop Now — Save 35%
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}   