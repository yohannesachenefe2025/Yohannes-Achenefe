import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { calculateAcceleration, PhysicsCalculationResult } from '../physics/tools';
import { PhysicsGraphCard } from './PhysicsGraphCard';

export const InteractiveGraphs: React.FC = () => {
  const [activeSimulation, setActiveSimulation] = useState<'velocity_time' | 'projectile' | 'newton_fbd' | 'shm'>('velocity_time');

  // Velocity-Time simulation parameters
  const [u, setU] = useState<number>(5);
  const [v, setV] = useState<number>(25);
  const [t, setT] = useState<number>(4);
  const [vtResult, setVtResult] = useState<PhysicsCalculationResult | null>(null);
  const [carAnimProgress, setCarAnimProgress] = useState<number>(0);
  const [isCarPlaying, setIsCarPlaying] = useState<boolean>(false);

  // Projectile simulation parameters
  const [v0, setV0] = useState<number>(25);
  const [angle, setAngle] = useState<number>(45);
  const [gravity, setGravity] = useState<number>(9.8);
  const [projectileAnimTime, setProjectileAnimTime] = useState<number>(0);
  const [isProjectilePlaying, setIsProjectilePlaying] = useState<boolean>(false);

  // Newton FBD parameters
  const [fbdMass, setFbdMass] = useState<number>(5.0);
  const [fbdForce, setFbdForce] = useState<number>(25.0);
  const [fbdMu, setFbdMu] = useState<number>(0.2);

  // Calculate v-t graph whenever parameters change
  useEffect(() => {
    try {
      if (t > 0) {
        const res = calculateAcceleration(u, v, t);
        setVtResult(res);
      }
    } catch {
      // Invalid state handled gracefully
    }
  }, [u, v, t]);

  // Car Animation loop
  useEffect(() => {
    let animId: number;
    if (isCarPlaying) {
      const startTime = performance.now();
      const durationMs = t * 1000;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const fraction = Math.min(1, elapsed / durationMs);
        setCarAnimProgress(fraction);

        if (fraction < 1) {
          animId = requestAnimationFrame(step);
        } else {
          setIsCarPlaying(false);
        }
      };

      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isCarPlaying, t]);

  // Projectile flight stats
  const rad = (angle * Math.PI) / 180;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);
  const totalFlightTime = (2 * v0y) / gravity;
  const maxRange = v0x * totalFlightTime;
  const maxHeight = (v0y * v0y) / (2 * gravity);

  // Projectile Animation loop
  useEffect(() => {
    let animId: number;
    if (isProjectilePlaying) {
      const startTime = performance.now();
      const durationMs = totalFlightTime * 1000;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const currentSimTime = Math.min(totalFlightTime, (elapsed / durationMs) * totalFlightTime);
        setProjectileAnimTime(currentSimTime);

        if (currentSimTime < totalFlightTime) {
          animId = requestAnimationFrame(step);
        } else {
          setIsProjectilePlaying(false);
        }
      };

      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isProjectilePlaying, totalFlightTime]);

  // Newton FBD calculations
  const weight = fbdMass * 9.8;
  const normal = weight;
  const maxStaticFriction = fbdMu * normal;
  const netForce = Math.max(0, fbdForce - maxStaticFriction);
  const fbdAcceleration = netForce / fbdMass;

  // External PhET simulation links (truthful attribution per Section 12)
  const phetSimulations = [
    {
      title: 'Forces and Motion: Basics',
      topics: 'Net force, friction, acceleration, Newton\'s laws',
      url: 'https://phet.colorado.edu/en/simulations/forces-and-motion-basics',
    },
    {
      title: 'Projectile Motion',
      topics: 'Launch angle, initial speed, air resistance, trajectory',
      url: 'https://phet.colorado.edu/en/simulations/projectile-motion',
    },
    {
      title: 'Energy Skate Park',
      topics: 'Kinetic, potential, and thermal energy conservation',
      url: 'https://phet.colorado.edu/en/simulations/energy-skate-park',
    },
    {
      title: 'Wave on a String',
      topics: 'Frequency, amplitude, wave speed, standing waves',
      url: 'https://phet.colorado.edu/en/simulations/wave-on-a-string',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Interactive Physics Graphs & Simulations
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic scientific visualization lab supporting kinematics, projectile trajectories, dynamics, and energy.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium space-x-1">
          <button
            onClick={() => setActiveSimulation('velocity_time')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSimulation === 'velocity_time'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Velocity–Time (v–t)
          </button>
          <button
            onClick={() => setActiveSimulation('projectile')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSimulation === 'projectile'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Projectile Motion
          </button>
          <button
            onClick={() => setActiveSimulation('newton_fbd')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSimulation === 'newton_fbd'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Newton's 2nd Law & FBD
          </button>
        </div>
      </div>

      {/* ---------------- SIMULATION 1: VELOCITY-TIME GRAPH (Core Section 12) ---------------- */}
      {activeSimulation === 'velocity_time' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  Kinematic Motion Parameters
                </h3>
              </div>
              <button
                onClick={() => {
                  setU(5);
                  setV(25);
                  setT(4);
                }}
                className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                title="Reset to Acceptance Test B values"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset (Test B)</span>
              </button>
            </div>

            {/* Slider 1: Initial Velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Initial Velocity (u):</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{u} m/s</span>
              </div>
              <input
                type="range"
                min="-20"
                max="50"
                step="1"
                value={u}
                onChange={(e) => setU(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-20 m/s</span>
                <span>0 m/s</span>
                <span>50 m/s</span>
              </div>
            </div>

            {/* Slider 2: Final Velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Final Velocity (v):</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{v} m/s</span>
              </div>
              <input
                type="range"
                min="-20"
                max="60"
                step="1"
                value={v}
                onChange={(e) => setV(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-20 m/s</span>
                <span>0 m/s</span>
                <span>60 m/s</span>
              </div>
            </div>

            {/* Slider 3: Time Interval */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Time Interval (t):</span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{t} s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={t}
                onChange={(e) => setT(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5 s</span>
                <span>10 s</span>
                <span>20 s</span>
              </div>
            </div>

            {/* Calculated Values Summary */}
            {vtResult && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Calculated Acceleration ($a$):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {vtResult.output.value} m/s²
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Graph Slope (Δv / Δt):</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    ({v} - {u}) / {t} = {vtResult.output.value} m/s²
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Area Under Curve (Displacement $s$):</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {vtResult.graphData?.summary.areaUnderCurve?.value} m
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Formula:</strong>{' '}
                  <code>a = (v - u) / t</code> | <code>s = ((u + v)/2) × t</code>
                </div>
              </div>
            )}

            {/* Live Motion Animation Player */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Motion Animation Preview</span>
                <button
                  onClick={() => {
                    setCarAnimProgress(0);
                    setIsCarPlaying(true);
                  }}
                  disabled={isCarPlaying}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>{isCarPlaying ? 'Simulating...' : 'Play Motion'}</span>
                </button>
              </div>

              {/* Highway Track */}
              <div className="relative h-14 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center px-4">
                {/* Road markings */}
                <div className="absolute inset-x-0 h-0.5 border-b border-dashed border-slate-700"></div>

                {/* Animated Object (Vehicle / Particle) */}
                <div
                  className="absolute transition-transform duration-75 flex flex-col items-center"
                  style={{
                    left: `${Math.max(4, Math.min(88, carAnimProgress * 85 + 4))}%`,
                  }}
                >
                  <div className="w-7 h-5 rounded-md bg-gradient-to-r from-amber-500 to-amber-400 border border-amber-300 shadow-md flex items-center justify-center text-[10px] font-bold text-slate-950">
                    🚗
                  </div>
                  <span className="text-[9px] font-mono text-amber-300 mt-0.5">
                    {(u + (v - u) * carAnimProgress).toFixed(1)} m/s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Display Panel */}
          <div className="lg:col-span-7 space-y-4">
            {vtResult && vtResult.graphData && (
              <PhysicsGraphCard graphData={vtResult.graphData} />
            )}

            {/* Scientific Explanation Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-blue-600 font-semibold">
                <Info className="w-4 h-4" />
                <span>Pedagogical Principles of the Velocity–Time Graph</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Slope represents Acceleration:</strong> The steepness of the tangent line directly equals acceleration (a = Δv/Δt). A positive slope means velocity is increasing; a horizontal line (slope = 0) represents uniform motion.
                </li>
                <li>
                  <strong>Area Under the Curve represents Displacement:</strong> By the fundamental theorem of calculus, net displacement equals the integral of velocity over time: Δs = ∫ v(t) dt. For uniform acceleration, this geometric area is a trapezoid: s = ((u + v)/2) × t.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SIMULATION 2: PROJECTILE MOTION ---------------- */}
      {activeSimulation === 'projectile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Launch Parameters
              </h3>
              <button
                onClick={() => {
                  setProjectileAnimTime(0);
                  setIsProjectilePlaying(true);
                }}
                disabled={isProjectilePlaying}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium flex items-center space-x-1"
              >
                <Play className="w-3 h-3" />
                <span>Fire Projectile</span>
              </button>
            </div>

            {/* Launch velocity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Launch Velocity (v₀):</span>
                <span className="font-mono font-bold text-blue-600">{v0} m/s</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={v0}
                onChange={(e) => setV0(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Angle */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Launch Angle (θ):</span>
                <span className="font-mono font-bold text-amber-600">{angle}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                value={angle}
                onChange={(e) => setAngle(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Gravity environment */}
            <div className="space-y-1.5">
              <span className="text-slate-600 dark:text-slate-400 text-xs">Gravitational Field:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setGravity(9.8)}
                  className={`py-1.5 rounded-lg text-xs font-medium border ${
                    gravity === 9.8 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Earth (9.8)
                </button>
                <button
                  onClick={() => setGravity(1.62)}
                  className={`py-1.5 rounded-lg text-xs font-medium border ${
                    gravity === 1.62 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Moon (1.62)
                </button>
                <button
                  onClick={() => setGravity(3.71)}
                  className={`py-1.5 rounded-lg text-xs font-medium border ${
                    gravity === 3.71 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Mars (3.71)
                </button>
              </div>
            </div>

            {/* Analytical Results */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Flight Time:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {totalFlightTime.toFixed(2)} s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Horizontal Range (R):</span>
                <span className="font-mono font-bold text-blue-600">
                  {maxRange.toFixed(2)} m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Maximum Height (H):</span>
                <span className="font-mono font-bold text-amber-600">
                  {maxHeight.toFixed(2)} m
                </span>
              </div>
            </div>
          </div>

          {/* Projectile Canvas Area */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center">
            <svg viewBox="0 0 500 280" className="w-full max-w-lg h-auto select-none">
              {/* Ground */}
              <line x1="30" y1="240" x2="470" y2="240" stroke="#475569" strokeWidth="2" />

              {/* Trajectory Parabola */}
              {(() => {
                const pts: string[] = [];
                for (let i = 0; i <= 40; i++) {
                  const simT = (totalFlightTime * i) / 40;
                  const x = v0x * simT;
                  const y = Math.max(0, v0y * simT - 0.5 * gravity * simT * simT);
                  const svgX = 40 + (x / maxRange) * 420;
                  const svgY = 240 - (y / (maxHeight * 1.3 || 1)) * 180;
                  pts.push(`${svgX},${svgY}`);
                }
                return (
                  <polyline
                    points={pts.join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                );
              })()}

              {/* Animated Cannonball */}
              {(() => {
                const curT = isProjectilePlaying ? projectileAnimTime : totalFlightTime / 2;
                const x = v0x * curT;
                const y = Math.max(0, v0y * curT - 0.5 * gravity * curT * curT);
                const svgX = 40 + (x / maxRange) * 420;
                const svgY = 240 - (y / (maxHeight * 1.3 || 1)) * 180;
                return (
                  <g>
                    <circle cx={svgX} cy={svgY} r="7" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                    <text x={svgX} y={svgY - 12} fill="#cbd5e1" fontSize="10" textAnchor="middle">
                      ({x.toFixed(1)}m, {y.toFixed(1)}m)
                    </text>
                  </g>
                );
              })()}

              {/* Cannon / Launcher base */}
              <circle cx="40" cy="240" r="12" fill="#64748b" />
            </svg>
            <div className="mt-2 text-xs text-slate-400">
              Optimal launch angle for maximum range on level ground in vacuum: <strong>45.0°</strong>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SIMULATION 3: NEWTON'S 2ND LAW & FREE-BODY DIAGRAM ---------------- */}
      {activeSimulation === 'newton_fbd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm border-b pb-2">
              Forces & Mass Settings
            </h3>

            {/* Mass */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Mass (m):</span>
                <span className="font-mono font-bold">{fbdMass} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={fbdMass}
                onChange={(e) => setFbdMass(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Applied Force */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Applied Pulling Force (F_app):</span>
                <span className="font-mono font-bold text-emerald-600">{fbdForce} N</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={fbdForce}
                onChange={(e) => setFbdForce(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Friction coef */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Coefficient of Friction (μ):</span>
                <span className="font-mono font-bold text-rose-600">{fbdMu}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={fbdMu}
                onChange={(e) => setFbdMu(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2 text-xs border">
              <div className="flex justify-between">
                <span>Gravity Weight (W = mg):</span>
                <span className="font-mono">{weight.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between">
                <span>Friction Opposing (f_k = μN):</span>
                <span className="font-mono text-rose-600">{maxStaticFriction.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between">
                <span>Net Horizontal Force (ΣF_x):</span>
                <span className="font-mono font-bold text-blue-600">{netForce.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-sm">
                <span>Resultant Acceleration (a = ΣF/m):</span>
                <span className="font-mono text-emerald-600">{fbdAcceleration.toFixed(2)} m/s²</span>
              </div>
            </div>
          </div>

          {/* Free-Body Diagram Canvas */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto select-none">
              {/* Surface */}
              <line x1="40" y1="210" x2="360" y2="210" stroke="#64748b" strokeWidth="3" />

              {/* Block Crate */}
              <rect x="150" y="130" width="100" height="80" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <text x="200" y="175" fill="#f8fafc" fontSize="14" fontWeight="bold" textAnchor="middle">
                {fbdMass} kg
              </text>

              {/* Normal Force Arrow (Up) */}
              <line x1="200" y1="130" x2="200" y2="60" stroke="#34d399" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="210" y="70" fill="#34d399" fontSize="11" fontWeight="600">
                N = {normal.toFixed(1)} N
              </text>

              {/* Gravity Arrow (Down) */}
              <line x1="200" y1="210" x2="200" y2="280" stroke="#f87171" strokeWidth="3" />
              <text x="210" y="275" fill="#f87171" fontSize="11" fontWeight="600">
                W = {weight.toFixed(1)} N
              </text>

              {/* Applied Force Arrow (Right) */}
              <line x1="250" y1="170" x2={250 + Math.min(100, fbdForce * 1.4)} y2="170" stroke="#38bdf8" strokeWidth="3" />
              <text x="260" y="160" fill="#38bdf8" fontSize="11" fontWeight="600">
                F_app = {fbdForce} N
              </text>

              {/* Friction Force Arrow (Left) */}
              <line x1="150" y1="170" x2={150 - Math.min(80, maxStaticFriction * 1.4)} y2="170" stroke="#fbbf24" strokeWidth="3" />
              <text x="70" y="160" fill="#fbbf24" fontSize="11" fontWeight="600">
                f = {maxStaticFriction.toFixed(1)} N
              </text>
            </svg>
            <div className="mt-2 text-xs text-slate-400">
              Free-Body Diagram representing orthogonal equilibrium (ΣF_y = 0) and dynamic acceleration (ΣF_x = ma).
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Official PhET Simulations Attribution Links (Section 12 requirement) ---------------- */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <Layers className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Recommended Official PhET Interactive Simulations (University of Colorado Boulder)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          In accordance with scientific and educational integrity standards, these established simulations are linked directly to their official platforms:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {phetSimulations.map((sim, i) => (
            <a
              key={i}
              href={sim.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600">
                  <span>{sim.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{sim.topics}</p>
              </div>
              <span className="text-[10px] text-blue-500 font-medium mt-3 inline-block">
                Launch Official PhET Sim →
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
