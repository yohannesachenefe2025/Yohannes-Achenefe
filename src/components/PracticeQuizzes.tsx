import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Info,
} from 'lucide-react';
import { PRACTICE_QUESTIONS, PracticeQuestion } from '../physics/practiceData';

interface PracticeQuizzesProps {
  onQuizCompleted: (score: number, total: number) => void;
}

export const PracticeQuizzes: React.FC<PracticeQuizzesProps> = ({ onQuizCompleted }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [numericalInput, setNumericalInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, { isCorrect: boolean; selected: any }>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredQuestions = PRACTICE_QUESTIONS.filter((q) => {
    if (selectedDifficulty === 'All') return true;
    return q.difficulty === selectedDifficulty;
  });

  const question = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  const handleSubmitAnswer = () => {
    if (isSubmitted || !question) return;

    let isCorrect = false;

    if (question.questionType === 'multiple_choice' || question.questionType === 'conceptual' || question.questionType === 'graph_interpretation') {
      if (selectedOption === null) return;
      isCorrect = selectedOption === question.correctOptionIndex;
    } else if (question.questionType === 'numerical') {
      const numVal = parseFloat(numericalInput);
      if (isNaN(numVal)) return;
      const target = question.correctNumericalAnswer ?? 0;
      const tol = question.numericalTolerance ?? 0.1;
      isCorrect = Math.abs(numVal - target) <= tol;
    }

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        isCorrect,
        selected: selectedOption !== null ? selectedOption : numericalInput,
      },
    }));

    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setNumericalInput('');
      setIsSubmitted(false);
      setShowHint(false);
    } else {
      // Finish quiz
      setQuizFinished(true);
      const correctCount = Object.values(userAnswers).filter((a) => a.isCorrect).length;
      onQuizCompleted(correctCount, filteredQuestions.length);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setNumericalInput('');
    setIsSubmitted(false);
    setShowHint(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const totalScore = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const scorePercentage = Math.round((totalScore / (filteredQuestions.length || 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Practice Questions & Assessment
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Verified university physics problems with misconception detection and instant feedback.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setSelectedDifficulty(diff);
                handleRestartQuiz();
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Acceptance Test H Honest Tracking Notice */}
      <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs flex items-start space-x-2.5 text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Honest Assessment & Storage Status (Acceptance Test H):</span>
          <p className="mt-0.5 text-slate-600 dark:text-slate-300">
            Scores in this prototype are calculated with mathematical precision and saved in your <strong>active browser session</strong>. To synchronize your records permanently across multiple devices, connect persistent storage (such as Firebase Firestore or PostgreSQL).
          </p>
        </div>
      </div>

      {/* Quiz Card */}
      {!quizFinished ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          {/* Progress meta */}
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Question {currentQuestionIndex + 1} of {filteredQuestions.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                {question.topicTitle}
              </span>
              <span className={`px-2 py-0.5 rounded font-medium ${
                question.difficulty === 'Beginner'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : question.difficulty === 'Intermediate'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {question.difficulty}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
            {question.question}
          </h2>

          {/* Multiple Choice Options */}
          {question.options && (
            <div className="space-y-2.5">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === question.correctOptionIndex;

                let optionStyle =
                  'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-900 dark:text-blue-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isSubmitted && setSelectedOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center justify-between transition-all ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Numerical Input Form */}
          {question.questionType === 'numerical' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Enter your calculated numerical answer ({question.unit}):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="any"
                  value={numericalInput}
                  onChange={(e) => setNumericalInput(e.target.value)}
                  disabled={isSubmitted}
                  placeholder={`e.g., ${question.correctNumericalAnswer}`}
                  className="w-48 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="font-semibold text-xs text-slate-600 dark:text-slate-400">
                  {question.unit}
                </span>
              </div>
            </div>
          )}

          {/* Misconception Diagnostic Alert if wrong option selected */}
          {isSubmitted &&
            selectedOption !== null &&
            question.misconceptionsMap &&
            question.misconceptionsMap[selectedOption] && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl text-xs space-y-1 text-amber-900 dark:text-amber-200">
                <div className="flex items-center space-x-1.5 font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Misconception Diagnostic:</span>
                </div>
                <p className="leading-relaxed pl-5">
                  {question.misconceptionsMap[selectedOption]}
                </p>
              </div>
            )}

          {/* Post-submission Solution and Explanation */}
          {isSubmitted && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Verified Solution & Derivation
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Calculation Procedure:
                </span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  {question.solutionSteps.map((step, sIdx) => (
                    <li key={sIdx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Hint Card */}
          {showHint && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs flex items-start space-x-2 text-indigo-900 dark:text-indigo-200">
              <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pedagogical Hint:</span> {question.hint}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center space-x-1"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Request Hint'}</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={
                  (question.questionType === 'numerical' && !numericalInput.trim()) ||
                  (question.options && selectedOption === null)
                }
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
              >
                <span>
                  {currentQuestionIndex < filteredQuestions.length - 1 ? 'Next Question' : 'View Quiz Summary'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Assessment Completed!
            </h2>
            <p className="text-sm text-slate-500">
              Debre Tabor University Physics Department • Problem Set Review
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl max-w-sm mx-auto border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {totalScore} / {filteredQuestions.length}
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Accuracy: {scorePercentage}%
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {scorePercentage >= 80
              ? 'Excellent mastery of undergraduate physical principles and numerical problem solving!'
              : scorePercentage >= 60
              ? 'Good conceptual foundation. Review the recommended revision topics in the Progress Dashboard.'
              : 'Keep practicing! Review the step-by-step worked examples in the Learning Library and retry.'}
          </p>

          <div className="pt-4 flex items-center justify-center space-x-3">
            <button
              onClick={handleRestartQuiz}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Practice Set</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
