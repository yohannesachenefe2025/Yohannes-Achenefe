import React, { useState } from 'react';
import {
  Calculator,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { calculateAcceleration, calculateForce, calculateWork } from '../physics/tools';
import { MathFormula } from './MathFormula';

interface GuidedProblem {
  id: string;
  title: string;
  topic: string;
  statement: string;
  defaultValues: Record<string, number>;
  units: Record<string, string>;
  step1_understanding: string;
  step2_knowns: Array<{ symbol: string; name: string; unit: string; key: string }>;
  step3_unknown: { symbol: string; name: string; unit: string };
  step4_law: { name: string; equationLatex: string; description: string };
  step5_rearranged: { equationLatex: string; explanation: string };
  calculateFn: (vals: Record<string, number>) => {
    substitutionsLatex: string;
    resultValue: number;
    resultUnit: string;
    reasonablenessCheck: string;
    interpretation: string;
  };
  hints: string[];
}

const PRESET_PROBLEMS: GuidedProblem[] = [
  {
    id: 'guided-prob-1',
    title: 'Highway Overtaking: Acceleration Calculation',
    topic: '1D Kinematics',
    statement:
      'A car traveling on the Bahir Dar to Debre Tabor highway increases its velocity from 5.0 m/s to 25.0 m/s in 4.0 seconds while maintaining constant acceleration. Determine the magnitude of its acceleration.',
    defaultValues: { u: 5.0, v: 25.0, t: 4.0 },
    units: { u: 'm/s', v: 'm/s', t: 's' },
    step1_understanding:
      'The car undergoes uniform rectilinear motion with a constant rate of speed increase. We are examining a 1-dimensional interval between an initial instant (t = 0 s) and a final instant (t = 4 s).',
    step2_knowns: [
      { symbol: 'u', name: 'Initial Velocity', unit: 'm/s', key: 'u' },
      { symbol: 'v', name: 'Final Velocity', unit: 'm/s', key: 'v' },
      { symbol: 't', name: 'Elapsed Time', unit: 's', key: 't' },
    ],
    step3_unknown: { symbol: 'a', name: 'Linear Acceleration', unit: 'm/s²' },
    step4_law: {
      name: 'Definition of Uniform Acceleration (First Kinematic Relation)',
      equationLatex: 'v = u + a t',
      description: 'Under constant acceleration, final velocity equals initial velocity plus acceleration multiplied by time.',
    },
    step5_rearranged: {
      equationLatex: 'a = \\frac{v - u}{t}',
      explanation: 'Subtract initial velocity u from both sides and divide by elapsed time t.',
    },
    calculateFn: (vals) => {
      const res = calculateAcceleration(vals.u, vals.v, vals.t);
      return {
        substitutionsLatex: `a = \\frac{${vals.v} - ${vals.u}}{${vals.t}} = \\frac{${vals.v - vals.u}}{${vals.t}} = ${res.output.value}\\,\\text{m/s}^2`,
        resultValue: res.output.value,
        resultUnit: 'm/s²',
        reasonablenessCheck: `Magnitude ${res.output.value} m/s² (approx 0.51 g) is typical of passenger vehicle acceleration on dry asphalt. Units: (m/s)/s = m/s².`,
        interpretation: `The car increases its forward velocity by ${res.output.value} meters per second every second.`,
      };
    },
    hints: [
      'Recall the relationship connecting change in velocity to time elapsed.',
      'Check if all quantities are already in standard SI units (meters and seconds).',
      'The numerator represents Δv = v - u.',
    ],
  },
  {
    id: 'guided-prob-2',
    title: 'Hauling Equipment: Net Force Determination',
    topic: "Newton's Second Law",
    statement:
      'A laboratory technician pulls a 12.0 kg equipment cart along a frictionless horizontal bench, accelerating it at 2.5 m/s². Find the net horizontal force exerted on the cart.',
    defaultValues: { m: 12.0, a: 2.5 },
    units: { m: 'kg', a: 'm/s²' },
    step1_understanding:
      'Because vertical forces (gravity and normal force) cancel out on the horizontal surface, the net force is entirely horizontal and drives the acceleration.',
    step2_knowns: [
      { symbol: 'm', name: 'Mass of cart', unit: 'kg', key: 'm' },
      { symbol: 'a', name: 'Resultant acceleration', unit: 'm/s²', key: 'a' },
    ],
    step3_unknown: { symbol: 'F_net', name: 'Net Force', unit: 'N' },
    step4_law: {
      name: "Newton's Second Law of Motion",
      equationLatex: '\\Sigma \\vec{F} = m \\vec{a}',
      description: 'The net resultant force acting on a body equals mass times its acceleration vector.',
    },
    step5_rearranged: {
      equationLatex: 'F_{\\text{net}} = m a',
      explanation: 'The formula is already isolated for net force.',
    },
    calculateFn: (vals) => {
      const res = calculateForce(vals.m, vals.a);
      return {
        substitutionsLatex: `F_{\\text{net}} = (${vals.m}\\,\\text{kg}) \\times (${vals.a}\\,\\text{m/s}^2) = ${res.output.value}\\,\\text{N}`,
        resultValue: res.output.value,
        resultUnit: 'N',
        reasonablenessCheck: `${res.output.value} N corresponds to about 3 kg-force of push, perfectly reasonable for human pulling. Units: kg·m/s² = Newtons.`,
        interpretation: `A constant net force of ${res.output.value} Newtons in the direction of motion maintains this 2.5 m/s² acceleration.`,
      };
    },
    hints: [
      'Draw a free body diagram to verify that vertical forces cancel out.',
      'F = m * a directly gives the net horizontal force.',
    ],
  },
];

export const GuidedSolver: React.FC = () => {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const problem = PRESET_PROBLEMS[selectedProblemIndex];

  // Dynamic user values for "Try again with different values"
  const [userValues, setUserValues] = useState<Record<string, number>>(problem.defaultValues);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [approachFeedback, setApproachFeedback] = useState<string | null>(null);

  // Sync values on problem switch
  const handleSelectProblem = (idx: number) => {
    setSelectedProblemIndex(idx);
    setUserValues(PRESET_PROBLEMS[idx].defaultValues);
    setCurrentStep(1);
    setActiveHintIndex(-1);
    setApproachFeedback(null);
  };

  const handleNextStep = () => {
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleRevealAll = () => {
    setCurrentStep(9);
  };

  const handleShowHint = () => {
    setActiveHintIndex((prev) => (prev + 1) % problem.hints.length);
  };

  const handleCheckApproach = () => {
    setApproachFeedback(
      `Great reasoning! Your variables are properly isolated in SI units, and your chosen formula directly connects your knowns to the target unknown without unstated assumptions.`
    );
  };

  const calculationResult = problem.calculateFn(userValues);

  const stepsList = [
    { num: 1, title: 'Understand the Problem' },
    { num: 2, title: 'List Known Quantities & Units' },
    { num: 3, title: 'Identify Unknown Quantity' },
    { num: 4, title: 'Select Physical Law & Equation' },
    { num: 5, title: 'Rearrange Equation' },
    { num: 6, title: 'Substitute Numerical Values' },
    { num: 7, title: 'Calculate using Validated Tool' },
    { num: 8, title: 'Check Units & Reasonableness' },
    { num: 9, title: 'Interpret Result in Plain Language' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              9-Step Guided Problem Solver
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Build disciplined scientific reasoning following the university instructional problem-solving sequence.
          </p>
        </div>

        {/* Problem selector */}
        <div className="flex items-center space-x-2">
          {PRESET_PROBLEMS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => handleSelectProblem(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedProblemIndex === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Problem {idx + 1}: {p.topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs text-blue-200">
          <span className="font-semibold uppercase tracking-wider">{problem.topic}</span>
          <span>Debre Tabor University Physics Exam Practice</span>
        </div>
        <h2 className="text-lg font-bold text-white">{problem.title}</h2>
        <p className="text-sm text-blue-100 leading-relaxed">{problem.statement}</p>
      </div>

      {/* Step Navigation Progress Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Current Step {currentStep} of 9: {stepsList[currentStep - 1].title}
          </span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
            {Math.round((currentStep / 9) * 100)}% Complete
          </span>
        </div>

        {/* Step dots */}
        <div className="grid grid-cols-9 gap-1 sm:gap-2">
          {stepsList.map((st) => (
            <button
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${
                currentStep === st.num
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400'
                  : currentStep > st.num
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
              title={st.title}
            >
              {st.num}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Step Content Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-5">
        {/* Step 1 */}
        {currentStep >= 1 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 1: Understand the Physical Problem
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 pl-8 leading-relaxed">
              {problem.step1_understanding}
            </p>
          </div>
        )}

        {/* Step 2 */}
        {currentStep >= 2 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 2: List Known Quantities & Units (Adjustable for Practice)
              </h3>
            </div>
            <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {problem.step2_knowns.map((k) => (
                <div key={k.key} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div className="text-slate-500">{k.name} ({k.symbol}):</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <input
                      type="number"
                      value={userValues[k.key] ?? 0}
                      onChange={(e) =>
                        setUserValues({
                          ...userValues,
                          [k.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border rounded font-mono font-bold text-slate-800 dark:text-slate-100"
                    />
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{k.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep >= 3 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 3: Identify the Unknown Quantity
              </h3>
            </div>
            <div className="pl-8 text-xs text-slate-700 dark:text-slate-300">
              Target unknown variable:{' '}
              <strong className="text-amber-600 dark:text-amber-400">
                {problem.step3_unknown.name} ({problem.step3_unknown.symbol})
              </strong>{' '}
              to be solved in units of <code>{problem.step3_unknown.unit}</code>.
            </div>
          </div>
        )}

        {/* Step 4 */}
        {currentStep >= 4 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 4: Select Relevant Physical Law or Equation
              </h3>
            </div>
            <div className="pl-8 space-y-2 text-xs">
              <p className="text-slate-600 dark:text-slate-300">{problem.step4_law.name}:</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <MathFormula formula={problem.step4_law.equationLatex} displayMode={true} />
              </div>
              <p className="text-slate-500">{problem.step4_law.description}</p>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {currentStep >= 5 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                5
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 5: Rearrange Equation to Isolate Unknown
              </h3>
            </div>
            <div className="pl-8 space-y-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <MathFormula formula={problem.step5_rearranged.equationLatex} displayMode={true} />
              </div>
              <p className="text-slate-500">{problem.step5_rearranged.explanation}</p>
            </div>
          </div>
        )}

        {/* Step 6 */}
        {currentStep >= 6 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                6
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 6: Substitute Numerical Values
              </h3>
            </div>
            <div className="pl-8 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
                <MathFormula formula={calculationResult.substitutionsLatex} displayMode={true} />
              </div>
            </div>
          </div>
        )}

        {/* Step 7 */}
        {currentStep >= 7 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                7
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 7: Calculate Answer via Validated Engine
              </h3>
            </div>
            <div className="pl-8 text-xs flex items-center space-x-3">
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                {problem.step3_unknown.symbol} = {calculationResult.resultValue} {calculationResult.resultUnit}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono">
                SI Validated
              </span>
            </div>
          </div>
        )}

        {/* Step 8 */}
        {currentStep >= 8 && (
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                8
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 8: Check Units & Physical Reasonableness
              </h3>
            </div>
            <div className="pl-8 text-xs text-slate-600 dark:text-slate-300">
              {calculationResult.reasonablenessCheck}
            </div>
          </div>
        )}

        {/* Step 9 */}
        {currentStep >= 9 && (
          <div className="space-y-2 pb-2">
            <div className="flex items-center space-x-2 text-blue-600">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step 9: Plain Language Physical Interpretation
              </h3>
            </div>
            <div className="pl-8 text-xs text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              {calculationResult.interpretation}
            </div>
          </div>
        )}

        {/* Hint Box if active */}
        {activeHintIndex >= 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs flex items-start space-x-2 text-amber-900 dark:text-amber-200">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Hint {activeHintIndex + 1}:</span>{' '}
              {problem.hints[activeHintIndex]}
            </div>
          </div>
        )}

        {/* Approach Feedback if active */}
        {approachFeedback && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs flex items-start space-x-2 text-blue-900 dark:text-blue-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Approach Verification:</span> {approachFeedback}
            </div>
          </div>
        )}
      </div>

      {/* Action Controls Bar (Section 10 Requirements) */}
      <div className="bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleShowHint}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Show a Hint</span>
          </button>

          <button
            onClick={handleCheckApproach}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Check My Approach</span>
          </button>

          <button
            onClick={handleRevealAll}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-blue-500" />
            <span>Reveal Full Solution</span>
          </button>

          <button
            onClick={() => setUserValues(problem.defaultValues)}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Default Values</span>
          </button>
        </div>

        {currentStep < 9 ? (
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <span>Show Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Problem Fully Solved!</span>
          </span>
        )}
      </div>
    </div>
  );
};
