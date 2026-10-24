/**
 * AI Agent Physics Tutor - Deterministic Physics Tools & Registry
 * Developed for Undergraduate Physics Students (Debre Tabor University)
 * Under the guidance of Dr. Yohannes Achenefe
 */

export interface ToolValidationResult {
  valid: boolean;
  error?: string;
}

export interface PhysicsCalculationResult {
  toolId: string;
  toolName: string;
  formula: string;
  formulaLatex: string;
  inputs: Record<string, { value: number; unit: string; description: string }>;
  output: {
    quantity: string;
    symbol: string;
    value: number;
    unit: string;
    formatted: string;
  };
  steps: string[];
  substitutions: string;
  assumptions: string[];
  interpretation: string;
  graphData?: PhysicsGraphData;
}

export interface PhysicsGraphData {
  type: 'velocity_time' | 'displacement_time' | 'acceleration_time' | 'force_displacement' | 'projectile_trajectory';
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  points: Array<{ x: number; y: number }>;
  summary: {
    slope?: { label: string; value: number; unit: string; physicalMeaning: string };
    areaUnderCurve?: { label: string; value: number; unit: string; physicalMeaning: string };
    endpoints?: { start: { x: number; y: number }; end: { x: number; y: number } };
  };
  interpretation: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'kinematics' | 'dynamics' | 'energy' | 'fluids' | 'thermodynamics' | 'visualization';
  parameters: Record<
    string,
    {
      type: 'number' | 'string';
      description: string;
      unit: string;
      required: boolean;
      default?: number;
      min?: number;
      max?: number;
    }
  >;
  execute: (args: Record<string, number>) => PhysicsCalculationResult;
}

// -------------------------------------------------------------
// Tool 1: Calculate Acceleration: a = (v - u) / t
// -------------------------------------------------------------
export function calculateAcceleration(u: number, v: number, t: number): PhysicsCalculationResult {
  if (t === undefined || isNaN(t)) {
    throw new Error('Missing parameter: elapsed time (t) in seconds is required.');
  }
  if (t <= 0) {
    throw new Error(`Invalid elapsed time: t = ${t} s. Elapsed time must be strictly greater than zero (t > 0) to compute average acceleration.`);
  }
  if (u === undefined || isNaN(u)) {
    throw new Error('Missing parameter: initial velocity (u) in m/s is required.');
  }
  if (v === undefined || isNaN(v)) {
    throw new Error('Missing parameter: final velocity (v) in m/s is required.');
  }

  const deltaV = v - u;
  const a = deltaV / t;
  const roundedA = Number(a.toFixed(4));
  const roundedDeltaV = Number(deltaV.toFixed(4));

  // Also construct velocity-time plot data
  const numPoints = 25;
  const points: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= numPoints; i++) {
    const curT = (t * i) / numPoints;
    const curV = u + a * curT;
    points.push({ x: Number(curT.toFixed(3)), y: Number(curV.toFixed(3)) });
  }

  // Displacement is area under curve: trapezoid = ((u + v) / 2) * t
  const displacement = ((u + v) / 2) * t;

  const interpretation =
    a === 0
      ? `The acceleration is 0 m/s². The object maintains a uniform, constant velocity of ${u} m/s with no net force acting upon it.`
      : a > 0
      ? `The acceleration is positive (+${roundedA} m/s²). The object's velocity increases by ${roundedA} m/s every second in the chosen reference direction under constant acceleration.`
      : `The acceleration is negative (${roundedA} m/s²), representing deceleration/braking. The object slows down by ${Math.abs(roundedA)} m/s each second.`;

  return {
    toolId: 'calculate_acceleration',
    toolName: 'Calculate Acceleration',
    formula: 'a = (v - u) / t',
    formulaLatex: 'a = \\frac{v - u}{t}',
    inputs: {
      u: { value: u, unit: 'm/s', description: 'Initial velocity' },
      v: { value: v, unit: 'm/s', description: 'Final velocity' },
      t: { value: t, unit: 's', description: 'Elapsed time' },
    },
    output: {
      quantity: 'Acceleration',
      symbol: 'a',
      value: roundedA,
      unit: 'm/s²',
      formatted: `${roundedA} m/s²`,
    },
    steps: [
      `Identify known quantities: initial velocity u = ${u} m/s, final velocity v = ${v} m/s, time t = ${t} s.`,
      `Recall the definition of uniform linear acceleration: a = Δv / Δt = (v - u) / t.`,
      `Compute velocity difference: Δv = ${v} m/s - (${u} m/s) = ${roundedDeltaV} m/s.`,
      `Divide by elapsed time: a = ${roundedDeltaV} m/s / ${t} s = ${roundedA} m/s².`,
    ],
    substitutions: `a = \\frac{${v} - ${u}}{${t}} = \\frac{${roundedDeltaV}}{${t}} = ${roundedA}\\,\\text{m/s}^2`,
    assumptions: [
      'Acceleration is assumed to be constant (uniform linear motion) during the interval.',
      'Motion is constrained to a single spatial dimension.',
      'Air resistance or other non-conservative resistive forces are neglected unless specified.',
    ],
    interpretation,
    graphData: {
      type: 'velocity_time',
      title: 'Velocity vs. Time Graph',
      xLabel: 'Time',
      yLabel: 'Velocity',
      xUnit: 's',
      yUnit: 'm/s',
      points,
      summary: {
        slope: {
          label: 'Slope (Acceleration)',
          value: roundedA,
          unit: 'm/s²',
          physicalMeaning: 'Rate of change of velocity with respect to time.',
        },
        areaUnderCurve: {
          label: 'Area Under Curve (Displacement)',
          value: Number(displacement.toFixed(3)),
          unit: 'm',
          physicalMeaning: 'Total net displacement s = ((u + v)/2) × t.',
        },
        endpoints: {
          start: { x: 0, y: u },
          end: { x: t, y: v },
        },
      },
      interpretation: `Linear slope indicates constant acceleration of ${roundedA} m/s². The trapezoidal area beneath the line represents a net displacement of ${displacement.toFixed(2)} m.`,
    },
  };
}

