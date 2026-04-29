import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "../components/Navbar/Logo";
import TextPressure from "../components/TextPressure";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

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
const serviceLinks = [
  "UI / UX Design",
  "Branding",
  "Web Development",
  "Motion & Animation",
  "Consulting",
];
const bottomLinks = ["Privacy Policy", "Terms & Conditions", "FAQ"];

// ─── Letter-by-letter brand name ──────────────────────────────────────────────

// function BigBrandName() {
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const section = sectionRef.current;
//     if (!section) return;

//     const letters = Array.from(section.querySelectorAll(".brand-letter"));

//     gsap.set(letters, { x: -80, opacity: 0 });

//     const st = ScrollTrigger.create({
//       trigger: section,
//       start: "top 92%",
//       onEnter: () => {
//         gsap.to(letters, {
//           x: 0,
//           opacity: 1,
//           duration: 0.55,
//           stagger: 0.06,
//           ease: "power3.out",
//         });
//       },
//       onLeaveBack: () => {
//         gsap.set(letters, { x: -80, opacity: 0 });
//       },
//     });

//     return () => st.kill();
//   }, []);

//   const word1 = "VERNICA".split("");
//   const word2 = "ORGANIC".split("");

//   return (
//     <>
//       <style>{`
//         .brand-section {
//           overflow: hidden;
//           border-top: 0.5px solid #c8e4b0;
//           margin-top: 16px;
//           padding-top: 20px;
//           padding-bottom: 8px;
//         }
//         .brand-line {
//           display: flex;
//           align-items: baseline;
//           gap: 0.25em;
//           flex-wrap: wrap;
//         }
//         .brand-word-wrap {
//           display: flex;
//           align-items: baseline;
//         }
//         .brand-letter {
//           display: inline-block;
//           font-size: clamp(52px, 11.5vw, 120px);
//           font-weight: 900;
//           letter-spacing: -0.02em;
//           font-family: Georgia, serif;
//           text-transform: uppercase;
//           line-height: 0.92;
//           will-change: transform, opacity;
//         }
//         .brand-letter.solid   { color: #1a3a0f; }
//         .brand-letter.outline {
//           color: transparent;
//           -webkit-text-stroke: 1.5px #aacf80;
//         }
//       `}</style>

//       <div ref={sectionRef} className="brand-section">
//         <div className="brand-line">
//           <div className="brand-word-wrap">
//             {word1.map((ch, i) => (
//               <span key={i} className="brand-letter solid">{ch}</span>
//             ))}
//           </div>
//           <div className="brand-word-wrap">
//             {word2.map((ch, i) => (
//               <span key={i} className="brand-letter outline">{ch}</span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// ─── Floating Leaf (used around video) ───────────────────────────────────────

