/**
 * AI Agent Physics Tutor - Practice Questions and Verified Question Bank
 * Debre Tabor University Undergraduate Physics
 */

export interface PracticeQuestion {
  id: string;
  moduleId: string;
  topicTitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionType: 'multiple_choice' | 'numerical' | 'conceptual' | 'unit_conversion' | 'graph_interpretation';
  question: string;
  options?: string[]; // for multiple choice
  correctOptionIndex?: number; // 0-based
  correctNumericalAnswer?: number; // for numerical
  numericalTolerance?: number; // acceptable ± tolerance
  unit?: string;
  hint: string;
  solutionSteps: string[];
  explanation: string;
  misconceptionsMap?: Record<number, string>; // Maps option index to misconception
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // 1. Acceleration / Kinematics (Matches Acceptance Test B & E)
  {
    id: 'pq-1',
    moduleId: 'module-2',
    topicTitle: 'Kinematics: Uniform Acceleration',
    difficulty: 'Beginner',
    questionType: 'numerical',
    question: 'A car accelerates uniformly along a straight highway from an initial velocity of 5 m/s to 25 m/s in 4.0 seconds. Calculate its acceleration in m/s².',
    correctNumericalAnswer: 5.0,
    numericalTolerance: 0.1,
    unit: 'm/s²',
    hint: 'Use the definition of acceleration: a = Δv / t = (v - u) / t.',
    solutionSteps: [
      'Identify knowns: Initial velocity u = 5 m/s, final velocity v = 25 m/s, time t = 4.0 s.',
      'State formula: a = (v - u) / t.',
      'Substitute: a = (25 - 5) / 4.0 = 20 / 4.0 = 5.0 m/s².',
      'Interpretation: The velocity increases by 5 m/s every second.',
    ],
    explanation: 'The acceleration is 5.0 m/s². The velocity of the car increases linearly at 5 m/s each second.',
  },
  // 2. Newton's Second Law (Matches Acceptance Test A & F)
  {
    id: 'pq-2',
    moduleId: 'module-3',
    topicTitle: "Newton's Laws & Dynamics",
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'A net horizontal force of 18 N acts on a frictionless block of mass 3.0 kg. What is the resulting acceleration of the block?',
    options: [
      '6.0 m/s²',
      '54 m/s²',
      '0.167 m/s²',
      '15 m/s²',
    ],
    correctOptionIndex: 0,
    hint: "Recall Newton's Second Law: ΣF = m · a. Rearrange for acceleration: a = F / m.",
    solutionSteps: [
      "Given: Net force F = 18 N, mass m = 3.0 kg.",
      "Newton's Second Law: F = m · a.",
      "Rearrange: a = F / m = 18 N / 3.0 kg = 6.0 m/s².",
    ],
    explanation: "Correct! By Newton's second law, a = F/m = 18/3 = 6.0 m/s².",
    misconceptionsMap: {
      1: "Misconception: You multiplied force by mass (F · m = 18 · 3 = 54) instead of dividing force by mass (a = F/m).",
      2: "Misconception: You inverted the fraction (m / F = 3 / 18 = 0.167 s²/m) instead of dividing force by mass.",
      3: "Misconception: You subtracted mass from force (18 - 3 = 15) which is physically invalid due to incompatible units.",
    },
  },
  // 3. Free Fall Peak Acceleration
  {
    id: 'pq-3',
    moduleId: 'module-2',
    topicTitle: 'Kinematics: Free Fall Motion',
    difficulty: 'Intermediate',
    questionType: 'conceptual',
    question: 'A stone is thrown straight upward into the air. At the exact instant it reaches its maximum height, what is its acceleration? (Neglect air resistance)',
    options: [
      '9.8 m/s² downward',
      '0 m/s²',
      '9.8 m/s² upward',
      'It depends on the initial throwing speed',
    ],
    correctOptionIndex: 0,
    hint: 'Distinguish between velocity (rate of position change) and acceleration (rate of velocity change caused by net force). What force acts on the stone at the peak?',
    solutionSteps: [
      'At all points during free-flight, the only force acting on the stone is Earth’s gravity: F_g = mg downward.',
      "By Newton's second law, a = F_g / m = -mg / m = -g = 9.8 m/s² downward.",
      'Although instantaneous velocity v = 0 at the peak, the rate of change of velocity remains non-zero.',
    ],
    explanation: 'Correct! Earth’s gravity does not vanish at the apex. Acceleration is always 9.8 m/s² downward throughout the entire trajectory.',
    misconceptionsMap: {
      1: 'Common Misconception: Confusing zero instantaneous velocity with zero acceleration. If acceleration were zero at the peak, the stone would stop accelerating and float in midair!',
      2: 'Misconception: Gravity always pulls downward toward Earth’s center, never upward.',
      3: 'Misconception: Free-fall acceleration near Earth is a universal constant g ≈ 9.8 m/s² regardless of initial speed or mass.',
    },
  },
  // 4. Kinetic Energy Calculation
  {
    id: 'pq-4',
    moduleId: 'module-4',
    topicTitle: 'Work & Energy: Kinetic Energy',
    difficulty: 'Beginner',
    questionType: 'numerical',
    question: 'A 1200 kg vehicle cruises at a steady speed of 20 m/s. Calculate its translational kinetic energy in kiloJoules (kJ).',
    correctNumericalAnswer: 240,
    numericalTolerance: 2,
    unit: 'kJ',
    hint: 'Apply the kinetic energy formula: KE = 0.5 · m · v². Remember to convert Joules to kJ (1 kJ = 1000 J).',
    solutionSteps: [
      'Given: mass m = 1200 kg, speed v = 20 m/s.',
      'KE = (1/2) · m · v² = 0.5 · 1200 · (20)² = 600 · 400 = 240,000 J.',
      'Convert to kJ: 240,000 J / 1000 = 240 kJ.',
    ],
    explanation: 'The kinetic energy is 240 kJ (or 2.4 × 10⁵ Joules).',
  },
  // 5. Work done by Perpendicular Force
  {
    id: 'pq-5',
    moduleId: 'module-4',
    topicTitle: 'Work & Energy: Mechanical Work',
    difficulty: 'Intermediate',
    questionType: 'multiple_choice',
    question: 'A satellite moves in a circular orbit around Earth at a constant speed of 7500 m/s. How much mechanical work does Earth’s gravitational force do on the satellite during one complete orbit?',
    options: [
      '0 Joules',
      'Equal to the satellite’s kinetic energy',
      'Positive work because gravity points toward Earth',
      'Negative work because gravity pulls against velocity',
    ],
    correctOptionIndex: 0,
    hint: 'Look at the angle θ between the gravitational force vector and the instantaneous displacement (tangent to the circle). Recall W = F · d · cos(θ).',
    solutionSteps: [
      'In uniform circular motion, gravitational force is purely centripetal (radial toward Earth’s center).',
      'The instantaneous displacement vector is tangent to the orbit.',
      'The included angle is θ = 90° at all times.',
      'W = F · d · cos(90°) = F · d · (0) = 0 J.',
    ],
    explanation: 'Correct! Because the gravitational force is strictly perpendicular to the displacement vector at every point (cos 90° = 0), zero work is performed, and orbital speed remains constant.',
    misconceptionsMap: {
      1: 'Misconception: Gravity maintains the orbit, but does not alter kinetic energy since no work is done.',
      2: 'Misconception: A force doing work must have a component along the direction of motion.',
      3: 'Misconception: The force is perpendicular, not opposing motion.',
    },
  },
  // 6. Density & Buoyancy
  {
    id: 'pq-6',
    moduleId: 'module-5',
    topicTitle: 'Fluids: Density & Hydrostatics',
    difficulty: 'Intermediate',
    questionType: 'numerical',
    question: 'A solid metal block has a mass of 4050 kg and occupies a volume of 1.5 m³. What is its density in kg/m³?',
    correctNumericalAnswer: 2700,
    numericalTolerance: 5,
    unit: 'kg/m³',
    hint: 'Density is defined as mass per unit volume: ρ = m / V.',
    solutionSteps: [
      'Given: mass m = 4050 kg, volume V = 1.5 m³.',
      'ρ = m / V = 4050 kg / 1.5 m³ = 2700 kg/m³.',
      'Note: This corresponds to the density of pure aluminium.',
    ],
    explanation: 'The density is 2700 kg/m³ (characteristic of aluminium, which is 2.7 times denser than liquid water).',
  },
  // 7. Graph Interpretation (Velocity-Time)
  {
    id: 'pq-7',
    moduleId: 'module-2',
    topicTitle: 'Motion Graphs: Velocity-Time Graph',
    difficulty: 'Intermediate',
    questionType: 'graph_interpretation',
    question: 'On a velocity–time graph, what physical quantity does the area under the curve between times t₁ and t₂ represent?',
    options: [
      'Displacement (change in position)',
      'Instantaneous acceleration',
      'Average speed',
      'Total force applied',
    ],
    correctOptionIndex: 0,
    hint: 'Consider the units: Velocity (m/s) multiplied by time (s) yields meters (m). In calculus: ∫ v(t) dt.',
    solutionSteps: [
      'Velocity is the time derivative of position: v(t) = ds/dt.',
      'By the Fundamental Theorem of Calculus: s(t₂) - s(t₁) = ∫_{t₁}^{t₂} v(t) dt.',
      'Geometrically, the definite integral corresponds to the area under the curve.',
    ],
    explanation: 'Correct! The geometric area under a velocity–time graph directly equals the net displacement over that interval.',
    misconceptionsMap: {
      1: 'Misconception: The slope of the velocity-time graph is acceleration, not the area.',
      2: 'Misconception: Speed is scalar magnitude of velocity, not the integral.',
      3: 'Misconception: Area under a force-displacement graph represents work; under a velocity-time graph it is displacement.',
    },
  },
  // 8. Heat Transfer (Calorimetry)
  {
    id: 'pq-8',
    moduleId: 'module-6',
    topicTitle: 'Thermodynamics: Heat Transfer',
    difficulty: 'Intermediate',
    questionType: 'numerical',
    question: 'How much thermal energy in Joules (J) is required to raise the temperature of 2.5 kg of liquid water from 20°C to 60°C? (Specific heat of water c = 4184 J/kg·K)',
    correctNumericalAnswer: 418400,
    numericalTolerance: 1000,
    unit: 'J',
    hint: 'Apply Q = m · c · ΔT. Here ΔT = 60°C - 20°C = 40 K.',
    solutionSteps: [
      'Given: mass m = 2.5 kg, c = 4184 J/kg·K, ΔT = 60 - 20 = 40 K.',
      'Q = m · c · ΔT = 2.5 × 4184 × 40.',
      '2.5 × 40 = 100.',
      'Q = 100 × 4184 = 418,400 J (418.4 kJ).',
    ],
    explanation: '418,400 Joules (418.4 kJ) of thermal energy is absorbed by the water.',
  },
];