// -------------------------------------------------------------
// Tool 2: Calculate Displacement under Constant Acceleration: s = ut + 0.5 * a * t^2
// -------------------------------------------------------------
export function calculateDisplacement(u: number, a: number, t: number): PhysicsCalculationResult {
  if (t === undefined || isNaN(t)) {
    throw new Error('Elapsed time (t) in seconds is required.');
  }
  if (t < 0) {
    throw new Error(`Elapsed time cannot be negative (received t = ${t} s).`);
  }
  if (u === undefined || isNaN(u)) {
    throw new Error('Initial velocity (u) in m/s is required.');
  }
  if (a === undefined || isNaN(a)) {
    throw new Error('Acceleration (a) in m/s² is required.');
  }

  const term1 = u * t;
  const term2 = 0.5 * a * t * t;
  const s = term1 + term2;
  const roundedS = Number(s.toFixed(4));

  const points: Array<{ x: number; y: number }> = [];
  const stepsCount = 25;
  for (let i = 0; i <= stepsCount; i++) {
    const curT = (t * i) / stepsCount;
    const curS = u * curT + 0.5 * a * curT * curT;
    points.push({ x: Number(curT.toFixed(3)), y: Number(curS.toFixed(3)) });
  }

  return {
    toolId: 'calculate_displacement',
    toolName: 'Calculate Displacement (Kinematic Equation 2)',
    formula: 's = ut + (1/2) a t²',
    formulaLatex: 's = u t + \\frac{1}{2} a t^2',
    inputs: {
      u: { value: u, unit: 'm/s', description: 'Initial velocity' },
      a: { value: a, unit: 'm/s²', description: 'Constant acceleration' },
      t: { value: t, unit: 's', description: 'Elapsed time' },
    },
    output: {
      quantity: 'Displacement',
      symbol: 's',
      value: roundedS,
      unit: 'm',
      formatted: `${roundedS} m`,
    },
    steps: [
      `State knowns: u = ${u} m/s, a = ${a} m/s², t = ${t} s.`,
      `Apply the second kinematic relation: s = u·t + (1/2)·a·t².`,
      `Calculate initial velocity displacement contribution: u·t = (${u})·(${t}) = ${term1.toFixed(3)} m.`,
      `Calculate acceleration displacement contribution: (1/2)·a·t² = 0.5·(${a})·(${t}²) = ${term2.toFixed(3)} m.`,
      `Sum the contributions: s = ${term1.toFixed(3)} + ${term2.toFixed(3)} = ${roundedS} m.`,
    ],
    substitutions: `s = (${u})(${t}) + \\frac{1}{2}(${a})(${t})^2 = ${term1.toFixed(3)} + ${term2.toFixed(3)} = ${roundedS}\\,\\text{m}`,
    assumptions: [
      'Acceleration remains strictly constant throughout the entire time interval.',
      'Initial position at t = 0 is chosen as the coordinate origin (s_0 = 0 m).',
    ],
    interpretation: `Over the span of ${t} seconds, the object undergoes a net vector displacement of ${roundedS} meters.`,
    graphData: {
      type: 'displacement_time',
      title: 'Displacement vs. Time Graph',
      xLabel: 'Time',
      yLabel: 'Displacement',
      xUnit: 's',
      yUnit: 'm',
      points,
      summary: {
        endpoints: {
          start: { x: 0, y: 0 },
          end: { x: t, y: roundedS },
        },
      },
      interpretation: a === 0
        ? `Linear position-time graph with constant velocity ${u} m/s.`
        : `Parabolic position-time trajectory due to constant acceleration a = ${a} m/s².`,
    },
  };
}

// -------------------------------------------------------------
// Tool 3: Calculate Final Velocity: v = u + at
// -------------------------------------------------------------
export function calculateFinalVelocity(u: number, a: number, t: number): PhysicsCalculationResult {
  if (t === undefined || isNaN(t)) throw new Error('Elapsed time (t) in seconds is required.');
  if (t < 0) throw new Error(`Elapsed time cannot be negative: t = ${t} s.`);
  if (u === undefined || isNaN(u)) throw new Error('Initial velocity (u) in m/s is required.');
  if (a === undefined || isNaN(a)) throw new Error('Acceleration (a) in m/s² is required.');

  const at = a * t;
  const v = u + at;
  const roundedV = Number(v.toFixed(4));

  return {
    toolId: 'calculate_final_velocity',
    toolName: 'Calculate Final Velocity (Kinematic Equation 1)',
    formula: 'v = u + at',
    formulaLatex: 'v = u + a t',
    inputs: {
      u: { value: u, unit: 'm/s', description: 'Initial velocity' },
      a: { value: a, unit: 'm/s²', description: 'Acceleration' },
      t: { value: t, unit: 's', description: 'Elapsed time' },
    },
    output: {
      quantity: 'Final Velocity',
      symbol: 'v',
      value: roundedV,
      unit: 'm/s',
      formatted: `${roundedV} m/s`,
    },
    steps: [
      `List known parameters: u = ${u} m/s, a = ${a} m/s², t = ${t} s.`,
      `Apply the first kinematic relation: v = u + at.`,
      `Calculate velocity increment: a·t = (${a} m/s²) × (${t} s) = ${at.toFixed(3)} m/s.`,
      `Add to initial velocity: v = ${u} + ${at.toFixed(3)} = ${roundedV} m/s.`,
    ],
    substitutions: `v = ${u} + (${a})(${t}) = ${roundedV}\\,\\text{m/s}`,
    assumptions: ['Uniform acceleration along a straight-line coordinate axis.'],
    interpretation: `Starting at ${u} m/s and accelerating at ${a} m/s² for ${t} s, the object reaches a velocity of ${roundedV} m/s.`,
  };
}

