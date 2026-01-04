import { useState, useEffect, useRef } from "react";

interface SwitchState {
  a: boolean;
  b: boolean;
}

interface Particle {
  id: number;
  x: number;
  progress: number;
}

export default function SwitchAndGate() {
  const [switches, setSwitches] = useState<SwitchState>({ a: false, b: false });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const isCircuitComplete = switches.a && switches.b;

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
    const spawnInterval = 400; // ms between particles

    const animate = (time: number) => {
      // Spawn new particles
      if (time - lastSpawn > spawnInterval) {
        lastSpawn = time;
        particleIdRef.current += 1;
        setParticles((prev) => [
          ...prev.filter((p) => p.progress < 1.1),
          { id: particleIdRef.current, x: 0, progress: 0 },
        ]);
      }

      // Update particle positions
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 0.008 }))
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

  const toggleSwitch = (which: "a" | "b") => {
    setSwitches((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  // Path coordinates for particle animation
  const getParticlePosition = (progress: number) => {
    // Total path: power(30) -> switchA(130) -> switchA_end(210) -> switchB(330) -> switchB_end(410) -> out(530)
    const totalLength = 500;
    const x = 30 + progress * totalLength;
    return { x, y: 60 };
  };

  // How far electricity flows based on switch states
  const getElectricityEnd = () => {
    if (!switches.a) return 130; // Stop at switch A
    if (!switches.b) return 330; // Stop at switch B
    return 530; // Full circuit
  };

  const electricityEnd = getElectricityEnd();

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="0 0 560 120"
        className="w-full h-auto"
        style={{ minHeight: "100px" }}
      >
        <defs>
          {/* Glow filter for active elements */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Softer glow for particles */}
          <filter
            id="particleGlow"
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

          {/* Gradient for electricity flow */}
          <linearGradient
            id="electricGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ============ BASE WIRE (inactive) ============ */}
        <line
          x1="30"
          y1="60"
          x2="530"
          y2="60"
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ============ ACTIVE WIRE (shows electricity progress) ============ */}
        <line
          x1="30"
          y1="60"
          x2={electricityEnd}
          y2="60"
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
                filter="url(#particleGlow)"
                style={{ opacity }}
              />
            );
          })}

        {/* ============ POWER SOURCE ============ */}
        <g className="text-neutral-600 dark:text-neutral-400">
          {/* Battery symbol */}
          <line
            x1="10"
            y1="45"
            x2="10"
            y2="75"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="50"
            x2="20"
            y2="70"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="60"
            x2="30"
            y2="60"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* + symbol */}
          <text
            x="10"
            y="38"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
            fill="currentColor"
          >
            +
          </text>
        </g>

        {/* ============ SWITCH A ============ */}
        <g onClick={() => toggleSwitch("a")} className="cursor-pointer group">
          {/* Label */}
          <text
            x="170"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              switches.a
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            A
          </text>

          {/* Contact points */}
          <circle
            cx="130"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-500 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />
          <circle
            cx="210"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-500 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="130"
            y1="60"
            x2={switches.a ? "210" : "200"}
            y2={switches.a ? "60" : "25"}
            className={`transition-all duration-500 ease-out group-hover:stroke-amber-400 ${
              switches.a
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect x="110" y="15" width="120" height="60" fill="transparent" />
        </g>

        {/* ============ SWITCH B ============ */}
        <g onClick={() => toggleSwitch("b")} className="cursor-pointer group">
          {/* Label */}
          <text
            x="370"
            y="25"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              switches.b
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Contact points */}
          <circle
            cx="330"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              switches.a
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-500 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />
          <circle
            cx="410"
            cy="60"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              isCircuitComplete
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-500 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="330"
            y1="60"
            x2={switches.b ? "410" : "400"}
            y2={switches.b ? "60" : "25"}
            className={`transition-all duration-500 ease-out group-hover:stroke-amber-400 ${
              switches.b
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Invisible hit area */}
          <rect x="310" y="15" width="120" height="60" fill="transparent" />
        </g>

        {/* ============ OUTPUT INDICATOR ============ */}
        <g>
          {/* Output circle/bulb */}
          <circle
            cx="530"
            cy="60"
            r="12"
            className={`transition-all duration-500 ${
              isCircuitComplete
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-200 dark:fill-neutral-800"
            }`}
            style={{
              filter: isCircuitComplete ? "url(#glow)" : "none",
            }}
          />
          <circle
            cx="530"
            cy="60"
            r="12"
            className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
            strokeWidth="2"
            style={{
              opacity: isCircuitComplete ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />
        </g>

        {/* ============ BOOLEAN EXPRESSION ============ */}
        <text
          x="280"
          y="105"
          fontSize="13"
          textAnchor="middle"
          className="fill-neutral-400 dark:fill-neutral-600 select-none"
          fontFamily="ui-monospace, monospace"
        >
          <tspan
            className={switches.a ? "fill-amber-500 dark:fill-yellow-400" : ""}
          >
            A
          </tspan>
          <tspan> ∧ </tspan>
          <tspan
            className={switches.b ? "fill-amber-500 dark:fill-yellow-400" : ""}
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
        click the switches
      </p>
    </div>
  );
}