function FloatingLeaf({ style, color = "#7ac04a", rotate = 0, size = 28 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Gentle float loop
    gsap.to(el, {
      y: "random(-12, 12)",
      x: "random(-8, 8)",
      rotation: `random(${rotate - 15}, ${rotate + 15})`,
      duration: "random(2.5, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [rotate]);

  return (
    <svg
      ref={ref}
      width={size}
      height={size * 1.6}
      viewBox="0 0 28 45"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", ...style, pointerEvents: "none" }}
    >
      <path
        d="M14 44 C14 44 2 30 2 18 C2 8 8 2 14 2 C20 2 26 8 26 18 C26 30 14 44 14 44Z"
        fill={color}
        opacity="0.85"
      />
      <line
        x1="14"
        y1="6"
        x2="14"
        y2="42"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="14"
        x2="8"
        y2="20"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="20"
        x2="20"
        y2="26"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="26"
        x2="8"
        y2="32"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Mouse-interactive Grass Scene ───────────────────────────────────────────

function GrassScene() {
  const wrapRef = useRef(null);
  const mouseX = useRef(0);
  const rafRef = useRef(null);
  const swayTweens = useRef([]);
  const pulseTweens = useRef([]);

  const handleMouseMove = useCallback((e) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    mouseX.current = (e.clientX - rect.left) / rect.width; // 0..1
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const blades = Array.from(wrap.querySelectorAll(".blade"));
    const flowers = Array.from(wrap.querySelectorAll(".flower"));
    const gLeaves = Array.from(wrap.querySelectorAll(".groundleaf"));

    gsap.set(blades, {
      scaleY: 0,
      transformOrigin: "bottom center",
      opacity: 0,
    });
    gsap.set(flowers, {
      scale: 0,
      transformOrigin: "center center",
      opacity: 0,
    });
    gsap.set(gLeaves, { opacity: 0, x: -20 });

    // Store blade base positions for mouse influence
    const bladeData = blades.map((b, i) => {
      const bbox = b.getBBox ? b.getBBox() : { x: i * 50 };
      return {
        el: b,
        baseX: bbox.x || i * 50,
        side: i % 2 === 0 ? 1 : -1,
      };
    });

    const svgWidth = 1400;

    // Mouse-driven sway loop
    const loop = () => {
      const mx = mouseX.current; // 0..1
      bladeData.forEach(({ el, baseX, side }) => {
        const bladePos = baseX / svgWidth; // 0..1
        const dist = mx - bladePos; // negative = mouse left of blade
        // Influence: closer = stronger, max ±18deg
        const influence = Math.max(-1, Math.min(1, dist * 3));
        const targetRot = side * 4 + influence * 14;
        gsap.to(el, {
          rotation: targetRot,
          transformOrigin: "bottom center",
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      rafRef.current = requestAnimationFrame(loop);
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 95%",
      onEnter: () => {
        gsap.to(blades, {
          scaleY: 1,
          opacity: 1,
          duration: 0.9,
          stagger: { amount: 0.7, from: "random" },
          ease: "elastic.out(1, 0.55)",
          onComplete() {
            rafRef.current = requestAnimationFrame(loop);
          },
        });

        gsap.to(flowers, {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          stagger: 0.09,
          ease: "back.out(2.5)",
          delay: 0.75,
          onComplete() {
            flowers.forEach((f, i) => {
              const t = gsap.to(f, {
                scale: 1.25,
                transformOrigin: "center center",
                duration: 1.6 + i * 0.18,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.25,
              });
              pulseTweens.current.push(t);
            });
          },
        });

        gsap.to(gLeaves, {
          opacity: 0.75,
          x: 0,
          duration: 0.65,
          stagger: 0.11,
          ease: "power2.out",
          delay: 0.55,
        });
      },
    });

    wrap.addEventListener("mousemove", handleMouseMove);

    return () => {
      st.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      swayTweens.current.forEach((t) => t.kill());
      pulseTweens.current.forEach((t) => t.kill());
      wrap.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        height: 110,
        width: "100%",
        overflow: "visible",
        cursor: "none",
      }}
    >
      <svg
        width="100%"
        height="110"
        viewBox="0 0 1400 110"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="700"
          cy="108"
          rx="800"
          ry="32"
          fill="#d4eebc"
          opacity="0.35"
        />

        {/* === Grass blades — dense spread === */}
        {/* Cluster A ~40 */}
        <path
          className="blade"
          d="M28 110 Q25 70 20 48 Q30 72 36 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M40 110 Q37 62 43 40 Q49 65 47 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M52 110 Q57 68 53 45 Q60 70 58 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M64 110 Q61 58 67 36 Q73 60 71 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M76 110 Q79 72 75 50 Q82 74 80 110Z"
          fill="#4a9a1a"
        />
        {/* Cluster B ~160 */}
        <path
          className="blade"
          d="M148 110 Q144 64 140 43 Q151 66 155 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M162 110 Q159 56 165 34 Q171 58 169 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M175 110 Q180 70 177 48 Q184 72 182 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M188 110 Q185 60 191 38 Q197 62 195 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M200 110 Q203 74 199 52 Q207 76 205 110Z"
          fill="#4a9a1a"
        />
        {/* Cluster C ~300 */}
        <path
          className="blade"
          d="M286 110 Q282 62 278 40 Q289 63 293 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M300 110 Q297 54 303 32 Q309 56 307 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M314 110 Q319 68 315 46 Q322 70 320 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M327 110 Q324 58 330 38 Q336 62 334 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M340 110 Q343 72 339 50 Q347 74 345 110Z"
          fill="#5aaa2a"
        />
        {/* Cluster D ~460 */}
        <path
          className="blade"
          d="M446 110 Q442 64 438 42 Q449 65 453 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M460 110 Q457 56 463 34 Q469 58 467 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M474 110 Q479 70 475 48 Q482 72 480 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M487 110 Q484 60 490 38 Q496 62 494 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M500 110 Q503 74 499 52 Q507 76 505 110Z"
          fill="#4a9a1a"
        />
        {/* Cluster E ~630 */}
        <path
          className="blade"
          d="M616 110 Q612 62 608 40 Q619 63 623 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M630 110 Q627 54 633 32 Q639 56 637 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M644 110 Q649 68 645 46 Q652 70 650 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M657 110 Q654 58 660 36 Q666 60 664 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M670 110 Q673 72 669 50 Q677 74 675 110Z"
          fill="#4a9a1a"
        />
        {/* Cluster F ~790 */}
        <path
          className="blade"
          d="M776 110 Q772 64 768 42 Q779 65 783 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M790 110 Q787 56 793 34 Q799 58 797 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M804 110 Q809 70 805 48 Q812 72 810 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M817 110 Q814 60 820 38 Q826 62 824 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M830 110 Q833 74 829 52 Q837 76 835 110Z"
          fill="#5aaa2a"
        />
        {/* Cluster G ~960 */}
        <path
          className="blade"
          d="M946 110 Q942 62 938 40 Q949 63 953 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M960 110 Q957 54 963 32 Q969 56 967 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M974 110 Q979 68 975 46 Q982 70 980 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M987 110 Q984 58 990 36 Q996 60 994 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M1000 110 Q1003 72 999 50 Q1007 74 1005 110Z"
          fill="#4a9a1a"
        />
        {/* Cluster H ~1130 */}
        <path
          className="blade"
          d="M1116 110 Q1112 64 1108 42 Q1119 65 1123 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M1130 110 Q1127 56 1133 34 Q1139 58 1137 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M1144 110 Q1149 70 1145 48 Q1152 72 1150 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M1157 110 Q1154 60 1160 38 Q1166 62 1164 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M1170 110 Q1173 74 1169 52 Q1177 76 1175 110Z"
          fill="#5aaa2a"
        />
        {/* Cluster I ~1300 */}
        <path
          className="blade"
          d="M1286 110 Q1282 62 1278 40 Q1289 63 1293 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M1300 110 Q1297 54 1303 32 Q1309 56 1307 110Z"
          fill="#4a9a1a"
        />
        <path
          className="blade"
          d="M1314 110 Q1319 68 1315 46 Q1322 70 1320 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M1327 110 Q1324 58 1330 36 Q1336 60 1334 110Z"
          fill="#5aaa2a"
        />
        <path
          className="blade"
          d="M1340 110 Q1343 72 1339 50 Q1347 74 1345 110Z"
          fill="#4a9a1a"
        />
        {/* Cluster J ~1380 edge */}
        <path
          className="blade"
          d="M1360 110 Q1356 66 1352 44 Q1363 67 1367 110Z"
          fill="#6aba3a"
        />
        <path
          className="blade"
          d="M1373 110 Q1370 58 1376 36 Q1382 60 1380 110Z"
          fill="#5aaa2a"
        />

        {/* Flowers */}
        <circle className="flower" cx="52" cy="42" r="5.5" fill="#f0c050" />
        <circle className="flower" cx="175" cy="45" r="5" fill="#f8a030" />
        <circle className="flower" cx="314" cy="43" r="5.5" fill="#f0c050" />
        <circle className="flower" cx="474" cy="44" r="5" fill="#e8d060" />
        <circle className="flower" cx="644" cy="43" r="5.5" fill="#f0c050" />
        <circle className="flower" cx="804" cy="44" r="5" fill="#f8a030" />
        <circle className="flower" cx="974" cy="43" r="5.5" fill="#f0c050" />
        <circle className="flower" cx="1144" cy="44" r="5" fill="#e8d060" />
        <circle className="flower" cx="1314" cy="43" r="5.5" fill="#f0c050" />

        {/* Ground leaves */}
        <ellipse
          className="groundleaf"
          cx="110"
          cy="96"
          rx="20"
          ry="8"
          fill="#7acb40"
          transform="rotate(-20 110 96)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="260"
          cy="98"
          rx="18"
          ry="7"
          fill="#6aba30"
          transform="rotate(15 260 98)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="420"
          cy="97"
          rx="19"
          ry="7"
          fill="#7acb40"
          transform="rotate(-12 420 97)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="580"
          cy="96"
          rx="18"
          ry="7"
          fill="#6aba30"
          transform="rotate(18 580 96)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="740"
          cy="97"
          rx="19"
          ry="7"
          fill="#7acb40"
          transform="rotate(-8 740 97)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="900"
          cy="96"
          rx="18"
          ry="7"
          fill="#6aba30"
          transform="rotate(20 900 96)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="1060"
          cy="97"
          rx="19"
          ry="7"
          fill="#7acb40"
          transform="rotate(-14 1060 97)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="1220"
          cy="96"
          rx="18"
          ry="7"
          fill="#6aba30"
          transform="rotate(16 1220 96)"
          opacity="0.75"
        />
        <ellipse
          className="groundleaf"
          cx="1370"
          cy="97"
          rx="17"
          ry="6"
          fill="#7acb40"
          transform="rotate(-10 1370 97)"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

// ─── Side Plant (Left or Right) ───────────────────────────────────────────────

function SidePlant({ side = "left" }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    const leaves = Array.from(svg.querySelectorAll(".side-leaf"));
    const blades = Array.from(svg.querySelectorAll(".side-blade"));

    gsap.set(leaves, {
      scale: 0,
      transformOrigin: "center bottom",
      opacity: 0,
    });
    gsap.set(blades, {
      scaleY: 0,
      transformOrigin: "bottom center",
      opacity: 0,
    });

    const st = ScrollTrigger.create({
      trigger: svg,
      start: "top 90%",
      onEnter: () => {
        gsap.to(blades, {
          scaleY: 1,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "elastic.out(1,0.5)",
        });
        gsap.to(leaves, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(2)",
          delay: 0.4,
          onComplete() {
            leaves.forEach((l, i) => {
              gsap.to(l, {
                rotation: side === "left" ? `random(-8,8)` : `random(-8,8)`,
                duration: 2.5 + i * 0.3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.2,
                transformOrigin: "50% 100%",
              });
            });
          },
        });
      },
    });

    return () => st.kill();
  }, [side]);

  if (side === "left") {
    return (
      <svg
        ref={ref}
        className="organic-blob"
        style={{
          top: 0,
          left: 0,
          width: 110,
          height: "100%",
          overflow: "visible",
        }}
        viewBox="0 0 110 700"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main stem */}
        <path
          className="side-blade"
          d="M38 700 Q34 580 28 490 Q20 400 32 300 Q44 200 36 100"
          stroke="#5a9a2a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Secondary stem */}
        <path
          className="side-blade"
          d="M52 700 Q48 610 56 530 Q64 450 54 370"
          stroke="#4a8a1a"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Leaf 1 — top, right branch */}
        <g className="side-leaf" transform="translate(36,110)">
          <path
            d="M0 0 C18 -8 42 -4 48 12 C42 28 18 24 0 0Z"
            fill="#6aba3a"
            opacity="0.9"
          />
          <line
            x1="0"
            y1="0"
            x2="44"
            y2="12"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.9"
          />
        </g>
        {/* Leaf 2 — upper left */}
        <g className="side-leaf" transform="translate(32,160) rotate(160)">
          <path
            d="M0 0 C14 -6 34 -3 38 10 C34 22 14 18 0 0Z"
            fill="#4a9a1a"
            opacity="0.85"
          />
          <line
            x1="0"
            y1="0"
            x2="35"
            y2="10"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.9"
          />
        </g>
        {/* Leaf 3 — mid right */}
        <g className="side-leaf" transform="translate(36,260)">
          <path
            d="M0 0 C22 -10 52 -5 58 15 C52 34 22 28 0 0Z"
            fill="#7aca3a"
            opacity="0.9"
          />
          <line
            x1="0"
            y1="0"
            x2="54"
            y2="15"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
        </g>
        {/* Leaf 4 — mid left */}
        <g className="side-leaf" transform="translate(28,310) rotate(150)">
          <path
            d="M0 0 C16 -7 38 -3 44 12 C38 26 16 20 0 0Z"
            fill="#5aaa2a"
            opacity="0.85"
          />
          <line
            x1="0"
            y1="0"
            x2="40"
            y2="12"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.9"
          />
        </g>
        {/* Leaf 5 — lower right big */}
        <g className="side-leaf" transform="translate(38,420)">
          <path
            d="M0 0 C26 -12 62 -6 68 18 C62 40 26 34 0 0Z"
            fill="#6aba3a"
            opacity="0.88"
          />
          <line
            x1="0"
            y1="0"
            x2="64"
            y2="18"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
        </g>
        {/* Leaf 6 — lower left */}
        <g className="side-leaf" transform="translate(24,480) rotate(155)">
          <path
            d="M0 0 C18 -8 44 -4 50 14 C44 30 18 24 0 0Z"
            fill="#4a9a1a"
            opacity="0.8"
          />
          <line
            x1="0"
            y1="0"
            x2="46"
            y2="14"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.9"
          />
        </g>
        {/* Leaf 7 — near base right */}
        <g className="side-leaf" transform="translate(54,550)">
          <path
            d="M0 0 C20 -9 48 -4 54 16 C48 36 20 28 0 0Z"
            fill="#7aca3a"
            opacity="0.85"
          />
          <line
            x1="0"
            y1="0"
            x2="50"
            y2="16"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        </g>
        {/* Leaf 8 — near base left */}
        <g className="side-leaf" transform="translate(20,600) rotate(145)">
          <path
            d="M0 0 C14 -6 34 -3 38 12 C34 26 14 20 0 0Z"
            fill="#5aaa2a"
            opacity="0.8"
          />
          <line
            x1="0"
            y1="0"
            x2="35"
            y2="12"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      ref={ref}
      className="organic-blob"
      style={{
        top: 0,
        right: 0,
        width: 110,
        height: "100%",
        overflow: "visible",
      }}
      viewBox="0 0 110 700"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <path
        className="side-blade"
        d="M72 700 Q76 580 82 490 Q90 400 78 300 Q66 200 74 100"
        stroke="#5a9a2a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Secondary stem */}
      <path
        className="side-blade"
        d="M58 700 Q62 610 54 530 Q46 450 56 370"
        stroke="#4a8a1a"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaf 1 — top left branch */}
      <g className="side-leaf" transform="translate(74,110)">
        <path
          d="M0 0 C-18 -8 -42 -4 -48 12 C-42 28 -18 24 0 0Z"
          fill="#6aba3a"
          opacity="0.9"
        />
        <line
          x1="0"
          y1="0"
          x2="-44"
          y2="12"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.9"
        />
      </g>
      {/* Leaf 2 — upper right */}
      <g className="side-leaf" transform="translate(78,160) rotate(-160)">
        <path
          d="M0 0 C-14 -6 -34 -3 -38 10 C-34 22 -14 18 0 0Z"
          fill="#4a9a1a"
          opacity="0.85"
        />
        <line
          x1="0"
          y1="0"
          x2="-35"
          y2="10"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.9"
        />
      </g>
      {/* Leaf 3 — mid left */}
      <g className="side-leaf" transform="translate(74,260)">
        <path
          d="M0 0 C-22 -10 -52 -5 -58 15 C-52 34 -22 28 0 0Z"
          fill="#7aca3a"
          opacity="0.9"
        />
        <line
          x1="0"
          y1="0"
          x2="-54"
          y2="15"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      </g>
      {/* Leaf 4 — mid right */}
      <g className="side-leaf" transform="translate(82,310) rotate(-150)">
        <path
          d="M0 0 C-16 -7 -38 -3 -44 12 C-38 26 -16 20 0 0Z"
          fill="#5aaa2a"
          opacity="0.85"
        />
        <line
          x1="0"
          y1="0"
          x2="-40"
          y2="12"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.9"
        />
      </g>
      {/* Leaf 5 — lower left big */}
      <g className="side-leaf" transform="translate(72,420)">
        <path
          d="M0 0 C-26 -12 -62 -6 -68 18 C-62 40 -26 34 0 0Z"
          fill="#6aba3a"
          opacity="0.88"
        />
        <line
          x1="0"
          y1="0"
          x2="-64"
          y2="18"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
        />
      </g>
      {/* Leaf 6 — lower right */}
      <g className="side-leaf" transform="translate(86,480) rotate(-155)">
        <path
          d="M0 0 C-18 -8 -44 -4 -50 14 C-44 30 -18 24 0 0Z"
          fill="#4a9a1a"
          opacity="0.8"
        />
        <line
          x1="0"
          y1="0"
          x2="-46"
          y2="14"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.9"
        />
      </g>
      {/* Leaf 7 — near base left */}
      <g className="side-leaf" transform="translate(56,550)">
        <path
          d="M0 0 C-20 -9 -48 -4 -54 16 C-48 36 -20 28 0 0Z"
          fill="#7aca3a"
          opacity="0.85"
        />
        <line
          x1="0"
          y1="0"
          x2="-50"
          y2="16"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
      </g>
      {/* Leaf 8 — near base right */}
      <g className="side-leaf" transform="translate(90,600) rotate(-145)">
        <path
          d="M0 0 C-14 -6 -34 -3 -38 12 C-34 26 -14 20 0 0Z"
          fill="#5aaa2a"
          opacity="0.8"
        />
        <line
          x1="0"
          y1="0"
          x2="-35"
          y2="12"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  const footerRef = useRef(null);
  const gridRef = useRef(null);
  const bottomRef = useRef(null);
  const videoRef = useRef(null);
  const socialRefs = useRef([]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const tweens = [];
    const cleanups = [];

    if (gridRef.current) {
      const cols = Array.from(gridRef.current.children);
      gsap.set(cols, { opacity: 0, y: 40 });
      tweens.push(
        gsap.to(cols, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        }),
      );
    }

    if (bottomRef.current) {
      gsap.set(bottomRef.current, { opacity: 0, y: 20 });
      tweens.push(
        gsap.to(bottomRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: bottomRef.current, start: "top 90%" },
        }),
      );
    }

    if (videoRef.current) {
      gsap.set(videoRef.current, { opacity: 0, scale: 0.96 });
      tweens.push(
        gsap.to(videoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: videoRef.current, start: "top 90%" },
        }),
      );
    }

    socialRefs.current.forEach((el) => {
      if (!el) return;
      const enter = () =>
        gsap.to(el, {
          rotation: 10,
          scale: 1.15,
          duration: 0.25,
          ease: "back.out(2)",
        });
      const leave = () =>
        gsap.to(el, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    });

    footer.querySelectorAll(".footer-nav-link").forEach((link) => {
      const enter = () =>
        gsap.to(link, { x: 6, duration: 0.2, ease: "power2.out" });
      const leave = () =>
        gsap.to(link, { x: 0, duration: 0.2, ease: "power2.out" });
      link.addEventListener("mouseenter", enter);
      link.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        link.removeEventListener("mouseenter", enter);
        link.removeEventListener("mouseleave", leave);
      });
    });

    return () => {
      tweens.forEach((t) => t.kill());
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <style>{`
        footer.organic-footer {
          background: #f9fdf5;
          color: #5a7a4a;
          position: relative;
          overflow: hidden;
        }
        .organic-blob {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .footer-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 40px 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 52px;
        }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } }
        .footer-brand-tagline {
          font-size: 13px; color: #6a8a5a;
          line-height: 1.7; margin-bottom: 22px;
        }
        .footer-newsletter-label {
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 2px; color: #8aab72; margin-bottom: 10px;
        }
        .footer-email-row {
          display: flex;
          border: 1px solid #c4dba8;
          border-radius: 6px; overflow: hidden; background: #fff;
        }
        .footer-email-row input {
          flex: 1; padding: 10px 14px; font-size: 13px;
          border: none; outline: none; background: transparent; color: #2a4a1a;
        }
        .footer-email-row input::placeholder { color: #aac896; }
        .footer-email-row button {
          background: #3a7a1a; color: #fff; border: none;
          padding: 10px 18px; font-size: 12px; cursor: pointer;
          letter-spacing: 0.5px; transition: background 0.2s;
        }
        .footer-email-row button:hover { background: #2a5a10; }
        .footer-col-heading {
          font-size: 10px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 2px; color: #1a3a0f; margin-bottom: 18px;
        }
        .footer-col ul { list-style: none; padding: 0; margin: 0; }
        .footer-col ul li { margin-bottom: 10px; }
        .footer-nav-link {
          font-size: 13px; color: #6a8a5a; text-decoration: none;
          display: inline-block; transition: color 0.2s;
        }
        .footer-nav-link:hover { color: #1a3a0f; }
        .contact-item {
          display: flex; align-items: flex-start;
          gap: 10px; margin-bottom: 14px;
        }
        .contact-item svg {
          width: 14px; height: 14px; color: #5aaa2a;
          flex-shrink: 0; margin-top: 2px;
        }
        .contact-item span { font-size: 13px; color: #6a8a5a; line-height: 1.5; }
        .footer-bottom {
          border-top: 0.5px solid #d4e8c2; padding: 20px 0;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;
        }
        .footer-copy { font-size: 11px; color: #8aab72; }
        .footer-copy span { color: #3a7a1a; }
        .footer-social { display: flex; gap: 8px; }
        .footer-social-btn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid #c4dba8;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; background: #fff;
          transition: border-color 0.2s, background 0.2s;
        }
        .footer-social-btn:hover { border-color: #3a7a1a; background: #f0f9e8; }
        .footer-social-btn svg { width: 13px; height: 13px; fill: #8aab72; transition: fill 0.2s; }
        .footer-social-btn:hover svg { fill: #3a7a1a; }
        .footer-legal { display: flex; gap: 20px; flex-wrap: wrap; }
        .footer-legal a {
          font-size: 11px; color: #8aab72;
          text-decoration: none; transition: color 0.2s;
        }
        .footer-legal a:hover { color: #2a5a10; }
        .footer-video-wrap {
          border-radius: 12px; overflow: hidden;
          margin-bottom: 0; border: 0.5px solid #c4dba8;
          position: relative;
        }
        .footer-video-wrap video {
          width: 100%; height: clamp(160px, 22vw, 320px);
          object-fit: cover; display: block;
        }
        .video-leaf-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: visible;
        }
      `}</style>

      <footer className="organic-footer" ref={footerRef}>
        {/* Blobs */}
        <svg
          className="organic-blob"
          style={{ top: 0, right: 0, width: 340, height: 320, opacity: 0.45 }}
          viewBox="0 0 340 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="280" cy="80" rx="180" ry="160" fill="#d8f0bc" />
        </svg>
        <svg
          className="organic-blob"
          style={{
            bottom: 60,
            left: 0,
            width: 260,
            height: 220,
            opacity: 0.35,
          }}
          viewBox="0 0 260 220"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="60" cy="160" rx="140" ry="110" fill="#c8eab0" />
        </svg>

        {/* ── Improved Side Plants ── */}
        <SidePlant side="left" />
        <SidePlant side="right" />

        <div className="footer-inner">
          {/* Top grid */}
          <div className="footer-grid" ref={gridRef}>
            <div>
              <h2 style={{ marginBottom: 12 }}>
                <Logo />
              </h2>
              <p className="footer-brand-tagline">
                We craft natural experiences that inspire, engage, and nourish —
                <br />
                organics with purpose.
              </p>
              <p className="footer-newsletter-label">Stay in the loop</p>
              <div className="footer-email-row">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">Company</h3>
              <ul>
                {companyLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-nav-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">Services</h3>
              <ul>
                {serviceLinks.map((item) => (
                  <li key={item}>
                    <a href="#" className="footer-nav-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-col-heading">Contact</h3>
              <div className="contact-item">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+91 9999 999 999</span>
              </div>
              <div className="contact-item">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>hello@vernica.com</span>
              </div>
              <div className="contact-item">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom" ref={bottomRef}>
            <p className="footer-copy">
              © 2024 <span>Vernica Organic</span>. All rights reserved.
            </p>
            <div className="footer-social">
              {socialIcons.map((icon, i) => (
                <button
                  key={icon.label}
                  aria-label={icon.label}
                  className="footer-social-btn"
                  ref={(el) => (socialRefs.current[i] = el)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d={icon.path} />
                  </svg>
                </button>
              ))}
            </div>
            <div className="footer-legal">
              {bottomLinks.map((item) => (
                <a key={item} href="#">
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Video with floating leaves */}
          <div className="footer-video-wrap" ref={videoRef}>
            <video
              src="./varnika logo video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Floating leaves INSIDE the video wrapper — fully contained */}
            <FloatingLeaf
              style={{ top: "8%", left: "3%" }}
              color="#5aaa2a"
              rotate={-30}
              size={32}
            />
            <FloatingLeaf
              style={{ top: "5%", left: "10%" }}
              color="#7aca3a"
              rotate={20}
              size={22}
            />
            <FloatingLeaf
              style={{ top: "12%", left: "6%" }}
              color="#4a9a1a"
              rotate={-10}
              size={18}
            />
            <FloatingLeaf
              style={{ top: "6%", right: "4%" }}
              color="#6aba3a"
              rotate={25}
              size={30}
            />
            <FloatingLeaf
              style={{ top: "14%", right: "8%" }}
              color="#5aaa2a"
              rotate={-20}
              size={20}
            />
            <FloatingLeaf
              style={{ top: "3%", right: "14%" }}
              color="#7aca3a"
              rotate={15}
              size={16}
            />
            <FloatingLeaf
              style={{ bottom: "10%", left: "4%" }}
              color="#4a9a1a"
              rotate={10}
              size={24}
            />
            <FloatingLeaf
              style={{ bottom: "6%", right: "5%" }}
              color="#6aba3a"
              rotate={-25}
              size={26}
            />
          </div>

          {/* Letter-by-letter brand name */}
          {/* <BigBrandName/> */}
          <div style={{ position: "relative", height: "300px" }}>
            <TextPressure
              text="Vernica"
              flex
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor="#111"
              strokeColor="#5227FF"
              minFontSize={36}
            />
          </div>

          {/* Grass + flowers with mouse interaction */}
          <GrassScene />
        </div>
      </footer>
    </>
  );
}
