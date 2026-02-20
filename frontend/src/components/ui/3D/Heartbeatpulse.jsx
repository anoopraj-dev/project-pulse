import { useEffect, useRef } from "react";

const TOTAL_LENGTH = 1800; // approximate path length

const css = `
  @keyframes ecg-draw {
    0%   { stroke-dashoffset: ${TOTAL_LENGTH}; }
    100% { stroke-dashoffset: 0; }
  }

  @keyframes ecg-glow-breathe {
    0%, 100% {
      filter:
        drop-shadow(0 0 2px #ffcc00)
        drop-shadow(0 0 8px #ffaa00)
        drop-shadow(0 0 16px #ff8800);
    }
    50% {
      filter:
        drop-shadow(0 0 5px #ffe033)
        drop-shadow(0 0 18px #ffcc00)
        drop-shadow(0 0 40px #ffaa00)
        drop-shadow(0 0 70px #ff8800);
    }
  }

  @keyframes dot-move {
    0%   { opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .ecg-wrap {
    width: 100%;
    height: 120px;
    overflow: visible;
  }

  .ecg-svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .ecg-line {
    fill: none;
    stroke: url(#ecgFade);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: ${TOTAL_LENGTH};
    stroke-dashoffset: ${TOTAL_LENGTH};
    animation:
      ecg-draw 3s linear infinite,
      ecg-glow-breathe 1.6s ease-in-out infinite;
  }

  .ecg-glow-line {
    fill: none;
    stroke: url(#ecgGlowFade);
    stroke-width: 14;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: ${TOTAL_LENGTH};
    stroke-dashoffset: ${TOTAL_LENGTH};
    animation: ecg-draw 3s linear infinite;
  }

  .ecg-mid-glow {
    fill: none;
    stroke: url(#ecgFade);
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-opacity: 0.25;
    stroke-dasharray: ${TOTAL_LENGTH};
    stroke-dashoffset: ${TOTAL_LENGTH};
    animation: ecg-draw 3s linear infinite;
  }
`;

const PATH = [
  "M 0,60",
  "L 220,60",
  "C 232,60 236,48 244,46",
  "C 252,44 256,56 266,60",
  "L 292,60",
  "L 298,67",
  "L 308,6",
  "L 318,72",
  "L 326,60",
  "L 356,60",
  "C 370,60 378,40 394,38",
  "C 410,36 418,52 432,60",
  "L 800,60",
].join(" ");

export default function HeartbeatPulse() {
  const styleRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const mainLineRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 3000; // ms, must match CSS animation

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
    styleRef.current = style;

    // Animate a leading dot along the path in sync with the draw animation
    const svg = dotRef.current?.ownerSVGElement;
    const pathEl = mainLineRef.current;
    if (!pathEl || !dotRef.current) return;

    const totalLen = pathEl.getTotalLength();

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = (timestamp - startRef.current) % DURATION;
      const progress = elapsed / DURATION;
      const point = pathEl.getPointAtLength(progress * totalLen);
      dotRef.current.setAttribute("cx", point.x);
      dotRef.current.setAttribute("cy", point.y);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (styleRef.current) document.head.removeChild(styleRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="ecg-wrap">
      <svg
        className="ecg-svg"
        viewBox="0 0 800 120"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ecgFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ffcc00" stopOpacity="0" />
            <stop offset="12%"  stopColor="#ffcc00" stopOpacity="0.3" />
            <stop offset="25%"  stopColor="#ffe033" stopOpacity="1" />
            <stop offset="75%"  stopColor="#ffe033" stopOpacity="1" />
            <stop offset="88%"  stopColor="#ffcc00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="ecgGlowFade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ffaa00" stopOpacity="0" />
            <stop offset="18%"  stopColor="#ffaa00" stopOpacity="0.06" />
            <stop offset="28%"  stopColor="#ffaa00" stopOpacity="0.14" />
            <stop offset="72%"  stopColor="#ffaa00" stopOpacity="0.14" />
            <stop offset="82%"  stopColor="#ffaa00" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ffaa00" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wide diffuse glow — draws in sync */}
        <path className="ecg-glow-line" d={PATH} />

        {/* Mid glow — draws in sync */}
        <path className="ecg-mid-glow" d={PATH} />

        {/* Main line drawing left to right */}
        <path className="ecg-line" d={PATH} ref={mainLineRef} />

        {/* Leading dot that follows the tip of the line */}
        <circle
          ref={dotRef}
          r="4"
          fill="#ffe033"
          style={{
            filter: "drop-shadow(0 0 6px #ffcc00) drop-shadow(0 0 14px #ffaa00)",
          }}
        />
      </svg>
    </div>
  );
}