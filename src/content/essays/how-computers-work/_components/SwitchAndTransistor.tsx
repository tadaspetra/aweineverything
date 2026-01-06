import { useState, useEffect, useRef } from "react";

interface ComponentState {
  switchClosed: boolean;
  transistorOn: boolean;
}

interface Particle {
  id: number;
  progress: number;
  circuit: "switch" | "transistor";
}

export default function SwitchAndTransistor() {
  const [state, setState] = useState<ComponentState>({
    switchClosed: false,
    transistorOn: false,
  });
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const toggleSwitch = () => {
    setState((prev) => ({ ...prev, switchClosed: !prev.switchClosed }));
  };

  const toggleTransistor = () => {
    setState((prev) => ({ ...prev, transistorOn: !prev.transistorOn }));
  };

  // Particle animation system
  useEffect(() => {
    const hasActiveCircuit = state.switchClosed || state.transistorOn;
    
    if (!hasActiveCircuit) {
      setParticles([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastSwitchSpawn = 0;
    let lastTransistorSpawn = 0;
    const spawnInterval = 500;

    const animate = (time: number) => {
      // Collect new particles to add
      const newParticles: Particle[] = [];

      // Spawn particles for switch circuit
      if (state.switchClosed && time - lastSwitchSpawn > spawnInterval) {
        lastSwitchSpawn = time;
        particleIdRef.current += 1;
        newParticles.push({ id: particleIdRef.current, progress: 0, circuit: "switch" });
      }

      // Spawn particles for transistor circuit
      if (state.transistorOn && time - lastTransistorSpawn > spawnInterval) {
        lastTransistorSpawn = time;
        particleIdRef.current += 1;
        newParticles.push({ id: particleIdRef.current, progress: 0, circuit: "transistor" });
      }

      // Update particle positions and add new ones in a single state update
      setParticles((prev) => [
        ...prev
          .map((p) => ({ ...p, progress: p.progress + 0.012 }))
          .filter((p) => p.progress < 1.1),
        ...newParticles,
      ]);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.switchClosed, state.transistorOn]);

  // Get particle position for switch circuit (horizontal flow)
  const getSwitchParticlePosition = (progress: number) => {
    // Flow from battery (42) through switch to output (225)
    const startX = 42;
    const endX = 225;
    const x = startX + progress * (endX - startX);
    return { x, y: 110 };
  };

  // Get particle position for transistor circuit (vertical then horizontal)
  const getTransistorParticlePosition = (progress: number) => {
    // Flow from battery top (480, 18) down through transistor to output (565, 175)
    const startY = 18;
    const junctionY = 175;
    const outputX = 565;
    
    // 0 to 0.7: vertical movement down
    // 0.7 to 1: horizontal movement to output
    if (progress < 0.7) {
      const verticalProgress = progress / 0.7;
      const y = startY + verticalProgress * (junctionY - startY);
      return { x: 480, y };
    } else {
      const horizontalProgress = (progress - 0.7) / 0.3;
      const x = 480 + horizontalProgress * (outputX - 480);
      return { x, y: junctionY };
    }
  };

  return (
    <div className="my-12 -mx-4 sm:mx-0">
      <svg
        viewBox="0 0 650 220"
        className="w-full h-auto"
        style={{ minHeight: "180px" }}
      >
        <defs>
          {/* Glow filter for output indicators */}
          <filter id="outputGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
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
        </defs>

        {/* ============ ELECTRICITY PARTICLES ============ */}
        {particles
          .filter((p) => 
            (p.circuit === "switch" && state.switchClosed) || 
            (p.circuit === "transistor" && state.transistorOn)
          )
          .map((particle) => {
            const pos = particle.circuit === "switch" 
              ? getSwitchParticlePosition(particle.progress)
              : getTransistorParticlePosition(particle.progress);
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

        {/* ============ SWITCH CIRCUIT (Left Side) ============ */}
        <g onClick={toggleSwitch} className="cursor-pointer group">
          {/* Power source */}
          <g className="text-amber-500 dark:text-yellow-400">
            {/* Battery positive line */}
            <line
              x1="30"
              y1="95"
              x2="30"
              y2="125"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Battery negative line */}
            <line
              x1="42"
              y1="102"
              x2="42"
              y2="118"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* + symbol */}
            <text
              x="30"
              y="88"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              fill="currentColor"
            >
              +
            </text>
          </g>

          {/* Wire from battery to switch */}
          <line
            x1="42"
            y1="110"
            x2="80"
            y2="110"
            className={`transition-colors duration-300 ${
              state.switchClosed
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-amber-400 dark:stroke-yellow-400"
            }`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Left contact point */}
          <circle
            cx="80"
            cy="110"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              state.switchClosed
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-500 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Switch arm */}
          <line
            x1="80"
            y1="110"
            x2={state.switchClosed ? "160" : "148"}
            y2={state.switchClosed ? "110" : "70"}
            className={`transition-all duration-500 ease-out group-hover:stroke-amber-400 ${
              state.switchClosed
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Right contact point */}
          <circle
            cx="160"
            cy="110"
            r="5"
            className={`transition-colors duration-300 group-hover:stroke-amber-400 ${
              state.switchClosed
                ? "fill-amber-400 dark:fill-yellow-400 stroke-amber-500 dark:stroke-yellow-500"
                : "fill-neutral-100 dark:fill-neutral-900 stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Wire from switch to output */}
          <line
            x1="160"
            y1="110"
            x2="210"
            y2="110"
            className={`transition-colors duration-300 ${
              state.switchClosed
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Output indicator (bulb/light) */}
          <circle
            cx="225"
            cy="110"
            r="14"
            className={`transition-all duration-500 ${
              state.switchClosed
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-200 dark:fill-neutral-800"
            }`}
            style={{
              filter: state.switchClosed ? "url(#outputGlow)" : "none",
            }}
          />
          <circle
            cx="225"
            cy="110"
            r="14"
            className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
            strokeWidth="2"
            style={{
              opacity: state.switchClosed ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />

          {/* Invisible hit area */}
          <rect
            x="20"
            y="50"
            width="230"
            height="100"
            fill="transparent"
            className="touch-manipulation"
          />
        </g>

        {/* ============ TRANSISTOR CIRCUIT (Right Side) ============ */}
        {/* Transistor center: (480, 110), radius: 28 */}
        {/* Top edge: 82, Bottom edge: 138, Left edge: 452 */}
        <g onClick={toggleTransistor} className="cursor-pointer group">
          {/* Collector wire from top (voltage in) - outside circle */}
          <line
            x1="480"
            y1="35"
            x2="480"
            y2="82"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-amber-400 dark:stroke-yellow-400"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Voltage source (Battery) */}
          <g className="text-amber-500 dark:text-yellow-400">
            {/* Battery positive line (longer) */}
            <line
              x1="468"
              y1="8"
              x2="492"
              y2="8"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Battery negative line (shorter) */}
            <line
              x1="472"
              y1="18"
              x2="488"
              y2="18"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Connecting wire to circuit */}
            <line
              x1="480"
              y1="18"
              x2="480"
              y2="35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* + symbol */}
            <text
              x="502"
              y="12"
              fontSize="12"
              fontWeight="500"
              fill="currentColor"
            >
              +
            </text>
          </g>

          {/* C Label */}
          <text
            x="498"
            y="60"
            fontSize="16"
            fontWeight="500"
            fontStyle="italic"
            className={`select-none transition-colors duration-300 ${
              state.transistorOn
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            C
          </text>

          {/* Transistor body circle - fill only (renders first, behind everything) */}
          <circle
            cx="480"
            cy="110"
            r="28"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "fill-amber-50 dark:fill-amber-950/30"
                : "fill-neutral-100 dark:fill-neutral-900"
            }`}
          />

          {/* Collector (top) - from circle edge to inside */}
          <line
            x1="480"
            y1="82"
            x2="480"
            y2="95"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Internal vertical bar */}
          <line
            x1="468"
            y1="100"
            x2="468"
            y2="120"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Collector to bar */}
          <line
            x1="480"
            y1="95"
            x2="468"
            y2="103"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter from bar */}
          <line
            x1="468"
            y1="117"
            x2="480"
            y2="125"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Emitter (bottom) with arrow - from inside to circle edge */}
          <line
            x1="480"
            y1="125"
            x2="480"
            y2="138"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow head on emitter */}
          <polygon
            points="480,138 476,130 484,130"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          />

          {/* Base (left side) - from circle edge to bar */}
          <line
            x1="452"
            y1="110"
            x2="468"
            y2="110"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-500 dark:stroke-yellow-400"
                : "stroke-neutral-500 dark:stroke-neutral-500"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Extended base wire to left (outside circle) */}
          <line
            x1="380"
            y1="110"
            x2="452"
            y2="110"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Base input dot (this is what you "toggle") */}
          <circle
            cx="380"
            cy="110"
            r="6"
            className={`transition-all duration-300 group-hover:scale-125 ${
              state.transistorOn
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-300 dark:fill-neutral-700"
            }`}
            style={{ transformOrigin: "380px 110px" }}
          />

          {/* B Label - to the left of the base wire */}
          <text
            x="365"
            y="115"
            fontSize="16"
            fontWeight="500"
            fontStyle="italic"
            textAnchor="middle"
            className={`select-none transition-colors duration-300 ${
              state.transistorOn
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            B
          </text>

          {/* Transistor body circle - stroke only (renders last, on top of everything) */}
          <circle
            cx="480"
            cy="110"
            r="28"
            fill="none"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-400 dark:stroke-yellow-500"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
          />

          {/* Emitter wire going down (outside circle) */}
          <line
            x1="480"
            y1="138"
            x2="480"
            y2="175"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Output wire (horizontal from emitter) */}
          <line
            x1="480"
            y1="175"
            x2="550"
            y2="175"
            className={`transition-colors duration-300 ${
              state.transistorOn
                ? "stroke-amber-400 dark:stroke-yellow-400"
                : "stroke-neutral-400 dark:stroke-neutral-600"
            }`}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Output indicator */}
          <circle
            cx="565"
            cy="175"
            r="14"
            className={`transition-all duration-500 ${
              state.transistorOn
                ? "fill-amber-400 dark:fill-yellow-400"
                : "fill-neutral-200 dark:fill-neutral-800"
            }`}
            style={{
              filter: state.transistorOn ? "url(#outputGlow)" : "none",
            }}
          />
          <circle
            cx="565"
            cy="175"
            r="14"
            className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
            strokeWidth="2"
            style={{
              opacity: state.transistorOn ? 0 : 1,
              transition: "opacity 0.3s",
            }}
          />

          {/* E Label - below the transistor circle */}
          <text
            x="498"
            y="155"
            fontSize="16"
            fontWeight="500"
            fontStyle="italic"
            className={`select-none transition-colors duration-300 ${
              state.transistorOn
                ? "fill-amber-500 dark:fill-yellow-400"
                : "fill-neutral-500 dark:fill-neutral-500"
            }`}
          >
            E
          </text>

          {/* Invisible hit area */}
          <rect
            x="350"
            y="10"
            width="240"
            height="200"
            fill="transparent"
            className="touch-manipulation"
          />
        </g>
      </svg>

      {/* Subtle interaction hint */}
      <p className="text-center text-neutral-400 dark:text-neutral-600 text-xs mt-2 opacity-60">
        click to toggle
      </p>
    </div>
  );
}