// -------------------------------------------------------------
// Tool 4: Calculate Force: F = ma
// -------------------------------------------------------------
export function calculateForce(m: number, a: number): PhysicsCalculationResult {
  if (m === undefined || isNaN(m)) throw new Error('Mass (m) in kilograms is required.');
  if (m <= 0) throw new Error(`Mass must be strictly positive: received m = ${m} kg.`);
  if (a === undefined || isNaN(a)) throw new Error('Acceleration (a) in m/s² is required.');

  const F = m * a;
  const roundedF = Number(F.toFixed(4));

  return {
    toolId: 'calculate_force',
    toolName: "Calculate Net Force (Newton's Second Law)",
    formula: 'F = m * a',
    formulaLatex: 'F_{\\text{net}} = m a',
    inputs: {
      m: { value: m, unit: 'kg', description: 'Inertial mass' },
      a: { value: a, unit: 'm/s²', description: 'Acceleration' },
    },
    output: {
      quantity: 'Net Force',
      symbol: 'F_net',
      value: roundedF,
      unit: 'N',
      formatted: `${roundedF} N`,
    },
    steps: [
      `Identify parameters: mass m = ${m} kg, acceleration a = ${a} m/s².`,
      `Newton's Second Law states that the vector sum of forces equals mass multiplied by acceleration: ΣF = ma.`,
      `Substitute: F = (${m} kg) × (${a} m/s²).`,
      `Compute result: F = ${roundedF} kg·m/s² = ${roundedF} N (Newtons).`,
    ],
    substitutions: `F = (${m})(${a}) = ${roundedF}\\,\\text{N}`,
    assumptions: [
      'Inertial reference frame (non-accelerating frame of observation).',
      'Classical Newtonian regime (speed v ≪ c, no relativistic mass dilation).',
      'F represents the net resultant force acting on the center of mass.',
    ],
    interpretation: `A net resultant force of ${roundedF} Newtons is required to impart an acceleration of ${a} m/s² to an object of mass ${m} kg.`,
  };
}

// -------------------------------------------------------------
// Tool 5: Calculate Work: W = F * d * cos(theta)
// -------------------------------------------------------------
export function calculateWork(F: number, d: number, thetaDeg: number = 0): PhysicsCalculationResult {
  if (F === undefined || isNaN(F)) throw new Error('Force (F) in Newtons is required.');
  if (d === undefined || isNaN(d)) throw new Error('Displacement (d) in meters is required.');
  if (d < 0) throw new Error(`Displacement magnitude d cannot be negative: received ${d} m.`);

  const theta = thetaDeg ?? 0;
  const thetaRad = (theta * Math.PI) / 180;
  const cosTheta = Math.cos(thetaRad);
  const W = F * d * cosTheta;
  const roundedW = Number(W.toFixed(4));

  let workType = 'positive work (energy transferred to the system)';
  if (Math.abs(cosTheta) < 1e-7) {
    workType = 'zero work (force is perpendicular to displacement, e.g., centripetal or normal force)';
  } else if (cosTheta < 0) {
    workType = 'negative work (force opposes motion, e.g., kinetic friction, removing mechanical energy)';
  }

  return {
    toolId: 'calculate_work',
    toolName: 'Calculate Mechanical Work',
    formula: 'W = F * d * cos(θ)',
    formulaLatex: 'W = F d \\cos(\\theta)',
    inputs: {
      F: { value: F, unit: 'N', description: 'Applied constant force magnitude' },
      d: { value: d, unit: 'm', description: 'Displacement magnitude' },
      theta: { value: theta, unit: '°', description: 'Angle between force and displacement vectors' },
    },
    output: {
      quantity: 'Work',
      symbol: 'W',
      value: roundedW,
      unit: 'J',
      formatted: `${roundedW} J`,
    },
    steps: [
      `Given: Force F = ${F} N, displacement d = ${d} m, angle θ = ${theta}°.`,
      `Recall work formula for constant force: W = F·d·cos(θ).`,
      `Evaluate angle factor: cos(${theta}°) = ${cosTheta.toFixed(4)}.`,
      `Calculate product: W = (${F} N) × (${d} m) × (${cosTheta.toFixed(4)}) = ${roundedW} J (Joules).`,
    ],
    substitutions: `W = (${F})(${d})\\cos(${theta}^\\circ) = (${F})(${d})(${cosTheta.toFixed(4)}) = ${roundedW}\\,\\text{J}`,
    assumptions: [
      'The force is constant throughout the entire displacement.',
      'The displacement is along a straight trajectory.',
    ],
    interpretation: `The force performs ${roundedW} Joules of ${workType}.`,
  };
}

