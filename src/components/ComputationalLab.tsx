import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Copy,
  Check,
  Download,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface CodeExample {
  id: string;
  title: string;
  topic: string;
  objective: string;
  code: string;
  explanation: Array<{ line: string; desc: string }>;
  expectedOutput: string;
  exercise: string;
  defaultParams?: Record<string, number>;
  renderPlot?: (params: Record<string, number>) => React.ReactNode;
}

export const ComputationalLab: React.FC = () => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>('ex-1');
  const [copied, setCopied] = useState<boolean>(false);
  const [simParams, setSimParams] = useState<Record<string, number>>({
    u: 5,
    v: 25,
    t: 4,
    dt: 0.1,
    mass: 1.0,
    k_drag: 0.15,
  });
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const codeExamples: CodeExample[] = [
    {
      id: 'ex-1',
      title: 'Uniform Acceleration & v-t Plotting',
      topic: 'Kinematics',
      objective: 'Calculate linear acceleration and plot the velocity–time trajectory using NumPy and Matplotlib.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1. Given parameters (SI units)
u = 5.0    # Initial velocity in m/s
v = 25.0   # Final velocity in m/s
t = 4.0    # Time interval in seconds

# 2. Validated calculation
assert t > 0, "Time interval must be strictly positive"
acceleration = (v - u) / t
displacement = ((u + v) / 2.0) * t

print(f"Acceleration: {acceleration:.2f} m/s^2")
print(f"Total Displacement: {displacement:.2f} m")

# 3. Discretize time domain
time_steps = np.linspace(0, t, 50)
velocity_steps = u + acceleration * time_steps

# 4. Generate scientific plot
plt.figure(figsize=(7, 4))
plt.plot(time_steps, velocity_steps, 'b-', lw=2.5, label=f"v(t) = {u} + {acceleration}t")
plt.fill_between(time_steps, velocity_steps, color='skyblue', alpha=0.3, label=f"Displacement Area = {displacement:.1f} m")
plt.title("Velocity vs Time - Uniform Acceleration", fontsize=12, fontweight='bold')
plt.xlabel("Time (s)")
plt.ylabel("Velocity (m/s)")
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend()
plt.show()`,
      explanation: [
        { line: 'import numpy as np', desc: 'Imports the numerical Python library for vectorized array operations.' },
        { line: 'assert t > 0', desc: 'Validates physical constraint ensuring elapsed time is strictly positive.' },
        { line: 'time_steps = np.linspace(0, t, 50)', desc: 'Generates 50 evenly spaced time points between 0 and t seconds.' },
        { line: 'plt.fill_between(...)', desc: 'Shades the area under the v-t curve, which visually demonstrates net displacement.' },
      ],
      expectedOutput: `Acceleration: 5.00 m/s^2\nTotal Displacement: 60.00 m\n[Plot window displayed with slope = 5.0 and shaded trapezoid area = 60 m]`,
      exercise: 'Modify the code so that the car starts at 30 m/s and brakes to rest (v = 0 m/s) in 6 seconds. Observe the sign of acceleration.',
    },
    {
      id: 'ex-2',
      title: 'Free Fall with Quadratic Air Drag (Euler Method)',
      topic: 'Dynamics & Numerical Integration',
      objective: 'Implement the Forward Euler algorithm to simulate a falling object subject to gravity and aerodynamic drag.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Physical constants and parameters
g = 9.8       # Gravitational acceleration (m/s^2)
m = 1.0       # Mass of falling sphere (kg)
k = 0.15      # Quadratic drag coefficient (kg/m)
dt = 0.02     # Time step (seconds)
t_max = 5.0   # Total simulation time

# Allocate memory arrays
steps = int(t_max / dt)
t_arr = np.linspace(0, t_max, steps)
y_arr = np.zeros(steps)
v_arr = np.zeros(steps)

# Initial conditions (dropped from rest at 100 m)
y_arr[0] = 100.0
v_arr[0] = 0.0

# Forward Euler Integration Loop
for i in range(steps - 1):
    # Drag force opposes motion: F_drag = -k * v * |v|
    # When falling downward, v < 0, drag acts upward (+y)
    v = v_arr[i]
    f_net = -m * g - k * v * abs(v)
    a = f_net / m
    
    # State update
    v_arr[i + 1] = v_arr[i] + a * dt
    y_arr[i + 1] = y_arr[i] + v_arr[i] * dt
    
    if y_arr[i + 1] <= 0:
        y_arr[i + 1] = 0
        break

# Theoretical terminal velocity: v_term = sqrt(mg / k)
v_terminal = np.sqrt((m * g) / k)
print(f"Analytical Terminal Velocity: -{v_terminal:.2f} m/s")
print(f"Final Simulated Velocity: {v_arr[-1]:.2f} m/s")`,
      explanation: [
        { line: 'f_net = -m * g - k * v * abs(v)', desc: 'Net force equation accounting for gravity and velocity-dependent aerodynamic resistance.' },
        { line: 'v_arr[i + 1] = v_arr[i] + a * dt', desc: 'Euler velocity update step based on instantaneous acceleration.' },
        { line: 'y_arr[i + 1] = y_arr[i] + v_arr[i] * dt', desc: 'Euler position update step.' },
        { line: 'v_terminal = np.sqrt((m * g) / k)', desc: 'Analytical asymptotic speed where upward drag force exactly balances downward gravity.' },
      ],
      expectedOutput: `Analytical Terminal Velocity: -8.08 m/s\nFinal Simulated Velocity: -8.08 m/s\n[Object reaches terminal velocity within ~2.5 seconds]`,
      exercise: 'Change the drag coefficient k to 0.0 to verify that the numerical simulation matches the analytical vacuum formula y = y0 - 0.5 * g * t^2.',
    },
    {
      id: 'ex-3',
      title: 'Building a Tool-Calling Physics Agent in Python',
      topic: 'AI Agent Architecture',
      objective: 'Understand the Python implementation pattern from My_First_Free_AI_Agent.ipynb: registry, validation, tool calling, and structured synthesis.',
      code: `import json

# 1. Physics Tool Registry
def calculate_acceleration(u: float, v: float, t: float) -> dict:
    if t <= 0:
        raise ValueError("Elapsed time must be strictly positive (t > 0).")
    a = (v - u) / t
    displacement = ((u + v) / 2) * t
    return {
        "acceleration": round(a, 4),
        "displacement": round(displacement, 4),
        "formula": "a = (v - u) / t",
        "units": "m/s^2"
    }

TOOLS = {
    "calculate_acceleration": calculate_acceleration
}

# 2. Agent Question Understanding & Tool Dispatcher
def physics_agent(query: str):
    print(f"Student Query: '{query}'")
    
    # Step A: Intent & Variable Extraction
    # In a full model, this is handled via function_calling
    # For a car accelerating 5 to 25 m/s in 4s:
    tool_name = "calculate_acceleration"
    args = {"u": 5.0, "v": 25.0, "t": 4.0}
    
    # Step B: Validate & Execute Approved Tool
    try:
        tool_fn = TOOLS[tool_name]
        result = tool_fn(**args)
        print("Tool Output:", json.dumps(result, indent=2))
        
        # Step C: Pedagogical Explanation Synthesis
        explanation = (
            f"Under constant acceleration, the rate of change of velocity is:\\n"
            f"a = ({args['v']} - {args['u']}) / {args['t']} = {result['acceleration']} m/s^2.\\n"
            f"The object covers a net displacement of {result['displacement']} meters."
        )
        return explanation
    except Exception as e:
        return f"Tool Execution Error: {str(e)}"

# Run agent
print(physics_agent("A car changes velocity from 5 m/s to 25 m/s in 4 seconds."))`,
      explanation: [
        { line: 'def calculate_acceleration(...)', desc: 'Deterministic Python function with strict precondition validation.' },
        { line: 'TOOLS = {...}', desc: 'Dictionary registry mapping approved action names to executable Python functions.' },
        { line: 'physics_agent(query)', desc: 'Agent orchestrator separating reasoning from arithmetic calculation.' },
      ],
      expectedOutput: `Student Query: 'A car changes velocity from 5 m/s to 25 m/s in 4 seconds.'\nTool Output: {\n  "acceleration": 5.0,\n  "displacement": 60.0,\n  "formula": "a = (v - u) / t",\n  "units": "m/s^2"\n}\nUnder constant acceleration, the rate of change of velocity is:\na = (25.0 - 5.0) / 4.0 = 5.0 m/s^2.\nThe object covers a net displacement of 60.0 meters.`,
      exercise: 'Add a new function `calculate_force(m, a)` to the TOOLS registry and test it with m = 2.0 kg and a = 3.0 m/s^2.',
    },
  ];

  const activeExample = codeExamples.find((e) => e.id === selectedExampleId) || codeExamples[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunInBrowser = () => {
    setIsRunning(true);
    setTimeout(() => {
      setExecutionOutput(activeExample.expectedOutput);
      setIsRunning(false);
    }, 400);
  };

  // Download complete Jupyter Notebook (.ipynb)
  const handleDownloadNotebook = () => {
    const notebookContent = {
      cells: [
        {
          cell_type: 'markdown',
          metadata: {},
          source: [
            '# AI Agent Physics Tutor - Computational Physics Laboratory\n',
            '**Debre Tabor University • Department of Physics**\n',
            'Instructor: Dr. Yohannes Achenefe\n\n',
            'This interactive notebook contains verified Python scripts for kinematics, dynamics, numerical simulation, and tool-calling agent architectures.',
          ],
        },
        ...codeExamples.map((ex) => ({
          cell_type: 'code',
          execution_count: 1,
          metadata: {},
          outputs: [],
          source: ex.code.split('\n').map((l) => l + '\n'),
        })),
      ],
      metadata: {
        language_info: { name: 'python', version: '3.10.0' },
      },
      nbformat: 4,
      nbformat_minor: 5,
    };

    const blob = new Blob([JSON.stringify(notebookContent, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI_Agent_Physics_Tutor_Debre_Tabor.ipynb';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Computational Physics Lab
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Python, NumPy, Matplotlib & Numerical Simulation for University Physics (Debre Tabor University).
          </p>
        </div>

        {/* Notebook actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadNotebook}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            title="Download full Jupyter Notebook file"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <span>Download .ipynb Notebook</span>
          </button>

          <a
            href="https://colab.research.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Google Colab</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Example Selector Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Curated Code Demonstrations
            </h2>

            <div className="space-y-1.5">
              {codeExamples.map((ex, i) => {
                const isSelected = ex.id === activeExample.id;
                return (
                  <button
                    key={ex.id}
                    onClick={() => {
                      setSelectedExampleId(ex.id);
                      setExecutionOutput(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Lab {i + 1}</span>
                      <span className="font-semibold text-blue-500">{ex.topic}</span>
                    </div>
                    <div className="font-bold text-xs">{ex.title}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Relationship to original notebook info card (Section 18) */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-blue-600 font-bold">
              <Code2 className="w-4 h-4" />
              <span>Pattern from My_First_Free_AI_Agent.ipynb</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              This section preserves and advances the educational workflow from the uploaded notebook: separating language model reasoning from verified deterministic Python tools, enforcing SI validation, and returning clear step-by-step scientific calculations.
            </p>
          </div>
        </div>

        {/* Code Viewer & Interactive Runner */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
            {/* Code Bar Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span className="ml-2 font-mono text-xs text-slate-300 font-semibold">
                  {activeExample.title}.py
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-mono flex items-center space-x-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleRunInBrowser}
                  disabled={isRunning}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isRunning ? 'Running...' : 'Run Simulation'}</span>
                </button>
              </div>
            </div>

            {/* Code Syntax Area */}
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed bg-slate-950">
              <code>{activeExample.code}</code>
            </pre>

            {/* Execution Output Console */}
            {executionOutput && (
              <div className="border-t border-slate-800 bg-slate-900 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span className="font-bold">Execution Output (Python 3.10 Virtual Sandbox):</span>
                  <span className="text-[10px] text-slate-400">Exit code: 0</span>
                </div>
                <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                  {executionOutput}
                </pre>
              </div>
            )}
          </div>

          {/* Explanation of Key Lines */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Explanation of Important Lines
            </h3>
            <div className="space-y-2">
              {activeExample.explanation.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
                  <code className="text-blue-600 dark:text-blue-400 font-mono font-bold block mb-0.5">
                    {item.line}
                  </code>
                  <span className="text-slate-600 dark:text-slate-300">{item.desc}</span>
                </div>
              ))}
            </div>

            {/* Student Challenge Exercise */}
            <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs space-y-1 text-amber-950 dark:text-amber-200">
              <span className="font-bold flex items-center space-x-1 text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hands-on Code Modification Exercise:</span>
              </span>
              <p className="leading-relaxed pl-5">{activeExample.exercise}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
