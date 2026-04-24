import { useEffect, useRef } from "react";

const BPM = 72;
const BEAT_DURATION = Math.round(60000 / BPM); // 833ms

const WAVEFORM_LENGTH = 420; // approximate length of just the QRS+T segment

const BASELINE_Y = 60;


const PATH = [
  `M 0,${BASELINE_Y}`,
  `L 160,${BASELINE_Y}`,                         // flat lead-in
  `C 172,${BASELINE_Y} 176,48 184,46`,            // P wave up
  `C 192,44 196,56 206,${BASELINE_Y}`,            // P wave down
  `L 232,${BASELINE_Y}`,                          // short flat (PR segment)
  `L 238,${BASELINE_Y + 7}`,                      // Q dip
  `L 248,6`,                                      // R peak (QRS spike up)
  `L 258,${BASELINE_Y + 12}`,                     // S dip
  `L 266,${BASELINE_Y}`,                          // return to baseline
  `L 296,${BASELINE_Y}`,                          // ST segment
  `C 310,${BASELINE_Y} 318,40 334,38`,            // T wave up
  `C 350,36 358,52 372,${BASELINE_Y}`,            // T wave down
  `L 800,${BASELINE_Y}`,                          // flat tail
].join(" ");

const TOTAL_LENGTH = 1800;

const ACTIVE_WAVEFORM_LENGTH = 380; // P→T wave segment length

const buildCss = () => `
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

  /* 
   * Real heartbeat timing breakdown:
   * - animation-duration = BEAT_DURATION (833ms for 72 BPM)
   * - The path is drawn left-to-right; flat sections draw near-instantly
   *   (they're geometrically short), the waveform spike draws fast,
   *   matching the sudden nature of a real heartbeat
   * - timing-function: linear keeps the draw speed proportional to path length,
   *   so the flat baseline draws quickly and the waveform gets its natural speed
   */
  .ecg-line {
    fill: none;
    stroke: url(#ecgFade);
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: ${TOTAL_LENGTH};
    stroke-dashoffset: ${TOTAL_LENGTH};
    animation:
      ecg-draw ${BEAT_DURATION}ms linear infinite,
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
    animation: ecg-draw ${BEAT_DURATION}ms linear infinite;
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
    animation: ecg-draw ${BEAT_DURATION}ms linear infinite;
  }
`;

export default function HeartbeatPulse() {
  const styleRef = useRef(null);
  const dotRef = useRef(null);
  const rafRef = useRef(null);
  const mainLineRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = buildCss();
    document.head.appendChild(style);
    styleRef.current = style;

    const pathEl = mainLineRef.current;
    if (!pathEl || !dotRef.current) return;

    const totalLen = pathEl.getTotalLength();

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = (timestamp - startRef.current) % BEAT_DURATION;
      const progress = elapsed / BEAT_DURATION;
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

        {/* Wide diffuse glow */}
        <path className="ecg-glow-line" d={PATH} />

        {/* Mid glow */}
        <path className="ecg-mid-glow" d={PATH} />

        {/* Main drawing line */}
        <path className="ecg-line" d={PATH} ref={mainLineRef} />

        {/* Leading dot tracking the tip */}
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