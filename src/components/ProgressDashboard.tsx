import React from 'react';
import {
  BarChart3,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Database,
  ArrowRight,
} from 'lucide-react';
import { PHYSICS_MODULES } from '../physics/modulesData';

interface ProgressDashboardProps {
  completedTopics: string[];
  quizHistory: Array<{ score: number; total: number; timestamp: string }>;
  onNavigateTab: (tab: any) => void;
  onResetProgress: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  completedTopics,
  quizHistory,
  onNavigateTab,
  onResetProgress,
}) => {
  const allTopicsCount = PHYSICS_MODULES.reduce((acc, m) => acc + m.topics.length, 0);
  const completionPercentage = Math.round((completedTopics.length / allTopicsCount) * 100);

  const totalQuizzesTaken = quizHistory.length;
  const averageScore =
    totalQuizzesTaken > 0
      ? Math.round(
          (quizHistory.reduce((acc, q) => acc + q.score / q.total, 0) / totalQuizzesTaken) * 100
        )
      : 0;

  // Frequently missed concepts
  const frequentlyMissed = [
    {
      concept: 'Free fall acceleration at the trajectory peak is 9.8 m/s² downward, not zero.',
      topic: 'Kinematics',
      severity: 'High',
    },
    {
      concept: 'Normal force is an electromagnetic contact force, NOT the Newton III reaction pair to gravity.',
      topic: 'Newton\'s Laws',
      severity: 'Medium',
    },
    {
      concept: 'Centripetal and normal forces perpendicular to displacement perform exactly 0 Joules of work.',
      topic: 'Work & Energy',
      severity: 'Medium',
    },
  ];

  const recommendedTopics = [
    { id: 'constant-acceleration-1d', title: 'Uniform Acceleration Kinematics', module: 'Module 2' },
    { id: 'newtons-laws', title: "Newton's Second Law & Free-Body Diagrams", module: 'Module 3' },
    { id: 'work-energy-theorem', title: 'Work-Energy Theorem & Conservation', module: 'Module 4' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              My Learning Progress
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Personalized academic analytics for General Physics I at Debre Tabor University.
          </p>
        </div>

        <button
          onClick={onResetProgress}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center space-x-1 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session Data</span>
        </button>
      </div>

      {/* Honest Storage Notice (Section 15 Requirement) */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex items-start space-x-3 text-slate-700 dark:text-slate-300">
        <Database className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Active Storage Architecture: In-Memory / Client Session State
          </span>
          <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
            Progress metrics displayed here are currently tracked within your active browser session. To preserve lesson history, assessment marks, and multi-device synchronization permanently, the platform can be connected to Firebase Authentication & Cloud Firestore or PostgreSQL via the application backend.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Curriculum Progress</span>
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {completionPercentage}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400">
            {completedTopics.length} of {allTopicsCount} topics completed
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Assessment Mastery</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {totalQuizzesTaken > 0 ? `${averageScore}%` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-400">
            Based on {totalQuizzesTaken} verified problem set attempts
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Quizzes Attempted</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            {totalQuizzesTaken}
          </div>
          <div className="text-[11px] text-slate-400">
            Across 9 core physics modules
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Learning Status</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            Undergraduate Scholar
          </div>
          <div className="text-[11px] text-slate-400">
            Debre Tabor University Physics Cohort
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module-by-Module Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Curriculum Mastery by Module
          </h2>

          <div className="space-y-3">
            {PHYSICS_MODULES.map((mod) => {
              const modTopicsCompleted = mod.topics.filter((t) => completedTopics.includes(t.id)).length;
              const modPct = Math.round((modTopicsCompleted / mod.topics.length) * 100);

              return (
                <div key={mod.id} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">
                      Module {mod.number}: {mod.title}
                    </span>
                    <span className="font-mono text-slate-500">{modPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${modPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Revision Recommendations */}
        <div className="lg:col-span-5 space-y-5">
          {/* Frequently Missed Concepts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center space-x-1.5 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Target Revision Areas (Diagnostic)</span>
            </div>
            <div className="space-y-2">
              {frequentlyMissed.map((item, i) => (
                <div key={i} className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs space-y-1 text-rose-950 dark:text-rose-200">
                  <span className="font-bold text-rose-700 dark:text-rose-400 block text-[10px] uppercase">
                    {item.topic}
                  </span>
                  <p className="leading-relaxed">{item.concept}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resume Link */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm">Resume Physics Learning</h3>
            <p className="text-xs text-blue-100 leading-relaxed">
              Continue your study with Module 2: Motion with Constant Acceleration or practice the 9-step guided solver.
            </p>
            <button
              onClick={() => onNavigateTab('learn')}
              className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <span>Open Learning Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
