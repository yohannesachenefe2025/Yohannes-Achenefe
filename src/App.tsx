import React, { useState, useEffect } from 'react';
import { Navbar, NavigationTab } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { ChatTutor } from './components/ChatTutor';
import { LearningLibrary } from './components/LearningLibrary';
import { GuidedSolver } from './components/GuidedSolver';
import { InteractiveGraphs } from './components/InteractiveGraphs';
import { PracticeQuizzes } from './components/PracticeQuizzes';
import { ComputationalLab } from './components/ComputationalLab';
import { ProgressDashboard } from './components/ProgressDashboard';
import { InstructorDashboard } from './components/InstructorDashboard';
import { SettingsAndHelp } from './components/SettingsAndHelp';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [amharicMode, setAmharicMode] = useState<boolean>(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dtu_physics_completed_topics');
      return saved ? JSON.parse(saved) : ['units-and-measurements', 'constant-acceleration-1d'];
    } catch {
      return ['units-and-measurements', 'constant-acceleration-1d'];
    }
  });

  const [quizHistory, setQuizHistory] = useState<
    Array<{ score: number; total: number; timestamp: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('dtu_physics_quiz_history');
      return saved
        ? JSON.parse(saved)
        : [
            { score: 4, total: 5, timestamp: '2026-10-24 09:30' },
            { score: 5, total: 5, timestamp: '2026-10-24 10:45' },
          ];
    } catch {
      return [{ score: 4, total: 5, timestamp: '2026-10-24 09:30' }];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dtu_physics_completed_topics', JSON.stringify(completedTopics));
    } catch {
      // Storage unavailable fallback
    }
  }, [completedTopics]);

  useEffect(() => {
    try {
      localStorage.setItem('dtu_physics_quiz_history', JSON.stringify(quizHistory));
    } catch {
      // Storage unavailable fallback
    }
  }, [quizHistory]);

  const handleToggleCompleteTopic = (topicId: string) => {
    setCompletedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleQuizCompleted = (score: number, total: number) => {
    const entry = {
      score,
      total,
      timestamp: new Date().toLocaleString(),
    };
    setQuizHistory((prev) => [entry, ...prev]);
  };

  const handleResetProgress = () => {
    setCompletedTopics([]);
    setQuizHistory([]);
    try {
      localStorage.removeItem('dtu_physics_completed_topics');
      localStorage.removeItem('dtu_physics_quiz_history');
    } catch {
      // fallback
    }
  };

  const handleAskTutorWithPrompt = (prompt: string) => {
    setCurrentTab('tutor');
    // Dispatch query to ChatTutor via custom event or URL param
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('dtu-ask-tutor', { detail: { prompt } }));
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        amharicMode={amharicMode}
        onToggleAmharic={() => setAmharicMode(!amharicMode)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeDashboard
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onAskTutorWithPrompt={handleAskTutorWithPrompt}
            completedTopicsCount={completedTopics.length}
          />
        )}

        {currentTab === 'tutor' && <ChatTutor onNavigateToTab={(t) => setCurrentTab(t as NavigationTab)} />}

        {currentTab === 'learn' && (
          <LearningLibrary
            amharicMode={amharicMode}
            completedTopics={completedTopics}
            onToggleCompleteTopic={handleToggleCompleteTopic}
          />
        )}

        {currentTab === 'solve' && <GuidedSolver />}

        {currentTab === 'graphs' && <InteractiveGraphs />}

        {currentTab === 'practice' && (
          <PracticeQuizzes onQuizCompleted={handleQuizCompleted} />
        )}

        {currentTab === 'computational' && <ComputationalLab />}

        {currentTab === 'progress' && (
          <ProgressDashboard
            completedTopics={completedTopics}
            quizHistory={quizHistory}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentTab === 'instructor' && <InstructorDashboard />}

        {currentTab === 'settings' && <SettingsAndHelp />}
      </main>

      {/* Institutional Academic Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-slate-200">
              Debre Tabor University • Department of Physics
            </p>
            <p className="text-[11px] text-slate-500">
              AI Agent Physics Tutor: An Intelligent, Interactive Physics Learning and Problem-Solving Platform
            </p>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1">
            <p>Instructional Lead: Dr. Yohannes Achenefe</p>
            <p className="text-slate-400">SI Units Standard • Deterministic Tool Execution • Open Educational Resources</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
