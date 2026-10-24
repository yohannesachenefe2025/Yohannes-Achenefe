/**
 * AI Agent Physics Tutor - Physics Learning Curriculum (Modules 1 - 9)
 * Tailored for Undergraduate Physics at Debre Tabor University
 * Curated by Dr. Yohannes Achenefe
 */

export interface WorkedExample {
  id: string;
  title: string;
  problemStatement: string;
  given: Record<string, string>;
  find: string;
  applicableLaw: string;
  equation: string;
  stepByStepSolution: string[];
  finalAnswer: string;
  physicalInterpretation: string;
}

export interface Misconception {
  id: string;
  statement: string;
  scientificCorrection: string;
  explanation: string;
}

export interface ModuleTopic {
  id: string;
  title: string;
  amharicTitle?: string;
  readingTimeMin: number;
  learningObjectives: string[];
  introduction: string;
  conceptExplanation: string;
  keyEquations: Array<{
    name: string;
    latex: string;
    description: string;
    symbols: Record<string, string>;
  }>;
  workedExamples: WorkedExample[];
  misconceptions: Misconception[];
  practiceExercises: Array<{
    question: string;
    hint: string;
    solution: string;
  }>;
}

export interface PhysicsModule {
  id: string;
  number: number;
  title: string;
  amharicTitle: string;
  description: string;
  iconName: string;
  topics: ModuleTopic[];
}

