import React, { useState } from 'react';
import {
  Home,
  MessageSquare,
  BookOpen,
  Calculator,
  LineChart,
  CheckCircle2,
  Terminal,
  BarChart3,
  GraduationCap,
  Settings,
  Menu,
  X,
  Languages,
} from 'lucide-react';

export type NavigationTab =
  | 'home'
  | 'tutor'
  | 'learn'
  | 'solve'
  | 'graphs'
  | 'practice'
  | 'computational'
  | 'progress'
  | 'instructor'
  | 'settings';

interface NavbarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  amharicMode: boolean;
  onToggleAmharic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  amharicMode,
  onToggleAmharic,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: NavigationTab; label: string; amharic: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home Dashboard', amharic: 'ዋና ዳሽቦርድ', icon: <Home className="w-4 h-4" /> },
    { id: 'tutor', label: 'Ask AI Tutor', amharic: 'አይ አይ አስጠኚ', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn Physics', amharic: 'ፊዚክስ ተማር', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'solve', label: 'Guided Solver', amharic: 'የደረጃ መፍቻ', icon: <Calculator className="w-4 h-4" /> },
    { id: 'graphs', label: 'Simulations & Graphs', amharic: 'ግራፎች እና ሲሙሌሽን', icon: <LineChart className="w-4 h-4" /> },
    { id: 'practice', label: 'Quizzes & Practice', amharic: 'ልምምድ እና ፈተና', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'computational', label: 'Python Physics Lab', amharic: 'የፓይዘን ቤተ-ሙከራ', icon: <Terminal className="w-4 h-4" /> },
    { id: 'progress', label: 'My Progress', amharic: 'የትምህርት ሂደት', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'instructor', label: 'Instructor Portal', amharic: 'የመምህር ገጽ', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'settings', label: 'Reference & Help', amharic: 'መረጃ እና እገዛ', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Institutional Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-2 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-amber-400">Debre Tabor University</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300">Department of Physics</span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">General Physics I & Computational Physics</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-slate-400">
              Instructor: <strong className="text-slate-200">Dr. Yohannes Achenefe</strong>
            </span>
            <button
              onClick={onToggleAmharic}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                amharicMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle Amharic physics terminology translations"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{amharicMode ? 'አማርኛ ንቁ' : 'Amharic (አማርኛ)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Brand */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-amber-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg font-black tracking-tighter text-white">Φ</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-amber-400 transition-colors">
                AI Agent Physics Tutor
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">
              {amharicMode ? 'ብልህ የፊዚክስ አስጠኚ እና የመፍትሄ መድረክ' : 'Tool-Using Pedagogical Reasoning Agent'}
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {item.icon}
                <span>{amharicMode ? item.amharic : item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{amharicMode ? item.amharic : item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