// -------------------------------------------------------------
// Tool 6: Calculate Kinetic Energy: KE = 0.5 * m * v^2
// -------------------------------------------------------------
export function calculateKineticEnergy(m: number, v: number): PhysicsCalculationResult {
  if (m === undefined || isNaN(m)) throw new Error('Mass (m) in kilograms is required.');
  if (m <= 0) throw new Error(`Mass must be strictly positive: m = ${m} kg.`);
  if (v === undefined || isNaN(v)) throw new Error('Speed/Velocity (v) in m/s is required.');

  const KE = 0.5 * m * v * v;
  const roundedKE = Number(KE.toFixed(4));

  return {
    toolId: 'calculate_kinetic_energy',
    toolName: 'Calculate Kinetic Energy',
    formula: 'KE = (1/2) * m * v²',
    formulaLatex: 'KE = \\frac{1}{2} m v^2',
    inputs: {
      m: { value: m, unit: 'kg', description: 'Mass of the object' },
      v: { value: v, unit: 'm/s', description: 'Speed of the object' },
    },
    output: {
      quantity: 'Kinetic Energy',
      symbol: 'KE',
      value: roundedKE,
      unit: 'J',
      formatted: `${roundedKE} J`,
    },
    steps: [
      `Given: mass m = ${m} kg, speed v = ${v} m/s.`,
      `Recall kinetic energy definition: KE = (1/2)·m·v².`,
      `Square the speed: v² = (${v} m/s)² = ${(v * v).toFixed(3)} m²/s².`,
      `Compute: KE = 0.5 × ${m} kg × ${(v * v).toFixed(3)} m²/s² = ${roundedKE} J.`,
    ],
    substitutions: `KE = \\frac{1}{2}(${m})(${v})^2 = 0.5 \\times ${m} \\times ${(v * v).toFixed(3)} = ${roundedKE}\\,\\text{J}`,
    assumptions: [
      'Object is treated as a point particle undergoing translational motion without rotation.',
      'Non-relativistic regime (v ≪ c).',
    ],
    interpretation: `The object possesses ${roundedKE} Joules of translational kinetic energy by virtue of its mass and motion.`,
  };
}

// -------------------------------------------------------------
// Tool 7: Calculate Density: rho = m / V
// -------------------------------------------------------------
export function calculateDensity(m: number, V: number): PhysicsCalculationResult {
  if (m === undefined || isNaN(m)) throw new Error('Mass (m) in kilograms is required.');
  if (m <= 0) throw new Error(`Mass must be positive: m = ${m} kg.`);
  if (V === undefined || isNaN(V)) throw new Error('Volume (V) in cubic meters (m³) is required.');
  if (V <= 0) throw new Error(`Volume must be strictly positive: received V = ${V} m³.`);

  const rho = m / V;
  const roundedRho = Number(rho.toFixed(4));

  // Comparison to water at 4°C (1000 kg/m³)
  const waterRatio = roundedRho / 1000;
  const buoyancyNote =
    waterRatio < 1
      ? `Less dense than liquid water (specific gravity = ${waterRatio.toFixed(3)}), so it will float in pure water.`
      : waterRatio === 1
      ? 'Neutral buoyancy in liquid water.'
      : `Denser than liquid water (specific gravity = ${waterRatio.toFixed(3)}), so it will sink in water.`;

  return {
    toolId: 'calculate_density',
    toolName: 'Calculate Density',
    formula: 'ρ = m / V',
    formulaLatex: '\\rho = \\frac{m}{V}',
    inputs: {
      m: { value: m, unit: 'kg', description: 'Mass of the substance' },
      V: { value: V, unit: 'm³', description: 'Volume occupied' },
    },
    output: {
      quantity: 'Density',
      symbol: 'ρ',
      value: roundedRho,
      unit: 'kg/m³',
      formatted: `${roundedRho} kg/m³`,
    },
    steps: [
      `Given: mass m = ${m} kg, volume V = ${V} m³.`,
      `Recall volumetric mass density definition: ρ = m / V.`,
      `Divide mass by volume: ρ = ${m} kg / ${V} m³ = ${roundedRho} kg/m³.`,
    ],
    substitutions: `\\rho = \\frac{${m}\\,\\text{kg}}{${V}\\,\\text{m}^3} = ${roundedRho}\\,\\text{kg/m}^3`,
    assumptions: ['Uniform, homogeneous substance with constant density throughout the sample volume.'],
    interpretation: `The volumetric mass density is ${roundedRho} kg/m³. ${buoyancyNote}`,
  };
}

// -------------------------------------------------------------
// Tool 8: Calculate Pressure: P = F / A
// -------------------------------------------------------------
export function calculatePressure(F: number, A: number): PhysicsCalculationResult {
  if (F === undefined || isNaN(F)) throw new Error('Normal force (F) in Newtons is required.');
  if (A === undefined || isNaN(A)) throw new Error('Contact area (A) in square meters (m²) is required.');
  if (A <= 0) throw new Error(`Area must be strictly greater than zero: received A = ${A} m².`);

  const P = F / A;
  const roundedP = Number(P.toFixed(4));
  const atmRatio = roundedP / 101325;

  return {
    toolId: 'calculate_pressure',
    toolName: 'Calculate Mechanical Pressure',
    formula: 'P = F / A',
    formulaLatex: 'P = \\frac{F}{A}',
    inputs: {
      F: { value: F, unit: 'N', description: 'Perpendicular compressive force' },
      A: { value: A, unit: 'm²', description: 'Surface contact area' },
    },
    output: {
      quantity: 'Pressure',
      symbol: 'P',
      value: roundedP,
      unit: 'Pa',
      formatted: `${roundedP} Pa`,
    },
    steps: [
      `Given: perpendicular force F = ${F} N, contact area A = ${A} m².`,
      `Recall definition of pressure: P = F / A.`,
      `Substitute: P = ${F} N / ${A} m² = ${roundedP} N/m² = ${roundedP} Pa (Pascals).`,
    ],
    substitutions: `P = \\frac{${F}\\,\\text{N}}{${A}\\,\\text{m}^2} = ${roundedP}\\,\\text{Pa}`,
    assumptions: [
      'Force is applied perpendicularly (normal) to the flat surface area.',
      'Pressure is distributed uniformly over the entire contact interface.',
    ],
    interpretation: `The resulting mechanical pressure is ${roundedP} Pa (equivalent to ${atmRatio.toFixed(3)} standard atmospheres).`,
  };
}

