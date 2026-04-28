import { useEffect, useRef, useState } from "react";
import Logo from "../components/Navbar/Logo";

const socialIcons = [
  {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "Twitter",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
];

const companyLinks = ["About Us", "Our Work", "Blog", "Testimonials", "Events"];
const serviceLinks = ["UI / UX Design", "Branding", "Web Development", "Motion & Animation", "Consulting"];
const bottomLinks = ["Privacy Policy", "Terms & Conditions", "FAQ"];

function BigBrandName() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .brand-section {
          overflow: hidden;
          border-top: 0.5px solid #222;
          margin-top: 0;
          padding-top: 28px;
          padding-bottom: 8px;
        }
        .brand-line {
          display: flex;
          align-items: baseline;
          gap: 0.2em;
          overflow: hidden;
        }
        .brand-word {
          display: block;
          font-size: clamp(52px, 11.5vw, 120px);
          font-weight: 900;
          letter-spacing: -0.03em;
          font-family: sans-serif;
          text-transform: uppercase;
          line-height: 0.92;
          white-space: nowrap;
          will-change: transform, opacity;
          transform: translateX(-120%);
          opacity: 0;
          transition: transform 0s, opacity 0s;
        }
        .brand-word.word-solid {
          color: #ffffff;
        }
        .brand-word.word-outline {
          color: transparent;
          -webkit-text-stroke: 1.5px #555;
        }
        .brand-section.active .brand-word.word-solid {
          transform: translateX(0);
          opacity: 1;
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0s,
                      opacity 0.5s ease 0s;
        }
        .brand-section.active .brand-word.word-outline {
          transform: translateX(0);
          opacity: 1;
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s,
                      opacity 0.5s ease 0.1s;
        }
      `}</style>

      <div
        ref={ref}
        className={`brand-section${inView ? " active" : ""}`}
      >
        <div className="brand-line">
          <span className="brand-word word-solid">VERNICA</span>
          <span className="brand-word word-outline">ORGANIC</span>
        </div>
      </div>
    </>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#111] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand + Newsletter */}
          <div>
            <h2 className="mb-3">
              <Logo />
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              We craft natural experiences that inspire, engage, and nourish — organics with purpose.
            </p>
            <p className="text-xs uppercase tracking-widest text-gray-600 mb-3">
              Stay in the loop
            </p>
            <div className="flex border border-gray-800 rounded overflow-hidden">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-transparent flex-1 px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 outline-none"
              />
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-white mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-white mb-5">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-white mb-5">
              Contact
            </h3>
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-sm text-gray-500">+91 9999 999 999</span>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-sm text-gray-500">hello@vernica.com</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-500">Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-14">
          <p className="text-xs text-gray-600">
            © 2024 <span className="text-red-500">Vernica Organic</span>. All rights reserved.
          </p>
          <div className="flex gap-3">
            {socialIcons.map((icon) => (
              <a
                key={icon.label}
                href="#"
                aria-label={icon.label}
                className="w-8 h-8 rounded-full border border-gray-800 flex items-center justify-center hover:border-red-500 transition-colors group"
              >
                <svg className="w-3.5 h-3.5 fill-gray-500 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d={icon.path} />
                </svg>
              </a>
            ))}
          </div>
          <div className="flex gap-6">
            {bottomLinks.map((item) => (
              <a key={item} href="#" className="text-xs text-gray-600 hover:text-gray-300 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* ── Video above the big brand name ── */}
        <div className="w-full rounded-xl overflow-hidden mb-6">
          <video
            src="./public/varnika logo video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-48 md:h-64 lg:h-80 object-cover"
          />
        </div>

        {/* Giant brand — slides in from LEFT every time you scroll to footer */}
        <BigBrandName />

      </div>
    </footer>
  );
}