export const PHYSICS_MODULES: PhysicsModule[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Preliminaries & Vectors',
    amharicTitle: 'መሰረታዊ ፅንሰ ሀሳቦች እና ቬክተሮች',
    description: 'Physical quantities, SI base & derived units, measurement uncertainty, dimensional analysis, scalar and vector algebra, and vector decomposition.',
    iconName: 'Ruler',
    topics: [
      {
        id: 'units-and-measurements',
        title: 'Physical Quantities & SI Units',
        amharicTitle: 'የፊዚክስ መጠኖች እና ዓለም አቀፍ መለኪያዎች',
        readingTimeMin: 7,
        learningObjectives: [
          'Differentiate between fundamental (base) and derived SI units.',
          'Apply dimensional analysis to verify the algebraic consistency of physical equations.',
          'Quantify experimental uncertainty and apply significant figure rules in calculations.',
        ],
        introduction:
          'Physics is fundamentally an empirical and quantitative science grounded in precise measurements. Every measurement pairs a numerical magnitude with a standardized physical unit.',
        conceptExplanation:
          'The International System of Units (SI) establishes seven fundamental dimensions: length (meter, m), mass (kilogram, kg), time (second, s), electric current (ampere, A), thermodynamic temperature (kelvin, K), amount of substance (mole, mol), and luminous intensity (candela, cd). All other mechanical quantities, such as force (Newton = kg·m/s²) and energy (Joule = kg·m²/s²), are derived through combinations of these base units.',
        keyEquations: [
          {
            name: 'Dimensional Homogeneity',
            latex: '[LHS] = [RHS]',
            description: 'Both sides of any physically valid equation must have identical physical dimensions.',
            symbols: {
              '[LHS]': 'Dimensions of the left-hand side terms',
              '[RHS]': 'Dimensions of the right-hand side terms',
            },
          },
        ],
        workedExamples: [
          {
            id: 'we-1-1',
            title: 'Verifying Dimensional Consistency of Kinematic Equation',
            problemStatement: 'Verify whether the equation s = ut + (1/2) a t² is dimensionally consistent.',
            given: { 's': 'Displacement [L]', 'u': 'Velocity [L T⁻¹]', 'a': 'Acceleration [L T⁻²]', 't': 'Time [T]' },
            find: 'Determine if [s] matches [ut] and [(1/2)at²]',
            applicableLaw: 'Principle of Dimensional Homogeneity',
            equation: '[s] = [ut] + [a t^2]',
            stepByStepSolution: [
              'Dimension of left-hand side: [s] = L (length in meters).',
              'Dimension of first term on RHS: [ut] = [L T⁻¹] · [T] = L.',
              'Dimension of second term on RHS: [(1/2) a t²] = [1] · [L T⁻²] · [T²] = L (pure numbers are dimensionless).',
              'Since each additive term has dimension L, the equation is dimensionally homogenous and physically consistent.',
            ],
            finalAnswer: 'Dimensionally valid: [L] = [L] + [L].',
            physicalInterpretation: 'Dimensional analysis proves algebraic consistency, though it cannot verify dimensionless numerical constants like 1/2.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-1-1',
            statement: 'Dimensions and units are the exact same thing.',
            scientificCorrection: 'Dimensions represent the physical nature of a quantity (e.g., Length [L]), while units are the specific arbitrary scale chosen to quantify it (e.g., meter, kilometer, foot, mile).',
            explanation: 'Velocity always has dimension [L/T], whether reported in meters per second (m/s) or kilometers per hour (km/h).',
          },
        ],
        practiceExercises: [
          {
            question: 'What are the base SI units of dynamic viscosity η, defined by F = η A (dv/dx)?',
            hint: 'Rearrange for η = F / (A · (dv/dx)) and substitute dimensions: F in kg·m/s², A in m², and dv/dx in (m/s)/m = s⁻¹.',
            solution: 'η has base units: kg / (m · s), or Pa·s in derived units.',
          },
        ],
      },
      {
        id: 'vectors-and-components',
        title: 'Vectors and Coordinate Decomposition',
        amharicTitle: 'ቬክተሮች እና የአቅጣጫ ክፍፍል',
        readingTimeMin: 9,
        learningObjectives: [
          'Distinguish between scalar quantities (magnitude only) and vector quantities (magnitude and direction).',
          'Resolve 2D vectors into orthogonal Cartesian components (x and y).',
          'Calculate dot products and cross products with physical interpretations.',
        ],
        introduction:
          'Many physical quantities, including displacement, velocity, acceleration, force, and momentum, depend not only on how much, but also in what direction an action occurs.',
        conceptExplanation:
          'In a 2D Cartesian plane, a vector A at an angle θ counterclockwise from the positive x-axis has horizontal component A_x = |A| cos(θ) and vertical component A_y = |A| sin(θ). The magnitude is |A| = √(A_x² + A_y²), and the orientation angle is θ = arctan(A_y / A_x).',
        keyEquations: [
          {
            name: 'Vector Resolution',
            latex: 'A_x = |\\vec{A}| \\cos\\theta, \\quad A_y = |\\vec{A}| \\sin\\theta',
            description: 'Orthogonal decomposition of a vector into Cartesian components.',
            symbols: {
              '|A|': 'Vector magnitude',
              'θ': 'Angle with respect to positive horizontal axis',
              'A_x, A_y': 'Scalar components along x and y directions',
            },
          },
          {
            name: 'Scalar (Dot) Product',
            latex: '\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}| \\cos\\phi = A_x B_x + A_y B_y',
            description: 'Projection of one vector onto another, yielding a scalar.',
            symbols: {
              'φ': 'Included angle between vector A and vector B',
            },
          },
        ],
        workedExamples: [
          {
            id: 'we-1-2',
            title: 'Resolving a Tension Force Vector',
            problemStatement: 'A rope pulls a crate with a tension of 120 N at an angle of 35° above the horizontal floor. Find the horizontal pulling force and the vertical lifting force.',
            given: { 'T': '120 N', 'θ': '35° above horizontal' },
            find: 'T_x (horizontal) and T_y (vertical)',
            applicableLaw: 'Trigonometric vector decomposition',
            equation: 'T_x = T \\cos\\theta, \\quad T_y = T \\sin\\theta',
            stepByStepSolution: [
              'Identify magnitude: T = 120 N, angle θ = 35°.',
              'Calculate horizontal component: T_x = 120 · cos(35°) = 120 · 0.8192 = 98.3 N.',
              'Calculate vertical component: T_y = 120 · sin(35°) = 120 · 0.5736 = 68.8 N.',
            ],
            finalAnswer: 'T_x = 98.3 N (forward), T_y = 68.8 N (upward).',
            physicalInterpretation: 'Only the 98.3 N horizontal component contributes to accelerating the crate forward, while the 68.8 N vertical component reduces the normal force on the floor.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-1-2',
            statement: 'The x-component of a vector is always calculated with cosine and y with sine.',
            scientificCorrection: 'Cosine and sine depend strictly on whether the referenced angle is measured relative to the horizontal or the vertical axis.',
            explanation: 'If angle φ is measured from the vertical y-axis, the horizontal component becomes A_x = A sin(φ) and vertical becomes A_y = A cos(φ).',
          },
        ],
        practiceExercises: [
          {
            question: 'Two vectors are A = 3i + 4j and B = -4i + 3j. Calculate their dot product A · B.',
            hint: 'A · B = A_x B_x + A_y B_y.',
            solution: 'A · B = (3)(-4) + (4)(3) = -12 + 12 = 0. The vectors are mutually perpendicular (orthogonal).',
          },
        ],
      },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Kinematics in 1D & 2D',
    amharicTitle: 'ኪኔማቲክስ (የእንቅስቃሴ ጥናት)',
    description: 'Position, displacement, average and instantaneous velocity, acceleration, constant-acceleration motion, free fall under gravity, and 2D projectile trajectories.',
    iconName: 'Activity',
    topics: [
      {
        id: 'constant-acceleration-1d',
        title: 'One-Dimensional Motion with Constant Acceleration',
        amharicTitle: 'በቀጥታ መስመር ላይ ቋሚ ማጣደፍ ያለው እንቅስቃሴ',
        readingTimeMin: 10,
        learningObjectives: [
          'Master the four fundamental kinematic equations of uniformly accelerated linear motion.',
          'Interpret velocity–time and displacement–time graphs, recognizing slope as rate of change and area as net displacement.',
          'Solve free-fall problems near Earth’s surface with g = 9.8 m/s².',
        ],
        introduction:
          'Kinematics describes how objects move without referencing the forces causing that motion. Constant acceleration is the foundational baseline for university physics.',
        conceptExplanation:
          'When acceleration a is constant, the instantaneous acceleration equals the average acceleration: a = (v - u) / t. Integrating with respect to time yields the position equation s = ut + 0.5 a t², and eliminating time gives v² = u² + 2as. On a velocity–time graph, the instantaneous slope represents acceleration, and the integral (geometric area beneath the curve) represents net displacement.',
        keyEquations: [
          {
            name: 'First Kinematic Equation',
            latex: 'v = u + a t',
            description: 'Relates initial velocity, acceleration, time, and final velocity.',
            symbols: { 'v': 'Final velocity (m/s)', 'u': 'Initial velocity (m/s)', 'a': 'Acceleration (m/s²)', 't': 'Elapsed time (s)' },
          },
          {
            name: 'Second Kinematic Equation',
            latex: 's = u t + \\frac{1}{2} a t^2',
            description: 'Computes net displacement as a quadratic function of time.',
            symbols: { 's': 'Displacement (m)', 'u': 'Initial velocity (m/s)', 'a': 'Acceleration (m/s²)', 't': 'Time (s)' },
          },
          {
            name: 'Third Kinematic Equation',
            latex: 'v^2 = u^2 + 2 a s',
            description: 'Time-independent kinematic relation between velocities and displacement.',
            symbols: { 'v': 'Final velocity (m/s)', 'u': 'Initial velocity (m/s)', 'a': 'Acceleration (m/s²)', 's': 'Displacement (m)' },
          },
        ],
        workedExamples: [
          {
            id: 'we-2-1',
            title: 'Car Braking to a Halt',
            problemStatement: 'A vehicle traveling at 25 m/s applies constant brakes, coming to a complete stop over a distance of 50 m. Determine the acceleration and time taken.',
            given: { 'u': '25 m/s', 'v': '0 m/s (stopped)', 's': '50 m' },
            find: 'Acceleration a (m/s²) and stopping duration t (s)',
            applicableLaw: 'Kinematic equation v² = u² + 2as and v = u + at',
            equation: 'a = (v^2 - u^2) / (2s)',
            stepByStepSolution: [
              'Apply v² = u² + 2as: 0 = (25)² + 2 · a · (50).',
              '0 = 625 + 100 a  ⟹  100 a = -625  ⟹  a = -6.25 m/s².',
              'Now determine time using v = u + at: 0 = 25 + (-6.25) · t.',
              '6.25 t = 25  ⟹  t = 4.0 seconds.',
            ],
            finalAnswer: 'Acceleration a = -6.25 m/s², Time t = 4.0 s.',
            physicalInterpretation: 'The negative sign indicates that acceleration is directed opposite to the positive velocity vector, slowing the car at 6.25 m/s each second.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-2-1',
            statement: 'When an object reaches the peak of vertical free-fall motion, its acceleration is momentarily zero because its velocity is zero.',
            scientificCorrection: 'At the apex of vertical flight, velocity is momentarily 0 m/s, but acceleration remains constant at -9.8 m/s² downward due to Earth’s unchanging gravity.',
            explanation: 'If acceleration were also zero at the peak, the object would have no force acting on it and would remain suspended in midair!',
          },
        ],
        practiceExercises: [
          {
            question: 'A ball is dropped from rest from a 45 m tall platform. How long does it take to strike the ground? (Use g = 9.8 m/s²)',
            hint: 'Set u = 0, s = 45 m, a = 9.8 m/s² in s = (1/2) a t².',
            solution: 't = √(2s / g) = √(2 · 45 / 9.8) = √(9.184) = 3.03 seconds.',
          },
        ],
      },
      {
        id: 'projectile-motion',
        title: 'Two-Dimensional Projectile Motion',
        amharicTitle: 'ባለ ሁለት አቅጣጫ የተወረወረ አካል እንቅስቃሴ',
        readingTimeMin: 12,
        learningObjectives: [
          'Understand that horizontal and vertical motions are completely independent of each other (Galileo’s principle).',
          'Calculate horizontal range, maximum flight altitude, and total flight time.',
          'Model parabolic trajectories in the absence of atmospheric drag.',
        ],
        introduction:
          'A projectile is any object propelled into flight upon which the only significant acting force is gravity. Under ideal conditions, horizontal velocity remains constant while vertical velocity exhibits uniform gravitational acceleration.',
        conceptExplanation:
          'Because gravity acts strictly downward in the negative y-direction, horizontal acceleration is zero (a_x = 0), meaning x(t) = v_{0x} t. Vertical acceleration is constant (a_y = -g), meaning y(t) = v_{0y} t - 0.5 g t². The trajectory curve is a parabola y(x) = x tan(θ) - (g / (2 v₀² cos²θ)) x².',
        keyEquations: [
          {
            name: 'Maximum Apex Altitude',
            latex: 'H = \\frac{v_0^2 \\sin^2\\theta}{2 g}',
            description: 'Peak height attained by a projectile launched from level ground.',
            symbols: { 'H': 'Maximum height (m)', 'v₀': 'Launch speed (m/s)', 'θ': 'Launch angle', 'g': '9.8 m/s²' },
          },
          {
            name: 'Horizontal Range',
            latex: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}',
            description: 'Total horizontal distance traveled over level terrain.',
            symbols: { 'R': 'Range (m)', 'v₀': 'Launch speed (m/s)', 'θ': 'Launch angle', 'g': '9.8 m/s²' },
          },
        ],
        workedExamples: [
          {
            id: 'we-2-2',
            title: 'Football Kick Analysis',
            problemStatement: 'A player kicks a ball with launch speed v₀ = 20 m/s at an angle θ = 45° across level ground. Compute flight time, range, and peak height.',
            given: { 'v₀': '20 m/s', 'θ': '45°', 'g': '9.8 m/s²' },
            find: 'T_flight, Range R, Height H',
            applicableLaw: 'Kinematics of projectile flight on level ground',
            equation: 'T = (2 v₀ \\sin\\theta) / g, \\quad R = (v_0^2 \\sin(2\\theta)) / g, \\quad H = (v_0^2 \\sin^2\\theta) / (2g)',
            stepByStepSolution: [
              'Components: v_{0x} = 20 cos(45°) = 14.14 m/s, v_{0y} = 20 sin(45°) = 14.14 m/s.',
              'Total flight time: T = 2 · (14.14) / 9.8 = 2.886 s.',
              'Horizontal range: R = v_{0x} · T = 14.14 · 2.886 = 40.82 m (or via formula: (20² · sin(90°))/9.8 = 400/9.8 = 40.82 m).',
              'Apex height: H = (14.14)² / (2 · 9.8) = 200 / 19.6 = 10.20 m.',
            ],
            finalAnswer: 'Flight time = 2.89 s, Range = 40.8 m, Maximum height = 10.2 m.',
            physicalInterpretation: 'At 45°, sin(2θ) reaches its maximum value of 1.0, yielding the maximum theoretical range on level ground.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-2-2',
            statement: 'A projectile maintains a continuous forward "force" keeping it in flight after release.',
            scientificCorrection: 'Once launched, no forward force exists on the projectile. It continues moving forward solely due to its own inertia (Newton’s First Law).',
            explanation: 'Force is an interaction, not a property stored inside moving objects.',
          },
        ],
        practiceExercises: [
          {
            question: 'At what launch angles are the horizontal ranges of a projectile launched at speed v₀ identical on flat ground?',
            hint: 'Observe the identity sin(2(90° - θ)) = sin(180° - 2θ) = sin(2θ).',
            solution: 'Complementary angles (angles that sum to 90°, such as 30° and 60°, or 20° and 70°) yield identical horizontal ranges.',
          },
        ],
      },
    ],
  },
  {
    id: 'module-3',
    number: 3,
    title: "Newton's Laws & Dynamics",
    amharicTitle: 'የኒውተን የእንቅስቃሴ ሕጎች እና ዳይናሚክስ',
    description: "Newton's three laws of motion, inertial frames, free-body diagrams, static & kinetic friction, inclined planes, and centripetal force in circular motion.",
    iconName: 'Zap',
    topics: [
      {
        id: 'newtons-laws',
        title: "Newton's Three Laws of Motion",
        amharicTitle: 'ሦስቱ የኒውተን የእንቅስቃሴ ሕጎች',
        readingTimeMin: 11,
        learningObjectives: [
          'State and explain Newton’s First, Second, and Third Laws in rigorous scientific language.',
          'Formulate and solve vector equations using free-body diagrams (FBDs).',
          'Distinguish action-reaction force pairs from balancing equilibrium forces.',
        ],
        introduction:
          'Dynamics connects kinematics with its underlying causes. Isaac Newton established the bedrock of classical mechanics in 1687 with his three laws of motion.',
        conceptExplanation:
          "Newton's First Law (Inertia): An object remains at rest or in uniform straight-line motion unless acted upon by a non-zero net external force.\nNewton's Second Law (Fundamental Dynamics): The rate of change of linear momentum equals the net external force: ΣF = d(p)/dt = m a (for constant mass).\nNewton's Third Law (Action-Reaction): Whenever body A exerts a force on body B, body B exerts an equal in magnitude and opposite in direction force on body A: F_{A on B} = -F_{B on A}. Crucially, action and reaction forces act on different bodies, so they never cancel each other out.",
        keyEquations: [
          {
            name: "Newton's Second Law",
            latex: '\\sum \\vec{F} = m \\vec{a}',
            description: 'Vector sum of all external forces equals mass times acceleration.',
            symbols: { 'ΣF': 'Net resultant force (N)', 'm': 'Inertial mass (kg)', 'a': 'Acceleration vector (m/s²)' },
          },
          {
            name: 'Coulomb / Amontons Friction Law',
            latex: 'f_s \\le \\mu_s N, \\quad f_k = \\mu_k N',
            description: 'Static friction responds up to a threshold; kinetic friction is constant.',
            symbols: { 'f_s, f_k': 'Static and kinetic friction forces (N)', 'μ_s, μ_k': 'Coefficients of friction', 'N': 'Normal force (N)' },
          },
        ],
        workedExamples: [
          {
            id: 'we-3-1',
            title: 'Block on an Inclined Plane with Friction',
            problemStatement: 'A 5.0 kg crate rests on a 30° ramp. The coefficient of kinetic friction is μ_k = 0.20. Calculate the acceleration of the crate as it slides down the ramp.',
            given: { 'm': '5.0 kg', 'θ': '30°', 'μ_k': '0.20', 'g': '9.8 m/s²' },
            find: 'Acceleration down the incline a (m/s²)',
            applicableLaw: "Newton's Second Law parallel to the incline",
            equation: 'a = g (\\sin\\theta - \\mu_k \\cos\\theta)',
            stepByStepSolution: [
              'Resolve gravity along axes: perpendicular to incline W_y = mg cos(30°), parallel down incline W_x = mg sin(30°).',
              'Normal force: perpendicular equilibrium ΣF_y = 0 ⟹ N = mg cos(30°) = 5 · 9.8 · 0.866 = 42.44 N.',
              'Kinetic friction: f_k = μ_k N = 0.20 · 42.44 N = 8.49 N directed uphill.',
              'Net force along ramp: ΣF_x = mg sin(30°) - f_k = (5 · 9.8 · 0.5) - 8.49 = 24.5 - 8.49 = 16.01 N.',
              'Acceleration: a = ΣF_x / m = 16.01 N / 5.0 kg = 3.20 m/s² down the ramp.',
            ],
            finalAnswer: 'a = 3.20 m/s² down the ramp.',
            physicalInterpretation: 'Notice that mass m cancels out algebraically when only gravity and friction act: a = g(sinθ - μ_k cosθ) = 9.8(0.5 - 0.20 · 0.866) = 3.20 m/s².',
          },
        ],
        misconceptions: [
          {
            id: 'misc-3-1',
            statement: 'The normal force on a body resting on a flat surface is the Newton’s Third Law reaction pair to its gravitational weight.',
            scientificCorrection: 'The normal force is an electromagnetic contact force from the floor pushing up on the body. Its reaction pair is the body pushing down on the floor.',
            explanation: 'The reaction pair to Earth’s gravitational pull on the body is the body’s gravitational pull on the Earth!',
          },
        ],
        practiceExercises: [
          {
            question: 'An elevator of total mass 800 kg accelerates upward at 1.5 m/s². What tension does the supporting cable experience?',
            hint: 'ΣF = T - mg = ma ⟹ T = m(g + a).',
            solution: 'T = 800 · (9.8 + 1.5) = 800 · 11.3 = 9040 N.',
          },
        ],
      },
    ],
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Work, Energy & Momentum',
    amharicTitle: 'ሥራ፣ ጉልበት እና ሞመንተም',
    description: 'Work done by constant and variable forces, Work-Energy theorem, kinetic and potential energy, conservation of mechanical energy, linear momentum, and collisions.',
    iconName: 'Flame',
    topics: [
      {
        id: 'work-energy-theorem',
        title: 'Work and the Work-Energy Theorem',
        amharicTitle: 'ሥራ እና የሥራ-ጉልበት ፅንሰ ሀሳብ',
        readingTimeMin: 9,
        learningObjectives: [
          'Calculate work done by constant and variable forces via vector dot products and integrals.',
          'Apply the Work-Energy Theorem: W_{net} = ΔKE.',
          'Distinguish between conservative (path-independent) and non-conservative forces.',
        ],
        introduction:
          'Energy is one of the most powerful unifying concepts across all sciences. While Newton’s laws relate force and acceleration at every instantaneous point, energy principles examine initial and final states.',
        conceptExplanation:
          'Work is the scalar product of force and displacement: W = F · d · cos(θ). If the force acts in the direction of motion (0° ≤ θ < 90°), work is positive, increasing the system’s kinetic energy. If force opposes motion (90° < θ ≤ 180°), work is negative, decreasing kinetic energy. If force is perpendicular (θ = 90°, such as magnetic force or centripetal force), no work is performed.',
        keyEquations: [
          {
            name: 'Mechanical Work',
            latex: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos\\theta',
            description: 'Work done by a constant force over displacement d.',
            symbols: { 'W': 'Work (Joules, J = N·m)', 'F': 'Force magnitude (N)', 'd': 'Displacement (m)', 'θ': 'Included angle' },
          },
          {
            name: 'Work-Energy Theorem',
            latex: 'W_{\\text{net}} = \\Delta KE = \\frac{1}{2} m v_f^2 - \\frac{1}{2} m v_i^2',
            description: 'The net work done by all forces equals the change in kinetic energy.',
            symbols: { 'W_net': 'Total net work', 'KE': 'Kinetic energy (J)' },
          },
          {
            name: 'Conservation of Mechanical Energy',
            latex: 'KE_i + PE_i = KE_f + PE_f \\quad (\\text{when } W_{nc} = 0)',
            description: 'Mechanical energy is strictly conserved under purely conservative forces.',
            symbols: { 'PE': 'Potential energy (mgh for gravity, 0.5 k x² for springs)' },
          },
        ],
        workedExamples: [
          {
            id: 'we-4-1',
            title: 'Roller Coaster Energy Conservation',
            problemStatement: 'A 250 kg cart starts from rest at the top of a frictionless hill at height h = 20 m. Calculate its speed at the bottom of the hill.',
            given: { 'm': '250 kg', 'h_i': '20 m', 'v_i': '0 m/s', 'h_f': '0 m', 'g': '9.8 m/s²' },
            find: 'Speed v_f at the bottom',
            applicableLaw: 'Conservation of Mechanical Energy',
            equation: 'm g h_i + \\frac{1}{2} m v_i^2 = m g h_f + \\frac{1}{2} m v_f^2',
            stepByStepSolution: [
              'Initial mechanical energy: E_i = PE_i + KE_i = m g h_i + 0.',
              'Final mechanical energy: E_f = 0 + (1/2) m v_f².',
              'Equating: m g h_i = (1/2) m v_f².',
              'Mass m cancels: v_f² = 2 g h_i  ⟹  v_f = √(2 · 9.8 · 20) = √(392) = 19.80 m/s.',
            ],
            finalAnswer: 'v_f = 19.8 m/s.',
            physicalInterpretation: 'Gravitational potential energy is completely transformed into kinetic energy. Notice the speed is independent of the cart mass or the path slope!',
          },
        ],
        misconceptions: [
          {
            id: 'misc-4-1',
            statement: 'Holding a heavy 30 kg suitcase stationary in your hand for an hour does a large amount of mechanical work.',
            scientificCorrection: 'In physics, W = F · d. Because the displacement d = 0, zero mechanical work is done on the suitcase.',
            explanation: 'Your muscles consume biological metabolic energy through internal microscopic muscle fiber twitches, but no mechanical work is performed on the external load.',
          },
        ],
        practiceExercises: [
          {
            question: 'A 1000 kg car traveling at 20 m/s has its speed doubled to 40 m/s. By what factor does its kinetic energy increase?',
            hint: 'Kinetic energy is proportional to the square of velocity: KE ∝ v².',
            solution: 'KE_f / KE_i = (v_f / v_i)² = (40 / 20)² = 2² = 4. The kinetic energy quadruples!',
          },
        ],
      },
    ],
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Fluid Mechanics',
    amharicTitle: 'የፍሳሾች ሜካኒክስ',
    description: 'Density, pressure, hydrostatic pressure with depth, Pascal’s principle, Archimedes’ principle and buoyant forces, continuity equation, and Bernoulli’s equation.',
    iconName: 'Droplet',
    topics: [
      {
        id: 'buoyancy-and-pressure',
        title: 'Hydrostatics, Pascal’s Principle & Archimedes’ Principle',
        amharicTitle: 'የፈሳሽ ግፊት እና የአርኪሜድስ መርህ',
        readingTimeMin: 10,
        learningObjectives: [
          'Calculate hydrostatic pressure at depth h: P = P_0 + ρgh.',
          'Apply Pascal’s principle to hydraulic lifts: F_1 / A_1 = F_2 / A_2.',
          'Calculate buoyant forces and determine whether objects float or sink.',
        ],
        introduction:
          'Fluids encompass liquids and gases—substances that continuously deform (flow) under applied shear stress. Fluid statics governs pressure distributions, hydraulic machinery, and floating vessels.',
        conceptExplanation:
          'Pressure is normal force per unit area: P = F / A. In a static fluid of density ρ, pressure increases linearly with depth due to the weight of fluid above: P = P_{atm} + ρ g h. Archimedes’ principle states that any body completely or partially submerged in a fluid is buoyed upward by a force equal to the weight of the fluid displaced: F_B = ρ_{fluid} · V_{submerged} · g.',
        keyEquations: [
          {
            name: 'Hydrostatic Pressure',
            latex: 'P = P_0 + \\rho g h',
            description: 'Pressure at depth h beneath a fluid surface with surface pressure P_0.',
            symbols: { 'P': 'Total absolute pressure (Pa)', 'ρ': 'Fluid density (kg/m³)', 'g': '9.8 m/s²', 'h': 'Depth (m)' },
          },
          {
            name: "Archimedes' Buoyant Force",
            latex: 'F_B = \\rho_{\\text{fluid}} V_{\\text{disp}} g',
            description: 'Upward force exerted on a submerged body equal to displaced fluid weight.',
            symbols: { 'F_B': 'Buoyant force (N)', 'V_disp': 'Displaced volume (m³)' },
          },
        ],
        workedExamples: [
          {
            id: 'we-5-1',
            title: 'Submarine Hull Pressure Calculation',
            problemStatement: 'A research submarine dives to a depth of 350 m in seawater (density ρ = 1025 kg/m³). Calculate the absolute pressure on the hull. (P_{atm} = 1.013 × 10⁵ Pa).',
            given: { 'h': '350 m', 'ρ': '1025 kg/m³', 'g': '9.8 m/s²', 'P_atm': '1.013 × 10⁵ Pa' },
            find: 'Absolute pressure P in Pa and atmospheres',
            applicableLaw: 'Hydrostatic Pressure Relation',
            equation: 'P = P_0 + \\rho g h',
            stepByStepSolution: [
              'Gauge pressure: P_gauge = ρ g h = 1025 · 9.8 · 350 = 3,515,750 Pa = 3.516 × 10⁶ Pa.',
              'Absolute pressure: P = P_{atm} + P_gauge = 101,300 + 3,515,750 = 3,617,050 Pa ≈ 3.62 MPa.',
              'Convert to atmospheres: 3.617 × 10⁶ / 101,325 Pa/atm = 35.7 atm.',
            ],
            finalAnswer: 'Absolute pressure P = 3.62 × 10⁶ Pa (35.7 atm).',
            physicalInterpretation: 'Every 10 meters of water depth adds approximately 1 full atmosphere of pressure.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-5-1',
            statement: 'Heavy objects sink and light objects float regardless of size.',
            scientificCorrection: 'Floating or sinking depends on volumetric mass density (specific gravity) relative to the fluid, not absolute total mass.',
            explanation: 'A 100,000-ton steel aircraft carrier floats easily because its hollow hull displaces a massive volume of water, making its average density far less than 1000 kg/m³.',
          },
        ],
        practiceExercises: [
          {
            question: 'A solid block of wood of volume 0.04 m³ and density 600 kg/m³ floats in fresh water (1000 kg/m³). What volume of wood is submerged?',
            hint: 'For a floating object in equilibrium: Weight = Buoyant force ⟹ m_wood g = ρ_water V_sub g ⟹ V_sub = (ρ_wood / ρ_water) · V_total.',
            solution: 'V_sub = (600 / 1000) · 0.04 m³ = 0.60 · 0.04 = 0.024 m³ (60% submerged).',
          },
        ],
      },
    ],
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Heat & Thermodynamics',
    amharicTitle: 'ሙቀት እና ቴርሞዳይናሚክስ',
    description: 'Temperature scales, thermal expansion, specific heat capacity, calorimetry, latent heat of phase changes, heat transfer mechanisms, and the First Law of Thermodynamics.',
    iconName: 'Sun',
    topics: [
      {
        id: 'calorimetry-and-heat',
        title: 'Calorimetry and Heat Transfer',
        amharicTitle: 'ካሎሪሜትሪ እና የሙቀት ልውውጥ',
        readingTimeMin: 9,
        learningObjectives: [
          'Calculate sensible heat exchange: Q = m c ΔT.',
          'Analyze phase transitions using latent heat: Q = m L.',
          'Solve thermal equilibrium problems using the principle of conservation of energy: ΣQ = 0.',
        ],
        introduction:
          'Thermodynamics governs thermal energy transformations and heat flow. Heat is thermal energy in transit between systems due to a temperature difference.',
        conceptExplanation:
          'When thermal energy flows into a body without changing its phase, its temperature rises according to Q = m c ΔT, where c is specific heat capacity. Water has an unusually high specific heat (4184 J/kg·K), acting as a massive thermal stabilizer on Earth. During a phase transition (melting, freezing, vaporization, condensation), temperature remains constant while energy is absorbed or released as latent heat: Q = m L.',
        keyEquations: [
          {
            name: 'Sensible Heat Transfer',
            latex: 'Q = m c \\Delta T = m c (T_f - T_i)',
            description: 'Heat absorbed or released causing temperature change without phase change.',
            symbols: { 'Q': 'Heat (Joules)', 'm': 'Mass (kg)', 'c': 'Specific heat (J/kg·K)', 'ΔT': 'Temperature change' },
          },
          {
            name: 'First Law of Thermodynamics',
            latex: '\\Delta U = Q - W',
            description: 'Change in internal energy equals heat added minus work done by system.',
            symbols: { 'ΔU': 'Internal energy change (J)', 'Q': 'Net heat added', 'W': 'Work done by gas' },
          },
        ],
        workedExamples: [
          {
            id: 'we-6-1',
            title: 'Equilibrium Temperature of Hot Metal in Water',
            problemStatement: 'A 0.40 kg copper block (c = 385 J/kg·K) at 95°C is dropped into 0.20 kg of water (c = 4184 J/kg·K) at 20°C in an insulated calorimeter. Find the final equilibrium temperature.',
            given: { 'm_c': '0.40 kg', 'c_c': '385 J/kg·K', 'T_c': '95°C', 'm_w': '0.20 kg', 'c_w': '4184 J/kg·K', 'T_w': '20°C' },
            find: 'Equilibrium temperature T_eq',
            applicableLaw: 'Thermal energy conservation in an isolated system (ΣQ = 0)',
            equation: 'Q_{\\text{copper}} + Q_{\\text{water}} = 0',
            stepByStepSolution: [
              'm_c c_c (T_eq - 95) + m_w c_w (T_eq - 20) = 0.',
              '0.40 · 385 · (T_eq - 95) + 0.20 · 4184 · (T_eq - 20) = 0.',
              '154 · (T_eq - 95) + 836.8 · (T_eq - 20) = 0.',
              '154 T_eq - 14,630 + 836.8 T_eq - 16,736 = 0.',
              '990.8 T_eq = 31,366  ⟹  T_eq = 31.66°C.',
            ],
            finalAnswer: 'T_eq = 31.7°C.',
            physicalInterpretation: 'Despite the copper being much hotter, water’s high heat capacity dominates, resulting in an equilibrium temperature much closer to 20°C than 95°C.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-6-1',
            statement: 'Temperature and heat are the same thing.',
            scientificCorrection: 'Temperature is a measure of the average microscopic translational kinetic energy per molecule. Heat is thermal energy transferred between bodies due to a temperature gradient.',
            explanation: 'A cup of boiling water has a much higher temperature than an iceberg, but the iceberg contains vastly more total thermal energy due to its immense mass.',
          },
        ],
        practiceExercises: [
          {
            question: 'How much heat is required to heat 1.5 kg of liquid water from 15°C to 75°C? (c = 4184 J/kg·K)',
            hint: 'Q = m c ΔT = 1.5 · 4184 · (75 - 15).',
            solution: 'Q = 1.5 · 4184 · 60 = 376,560 J = 376.6 kJ.',
          },
        ],
      },
    ],
  },
  {
    id: 'module-7',
    number: 7,
    title: 'Waves & Oscillations',
    amharicTitle: 'ሞገዶች እና ንዝረቶች',
    description: 'Simple harmonic motion (mass-spring & simple pendulum), resonance, wave velocity, sound waves, Doppler effect, and wave superposition.',
    iconName: 'Radio',
    topics: [
      {
        id: 'simple-harmonic-motion',
        title: 'Simple Harmonic Motion (SHM)',
        amharicTitle: 'ቀላል ሃርሞኒክ እንቅስቃሴ',
        readingTimeMin: 9,
        learningObjectives: [
          'Recognize Hooke’s Law restoring forces: F = -kx.',
          'Calculate frequency, period, and angular frequency: ω = √(k/m).',
          'Analyze energy transformations between elastic potential and kinetic energy.',
        ],
        introduction:
          'Periodic motion occurs repeatedly over equal time intervals. When the restoring force is directly proportional to displacement and directed toward equilibrium, the resulting oscillation is called Simple Harmonic Motion.',
        conceptExplanation:
          'For a mass-spring system, Hooke’s law states F = -k x. By Newton’s second law, m (d²x/dt²) + k x = 0. The position function is x(t) = A cos(ωt + φ), with angular frequency ω = √(k/m), frequency f = ω / (2π), and period T = 1/f = 2π √(m/k). Total mechanical energy E = (1/2) k A² is continuously exchanged between elastic potential and kinetic energy.',
        keyEquations: [
          {
            name: 'Period of Mass-Spring Oscillator',
            latex: 'T = 2\\pi \\sqrt{\\frac{m}{k}}',
            description: 'Period of oscillation of mass m on a spring with stiffness k.',
            symbols: { 'T': 'Period (s)', 'm': 'Mass (kg)', 'k': 'Spring constant (N/m)' },
          },
          {
            name: 'Period of Simple Pendulum',
            latex: 'T = 2\\pi \\sqrt{\\frac{L}{g}}',
            description: 'Period for small angular oscillations (θ < 15°).',
            symbols: { 'L': 'Length of pendulum string (m)', 'g': '9.8 m/s²' },
          },
        ],
        workedExamples: [
          {
            id: 'we-7-1',
            title: 'Calculating Spring Constant from Oscillation Period',
            problemStatement: 'A 0.50 kg mass oscillating horizontally on a spring completes 10 full cycles in 8.0 seconds. Find the spring constant k.',
            given: { 'm': '0.50 kg', '10 cycles in 8.0 s': 'Period T = 8.0 / 10 = 0.80 s' },
            find: 'Spring constant k in N/m',
            applicableLaw: 'Period formula for simple harmonic oscillator',
            equation: 'k = \\frac{4\\pi^2 m}{T^2}',
            stepByStepSolution: [
              'T = 0.80 s  ⟹  T² = 0.64 s².',
              'From T = 2π √(m/k)  ⟹  k = 4π² m / T².',
              'Substitute: k = 4 · (3.14159)² · (0.50) / 0.64.',
              'k = 4 · 9.8696 · 0.50 / 0.64 = 19.739 / 0.64 = 30.84 N/m.',
            ],
            finalAnswer: 'k = 30.8 N/m.',
            physicalInterpretation: 'A higher spring constant produces a stiffer spring and shorter oscillation period.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-7-1',
            statement: 'Increasing the amplitude of a simple pendulum makes it take longer to complete one swing.',
            scientificCorrection: 'In the small-angle approximation (θ < 15°), the period T = 2π√(L/g) is completely independent of the oscillation amplitude (isochronism of pendulums).',
            explanation: 'Greater amplitude means traveling a longer distance, but restoring forces are proportionally greater, accelerating the bob faster and keeping the period constant.',
          },
        ],
        practiceExercises: [
          {
            question: 'What length must a simple pendulum have to possess a period of exactly 1.0 second on Earth? (g = 9.8 m/s²)',
            hint: 'L = g T² / (4 π²).',
            solution: 'L = 9.8 · (1.0)² / (4 · 9.8696) = 0.248 m = 24.8 cm.',
          },
        ],
      },
    ],
  },
  {
    id: 'module-8',
    number: 8,
    title: 'Electricity & Magnetism',
    amharicTitle: 'ኤሌክትሪክ እና ማግኔቲዝም',
    description: "Coulomb's Law, electric field, electric potential, Ohm's law, DC circuits, magnetic forces on moving charges, and electromagnetic induction.",
    iconName: 'Compass',
    topics: [
      {
        id: 'coulombs-law-and-circuits',
        title: 'Electrostatics & Ohm’s Law',
        amharicTitle: 'የኤሌክትሪክ ክፍያዎች እና የኦህም ሕግ',
        readingTimeMin: 10,
        learningObjectives: [
          'Calculate electrostatic forces between point charges via Coulomb’s Law.',
          'Define electric potential difference (voltage) and electric field.',
          'Solve basic DC resistive circuits using Ohm’s Law: V = IR and power P = IV.',
        ],
        introduction:
          'Electromagnetism is one of the four fundamental interactions of nature. It governs atomic structure, chemical bonding, electronics, and light.',
        conceptExplanation:
          'Coulomb’s law states that the electrostatic force between two stationary point charges is F = k_e |q_1 q_2| / r², where k_e = 8.99 × 10⁹ N·m²/C². Like charges repel; opposite charges attract. In electrical conductors, electric potential difference V drives current I against resistance R according to Ohm’s Law: V = I R.',
        keyEquations: [
          {
            name: "Coulomb's Law",
            latex: 'F = k_e \\frac{|q_1 q_2|}{r^2}',
            description: 'Electrostatic force between two point charges.',
            symbols: { 'k_e': '8.988 × 10⁹ N·m²/C²', 'q_1, q_2': 'Electric charges in Coulombs (C)', 'r': 'Separation distance (m)' },
          },
          {
            name: "Ohm's Law",
            latex: 'V = I R',
            description: 'Linear relationship between voltage, current, and resistance.',
            symbols: { 'V': 'Electric potential difference (Volts, V)', 'I': 'Electric current (Amperes, A)', 'R': 'Resistance (Ohms, Ω)' },
          },
        ],
        workedExamples: [
          {
            id: 'we-8-1',
            title: 'Electrostatic Force Between Microcharges',
            problemStatement: 'Two point charges q_1 = +2.0 μC and q_2 = -5.0 μC are separated by a distance of 0.30 m in a vacuum. Calculate the electrostatic force between them.',
            given: { 'q_1': '2.0 × 10⁻⁶ C', 'q_2': '-5.0 × 10⁻⁶ C', 'r': '0.30 m', 'k_e': '8.99 × 10⁹ N·m²/C²' },
            find: 'Magnitude and nature of electrostatic force F',
            applicableLaw: "Coulomb's Law",
            equation: 'F = k_e \\frac{|q_1 q_2|}{r^2}',
            stepByStepSolution: [
              '|q_1 · q_2| = (2.0 × 10⁻⁶) · (5.0 × 10⁻⁶) = 1.0 × 10⁻¹¹ C².',
              'r² = (0.30)² = 0.09 m².',
              'F = (8.99 × 10⁹) · (1.0 × 10⁻¹¹) / 0.09 = 0.0899 / 0.09 = 0.999 N ≈ 1.0 N.',
            ],
            finalAnswer: 'F = 1.0 N (attractive force).',
            physicalInterpretation: 'Because the charges carry opposite signs (+ and -), the electrostatic force is mutually attractive.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-8-1',
            statement: 'Current is "used up" as it travels through a light bulb or resistor.',
            scientificCorrection: 'Electric current (charge flow rate, dQ/dt) is strictly conserved in any closed electrical loop (Kirchhoff’s Current Law).',
            explanation: 'What is consumed is electric potential energy (voltage drop), which is converted into heat and radiant light; every electron entering the resistor exits into the return wire.',
          },
        ],
        practiceExercises: [
          {
            question: 'A 100-watt heating element operates connected to a 220 V line. What is its operating resistance?',
            hint: 'Power P = V² / R ⟹ R = V² / P.',
            solution: 'R = (220)² / 100 = 48,400 / 100 = 484 Ω.',
          },
        ],
      },
    ],
  },
  {
    id: 'module-9',
    number: 9,
    title: 'Computational Physics Lab',
    amharicTitle: 'ኮምፒውቲሽናል ፊዚክስ ቤተ-ሙከራ',
    description: 'Python for scientific physics, numerical algorithms, rounding and truncation errors, Matplotlib graphing, Euler integration, and analytical vs numerical comparisons.',
    iconName: 'Terminal',
    topics: [
      {
        id: 'python-euler-integration',
        title: 'Numerical Simulation of Motion via Euler Integration',
        amharicTitle: 'በፓይዘን የኦይለር ኢንቴግሬሽን እንቅስቃሴን መምሰል',
        readingTimeMin: 14,
        learningObjectives: [
          'Understand why non-linear physical problems require numerical approximations.',
          'Implement the Forward Euler algorithm: x_{n+1} = x_n + v_n Δt, v_{n+1} = v_n + a_n Δt.',
          'Analyze truncation error and stability as a function of the time step Δt.',
        ],
        introduction:
          'While textbook physics focuses on idealized closed-form analytical solutions, real-world systems (air drag, chaotic orbits, three-body problems) require numerical integration executed on computers.',
        conceptExplanation:
          'Euler’s method discretizes continuous differential equations into small time steps Δt. Given initial position x_0 and velocity v_0, at each step we calculate acceleration from forces a = F/m, update position by x = x + v · dt, and update velocity by v = v + a · dt. Choosing a smaller Δt reduces truncation error at the cost of more computation.',
        keyEquations: [
          {
            name: 'Forward Euler Update Equations',
            latex: 'v_{n+1} = v_n + a_n \\Delta t, \\quad x_{n+1} = x_n + v_n \\Delta t',
            description: 'Discrete numerical approximation of differential equations dx/dt = v and dv/dt = a.',
            symbols: { 'Δt': 'Time step interval (s)', 'x_n, v_n': 'Position and velocity at step n' },
          },
        ],
        workedExamples: [
          {
            id: 'we-9-1',
            title: 'Simulating Free Fall with Quadratic Drag in Python',
            problemStatement: 'Write a Python snippet to simulate a 1 kg sphere falling from rest under gravity and air drag F_drag = -0.5 c_d ρ A v².',
            given: { 'm': '1.0 kg', 'g': '9.8 m/s²', 'k (drag coef)': '0.1 kg/m', 'dt': '0.05 s' },
            find: 'Numerical algorithm structure',
            applicableLaw: "Euler integration of Newton's second law",
            equation: 'm \\frac{dv}{dt} = m g - k v^2',
            stepByStepSolution: [
              'Initialize: t = 0, y = 100.0, v = 0.0, dt = 0.05.',
              'Loop while y > 0:',
              'Compute net acceleration: a = -g + (k * v**2) / m (if v downward).',
              'Update velocity: v = v + a * dt.',
              'Update position: y = y + v * dt.',
              'Advance clock: t = t + dt.',
            ],
            finalAnswer: 'Terminal velocity reached when a = 0 ⟹ v_term = √(mg / k) = √(9.8 / 0.1) = 9.9 m/s.',
            physicalInterpretation: 'Unlike analytical vacuum free-fall where speed grows indefinitely, the numerical simulation naturally captures asymptotic terminal velocity.',
          },
        ],
        misconceptions: [
          {
            id: 'misc-9-1',
            statement: 'Numerical simulations give exact answers just like analytical equations.',
            scientificCorrection: 'All numerical integrations introduce finite truncation errors (from Taylor series truncation) and floating-point roundoff errors.',
            explanation: 'Always verify numerical results by testing different time steps Δt and checking conservation of total energy.',
          },
        ],
        practiceExercises: [
          {
            question: 'What happens to the total energy of an undamped harmonic oscillator simulated with the standard Forward Euler method over many cycles?',
            hint: 'Forward Euler is not symplectic; examine whether the phase space spiral expands or contracts.',
            solution: 'Standard Forward Euler artificially injects energy at every step, causing the amplitude to grow unbounded. Using the Euler-Cromer or Verlet algorithm solves this problem!',
          },
        ],
      },
    ],
  },
];