// -------------------------------------------------------------
// Tool 9: Calculate Heat Transfer: Q = mcΔT
// -------------------------------------------------------------
export function calculateHeatTransfer(m: number, c: number, deltaT: number): PhysicsCalculationResult {
  if (m === undefined || isNaN(m)) throw new Error('Mass (m) in kilograms is required.');
  if (m <= 0) throw new Error(`Mass must be strictly positive: received m = ${m} kg.`);
  if (c === undefined || isNaN(c)) throw new Error('Specific heat capacity (c) in J/(kg·K) is required.');
  if (c <= 0) throw new Error(`Specific heat capacity must be positive: received c = ${c} J/(kg·K).`);
  if (deltaT === undefined || isNaN(deltaT)) throw new Error('Temperature change (ΔT) in K or °C is required.');

  const Q = m * c * deltaT;
  const roundedQ = Number(Q.toFixed(4));
  const kJ = (roundedQ / 1000).toFixed(3);

  const direction =
    deltaT > 0
      ? 'Endothermic (heat is absorbed by the system, increasing internal thermal energy and temperature).'
      : deltaT < 0
      ? 'Exothermic (heat is released by the system into its surroundings, decreasing temperature).'
      : 'Thermal equilibrium: no net heat transfer occurs since ΔT = 0.';

  return {
    toolId: 'calculate_heat_transfer',
    toolName: 'Calculate Heat Transfer (Calorimetry)',
    formula: 'Q = m * c * ΔT',
    formulaLatex: 'Q = m c \\Delta T',
    inputs: {
      m: { value: m, unit: 'kg', description: 'Mass of the substance' },
      c: { value: c, unit: 'J/(kg·K)', description: 'Specific heat capacity' },
      deltaT: { value: deltaT, unit: 'K / °C', description: 'Temperature change (T_final - T_initial)' },
    },
    output: {
      quantity: 'Heat Transfer',
      symbol: 'Q',
      value: roundedQ,
      unit: 'J',
      formatted: `${roundedQ} J (${kJ} kJ)`,
    },
    steps: [
      `Given: mass m = ${m} kg, specific heat c = ${c} J/(kg·K), temperature change ΔT = ${deltaT} K (°C).`,
      `Recall sensible heat relation: Q = m·c·ΔT.`,
      `Multiply: Q = (${m} kg) × (${c} J/kg·K) × (${deltaT} K) = ${roundedQ} J.`,
    ],
    substitutions: `Q = (${m})(${c})(${deltaT}) = ${roundedQ}\\,\\text{J}`,
    assumptions: [
      'No phase changes occur within this temperature range (sensible heat only).',
      'Specific heat capacity c is assumed constant over the temperature interval.',
      'No heat losses to the external environment (isolated adiabatic container).',
    ],
    interpretation: `Total thermal energy transferred: ${roundedQ} Joules (${kJ} kJ). Sign convention: ${direction}`,
  };
}

