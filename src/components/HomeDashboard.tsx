import React, { useState } from 'react';
import {
  MessageSquare,
  BookOpen,
  Calculator,
  LineChart,
  CheckCircle2,
  Terminal,
  BarChart3,
  GraduationCap,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { NavigationTab } from './Navbar';
import { PHYSICS_MODULES } from '../physics/modulesData';

interface HomeDashboardProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onAskTutorWithPrompt: (prompt: string) => void;
  completedTopicsCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateTab,
  onAskTutorWithPrompt,
  completedTopicsCount,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onAskTutorWithPrompt(quickInput);
  };

  const topicShortcuts = [
    {
      id: 'module-2',
      title: 'Kinematics & Acceleration',
      desc: 'Uniform motion, v-t and s-t graphs, and free-fall.',
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      tag: 'Module 2',
    },
    {
      id: 'module-3',
      title: "Newton's Laws & Dynamics",
      desc: 'Force vectors, F = ma, friction, and free-body diagrams.',
      icon: <Cpu className="w-5 h-5 text-amber-500" />,
      tag: 'Module 3',
    },
    {
      id: 'module-4',
      title: 'Work, Energy & Momentum',
      desc: 'Work-energy theorem, potential energy, and collisions.',
      icon: <Layers className="w-5 h-5 text-emerald-500" />,
      tag: 'Module 4',
    },
    {
      id: 'module-9',
      title: 'Python Computational Lab',
      desc: 'Euler integration and scientific plotting scripts.',
      icon: <Terminal className="w-5 h-5 text-indigo-500" />,
      tag: 'Module 9',
    },
  ];

  const suggestedQuestions = [
    {
      label: 'Acceleration Calculation',
      prompt: 'A car changes velocity from 5 m/s to 25 m/s in 4 seconds. Calculate its acceleration.',
    },
    {
      label: 'Plot Velocity-Time',
      prompt: 'Plot velocity against time for a car accelerating from 5 m/s to 25 m/s in 4 seconds.',
    },
    {
      label: "Newton's Second Law",
      prompt: 'Explain Newton\'s second law in simple language.',
    },
    {
      label: 'Guided Problem Solving',
      prompt: 'Give me a hint for solving a Newton\'s second law problem.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Debre Tabor University • Department of Physics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            AI Agent Physics Tutor
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to the intelligent physics learning platform for undergraduate physics students.
            Ask conceptual questions, perform validated numerical calculations, simulate interactive motion graphs,
            and practice guided problem-solving under the instructional guidance of <strong>Dr. Yohannes Achenefe</strong>.
          </p>

          {/* Prominent Question Input Bar */}
          <form onSubmit={handleQuickSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-700 shadow-xl">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Ask any physics question (e.g. 'A car accelerates from 5 to 25 m/s in 4s. Calculate acceleration and plot v-t')..."
                className="w-full px-4 py-3 text-sm bg-transparent text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-md whitespace-nowrap"
              >
                <span>Ask AI Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium">Try asking:</span>
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onAskTutorWithPrompt(q.prompt)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors text-[11px]"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative background Greek Phi symbol */}
        <div className="absolute right-4 -bottom-10 text-white/5 text-[220px] font-black pointer-events-none select-none">
          Φ
        </div>
      </div>

      {/* Feature Navigation Cards (The 10 Core Features) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Interactive Learning Capabilities
          </h2>
          <span className="text-xs text-slate-500">10 Integrated Educational Workspaces</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateTab('tutor')}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
              Ask AI Physics Tutor
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Natural language physics dialog with deterministic tool-calling for acceleration, force, and energy.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('learn')}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
              Learn Physics (Modules 1 - 9)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Curriculum covering kinematics, dynamics, energy, fluids, thermodynamics, and waves.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('solve')}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
              9-Step Guided Problem Solver
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Step-by-step problem deconstruction with hints, approach checking, and variable substitution.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('graphs')}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <LineChart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
              Simulations & Graphs
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Interactive velocity-time graph with dynamic slopes and displacement area integration.
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Module Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Featured Course Modules
          </h2>
          <button
            onClick={() => onNavigateTab('learn')}
            className="text-xs text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>View All 9 Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topicShortcuts.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab('learn')}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer transition-all shadow-xs space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-mono">
                  {item.tag}
                </span>
                {item.icon}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
