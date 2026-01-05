import { useState, useEffect, useRef } from "react";

interface TransistorState {
  a: boolean;
  b: boolean;
}

interface Particle {
  id: number;
  progress: number;
}

export default function TransistorAndGate() {
  const [inputs, setInputs] = useState<TransistorState>({ a: false, b: false });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const isCircuitComplete = inputs.a && inputs.b;

  // Particle animation system
  useEffect(() => {
    if (!isCircuitComplete) {
      setParticles([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastSpawn = 0;
    const spawnInterval = 500;

    const animate = (time: number) => {
      if (time - lastSpawn > spawnInterval) {
        lastSpawn = time;
        particleIdRef.current += 1;
        setParticles((prev) => [
          ...prev.filter((p) => p.progress < 1.1),
          { id: particleIdRef.current, progress: 0 },
        ]);
      }

      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 0.006 }))
          .filter((p) => p.progress < 1.1)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isCircuitComplete]);

  const toggleInput = (which: "a" | "b") => {
    setInputs((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  // Path for particle animation (vertical flow from V to Out)
  const getParticlePosition = (progress: number) => {
    // Vertical path from top (V) to bottom (Out)
    const startY = 35;
    const endY = 365;
    const y = startY + progress * (endY - startY);
    return { x: 200, y };
  };

  // How far electricity flows based on input states
  const getElectricityEndY = () => {
    if (!inputs.a) return 95; // Stop at transistor A collector
    if (!inputs.b) return 215; // Stop at transistor B collector
    return 365; // Full circuit to output
  };

  const electricityEndY = getElectricityEndY();

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="0 0 400 420"
        className="w-full h-auto max-w-md mx-auto"
        style={{ minHeight: "300px" }}
      >
        <defs>
          {/* Glow filter for active elements */}
          <filter id="transistorGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter
            id="transistorParticleGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ============ MAIN VERTICAL WIRE (inactive) ============ */}
        <line
          x1="200"
          y1="35"
          x2="200"
          y2="365"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ============ ACTIVE WIRE (shows electricity progress) ============ */}
        <line
          x1="200"
          y1="35"
          x2="200"
          y2={electricityEndY}
          className="stroke-amber-400 dark:stroke-yellow-400"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* ============ ELECTRICITY PARTICLES ============ */}
        {isCircuitComplete &&
          particles.map((particle) => {
            const pos = getParticlePosition(particle.progress);
            const opacity =
              particle.progress < 0.1
                ? particle.progress * 10
                : particle.progress > 0.9
                ? (1 - particle.progress) * 10
                : 1;
            return (
              <circle
                key={particle.id}
                cx={pos.x}
                cy={pos.y}
                r="4"
                className="fill-amber-300 dark:fill-yellow-300"
                filter="url(#transistorParticleGlow)"
                style={{ opacity }}
              />
            );
          })}

        {/* ============ VOLTAGE SOURCE (V) ============ */}
        <g className="text-neutral-600 dark:text-neutral-400">
          <circle
            cx="200"
            cy="20"
            r="14"
            className="fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            strokeWidth="2"
          />
          <text
            x="200"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className="fill-neutral-600 dark:fill-neutral-400 select-none"
          >
            V
          </text>
        </g>

        {/* ============ TRANSISTOR A ============ */}
        <g onClick={() => toggleInput("a")} className="cursor-pointer group">
          {/* Transistor body circle */}
          <circle
            cx="200"
            cy="120"
            r="28"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "fill-amber-50 dark:fill-amber-950/30 stroke-amber-400 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Collector (top) */}
          <line
            x1="200"
            y1="92"
            x2="200"
            y2="105"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter (bottom) with arrow */}
          <line
            x1="200"
            y1="135"
            x2="200"
            y2="148"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow head on emitter */}
          <polygon
            points="200,148 196,140 204,140"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          />

          {/* Internal vertical bar */}
          <line
            x1="188"
            y1="110"
            x2="188"
            y2="130"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Collector to bar */}
          <line
            x1="200"
            y1="105"
            x2="188"
            y2="113"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter from bar */}
          <line
            x1="188"
            y1="127"
            x2="200"
            y2="135"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Base (left side) */}
          <line
            x1="172"
            y1="120"
            x2="188"
            y2="120"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect x="60" y="85" width="180" height="70" fill="transparent" />
        </g>

        {/* ============ INPUT A (with resistor) ============ */}
        <g onClick={() => toggleInput("a")} className="cursor-pointer group">
          {/* Horizontal wire to resistor */}
          <line
            x1="60"
            y1="120"
            x2="90"
            y2="120"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-300 dark:stroke-neutral-700"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Resistor symbol */}
          <path
            d="M90,120 L95,112 L105,128 L115,112 L125,128 L135,112 L145,128 L150,120 L172,120"
            fill="none"
            className={`transition-colors duration-300 ${
              inputs.a
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Input A label */}
          <text
            x="45"
            y="125"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              inputs.a
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            A
          </text>

          {/* Input dot */}
          <circle
            cx="60"
            cy="120"
            r="6"
            className={`transition-colors duration-300 group-hover:scale-110 ${
              inputs.a
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-300 dark:fill-neutral-700"
            }`}
            style={{ transformOrigin: "60px 120px", transition: "all 0.3s" }}
          />

          {/* R label */}
          <text
            x="120"
            y="108"
            fontSize="11"
            textAnchor="middle"
            className="fill-neutral-400 dark:fill-neutral-600 select-none"
          >
            R
          </text>
        </g>

        {/* ============ TRANSISTOR B ============ */}
        <g onClick={() => toggleInput("b")} className="cursor-pointer group">
          {/* Transistor body circle */}
          <circle
            cx="200"
            cy="240"
            r="28"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "fill-amber-50 dark:fill-amber-950/30 stroke-amber-400 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Collector (top) */}
          <line
            x1="200"
            y1="212"
            x2="200"
            y2="225"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter (bottom) with arrow */}
          <line
            x1="200"
            y1="255"
            x2="200"
            y2="268"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow head on emitter */}
          <polygon
            points="200,268 196,260 204,260"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          />

          {/* Internal vertical bar */}
          <line
            x1="188"
            y1="230"
            x2="188"
            y2="250"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Collector to bar */}
          <line
            x1="200"
            y1="225"
            x2="188"
            y2="233"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter from bar */}
          <line
            x1="188"
            y1="247"
            x2="200"
            y2="255"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Base (left side) */}
          <line
            x1="172"
            y1="240"
            x2="188"
            y2="240"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect x="60" y="205" width="180" height="70" fill="transparent" />
        </g>

        {/* ============ INPUT B (with resistor) ============ */}
        <g onClick={() => toggleInput("b")} className="cursor-pointer group">
          {/* Horizontal wire to resistor */}
          <line
            x1="60"
            y1="240"
            x2="90"
            y2="240"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-300 dark:stroke-neutral-700"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Resistor symbol */}
          <path
            d="M90,240 L95,232 L105,248 L115,232 L125,248 L135,232 L145,248 L150,240 L172,240"
            fill="none"
            className={`transition-colors duration-300 ${
              inputs.b
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Input B label */}
          <text
            x="45"
            y="245"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              inputs.b
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Input dot */}
          <circle
            cx="60"
            cy="240"
            r="6"
            className={`transition-colors duration-300 group-hover:scale-110 ${
              inputs.b
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-300 dark:fill-neutral-700"
            }`}
            style={{ transformOrigin: "60px 240px", transition: "all 0.3s" }}
          />

          {/* R label */}
          <text
            x="120"
            y="228"
            fontSize="11"
            textAnchor="middle"
            className="fill-neutral-400 dark:fill-neutral-600 select-none"
          >
            R
          </text>
        </g>

        {/* ============ OUTPUT SECTION ============ */}
        {/* Junction point */}
        <circle
          cx="200"
          cy="310"
          r="4"
          className={`transition-colors duration-300 ${
            isCircuitComplete
              ? "fill-amber-400 dark:fill-yellow-400"
              : "fill-neutral-400 dark:fill-neutral-600"
          }`}
        />

        {/* Horizontal wire to output */}
        <line
          x1="200"
          y1="310"
          x2="280"
          y2="310"
          className={`transition-colors duration-300 ${
            isCircuitComplete
              ? "stroke-amber-400 dark:stroke-yellow-400"
              : "stroke-neutral-300 dark:stroke-neutral-700"
          }`}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Output label */}
        <text
          x="300"
          y="315"
          fontSize="13"
          fontWeight="500"
          className={`select-none transition-colors duration-300 ${
            isCircuitComplete
              ? "fill-amber-500 dark:fill-yellow-400"
              : "fill-neutral-500 dark:fill-neutral-500"
          }`}
        >
          Out
        </text>

        {/* ============ OUTPUT RESISTOR TO GROUND ============ */}
        {/* Vertical wire down from junction */}
        <line
          x1="200"
          y1="310"
          x2="200"
          y2="325"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Output Resistor symbol (vertical) */}
        <path
          d="M200,325 L208,330 L192,340 L208,350 L192,360 L200,365"
          fill="none"
          className="stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* R_Out label */}
        <text
          x="225"
          y="350"
          fontSize="11"
          className="fill-neutral-400 dark:fill-neutral-600 select-none"
        >
          R
          <tspan fontSize="8" dy="2">Out</tspan>
        </text>

        {/* ============ GROUND SYMBOL ============ */}
        <g className="text-neutral-500 dark:text-neutral-600">
          <line
            x1="200"
            y1="365"
            x2="200"
            y2="380"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="185"
            y1="380"
            x2="215"
            y2="380"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="190"
            y1="386"
            x2="210"
            y2="386"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="195"
            y1="392"
            x2="205"
            y2="392"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        {/* ============ OUTPUT INDICATOR (glow when active) ============ */}
        <circle
          cx="280"
          cy="310"
          r="8"
          className={`transition-all duration-500 ${
            isCircuitComplete
              ? "fill-amber-400 dark:fill-yellow-400"
              : "fill-neutral-200 dark:fill-neutral-800"
          }`}
          style={{
            filter: isCircuitComplete ? "url(#transistorGlow)" : "none",
          }}
        />
        <circle
          cx="280"
          cy="310"
          r="8"
          className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
          strokeWidth="1.5"
          style={{
            opacity: isCircuitComplete ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        />

        {/* ============ BOOLEAN EXPRESSION ============ */}
        <text
          x="200"
          y="410"
          fontSize="13"
          textAnchor="middle"
          className="fill-neutral-400 dark:fill-neutral-600 select-none"
          fontFamily="ui-monospace, monospace"
        >
          <tspan
            className={inputs.a ? "fill-amber-500 dark:fill-yellow-400" : ""}
          >
            A
          </tspan>
          <tspan> ∧ </tspan>
          <tspan
            className={inputs.b ? "fill-amber-500 dark:fill-yellow-400" : ""}
          >
            B
          </tspan>
          <tspan> = </tspan>
          <tspan
            className={
              isCircuitComplete ? "fill-emerald-500 dark:fill-emerald-400" : ""
            }
            fontWeight={isCircuitComplete ? "600" : "400"}
          >
            {isCircuitComplete ? "1" : "0"}
          </tspan>
        </text>
      </svg>

      {/* Subtle interaction hint */}
      <p className="text-center text-neutral-400 dark:text-neutral-600 text-xs mt-2 opacity-60">
        click A or B to apply voltage
      </p>
    </div>
  );
}