// -------------------------------------------------------------
// Tool 10: Generate Physics Graph
// -------------------------------------------------------------
export function generatePhysicsGraph(
  graphType: 'velocity_time' | 'displacement_time' | 'projectile_trajectory' | 'force_displacement',
  params: Record<string, number>
): PhysicsCalculationResult {
  if (graphType === 'velocity_time') {
    const u = params.u ?? 0;
    const v = params.v ?? 20;
    const t = params.t ?? 5;
    if (t <= 0) throw new Error('Time interval must be strictly positive (> 0) for a velocity-time graph.');
    return calculateAcceleration(u, v, t);
  }

  if (graphType === 'displacement_time') {
    const u = params.u ?? 0;
    const a = params.a ?? 2;
    const t = params.t ?? 5;
    if (t <= 0) throw new Error('Time interval must be strictly positive (> 0) for a displacement-time graph.');
    return calculateDisplacement(u, a, t);
  }

  if (graphType === 'force_displacement') {
    const F = params.F ?? 10;
    const d = params.d ?? 5;
    const theta = params.theta ?? 0;
    return calculateWork(F, d, theta);
  }

  if (graphType === 'projectile_trajectory') {
    const v0 = params.v0 ?? 20;
    const thetaDeg = params.theta ?? 45;
    const g = params.g ?? 9.8;
    if (v0 <= 0) throw new Error('Initial launch speed must be positive.');
    if (thetaDeg <= 0 || thetaDeg >= 90) throw new Error('Launch angle must be between 0° and 90° for standard parabolic trajectory.');

    const thetaRad = (thetaDeg * Math.PI) / 180;
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);
    const flightTime = (2 * v0y) / g;
    const maxRange = v0x * flightTime;
    const maxHeight = (v0y * v0y) / (2 * g);

    const points: Array<{ x: number; y: number }> = [];
    const count = 30;
    for (let i = 0; i <= count; i++) {
      const curT = (flightTime * i) / count;
      const x = v0x * curT;
      const y = Math.max(0, v0y * curT - 0.5 * g * curT * curT);
      points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
    }

    return {
      toolId: 'plot_projectile_trajectory',
      toolName: 'Projectile Trajectory Plotter',
      formula: 'y(x) = x tan(θ) - (g x²) / (2 v₀² cos²θ)',
      formulaLatex: 'y(x) = x \\tan(\\theta) - \\frac{g x^2}{2 v_0^2 \\cos^2(\\theta)}',
      inputs: {
        v0: { value: v0, unit: 'm/s', description: 'Launch speed' },
        theta: { value: thetaDeg, unit: '°', description: 'Launch angle' },
        g: { value: g, unit: 'm/s²', description: 'Gravitational acceleration' },
      },
      output: {
        quantity: 'Horizontal Range',
        symbol: 'R',
        value: Number(maxRange.toFixed(2)),
        unit: 'm',
        formatted: `${maxRange.toFixed(2)} m (Max Height: ${maxHeight.toFixed(2)} m, Flight Time: ${flightTime.toFixed(2)} s)`,
      },
      steps: [
        `Decompose initial velocity: v_{0x} = ${v0} cos(${thetaDeg}°) = ${v0x.toFixed(2)} m/s, v_{0y} = ${v0} sin(${thetaDeg}°) = ${v0y.toFixed(2)} m/s.`,
        `Calculate total flight duration: T_{flight} = 2 v_{0y} / g = 2(${v0y.toFixed(2)}) / ${g} = ${flightTime.toFixed(2)} s.`,
        `Compute horizontal range: R = v_{0x} · T_{flight} = ${v0x.toFixed(2)} × ${flightTime.toFixed(2)} = ${maxRange.toFixed(2)} m.`,
        `Compute maximum vertical apex height: H = v_{0y}² / (2g) = ${maxHeight.toFixed(2)} m.`,
      ],
      substitutions: `R = \\frac{(${v0})^2 \\sin(2 \\times ${thetaDeg}^\\circ)}{${g}} = ${maxRange.toFixed(2)}\\,\\text{m}`,
      assumptions: ['Vacuum flight (zero atmospheric drag), uniform flat gravitational field g = 9.8 m/s².'],
      interpretation: `At a launch speed of ${v0} m/s and angle of ${thetaDeg}°, the projectile achieves an apex height of ${maxHeight.toFixed(2)} m and lands at range ${maxRange.toFixed(2)} m after ${flightTime.toFixed(2)} seconds.`,
      graphData: {
        type: 'projectile_trajectory',
        title: `Projectile Trajectory (v₀ = ${v0} m/s, θ = ${thetaDeg}°)`,
        xLabel: 'Horizontal Distance (x)',
        yLabel: 'Vertical Height (y)',
        xUnit: 'm',
        yUnit: 'm',
        points,
        summary: {
          endpoints: {
            start: { x: 0, y: 0 },
            end: { x: Number(maxRange.toFixed(2)), y: 0 },
          },
        },
        interpretation: `Parabolic trajectory with peak height H = ${maxHeight.toFixed(2)} m at x = ${(maxRange / 2).toFixed(2)} m and landing range R = ${maxRange.toFixed(2)} m.`,
      },
    };
  }

  throw new Error(`Unsupported graph type: ${graphType}`);
}

