'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Send, Bot, Clock, Plus,
  Copy, Check, MessageSquare, Trash2,
  Volume2, VolumeX, User,
  Calculator, TrendingUp, Wallet,
  BanknoteIcon as Banknote, Target, Shield,
  Sun, Moon, Brain,
  Loader2, AlertTriangle,
  Search, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Zap, PieChart, CreditCard, ArrowUp, Edit3,
  Play, Pause, MoreHorizontal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast, Toaster } from 'react-hot-toast';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: string;
  modelIntelligence?: string;
  estimatedCost?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActive: Date;
  category?: 'budget' | 'investment' | 'savings' | 'debt' | 'retirement' | 'general';
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<string>;
  awsAvailable: boolean;
  currentModel?: string;
  modelIntelligence?: string;
  estimatedCost?: string;
  hasNova?: boolean;
  userData?: {
    monthlyIncome?: number;
    savingsGoal?: number;
    debtAmount?: number;
    riskTolerance?: 'low' | 'medium' | 'high';
  };
}

export default function AIChatModal({
  isOpen,
  onClose,
  onSendMessage,
  awsAvailable,
  currentModel = 'Claude 3',
  modelIntelligence = 'Advanced',
  estimatedCost = 'FREE',
  hasNova = false,
  userData
}: AIChatModalProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState(currentModel);
  const [aiIntelligence, setAiIntelligence] = useState(modelIntelligence);
  const [aiCost, setAiCost] = useState(estimatedCost);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile] = useState({
    name: 'User',
    plan: 'Premium',
    advisorLevel: 'Personal'
  });

  // New states for enhanced features
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionEditTitle, setSessionEditTitle] = useState('');
  const [showSessionMenu, setShowSessionMenu] = useState<string | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [speechProgress, setSpeechProgress] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sessionMenuRefs = useRef<Record<string, HTMLDivElement>>({});

  // Handle click outside session menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSessionMenu) {
        const menuElement = sessionMenuRefs.current[showSessionMenu];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setShowSessionMenu(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSessionMenu]);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (modalRef.current?.requestFullscreen) {
        modalRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update AI model info when props change
  useEffect(() => {
    setAiModel(currentModel);
    setAiIntelligence(modelIntelligence);
    setAiCost(estimatedCost);
  }, [currentModel, modelIntelligence, estimatedCost]);

  // Initialize chat sessions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('monietar_chat_sessions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const sessions = parsed.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
            lastActive: new Date(session.lastActive),
            messages: session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setChatSessions(sessions);
          setCurrentSessionId(sessions[0]?.id || '');
        } catch (e) {
          createDefaultSession();
        }
      } else {
        createDefaultSession();
      }
    }
  }, []);

  const createDefaultSession = () => {
    const defaultSession: ChatSession = {
      id: 'default_' + Date.now(),
      title: 'Cash Flow Analysis',
      messages: [{
        id: 'welcome',
        text: awsAvailable 
          ? `# Welcome to Monietar AI 💰\n\nI'm your personal financial analyst, specializing in cash flow management and financial optimization.\n\n## What I can help with:\n\n• **Cash Flow Analysis** - Track inflows/outflows, calculate burn rate\n• **Budget Optimization** - Smart budgeting & expense reduction\n• **Investment Planning** - ROI calculations & portfolio advice\n• **Debt Management** - Payoff strategies & interest optimization\n• **Savings Strategy** - Goal-based savings & compound growth\n\n**💡 Pro Tip:** Start by sharing your financial data for personalized insights.`
          : "**🔧 Setup Required**\n\nConnect to AI services to unlock financial analysis capabilities.",
        sender: 'ai',
        timestamp: new Date(),
        model: aiModel,
        modelIntelligence: aiIntelligence,
        estimatedCost: aiCost
      }],
      createdAt: new Date(),
      lastActive: new Date(),
      category: 'general'
    };
    setChatSessions([defaultSession]);
    setCurrentSessionId(defaultSession.id);
  };

  const currentSession = chatSessions.find(s => s.id === currentSessionId) || chatSessions[0];

  // Save sessions to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && chatSessions.length > 0) {
      localStorage.setItem('monietar_chat_sessions', JSON.stringify(chatSessions));
      localStorage.setItem('monietar_chat_theme', darkMode ? 'dark' : 'light');
    }
  }, [chatSessions, darkMode]);

  // Load theme preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('monietar_chat_theme');
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark');
      }
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSession?.messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && isSpeaking) {
      stopSpeech();
    }
  }, [isOpen, isSpeaking]);

  const createNewChat = () => {
    if (!awsAvailable) {
      toast.error('Please check your connection and try again.');
      return;
    }

    const newSessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Analysis',
      messages: [{
        id: 'welcome_' + Date.now(),
        text: `# New Financial Analysis Session 💼\n\nI'm ready to analyze your financial data. You can:\n\n• Share specific financial questions\n• Upload transaction data\n• Request cash flow projections\n• Get investment recommendations\n\n**Ask me anything about your finances!**`,
        sender: 'ai',
        timestamp: new Date(),
        model: aiModel,
        modelIntelligence: aiIntelligence,
        estimatedCost: aiCost
      }],
      createdAt: new Date(),
      lastActive: new Date(),
      category: 'general'
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setNewMessage('');
    setConnectionError(null);
    
    toast.success('New conversation created!');
    
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const switchChatSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setNewMessage('');
    setConnectionError(null);
    
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, lastActive: new Date() }
        : session
    ));
    
    if (window.innerWidth < 768) setShowSidebar(false);
    setShowSessionMenu(null);
  };

  const toggleSessionMenu = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSessionMenu(showSessionMenu === sessionId ? null : sessionId);
  };

  const startRenameSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setEditingSessionId(sessionId);
      setSessionEditTitle(session.title);
      setShowSessionMenu(null);
    }
  };

  const saveRenameSession = (sessionId: string) => {
    if (!sessionEditTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: sessionEditTitle }
        : session
    ));
    
    setEditingSessionId(null);
    toast.success('Conversation renamed!');
  };

  const cancelRenameSession = () => {
    setEditingSessionId(null);
    setSessionEditTitle('');
  };

  const deleteChatSession = (sessionId: string) => {
    if (chatSessions.length <= 1) {
      toast.error('Keep at least one chat for your financial history.');
      return;
    }

    if (window.confirm('Delete this conversation? This action cannot be undone.')) {
      const newSessions = chatSessions.filter(s => s.id !== sessionId);
      setChatSessions(newSessions);
      
      if (currentSessionId === sessionId) {
        const nextSession = newSessions[0];
        setCurrentSessionId(nextSession.id);
      }
      
      setShowSessionMenu(null);
      toast.success('Conversation deleted!');
    }
  };

  const duplicateSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (!session) return;

    const newSessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      ...session,
      id: newSessionId,
      title: `${session.title} (Copy)`,
      createdAt: new Date(),
      lastActive: new Date(),
      messages: session.messages.map(msg => ({
        ...msg,
        id: `${msg.id}_copy_${Date.now()}`
      }))
    };

    setChatSessions(prev => [newSession, ...prev]);
    setShowSessionMenu(null);
    toast.success('Conversation duplicated!');
  };

  const updateChatTitle = (sessionId: string, firstMessage: string) => {
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            title: firstMessage.length > 30 
              ? firstMessage.substring(0, 30) + '...' 
              : firstMessage,
            lastActive: new Date()
          }
        : session
    ));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || isLoading) return;
    
    if (!awsAvailable) {
      setConnectionError('Connection issue. Please check your internet.');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    if (currentSession?.messages.length === 1) {
      updateChatTitle(currentSessionId, newMessage);
    }

    setChatSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { 
            ...session, 
            messages: [...session.messages, userMessage],
            lastActive: new Date()
          }
        : session
    ));

    const currentMessage = newMessage;
    setNewMessage('');
    setIsLoading(true);
    setConnectionError(null);

    try {
      const aiResponse = await onSendMessage(currentMessage);
      
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        model: aiModel,
        modelIntelligence: aiIntelligence,
        estimatedCost: aiCost
      };

      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, aiMessage] }
          : session
      ));
      
      toast.success('Response received!');
      
    } catch (error: any) {
      console.error('Request failed:', error);
      toast.error('Temporary service issue. Please try again in a moment.');
      
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        text: `## Service Temporarily Unavailable ⚠️\n\nI apologize for the interruption. Please try your question again in a few moments.\n\n**Quick Tips:**\n• Check your internet connection\n• Refresh if needed\n• Your chat history is saved locally`,
        sender: 'ai',
        timestamp: new Date(),
        model: 'Monietar AI'
      };
      
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, errorMessage] }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (!awsAvailable) {
      toast.error('Please check your connection.');
      return;
    }
    setNewMessage(question);
    inputRef.current?.focus();
  };

  const copyMessage = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy text');
    }
  };

  const readText = (text: string, messageId: string) => {
    if ('speechSynthesis' in window) {
      // Stop any currently playing speech
      stopSpeech();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        setIsSpeaking(true);
        setCurrentlyPlayingId(messageId);
        setSpeechProgress(prev => ({ ...prev, [messageId]: 0 }));
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
        setSpeechProgress(prev => ({ ...prev, [messageId]: 100 }));
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        setCurrentlyPlayingId(null);
        toast.error('Text-to-speech failed');
      };
      
      // Track progress
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const progress = Math.min(100, Math.floor((event.charIndex / text.length) * 100));
          setSpeechProgress(prev => ({ ...prev, [messageId]: progress }));
        }
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      toast.success('Reading response...');
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentlyPlayingId(null);
      setSpeechProgress({});
    }
  };

  const togglePlayPause = (text: string, messageId: string) => {
    if (currentlyPlayingId === messageId) {
      stopSpeech();
    } else {
      readText(text, messageId);
    }
  };

  const toggleTextToSpeech = () => {
    setTextToSpeech(!textToSpeech);
    if (textToSpeech && isSpeaking) stopSpeech();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getIntelligenceColor = (intelligence: string) => {
    switch (intelligence) {
      case 'Expert':
      case 'Highest': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'Advanced':
      case 'High': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'Professional':
      case 'Medium': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800';
    }
  };

  const getIntelligenceIcon = (intelligence: string) => {
    switch (intelligence) {
      case 'Expert':
      case 'Highest': return <Zap className="w-3.5 h-3.5" />;
      case 'Advanced':
      case 'High': return <Brain className="w-3.5 h-3.5" />;
      default: return <Bot className="w-3.5 h-3.5" />;
    }
  };

  const financialTopics = [
    { icon: <Calculator className="w-4 h-4" />, text: "Cash Flow", desc: "Analyze inflows/outflows" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Investments", desc: "ROI & portfolio advice" },
    { icon: <Wallet className="w-4 h-4" />, text: "Budgeting", desc: "Expense optimization" },
    { icon: <Target className="w-4 h-4" />, text: "Savings", desc: "Goal-based planning" },
    { icon: <Shield className="w-4 h-4" />, text: "Risk Analysis", desc: "Financial protection" },
    { icon: <PieChart className="w-4 h-4" />, text: "Portfolio", desc: "Asset allocation" },
    { icon: <CreditCard className="w-4 h-4" />, text: "Debt", desc: "Payoff strategies" },
    { icon: <Banknote className="w-4 h-4" />, text: "Tax", desc: "Optimization tips" },
  ];

  const suggestedQuestions = [
    "Analyze my monthly cash flow",
    "How to reduce expenses by 20%",
    "Best investment for ₦500,000",
    "Create a debt payoff plan",
    "Calculate my emergency fund needs",
    "Should I rent or buy property?",
    "Retirement savings strategy",
    "Tax optimization for businesses"
  ];

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Custom markdown components for beautiful formatting
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold mb-3 mt-4 text-gray-900 dark:text-gray-100">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-base font-medium mb-2 mt-2 text-gray-700 dark:text-gray-300">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-4 space-y-1.5 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 space-y-1.5 ml-4 list-decimal">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start">
        <span className="mr-2 text-emerald-500 mt-1">•</span>
        <span className="text-gray-700 dark:text-gray-300">{children}</span>
      </li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-emerald-600 dark:text-emerald-400">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-600 dark:text-gray-400">
        {children}
      </em>
    ),
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto mb-4">
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      </pre>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        {children}
      </td>
    ),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" ref={modalRef}>
      <Toaster position="top-right" />
      
      {/* ChatGPT-like backdrop */}
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900/90' : 'bg-black/50'} backdrop-blur-sm`} onClick={onClose} />
      
      {/* Main Modal - Full Screen */}
      <div className={`absolute inset-0 flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${isFullscreen ? '' : 'md:inset-4 md:rounded-xl overflow-hidden'}`}>
        {/* Left Sidebar - ChatGPT style */}
        {showSidebar && (
          <div className={`w-64 md:w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-all duration-300`}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-700/50 dark:border-gray-200/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Brain className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-sm">Monietar AI</h1>
                    <p className="text-xs text-gray-500">Financial Analyst</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1.5 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded-md transition md:hidden"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              
              {/* New Chat Button */}
              <button 
                onClick={createNewChat}
                disabled={!awsAvailable}
                className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm ${
                  awsAvailable 
                    ? `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`
                    : 'bg-gray-300 cursor-not-allowed'
                } transition`}
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">New chat</span>
              </button>
              
              {/* Search */}
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                  } border focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`}
                />
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {filteredSessions.slice(0, 8).map((session) => (
                  <div key={session.id} className="relative">
                    {editingSessionId === session.id ? (
                      <div className="p-2 rounded-lg bg-gray-700/30 dark:bg-gray-200/20">
                        <input
                          type="text"
                          value={sessionEditTitle}
                          onChange={(e) => setSessionEditTitle(e.target.value)}
                          className={`w-full px-2 py-1.5 rounded text-sm ${
                            darkMode 
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-200 text-gray-900'
                          } border ${darkMode ? 'border-gray-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-emerald-500`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRenameSession(session.id);
                            if (e.key === 'Escape') cancelRenameSession();
                          }}
                          autoFocus
                        />
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => saveRenameSession(session.id)}
                            className="flex-1 px-2 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelRenameSession}
                            className="flex-1 px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => switchChatSession(session.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                          currentSessionId === session.id 
                            ? `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${darkMode ? 'text-white' : 'text-gray-900'}`
                            : `${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          <div className="text-left truncate">
                            <div className="text-sm font-medium truncate">{session.title}</div>
                            <div className="text-xs truncate">
                              {formatDate(session.lastActive)}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleSessionMenu(session.id, e)}
                          className="p-1 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded transition"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </button>
                    )}

                    {/* Session Menu */}
                    {showSessionMenu === session.id && (
                      <div
                        ref={el => {
                          if (el) sessionMenuRefs.current[session.id] = el;
                        }}
                        className={`absolute right-2 top-10 z-20 w-48 rounded-lg shadow-lg border ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="p-1">
                          <button
                            onClick={() => startRenameSession(session.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-700'
                            } transition`}
                          >
                            <Edit3 className="w-4 h-4" />
                            Rename
                          </button>
                          <button
                            onClick={() => duplicateSession(session.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${
                              darkMode 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-700'
                            } transition`}
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <div className="h-px my-1 bg-gray-700/50 dark:bg-gray-200/20" />
                          <button
                            onClick={() => deleteChatSession(session.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm ${
                              darkMode 
                                ? 'hover:bg-red-500/20 text-red-400' 
                                : 'hover:bg-red-50 text-red-600'
                            } transition`}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${awsAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className="text-xs">{awsAvailable ? 'Connected' : 'Offline'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-1.5 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded transition"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded transition"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Chat Area - ChatGPT Style */}
        <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-all duration-300`}>
          {/* Chat Header */}
          <div className={`sticky top-0 z-10 px-4 md:px-6 h-16 flex items-center justify-between border-b ${
            darkMode ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-gray-50/95'
          } backdrop-blur-sm`}>
            <div className="flex items-center gap-4">
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-800/50 dark:hover:bg-gray-200/20 rounded-lg transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <Brain className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h1 className="font-semibold text-sm">{currentSession?.title || 'Financial Analysis'}</h1>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getIntelligenceColor(aiIntelligence)}`}>
                      <span className="flex items-center gap-1">
                        {getIntelligenceIcon(aiIntelligence)}
                        {aiModel}
                      </span>
                    </span>
                    {awsAvailable && (
                      <span className="text-xs text-gray-500">• Online</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTextToSpeech}
                className={`p-2 rounded-lg transition ${
                  textToSpeech 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
                }`}
                title="Text-to-speech"
              >
                {textToSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200/20 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
              {connectionError && (
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-400">Connection Error</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{connectionError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {currentSession?.messages.map((message, index) => (
                <div key={message.id} className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'ai' && (
                    <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                      <Brain className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                  
                  <div className={`flex-1 ${message.sender === 'user' ? 'max-w-[80%]' : ''}`}>
                    <div className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? `${darkMode ? 'bg-emerald-600' : 'bg-emerald-500'} text-white rounded-tr-none`
                        : `${darkMode ? 'bg-gray-800' : 'bg-white'} ${darkMode ? 'text-gray-200' : 'text-gray-800'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-tl-none`
                    }`}>
                      <div className={`flex items-center justify-between mb-2 ${message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'}`}>
                        <span className="text-sm font-medium">
                          {message.sender === 'ai' ? 'Monietar AI' : 'You'}
                        </span>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                      </div>
                      
                      {/* Beautiful Markdown Content */}
                      <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''} prose-sm`}>
                        <ReactMarkdown components={markdownComponents}>
                          {message.text}
                        </ReactMarkdown>
                      </div>
                      
                      {/* Message Actions */}
                      {message.sender === 'ai' && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30 dark:border-gray-200/20">
                          <div className="flex items-center gap-2">
                            {/* Play/Pause Button */}
                            <button
                              onClick={() => togglePlayPause(message.text, message.id)}
                              className={`p-1.5 rounded transition ${
                                currentlyPlayingId === message.id
                                  ? 'bg-emerald-500 text-white'
                                  : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                              }`}
                              title={currentlyPlayingId === message.id ? 'Stop reading' : 'Read aloud'}
                            >
                              {currentlyPlayingId === message.id ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => copyMessage(message.text, message.id)}
                              className={`p-1.5 rounded transition ${
                                copiedMessageId === message.id
                                  ? 'bg-emerald-500 text-white'
                                  : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                              }`}
                              title="Copy to clipboard"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Speech Progress Bar (only when playing) */}
                            {currentlyPlayingId === message.id && speechProgress[message.id] !== undefined && (
                              <div className="w-32 h-1.5 bg-gray-700/30 dark:bg-gray-200/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 transition-all duration-300"
                                  style={{ width: `${speechProgress[message.id]}%` }}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            {message.model && (
                              <span className="px-2 py-0.5 bg-gray-700/30 dark:bg-gray-200/20 rounded">
                                {message.model}
                              </span>
                            )}
                            {message.estimatedCost}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4">
                  <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                    <Brain className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-tl-none`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Monietar AI</span>
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />
                      </div>
                      <div className="space-y-2 mt-3">
                        <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} style={{ width: '80%' }} />
                        <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} style={{ width: '60%' }} />
                        <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Welcome Screen */}
              {currentSession?.messages.length === 1 && !connectionError && (
                <div className="text-center py-12 px-4">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-500/10 mb-6">
                    <Brain className="w-12 h-12 text-emerald-500" />
                  </div>
                  <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                    Monietar Financial AI
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Your personal financial analyst for cash flow management, investment planning, and wealth optimization.
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                    {financialTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(topic.text)}
                        className={`group p-3 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-700 group-hover:border-emerald-500/50' : 'border-gray-200 group-hover:border-emerald-300'} transition-all`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} group-hover:bg-emerald-500/10 transition`}>
                            {topic.icon}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{topic.text}</div>
                            <div className="text-xs text-gray-500">{topic.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Suggested Questions */}
                  <div className="max-w-2xl mx-auto">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                      Try asking...
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(question)}
                          className={`text-left p-3 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition text-sm`}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-px" />
            </div>
          </div>

          {/* Input Area - ChatGPT Style */}
          <div className={`sticky bottom-0 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className={`rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} shadow-lg`}>
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={awsAvailable ? "Message Monietar AI..." : "Connecting to AI services..."}
                  className={`w-full px-4 py-3 bg-transparent outline-none resize-none ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'} min-h-[60px] max-h-[200px]`}
                  rows={1}
                  disabled={isLoading || !awsAvailable}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                  }}
                />
                
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700/50 dark:border-gray-200/20">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleTextToSpeech}
                      className={`p-1.5 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
                      title="Text-to-speech"
                    >
                      {textToSpeech ? (
                        <Volume2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <VolumeX className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <div className="text-xs text-gray-500">
                      {awsAvailable ? 'Press Enter to send' : 'Disconnected'}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || isLoading || !awsAvailable}
                    className={`p-2 rounded-lg transition ${newMessage.trim() && !isLoading && awsAvailable
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-center text-gray-500 mt-3">
                Monietar AI can make mistakes. Consider verifying important financial information.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}