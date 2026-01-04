import { useState, useEffect } from "react";

interface SwitchState {
  a: boolean;
  b: boolean;
}

export default function SeriesAndGate() {
  const [switches, setSwitches] = useState<SwitchState>({ a: false, b: false });
  const [electricityOffset, setElectricityOffset] = useState(0);

  const isCircuitComplete = switches.a && switches.b;

  // Animate electricity flow
  useEffect(() => {
    if (!isCircuitComplete) return;

    const interval = setInterval(() => {
      setElectricityOffset((prev) => (prev + 2) % 24);
    }, 40);

    return () => clearInterval(interval);
  }, [isCircuitComplete]);

  const toggleSwitch = (which: "a" | "b") => {
    setSwitches((prev) => ({ ...prev, [which]: !prev[which] }));
  };

  // Colors based on theme (using CSS variables approach)
  const wireColor = "currentColor";
  const electricColor = "#3b82f6";

  return (
    <div className="my-8 select-none">
      {/* Main circuit visualization */}
      <div className="relative bg-white dark:bg-neutral-950 rounded-2xl p-4 sm:p-8 overflow-hidden border border-neutral-200 dark:border-neutral-800">
        {/* SVG Circuit */}
        <svg
          viewBox="0 0 600 160"
          className="w-full h-auto text-neutral-800 dark:text-neutral-200"
          style={{ minHeight: "120px" }}
        >
          <defs>
            {/* Glow effect for electricity */}
            <filter id="electricGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ============ CONTINUOUS WIRE PATH ============ */}
          
          {/* Wire segment 1: Power source to Switch A pivot */}
          <line
            x1="45"
            y1="95"
            x2="110"
            y2="95"
            stroke={wireColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Wire segment 2: Switch A contact to Switch B pivot */}
          <line
            x1="190"
            y1="95"
            x2="310"
            y2="95"
            stroke={wireColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          
          {/* Wire segment 3: Switch B contact to Output */}
          <line
            x1="390"
            y1="95"
            x2="520"
            y2="95"
            stroke={wireColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* ============ ELECTRICITY FLOW OVERLAY ============ */}
          
          {/* Electricity: Power to Switch A (always on) */}
          <line
            x1="45"
            y1="95"
            x2="110"
            y2="95"
            stroke={electricColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 8"
            strokeDashoffset={-electricityOffset}
            filter="url(#electricGlow)"
            opacity="0.9"
          />

          {/* Electricity: Switch A to Switch B (only if A closed) */}
          {switches.a && (
            <line
              x1="190"
              y1="95"
              x2="310"
              y2="95"
              stroke={electricColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 8"
              strokeDashoffset={-electricityOffset}
              filter="url(#electricGlow)"
              opacity="0.9"
            />
          )}

          {/* Electricity: Switch B to Output (only if both closed) */}
          {isCircuitComplete && (
            <line
              x1="390"
              y1="95"
              x2="520"
              y2="95"
              stroke={electricColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 8"
              strokeDashoffset={-electricityOffset}
              filter="url(#electricGlow)"
              opacity="0.9"
            />
          )}

          {/* ============ POWER SOURCE ============ */}
          <g>
            {/* Positive terminal (longer) */}
            <line
              x1="25"
              y1="80"
              x2="25"
              y2="110"
              stroke={wireColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Negative terminal (shorter) */}
            <line
              x1="35"
              y1="86"
              x2="35"
              y2="104"
              stroke={wireColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Connecting wire from battery */}
            <line
              x1="35"
              y1="95"
              x2="45"
              y2="95"
              stroke={wireColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>

          {/* ============ SWITCH A ============ */}
          <g
            onClick={() => toggleSwitch("a")}
            className="cursor-pointer"
          >
            {/* Label A */}
            <text
              x="150"
              y="40"
              fill="currentColor"
              fontSize="24"
              fontWeight="500"
              textAnchor="middle"
              className="select-none pointer-events-none"
            >
              A
            </text>

            {/* Switch pivot point (left contact) */}
            <circle
              cx="110"
              cy="95"
              r="8"
              className="fill-white dark:fill-neutral-950"
              stroke={wireColor}
              strokeWidth="2.5"
            />
            <circle cx="110" cy="95" r="3" fill={wireColor} />

            {/* Switch arm - animates between open (angled up) and closed (horizontal) */}
            <line
              x1="110"
              y1="95"
              x2={switches.a ? "190" : "178"}
              y2={switches.a ? "95" : "50"}
              stroke={wireColor}
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />

            {/* Switch contact point (right) */}
            <circle
              cx="190"
              cy="95"
              r="6"
              className="fill-white dark:fill-neutral-950"
              stroke={wireColor}
              strokeWidth="2.5"
            />
            <circle cx="190" cy="95" r="2" fill={wireColor} />

            {/* Invisible click target */}
            <rect
              x="90"
              y="30"
              width="120"
              height="90"
              fill="transparent"
              className="cursor-pointer"
            />
          </g>

          {/* ============ SWITCH B ============ */}
          <g
            onClick={() => toggleSwitch("b")}
            className="cursor-pointer"
          >
            {/* Label B */}
            <text
              x="350"
              y="40"
              fill="currentColor"
              fontSize="24"
              fontWeight="500"
              textAnchor="middle"
              className="select-none pointer-events-none"
            >
              B
            </text>

            {/* Switch pivot point (left contact) */}
            <circle
              cx="310"
              cy="95"
              r="8"
              className="fill-white dark:fill-neutral-950"
              stroke={wireColor}
              strokeWidth="2.5"
            />
            <circle cx="310" cy="95" r="3" fill={wireColor} />

            {/* Switch arm */}
            <line
              x1="310"
              y1="95"
              x2={switches.b ? "390" : "378"}
              y2={switches.b ? "95" : "50"}
              stroke={wireColor}
              strokeWidth="3"
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
            />

            {/* Switch contact point (right) */}
            <circle
              cx="390"
              cy="95"
              r="6"
              className="fill-white dark:fill-neutral-950"
              stroke={wireColor}
              strokeWidth="2.5"
            />
            <circle cx="390" cy="95" r="2" fill={wireColor} />

            {/* Invisible click target */}
            <rect
              x="290"
              y="30"
              width="120"
              height="90"
              fill="transparent"
              className="cursor-pointer"
            />
          </g>

          {/* ============ OUTPUT ============ */}
          <g>
            {/* Output label */}
            <text
              x="555"
              y="102"
              fontSize="22"
              fontWeight="500"
              textAnchor="middle"
              className={`select-none transition-all duration-300 ${
                isCircuitComplete 
                  ? "fill-blue-500 dark:fill-blue-400" 
                  : "fill-current"
              }`}
              filter={isCircuitComplete ? "url(#electricGlow)" : undefined}
            >
              Out
            </text>
          </g>
        </svg>

        {/* Interaction hint */}
        <p className="text-center text-neutral-500 dark:text-neutral-500 text-sm mt-4">
          Click the switches to toggle them
        </p>
      </div>

      {/* Status display cards */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {/* Switch A Status */}
        <button
          onClick={() => toggleSwitch("a")}
          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
            switches.a
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-500/60 shadow-sm"
              : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600"
          }`}
        >
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
            Switch A
          </div>
          <div
            className={`text-lg font-semibold transition-colors duration-300 ${
              switches.a ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"
            }`}
          >
            {switches.a ? "CLOSED" : "OPEN"}
          </div>
        </button>

        {/* Switch B Status */}
        <button
          onClick={() => toggleSwitch("b")}
          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
            switches.b
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-500/60 shadow-sm"
              : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700/50 hover:border-neutral-300 dark:hover:border-neutral-600"
          }`}
        >
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
            Switch B
          </div>
          <div
            className={`text-lg font-semibold transition-colors duration-300 ${
              switches.b ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"
            }`}
          >
            {switches.b ? "CLOSED" : "OPEN"}
          </div>
        </button>

        {/* Output Status */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            isCircuitComplete
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/60 shadow-sm"
              : "bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700/50"
          }`}
        >
          <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
            Output
          </div>
          <div
            className={`text-lg font-semibold transition-colors duration-300 ${
              isCircuitComplete ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"
            }`}
          >
            {isCircuitComplete ? "ON" : "OFF"}
          </div>
        </div>
      </div>

      {/* Boolean expression */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex-wrap justify-center">
          <span className="text-neutral-500 text-sm">Boolean:</span>
          <code className="text-sm bg-transparent border-0 px-0 font-mono whitespace-nowrap">
            <span
              className={`transition-colors duration-300 ${
                switches.a ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"
              }`}
            >
              A
            </span>
            <span className="text-neutral-400 mx-1">AND</span>
            <span
              className={`transition-colors duration-300 ${
                switches.b ? "text-blue-600 dark:text-blue-400" : "text-neutral-400"
              }`}
            >
              B
            </span>
            <span className="text-neutral-400 mx-1">=</span>
            <span
              className={`font-semibold transition-colors duration-300 ${
                isCircuitComplete ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"
              }`}
            >
              {isCircuitComplete ? "TRUE" : "FALSE"}
            </span>
          </code>
        </div>
      </div>
    </div>
  );
}