// -------------------------------------------------------------
// Tool Registry for Agent Tool Invocation
// -------------------------------------------------------------
export const PHYSICS_TOOLS: Record<string, ToolDefinition> = {
  calculate_acceleration: {
    id: 'calculate_acceleration',
    name: 'Calculate Acceleration',
    description: 'Calculates linear acceleration from initial velocity (u), final velocity (v), and elapsed time (t) using a = (v - u) / t.',
    category: 'kinematics',
    parameters: {
      u: { type: 'number', description: 'Initial velocity in m/s', unit: 'm/s', required: true },
      v: { type: 'number', description: 'Final velocity in m/s', unit: 'm/s', required: true },
      t: { type: 'number', description: 'Elapsed time in seconds (must be > 0)', unit: 's', required: true, min: 0.0001 },
    },
    execute: (args) => calculateAcceleration(args.u, args.v, args.t),
  },
  calculate_displacement: {
    id: 'calculate_displacement',
    name: 'Calculate Displacement',
    description: 'Calculates displacement under constant acceleration from initial velocity (u), acceleration (a), and time (t) using s = ut + 0.5 a t².',
    category: 'kinematics',
    parameters: {
      u: { type: 'number', description: 'Initial velocity in m/s', unit: 'm/s', required: true },
      a: { type: 'number', description: 'Acceleration in m/s²', unit: 'm/s²', required: true },
      t: { type: 'number', description: 'Time interval in seconds (>= 0)', unit: 's', required: true, min: 0 },
    },
    execute: (args) => calculateDisplacement(args.u, args.a, args.t),
  },
  calculate_final_velocity: {
    id: 'calculate_final_velocity',
    name: 'Calculate Final Velocity',
    description: 'Calculates final velocity from initial velocity (u), acceleration (a), and time (t) using v = u + at.',
    category: 'kinematics',
    parameters: {
      u: { type: 'number', description: 'Initial velocity in m/s', unit: 'm/s', required: true },
      a: { type: 'number', description: 'Acceleration in m/s²', unit: 'm/s²', required: true },
      t: { type: 'number', description: 'Time interval in seconds (>= 0)', unit: 's', required: true, min: 0 },
    },
    execute: (args) => calculateFinalVelocity(args.u, args.a, args.t),
  },
  calculate_force: {
    id: 'calculate_force',
    name: 'Calculate Force',
    description: "Calculates net resultant force from mass (m) and acceleration (a) using Newton's second law F = ma.",
    category: 'dynamics',
    parameters: {
      m: { type: 'number', description: 'Mass in kg (must be > 0)', unit: 'kg', required: true, min: 0.0001 },
      a: { type: 'number', description: 'Acceleration in m/s²', unit: 'm/s²', required: true },
    },
    execute: (args) => calculateForce(args.m, args.a),
  },
  calculate_work: {
    id: 'calculate_work',
    name: 'Calculate Work',
    description: 'Calculates mechanical work done by a constant force over displacement at angle theta using W = F * d * cos(theta).',
    category: 'energy',
    parameters: {
      F: { type: 'number', description: 'Force in Newtons', unit: 'N', required: true },
      d: { type: 'number', description: 'Displacement in meters (>= 0)', unit: 'm', required: true, min: 0 },
      theta: { type: 'number', description: 'Angle between force and displacement in degrees', unit: '°', required: false, default: 0 },
    },
    execute: (args) => calculateWork(args.F, args.d, args.theta ?? 0),
  },
  calculate_kinetic_energy: {
    id: 'calculate_kinetic_energy',
    name: 'Calculate Kinetic Energy',
    description: 'Calculates translational kinetic energy from mass (m) and speed (v) using KE = 0.5 * m * v².',
    category: 'energy',
    parameters: {
      m: { type: 'number', description: 'Mass in kg (must be > 0)', unit: 'kg', required: true, min: 0.0001 },
      v: { type: 'number', description: 'Speed in m/s', unit: 'm/s', required: true },
    },
    execute: (args) => calculateKineticEnergy(args.m, args.v),
  },
  calculate_density: {
    id: 'calculate_density',
    name: 'Calculate Density',
    description: 'Calculates density from mass (m) and volume (V) using rho = m / V.',
    category: 'fluids',
    parameters: {
      m: { type: 'number', description: 'Mass in kg (must be > 0)', unit: 'kg', required: true, min: 0.0001 },
      V: { type: 'number', description: 'Volume in m³ (must be > 0)', unit: 'm³', required: true, min: 0.000001 },
    },
    execute: (args) => calculateDensity(args.m, args.V),
  },
  calculate_pressure: {
    id: 'calculate_pressure',
    name: 'Calculate Pressure',
    description: 'Calculates pressure exerted by normal force over an area using P = F / A.',
    category: 'fluids',
    parameters: {
      F: { type: 'number', description: 'Normal force in Newtons', unit: 'N', required: true },
      A: { type: 'number', description: 'Contact area in m² (must be > 0)', unit: 'm²', required: true, min: 0.000001 },
    },
    execute: (args) => calculatePressure(args.F, args.A),
  },
  calculate_heat_transfer: {
    id: 'calculate_heat_transfer',
    name: 'Calculate Heat Transfer',
    description: 'Calculates thermal heat transferred for a temperature change without phase change using Q = mcΔT.',
    category: 'thermodynamics',
    parameters: {
      m: { type: 'number', description: 'Mass in kg (must be > 0)', unit: 'kg', required: true, min: 0.0001 },
      c: { type: 'number', description: 'Specific heat capacity in J/(kg·K)', unit: 'J/(kg·K)', required: true, min: 0.0001 },
      deltaT: { type: 'number', description: 'Temperature change in K or °C', unit: 'K / °C', required: true },
    },
    execute: (args) => calculateHeatTransfer(args.m, args.c, args.deltaT),
  },
  generate_physics_graph: {
    id: 'generate_physics_graph',
    name: 'Generate Physics Graph',
    description: 'Generates coordinate points, slope, area under curve, and interpretation for physics plots.',
    category: 'visualization',
    parameters: {
      u: { type: 'number', description: 'Initial velocity for v-t plot', unit: 'm/s', required: false },
      v: { type: 'number', description: 'Final velocity for v-t plot', unit: 'm/s', required: false },
      t: { type: 'number', description: 'Time duration for v-t plot', unit: 's', required: false },
    },
    execute: (args) =>
      generatePhysicsGraph('velocity_time', {
        u: args.u ?? 0,
        v: args.v ?? 20,
        t: args.t ?? 5,
      }),
  },
};

// -------------------------------------------------------------
// Automated Unit Tests for Physics Tools
// -------------------------------------------------------------
export interface TestCaseResult {
  name: string;
  passed: boolean;
  expected: string;
  actual: string;
  notes?: string;
}

