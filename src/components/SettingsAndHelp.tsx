import React from 'react';
import {
  Settings,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  GraduationCap,
  Sparkles,
  Info,
  Languages,
} from 'lucide-react';
import { PHYSICS_TOOLS } from '../physics/tools';

export const SettingsAndHelp: React.FC = () => {
  const physicalConstants = [
    { name: 'Acceleration due to gravity (near Earth surface)', symbol: 'g', value: '9.80665 m/s²', approx: '9.8 m/s²' },
    { name: 'Speed of light in vacuum', symbol: 'c', value: '299,792,458 m/s', approx: '3.00 × 10⁸ m/s' },
    { name: 'Universal gravitational constant', symbol: 'G', value: '6.67430 × 10⁻¹¹ N·m²/kg²', approx: '6.67 × 10⁻¹¹' },
    { name: 'Coulomb constant', symbol: 'k_e', value: '8.98755 × 10⁹ N·m²/C²', approx: '8.99 × 10⁹ N·m²/C²' },
    { name: 'Density of pure water (at 4°C)', symbol: 'ρ_water', value: '1,000 kg/m³', approx: '1000 kg/m³' },
    { name: 'Specific heat capacity of water', symbol: 'c_water', value: '4,184 J/(kg·K)', approx: '4184 J/(kg·K)' },
    { name: 'Standard atmospheric pressure', symbol: 'P_atm', value: '101,325 Pa', approx: '1.013 × 10⁵ Pa (1 atm)' },
  ];

  const amharicGlossary = [
    { english: 'Acceleration', amharic: 'ማጣደፍ (አክሲለሬሽን)', definition: 'የፍጥነት ለውጥ በጊዜ ክፍፍል' },
    { english: 'Velocity', amharic: 'ቬሎሲቲ (አቅጣጫዊ ፍጥነት)', definition: 'የአካሉ የቦታ ለውጥ በጊዜ' },
    { english: 'Displacement', amharic: 'የቦታ ለውጥ (ዲስፕሌስመንት)', definition: 'የመጀመሪያ እና የመጨረሻ ነጥብ ቀጥተኛ ርቀት' },
    { english: 'Force', amharic: 'ኃይል (ፎርስ)', definition: 'የአካሉን ፍጥነት ወይም አቅጣጫ የሚቀይር መስተጋብር' },
    { english: 'Inertia', amharic: 'ኢነርሺያ (ስንፍና)', definition: 'አካሉ እንቅስቃሴውን የመቀየር አቅም መቋቋም' },
    { english: 'Work', amharic: 'ሥራ (ወርክ)', definition: 'በኃይል እና በርቀት የሚከናወን ጉልበት' },
    { english: 'Kinetic Energy', amharic: 'የእንቅስቃሴ ጉልበት', definition: 'አካሉ በእንቅስቃሴው ምክንያት ያለው ጉልበት' },
    { english: 'Density', amharic: 'ጥግግት (ዴንሲቲ)', definition: 'የክብደት በይዘት ክፍፍል' },
    { english: 'Pressure', amharic: 'ግፊት (ፕሬሸር)', definition: 'በአንድ ካሬ ስፋት ላይ የሚያርፍ ኃይል' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Settings, Help & Scientific Reference
          </h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Physical constants table, Amharic physics glossary, pedagogical system instructions, and tool registry.
        </p>
      </div>

      {/* University & Department Accreditation */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Institutional Context</span>
        </div>
        <h2 className="text-lg font-bold">Debre Tabor University • Department of Physics</h2>
        <p className="text-xs text-blue-100 leading-relaxed max-w-2xl">
          Designed and developed for undergraduate university physics students (General Physics I and introductory computational physics), under the pedagogical direction of <strong>Dr. Yohannes Achenefe</strong>.
        </p>
      </div>

      {/* Physical Constants Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Fundamental Physical Constants (SI Standard)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Constant</th>
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Standard SI Value</th>
                <th className="py-2.5 px-3">Working Approximation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {physicalConstants.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-medium">{c.name}</td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 dark:text-blue-400 font-bold">{c.symbol}</td>
                  <td className="py-2.5 px-3 font-mono">{c.value}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">{c.approx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amharic Physics Terminology Glossary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-amber-600">
          <Languages className="w-5 h-5" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Amharic Physics Terminology Glossary (የአማርኛ ፊዚክስ ቃላት መዝገብ)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {amharicGlossary.map((g, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
              <div className="font-bold text-blue-600 dark:text-blue-400">{g.english}</div>
              <div className="font-semibold text-amber-700 dark:text-amber-300">{g.amharic}</div>
              <div className="text-[11px] text-slate-500">{g.definition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Physics Tool Registry Inspector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-emerald-600">
          <Cpu className="w-5 h-5" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Registered Deterministic Physics Tools ({Object.keys(PHYSICS_TOOLS).length} Total)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.values(PHYSICS_TOOLS).map((tool) => (
            <div key={tool.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100">{tool.name}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-semibold">
                  {tool.category}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {tool.description}
              </p>
              <div className="pt-1 flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                <span>Inputs:</span>
                {Object.keys(tool.parameters).map((p) => (
                  <span key={p} className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 9: AI Tutor Pedagogical System Instruction */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <div className="flex items-center space-x-2 text-blue-600 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Core Pedagogical System Instruction (Section 9 Specification)</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
          The AI Agent operates strictly under this system prompt:
        </p>
        <blockquote className="border-l-2 border-blue-500 pl-4 py-1 text-slate-700 dark:text-slate-300 italic text-[11px] leading-relaxed space-y-1">
          <p>"You are an AI Physics Tutor for undergraduate university students. Your purpose is to help students understand physics, develop scientific reasoning, and solve problems independently."</p>
          <p>Key mandates: SI units only, deterministic calculations for verified arithmetic, never fabricating data or citations, guiding with hints rather than dumping raw answers, and checking units/reasonableness.</p>
        </blockquote>
      </div>
    </div>
  );
};
