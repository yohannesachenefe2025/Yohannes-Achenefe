import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  Cpu,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
} from 'lucide-react';
import { PhysicsGraphCard } from './PhysicsGraphCard';
import { PhysicsCalculationResult, PhysicsGraphData } from '../physics/tools';
import { MathFormula } from './MathFormula';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  toolExecuted?: PhysicsCalculationResult | null;
  graphData?: PhysicsGraphData | null;
  missingInfo?: string[];
  isHint?: boolean;
  error?: string;
  rated?: 'up' | 'down';
  reported?: boolean;
}

interface ChatTutorProps {
  onNavigateToTab?: (tab: string) => void;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({ onNavigateToTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: `Hello! I am your **AI Agent Physics Tutor** at **Debre Tabor University**, guided by the pedagogy of Dr. Yohannes Achenefe.\n\nI don't just generate text—I understand physical principles, validate physical assumptions and units, execute deterministic calculation tools, and render scientific graphs.\n\nHow can I help you today? You can ask a conceptual question, request a numerical solution, plot a graph, or ask for a hint!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Listen to cross-component question submissions
  useEffect(() => {
    const handleCustomPrompt = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt: string }>;
      if (customEvent.detail && customEvent.detail.prompt) {
        handleSendQuery(customEvent.detail.prompt);
      }
    };
    window.addEventListener('dtu-ask-tutor', handleCustomPrompt);
    return () => window.removeEventListener('dtu-ask-tutor', handleCustomPrompt);
  }, []);

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Build session history payload
      const historyPayload = messages.slice(-8).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.text || 'Calculation completed successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolExecuted: data.toolExecuted || null,
        graphData: data.graphData || null,
        missingInfo: data.missingInfo || undefined,
        isHint: data.isHint || false,
        error: data.error || undefined,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err: unknown) {
      const e = err as Error;
      const errorMessage: ChatMessage = {
        id: `agent-error-${Date.now()}`,
        sender: 'agent',
        text: `### Communication / Processing Error\n\nI was unable to complete this query: ${e.message}.\n\nPlease try again or check your question format.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: e.message,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'agent',
        text: `Conversation cleared. What physics concept or problem would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRate = (id: string, rating: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, rated: m.rated === rating ? undefined : rating } : m))
    );
  };

  const handleReport = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, reported: true } : m))
    );
  };

  // Preset Acceptance Criteria Test Prompts
  const acceptanceTestPrompts = [
    {
      id: 'test-a',
      tag: 'Test A',
      title: 'Conceptual Explanation',
      prompt: 'Explain Newton\'s second law in simple language.',
    },
    {
      id: 'test-b',
      tag: 'Test B',
      title: 'Numerical Calculation',
      prompt: 'A car changes velocity from 5 m/s to 25 m/s in 4 seconds. Calculate its acceleration.',
    },
    {
      id: 'test-c',
      tag: 'Test C',
      title: 'Graph Generation',
      prompt: 'Plot velocity against time for a car accelerating from 5 m/s to 25 m/s in 4 seconds.',
    },
    {
      id: 'test-d',
      tag: 'Test D',
      title: 'Missing Information Check',
      prompt: 'Calculate the acceleration.',
    },
    {
      id: 'test-e',
      tag: 'Test E',
      title: 'Zero Time Validation Error',
      prompt: 'A car changes velocity from 5 m/s to 25 m/s in 0 seconds. Calculate its acceleration.',
    },
    {
      id: 'test-f',
      tag: 'Test F',
      title: 'Pedagogical Hint',
      prompt: 'Give me a hint for solving a Newton\'s second law problem.',
    },
    {
      id: 'test-force',
      tag: 'Tool 4',
      title: 'Force Calculation',
      prompt: 'A 2 kg object accelerates at 3 m/s². Calculate the net force.',
    },
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Top Bar with Acceptance Criteria shortcuts */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Verified Acceptance Test Prompts:
            </span>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {acceptanceTestPrompts.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSendQuery(t.prompt)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-700 whitespace-nowrap transition-all font-medium flex items-center space-x-1"
                title={t.prompt}
              >
                <span className="font-bold text-amber-600 dark:text-amber-400">{t.tag}:</span>
                <span>{t.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div className="flex items-center space-x-2 text-xs text-slate-500 px-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {isUser ? 'You (Undergraduate Student)' : 'AI Physics Tutor (Debre Tabor University)'}
                </span>
                <span>•</span>
                <span>{message.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-3xl rounded-2xl p-4 sm:p-5 shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Text Body */}
                <div className="text-sm leading-relaxed space-y-3 prose dark:prose-invert max-w-none">
                  {message.text.split('\n\n').map((paragraph, pIdx) => {
                    // Check if paragraph is markdown header
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={pIdx} className="text-base font-bold text-blue-900 dark:text-blue-300 mt-2 mb-1">
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith('#### ')) {
                      return (
                        <h4 key={pIdx} className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2 mb-1">
                          {paragraph.replace('#### ', '')}
                        </h4>
                      );
                    }

                    // Check for math block $$...$$
                    if (paragraph.includes('$$')) {
                      const parts = paragraph.split('$$');
                      return (
                        <div key={pIdx} className="my-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-center overflow-x-auto">
                          {parts.map((part, partIdx) =>
                            partIdx % 2 === 1 ? (
                              <MathFormula key={partIdx} formula={part} displayMode={true} />
                            ) : (
                              <span key={partIdx} className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                                {part}
                              </span>
                            )
                          )}
                        </div>
                      );
                    }

                    return (
                      <p key={pIdx} className="text-slate-700 dark:text-slate-200">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Missing Info Prompt Callout */}
                {message.missingInfo && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs flex items-start space-x-2 text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Missing Variables Identified:</p>
                      <p className="mt-1">
                        The agent rejected guessing arbitrary values. Please supply: {message.missingInfo.join(', ')}.
                      </p>
                    </div>
                  </div>
                )}

                {/* Hint Card */}
                {message.isHint && (
                  <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs flex items-start space-x-2 text-indigo-900 dark:text-indigo-200">
                    <Lightbulb className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">Pedagogical Hint Mode:</p>
                      <p className="mt-1">
                        Guiding questions and systematic steps provided without automatically revealing the complete answer.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tool Execution Details Card */}
                {message.toolExecuted && (
                  <div className="mt-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {message.toolExecuted.toolName}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                        Validated Deterministic Tool
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-500">Formula:</span>
                        <code className="bg-slate-200 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono text-blue-700 dark:text-blue-300">
                          {message.toolExecuted.formula}
                        </code>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-500">Output:</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                          {message.toolExecuted.output.quantity} = {message.toolExecuted.output.formatted}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Embedded Scientific Graph */}
                {message.graphData && (
                  <div className="mt-4">
                    <PhysicsGraphCard graphData={message.graphData} />
                  </div>
                )}

                {/* Message Utility Actions */}
                {!isUser && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(message.id, message.text)}
                        className="flex items-center space-x-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRate(message.id, 'up')}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          message.rated === 'up' ? 'text-blue-600 font-bold' : ''
                        }`}
                        title="Helpful explanation"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRate(message.id, 'down')}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          message.rated === 'down' ? 'text-rose-600 font-bold' : ''
                        }`}
                        title="Unhelpful or unclear"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReport(message.id)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                          message.reported ? 'text-amber-500' : ''
                        }`}
                        title="Report incorrect answer or scientific discrepancy"
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {message.reported && (
                  <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded text-center">
                    Report submitted to Dr. Yohannes Achenefe's instructor review queue.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold animate-pulse">
              Φ
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Physics Agent reasoning, checking units & invoking tools...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="max-w-5xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title="Clear conversation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask a physics question (e.g., 'A car accelerates from 5 to 25 m/s in 4s. Calculate acceleration and plot v-t')..."
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
              <div className="absolute right-3 top-3 text-slate-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Powered by Tool-Using Pedagogical AI & Deterministic Calculation Engines</span>
            <span>SI Units Strictly Enforced</span>
          </div>
        </div>
      </div>
    </div>
  );
};