export function runPhysicsToolAutomatedTests(): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  // Test 1: Acceptance Test B (Acceleration: u=5, v=25, t=4 -> a=5)
  try {
    const res = calculateAcceleration(5, 25, 4);
    const passed = res.output.value === 5 && res.graphData !== undefined;
    results.push({
      name: 'Test B: Acceleration calculation (u=5 m/s, v=25 m/s, t=4 s)',
      passed,
      expected: '5 m/s²',
      actual: `${res.output.value} ${res.output.unit}`,
      notes: `Slope: ${res.graphData?.summary.slope?.value} m/s², Displacement Area: ${res.graphData?.summary.areaUnderCurve?.value} m`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Test B: Acceleration calculation',
      passed: false,
      expected: '5 m/s²',
      actual: `Error: ${e.message}`,
    });
  }

  // Test 2: Acceptance Test E (Zero elapsed time rejection)
  try {
    calculateAcceleration(5, 25, 0);
    results.push({
      name: 'Test E: Zero elapsed time validation',
      passed: false,
      expected: 'Error thrown rejecting t <= 0',
      actual: 'Calculation unexpectedly succeeded',
    });
  } catch (err: unknown) {
    const e = err as Error;
    const passed = e.message.includes('greater than zero');
    results.push({
      name: 'Test E: Zero elapsed time validation',
      passed,
      expected: 'Rejection error message stating t > 0 is required',
      actual: e.message,
    });
  }

  // Test 3: Force F = ma (m=2 kg, a=3 m/s² -> F=6 N)
  try {
    const res = calculateForce(2, 3);
    const passed = res.output.value === 6;
    results.push({
      name: 'Force Tool: Newton II (m=2 kg, a=3 m/s²)',
      passed,
      expected: '6 N',
      actual: `${res.output.value} ${res.output.unit}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Force Tool',
      passed: false,
      expected: '6 N',
      actual: e.message,
    });
  }

  // Test 4: Negative mass rejection
  try {
    calculateForce(-2, 3);
    results.push({
      name: 'Force Tool: Negative mass rejection',
      passed: false,
      expected: 'Rejection error for m <= 0',
      actual: 'Unexpectedly succeeded',
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Force Tool: Negative mass rejection',
      passed: e.message.includes('strictly positive'),
      expected: 'Rejection error for m <= 0',
      actual: e.message,
    });
  }

  // Test 5: Work W = F*d*cos(theta) (F=50 N, d=10 m, theta=60° -> cos(60)=0.5, W=250 J)
  try {
    const res = calculateWork(50, 10, 60);
    const passed = Math.abs(res.output.value - 250) < 0.01;
    results.push({
      name: 'Work Tool: W = F d cos(60°) (F=50 N, d=10 m)',
      passed,
      expected: '250 J',
      actual: `${res.output.value} ${res.output.unit}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Work Tool',
      passed: false,
      expected: '250 J',
      actual: e.message,
    });
  }

  // Test 6: Kinetic Energy KE = 0.5 * m * v^2 (m=4 kg, v=10 m/s -> KE=200 J)
  try {
    const res = calculateKineticEnergy(4, 10);
    const passed = res.output.value === 200;
    results.push({
      name: 'Kinetic Energy Tool (m=4 kg, v=10 m/s)',
      passed,
      expected: '200 J',
      actual: `${res.output.value} ${res.output.unit}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Kinetic Energy Tool',
      passed: false,
      expected: '200 J',
      actual: e.message,
    });
  }

  // Test 7: Density rho = m / V (m=1000 kg, V=1 m³ -> rho=1000 kg/m³)
  try {
    const res = calculateDensity(1000, 1);
    const passed = res.output.value === 1000;
    results.push({
      name: 'Density Tool (m=1000 kg, V=1 m³)',
      passed,
      expected: '1000 kg/m³',
      actual: `${res.output.value} ${res.output.unit}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Density Tool',
      passed: false,
      expected: '1000 kg/m³',
      actual: e.message,
    });
  }

  // Test 8: Pressure P = F / A (F=500 N, A=0.05 m² -> P=10000 Pa)
  try {
    const res = calculatePressure(500, 0.05);
    const passed = res.output.value === 10000;
    results.push({
      name: 'Pressure Tool (F=500 N, A=0.05 m²)',
      passed,
      expected: '10000 Pa',
      actual: `${res.output.value} ${res.output.unit}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Pressure Tool',
      passed: false,
      expected: '10000 Pa',
      actual: e.message,
    });
  }

  // Test 9: Heat Transfer Q = mcΔT (m=2 kg, c=4184 J/kg·K water, ΔT=10 K -> Q=83680 J)
  try {
    const res = calculateHeatTransfer(2, 4184, 10);
    const passed = res.output.value === 83680;
    results.push({
      name: 'Heat Transfer Tool (water: m=2 kg, c=4184, ΔT=10 K)',
      passed,
      expected: '83680 J',
      actual: `${res.output.value} ${res.output.unit}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Heat Transfer Tool',
      passed: false,
      expected: '83680 J',
      actual: e.message,
    });
  }

  // Test 10: Graph Generation Tool (v-t plot verification)
  try {
    const res = generatePhysicsGraph('velocity_time', { u: 5, v: 25, t: 4 });
    const graphOk =
      res.graphData !== undefined &&
      res.graphData.points.length > 10 &&
      res.graphData.summary.slope?.value === 5 &&
      res.graphData.summary.areaUnderCurve?.value === 60;
    results.push({
      name: 'Graph Generator Tool: v-t plot (Endpoints (0,5) to (4,25))',
      passed: Boolean(graphOk),
      expected: 'Points array, slope 5 m/s², area under curve 60 m',
      actual: `Generated ${res.graphData?.points.length} points, slope = ${res.graphData?.summary.slope?.value}, area = ${res.graphData?.summary.areaUnderCurve?.value}`,
    });
  } catch (err: unknown) {
    const e = err as Error;
    results.push({
      name: 'Graph Generator Tool',
      passed: false,
      expected: 'Valid graph dataset',
      actual: e.message,
    });
  }

  return results;
}
