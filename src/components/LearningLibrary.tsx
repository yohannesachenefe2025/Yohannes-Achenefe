import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  Sparkles,
  Languages,
} from 'lucide-react';
import { PHYSICS_MODULES, PhysicsModule, ModuleTopic, WorkedExample } from '../physics/modulesData';
import { MathFormula } from './MathFormula';

interface LearningLibraryProps {
  amharicMode: boolean;
  completedTopics: string[];
  onToggleCompleteTopic: (topicId: string) => void;
}

export const LearningLibrary: React.FC<LearningLibraryProps> = ({
  amharicMode,
  completedTopics,
  onToggleCompleteTopic,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('module-2');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('constant-acceleration-1d');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const activeModule = PHYSICS_MODULES.find((m) => m.id === selectedModuleId) || PHYSICS_MODULES[0];
  const activeTopic = activeModule.topics.find((t) => t.id === selectedTopicId) || activeModule.topics[0];

  // Search filtering
  const filteredModules = PHYSICS_MODULES.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const modMatch = m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    const topMatch = m.topics.some(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.introduction.toLowerCase().includes(q) ||
        t.conceptExplanation.toLowerCase().includes(q)
    );
    return modMatch || topMatch;
  });

  const isCurrentTopicCompleted = completedTopics.includes(activeTopic.id);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {amharicMode ? 'የፊዚክስ ትምህርት ቤተ-መጻሕፍት' : 'Physics Learning Library'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            General Physics I and Introductory Computational Physics curriculum at Debre Tabor University.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search concepts, laws, equations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module & Topic Sidebar Navigation */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              Course Modules (1 - 9)
            </h2>

            <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
              {filteredModules.map((mod) => {
                const isSelectedMod = mod.id === activeModule.id;

                return (
                  <div key={mod.id} className="space-y-1">
                    <button
                      onClick={() => {
                        setSelectedModuleId(mod.id);
                        if (mod.topics.length > 0) {
                          setSelectedTopicId(mod.topics[0].id);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                        isSelectedMod
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          isSelectedMod ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {mod.number}
                        </span>
                        <span className="truncate">
                          {amharicMode ? mod.amharicTitle : mod.title}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelectedMod ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Subtopics under selected module */}
                    {isSelectedMod && (
                      <div className="pl-4 space-y-1 py-1">
                        {mod.topics.map((t) => {
                          const isSelectedTopic = t.id === activeTopic.id;
                          const isDone = completedTopics.includes(t.id);

                          return (
                            <button
                              key={t.id}
                              onClick={() => setSelectedTopicId(t.id)}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                isSelectedTopic
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-bold border-l-2 border-blue-600'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span className="truncate">{amharicMode && t.amharicTitle ? t.amharicTitle : t.title}</span>
                              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Topic Reader Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Topic Header & Meta */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  Module {activeModule.number}: {activeModule.title}
                </span>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{activeTopic.readingTimeMin} min read</span>
                  </span>
                  <button
                    onClick={() => onToggleCompleteTopic(activeTopic.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      isCurrentTopicCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrentTopicCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{isCurrentTopicCompleted ? 'Completed' : 'Mark as Done'}</span>
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {activeTopic.title}
              </h2>
              {amharicMode && activeTopic.amharicTitle && (
                <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Languages className="w-3.5 h-3.5" />
                  <span>{activeTopic.amharicTitle}</span>
                </div>
              )}
            </div>

            {/* Learning Objectives */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learning Objectives</span>
              </h3>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {activeTopic.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Introduction & Concepts */}
            <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Introduction & Physical Foundation
              </h3>
              <p>{activeTopic.introduction}</p>
              <p className="whitespace-pre-line">{activeTopic.conceptExplanation}</p>
            </div>

            {/* Key Equations with KaTeX */}
            <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Key Equations & Symbol Definitions
              </h3>
              <div className="space-y-3">
                {activeTopic.keyEquations.map((eq, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{eq.name}</span>
                      <span className="text-[11px] text-slate-400">{eq.description}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-lg text-center shadow-xs overflow-x-auto">
                      <MathFormula formula={eq.latex} displayMode={true} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      {Object.entries(eq.symbols).map(([sym, def]) => (
                        <div key={sym} className="flex items-center space-x-1">
                          <code className="text-blue-600 dark:text-blue-400 font-mono font-bold">{sym}:</code>
                          <span>{def}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worked Examples */}
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Step-by-Step Worked Examples
              </h3>
              {activeTopic.workedExamples.map((ex) => (
                <div key={ex.id} className="bg-blue-50/50 dark:bg-slate-800/60 p-4 rounded-xl border border-blue-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="font-bold text-sm text-blue-900 dark:text-blue-300">
                    {ex.title}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {ex.problemStatement}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-blue-100 dark:border-slate-800">
                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-400">Given:</span>{' '}
                      {Object.entries(ex.given).map(([k, v]) => `${k} = ${v}`).join(', ')}
                    </div>
                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-400">Find:</span> {ex.find}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Solution Sequence:</span>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {ex.stepByStepSolution.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg text-emerald-900 dark:text-emerald-200 font-semibold">
                    Final Answer: {ex.finalAnswer}
                  </div>

                  <div className="text-[11px] text-slate-500 italic">
                    <strong>Physical Interpretation:</strong> {ex.physicalInterpretation}
                  </div>
                </div>
              ))}
            </div>

            {/* Common Misconceptions */}
            {activeTopic.misconceptions.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Common Student Misconceptions & Scientific Corrections</span>
                </h3>
                <div className="space-y-2.5">
                  {activeTopic.misconceptions.map((misc) => (
                    <div key={misc.id} className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1.5 text-xs text-amber-950 dark:text-amber-200">
                      <div className="flex items-start space-x-1.5">
                        <span className="text-rose-600 font-bold shrink-0">❌ Common Pitfall:</span>
                        <span className="font-medium italic">"{misc.statement}"</span>
                      </div>
                      <div className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">✓ Correction:</span>
                        <span>{misc.scientificCorrection}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-4">{misc.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Exercises */}
            {activeTopic.practiceExercises.length > 0 && (
              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Self-Assessment & Quick Practice</span>
                </h3>
                {activeTopic.practiceExercises.map((pe, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{pe.question}</p>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setRevealedHints((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded text-[11px] font-semibold"
                      >
                        {revealedHints[idx] ? 'Hide Hint' : 'Show Hint'}
                      </button>
                      <button
                        onClick={() =>
                          setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded text-[11px] font-semibold"
                      >
                        {revealedSolutions[idx] ? 'Hide Solution' : 'Check Solution'}
                      </button>
                    </div>

                    {revealedHints[idx] && (
                      <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded text-amber-900 dark:text-amber-200">
                        <strong>Hint:</strong> {pe.hint}
                      </div>
                    )}

                    {revealedSolutions[idx] && (
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded text-emerald-900 dark:text-emerald-200">
                        <strong>Solution:</strong> {pe.solution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
