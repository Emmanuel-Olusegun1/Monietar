'use client'

import { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Plus,
  Copy, Check, MessageSquare, Trash2,
  Volume2, VolumeX, User,
  Calculator, TrendingUp, Wallet,
  BanknoteIcon as Banknote, Target, Shield,
  Sun, Moon, Brain,
  Loader2, AlertTriangle,
  Search, ChevronLeft, ChevronRight,
  Maximize2, Minimize2, Zap, PieChart, CreditCard, Edit3,
  Play, Pause, MoreHorizontal,
  Mic, MicOff, Paperclip, FileText, Image as ImageIcon,
  ChevronDown,
  Sparkles,
  Globe, Cpu,
  BrainCircuit,
  BarChart3,
  PieChart as PieChartIcon,
  Download as DownloadIcon,
  Key,
  Menu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast, Toaster } from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';

// Define interface for uploaded files
interface UploadedFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'document' | 'spreadsheet' | 'text';
  size: string;
  preview?: string;
  uploadedAt: Date;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model?: string;
  provider?: string;
  estimatedCost?: string;
  tokensUsed?: number;
  attachments?: UploadedFile[];
  reasoningTokens?: number;
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
  openRouterAvailable: boolean;
  currentModel?: string;
  estimatedCost?: string;
  usageStats?: {
    dailyRequests: number;
    dailyLimit: number;
    monthlyTokens: number;
    monthlyLimit: number;
    responseTime: number;
  };
  // New props for dashboard data
  financialData?: {
    income: number;
    expenses: number;
    profit: number;
    transactions: any[];
    budgets: any[];
    aiRecommendations: string[];
  };
  userData?: {
    name: string;
    businessName: string;
    currency: string;
  };
  formatCurrency?: (amount: number) => string;
}

// OpenRouter models
const FREE_MODELS = [
  { id: 'amazon/nova-2-lite-v1:free', name: 'Amazon Nova Lite', description: 'Fast & free', icon: <Zap className="w-3 h-3" />, speed: 'fast', intelligence: 'medium' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', description: 'Google AI', icon: <Brain className="w-3 h-3" />, speed: 'very-fast', intelligence: 'high' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B', description: 'Open source', icon: <Globe className="w-3 h-3" />, speed: 'fast', intelligence: 'medium' },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2', description: 'Meta AI', icon: <Cpu className="w-3 h-3" />, speed: 'medium', intelligence: 'good' },
];

const PAID_MODELS = [
  { id: 'anthropic/claude-3.5-sonnet:beta', name: 'Claude 3.5 Sonnet', description: 'Most intelligent', icon: <Sparkles className="w-3 h-3" />, speed: 'medium', intelligence: 'excellent' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'OpenAI latest', icon: <BrainCircuit className="w-3 h-3" />, speed: 'fast', intelligence: 'excellent' },
  { id: 'google/gemini-2.0-pro-exp-02-05:free', name: 'Gemini 2.0 Pro', description: 'Professional', icon: <BarChart3 className="w-3 h-3" />, speed: 'medium', intelligence: 'high' },
];

// Function to generate financial context from dashboard data
const generateFinancialContext = (
  financialData?: {
    income: number;
    expenses: number;
    profit: number;
    transactions: any[];
    budgets: any[];
    aiRecommendations: string[];
  },
  userData?: {
    name: string;
    businessName: string;
    currency: string;
  },
  formatCurrency?: (amount: number) => string
): string => {
  if (!financialData) {
    return "NO FINANCIAL DATA";
  }
  
  try {
    const { income = 0, expenses = 0, profit = 0, transactions = [], budgets = [], aiRecommendations = [] } = financialData;
    
    // Format currency
    const formatCurrencyFunc = (amount: number) => {
      if (formatCurrency && typeof formatCurrency === 'function') {
        return formatCurrency(amount);
      }
      // Fallback formatting
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: userData?.currency || 'NGN',
        minimumFractionDigits: 0
      }).format(amount);
    };
    
    let context = `FINANCIAL DATA FOR ANALYSIS:\n\n`;
    context += `USER PROFILE:\n`;
    context += `• Name: ${userData?.name || 'User'}\n`;
    context += `• Business: ${userData?.businessName || 'Not specified'}\n`;
    context += `• Currency: ${userData?.currency || 'NGN'}\n\n`;
    
    context += `FINANCIAL OVERVIEW:\n`;
    context += `• Total Income: ${formatCurrencyFunc(income)}\n`;
    context += `• Total Expenses: ${formatCurrencyFunc(expenses)}\n`;
    context += `• Net ${profit >= 0 ? 'Profit' : 'Loss'}: ${formatCurrencyFunc(Math.abs(profit))}\n`;
    context += `• Profit Margin: ${income > 0 ? ((profit / income) * 100).toFixed(1) : 0}%\n`;
    context += `• Transaction Count: ${transactions?.length || 0}\n\n`;
    
    if (budgets && budgets.length > 0) {
      context += `BUDGETS:\n`;
      budgets.forEach((budget: any, index: number) => {
        const spent = budget.spent || 0;
        const limit = budget.limit || 0;
        const percentage = limit > 0 ? ((spent / limit) * 100).toFixed(1) : '0';
        const status = spent > limit ? '❌ Over' : spent > (limit * 0.8) ? '⚠️ Close' : '✅ Good';
        context += `• ${budget.name || `Budget ${index + 1}`}: ${status} (${percentage}% used)\n`;
      });
      context += `\n`;
    }
    
    if (transactions && transactions.length > 0) {
      // Get top categories
      const categoryTotals: Record<string, number> = {};
      transactions.forEach((transaction: any) => {
        const category = transaction.category || 'Uncategorized';
        const amount = Math.abs(transaction.amount || 0);
        if (amount > 0) {
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });
      
      const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      if (topCategories.length > 0) {
        context += `TOP EXPENSE CATEGORIES:\n`;
        topCategories.forEach(([category, amount]) => {
          const percentage = expenses > 0 ? ((amount / expenses) * 100).toFixed(1) : '0';
          context += `• ${category}: ${formatCurrencyFunc(amount)} (${percentage}%)\n`;
        });
        context += `\n`;
      }
      
      // Recent transactions
      const recentTransactions = transactions.slice(-5).reverse();
      if (recentTransactions.length > 0) {
        context += `RECENT TRANSACTIONS:\n`;
        recentTransactions.forEach((transaction: any) => {
          const amount = transaction.amount || 0;
          const type = amount >= 0 ? 'Income' : 'Expense';
          const date = transaction.date ? new Date(transaction.date).toLocaleDateString() : 'Recent';
          context += `• ${date}: ${transaction.description || 'Transaction'} - ${formatCurrencyFunc(Math.abs(amount))} (${type})\n`;
        });
        context += `\n`;
      }
    }
    
    if (aiRecommendations && aiRecommendations.length > 0) {
      context += `PREVIOUS AI RECOMMENDATIONS:\n`;
      aiRecommendations.slice(0, 3).forEach((rec: string, index: number) => {
        context += `• ${rec}\n`;
      });
      context += `\n`;
    }
    
    context += `FINANCIAL HEALTH INDICATORS:\n`;
    context += `• Savings Rate: ${income > 0 ? ((profit > 0 ? profit : 0) / income * 100).toFixed(1) : 0}%\n`;
    context += `• Expense-to-Income Ratio: ${income > 0 ? ((expenses / income) * 100).toFixed(1) : 0}%\n`;
    context += `• Transaction Frequency: ~${transactions?.length > 0 ? Math.ceil(transactions.length / 30) : 0} per day\n`;
    
    return context;
    
  } catch (error) {
    console.error('Error generating financial context:', error);
    return "NO FINANCIAL DATA - Error generating context";
  }
};

// Add OpenRouter API function
async function queryOpenRouterAPI(
  message: string, 
  financialContext: string,
  files?: File[], 
  model: string = FREE_MODELS[0].id,
  style: 'simple' | 'balanced' | 'professional' = 'balanced'
): Promise<{ 
  response: string; 
  model: string;
  provider: string;
  tokensUsed: number;
  reasoningTokens?: number;
  costEstimate: string;
  responseTime: number;
  isFreeTier: boolean;
}> {
  try {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('context', financialContext);
    formData.append('model', model);
    formData.append('style', style);
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    const startTime = Date.now();
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    const responseTime = Date.now() - startTime;
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to get response');
    }
    
    return {
      response: data.response,
      model: data.model || model,
      provider: data.provider || 'OpenRouter',
      tokensUsed: data.tokensUsed || 0,
      reasoningTokens: data.costEstimate?.reasoningTokens,
      costEstimate: data.costEstimate?.estimatedCost || '0.000000',
      responseTime,
      isFreeTier: data.costEstimate?.isFreeTier || true
    };
    
  } catch (error: any) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

// Mobile detection utilities
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export default function AIChatModal({
  isOpen,
  onClose,
  openRouterAvailable,
  currentModel = FREE_MODELS[0].id,
  estimatedCost = '0.000000',
  usageStats = {
    dailyRequests: 0,
    dailyLimit: 50,
    monthlyTokens: 0,
    monthlyLimit: 1000000,
    responseTime: 0
  },
  financialData,
  userData,
  formatCurrency
}: AIChatModalProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(!isMobileDevice());
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [aiModel, setAiModel] = useState<string>(currentModel);
  const [aiCost, setAiCost] = useState(estimatedCost);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [responseStyle, setResponseStyle] = useState<'simple' | 'balanced' | 'professional'>('balanced');
  const [showModelSelector, setShowModelSelector] = useState(false);
  
  // Mobile-specific states
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [inputHeight, setInputHeight] = useState('auto');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // OpenRouter specific states
  const [openRouterUsage, setOpenRouterUsage] = useState(usageStats);
  const [modelPerformance, setModelPerformance] = useState<Record<string, { avgResponseTime: number; successRate: number }>>({});

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // File Upload States
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Export States
  const [exportFormat, setExportFormat] = useState<'pdf' | 'txt' | 'json'>('pdf');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // New states for enhanced features
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionEditTitle, setSessionEditTitle] = useState('');
  const [showSessionMenu, setShowSessionMenu] = useState<string | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [speechProgress, setSpeechProgress] = useState<Record<string, number>>({});
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [showDashboardInsights, setShowDashboardInsights] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const sessionMenuRefs = useRef<Record<string, HTMLDivElement>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const modelSelectorRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowSidebar(!mobile);
      setShowMobileMenu(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard visibility detection for mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleFocus = () => setIsKeyboardVisible(true);
    const handleBlur = () => setIsKeyboardVisible(false);

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, [isMobile, inputRef.current]);

  // Touch swipe for mobile - FIXED TYPE HANDLING
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };

      const dx = touchEnd.x - touchStart.x;
      const dy = touchEnd.y - touchStart.y;

      // Horizontal swipe (left/right)
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx > 0) {
          // Swipe right - show sidebar
          setShowSidebar(true);
        } else {
          // Swipe left - hide sidebar
          setShowSidebar(false);
        }
      }

      // Vertical swipe down from top to close
      if (touchStart.y < 50 && dy > 100) {
        onClose();
      }

      setTouchStart(null);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, touchStart, onClose]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          toast.success('Listening... Speak now!');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map(result => result.transcript)
            .join('');
          setTranscript(transcript);
          setNewMessage(prev => prev + ' ' + transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          toast.error('Voice input failed. Please try again.');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setSpeechRecognition(recognition);
        setVoiceSupported(true);
      } else {
        setVoiceSupported(false);
        console.warn('Speech Recognition not supported');
      }
    }
  }, []);

  // Update OpenRouter usage stats
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/usage');
        const data = await response.json();
        setOpenRouterUsage(data);
      } catch (error) {
        console.error('Failed to fetch usage stats');
      }
    };
    
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside for mobile - FIXED TYPE HANDLING
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (showSessionMenu) {
        const menuElement = sessionMenuRefs.current[showSessionMenu];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setShowSessionMenu(null);
        }
      }
      if (showExportMenu && exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
      if (showModelSelector && modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as EventListener);
    document.addEventListener('touchstart', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, [showSessionMenu, showExportMenu, showModelSelector]);

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
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
        setShowMobileMenu(false);
      } else {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update AI model info when props change
  useEffect(() => {
    setAiModel(currentModel);
    setAiCost(estimatedCost);
  }, [currentModel, estimatedCost]);

  // Initialize chat sessions
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
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
          if (sessions.length > 0) {
            setCurrentSessionId(sessions[0].id);
          } else {
            createDefaultSession();
          }
        } catch (e) {
          console.error('Error parsing saved sessions:', e);
          createDefaultSession();
        }
      } else {
        createDefaultSession();
      }
    }
  }, [isOpen]);

  const createDefaultSession = () => {
    const currentModelInfo = [...FREE_MODELS, ...PAID_MODELS].find(m => m.id === aiModel) || FREE_MODELS[0];
    const financialContext = generateFinancialContext(financialData, userData, formatCurrency);
    const hasData = financialData && (financialData.transactions?.length > 0 || financialData.budgets?.length > 0);
    
    const newSessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'Financial Analysis',
      messages: [{
        id: 'welcome',
        text: openRouterAvailable 
          ? `# 🎯 Monietar AI - Your Personal Financial Analyst\n\nI'm your financial assistant powered by **${currentModelInfo.name}** via OpenRouter.\n\n${hasData ? '## 📊 Your Financial Overview:\n' + financialContext.split('\n').slice(0, 10).join('\n') + '\n\n...' : '## 📈 Get Started:\nAdd transactions and budgets to get personalized insights!'}\n\n### 💡 What I Can Help With:\n• Analyzing your spending patterns\n• Budget optimization strategies\n• Investment recommendations\n• Debt management advice\n• Savings goal planning\n\n### ⚙️ Current Settings:\n• **Model:** ${currentModelInfo.name}\n• **Style:** ${responseStyle}\n• **Status:** Ready\n\n**Ask me anything about your finances!**`
          : `## 🔧 Setup Required\n\n### Get Started with OpenRouter:\n1. Visit **https://openrouter.ai**\n2. Sign up for free account\n3. Get your API key\n4. Add to your environment\n\n**Current Mode:** Using built-in financial knowledge`,
        sender: 'ai',
        timestamp: new Date(),
        model: currentModelInfo.name,
        provider: 'OpenRouter',
        estimatedCost: '0.000000',
        tokensUsed: 0
      }],
      createdAt: new Date(),
      lastActive: new Date(),
      category: 'general'
    };
    
    setChatSessions([newSession]);
    setCurrentSessionId(newSessionId);
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

  // Auto-scroll to bottom with mobile optimization
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: 'smooth',
        block: 'end',
      };
      
      // On mobile with keyboard visible, scroll more
      if (isMobile && isKeyboardVisible) {
        scrollOptions.block = 'start';
      }
      
      messagesEndRef.current.scrollIntoView(scrollOptions);
    }
  }, [currentSession?.messages, isOpen, streamedResponse, isMobile, isKeyboardVisible]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isMobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMobile]);

  // Stop speech when modal closes
  useEffect(() => {
    if (!isOpen && isSpeaking) {
      stopSpeech();
    }
  }, [isOpen, isSpeaking]);

  // Voice Input Functions
  const toggleVoiceInput = () => {
    if (!voiceSupported) {
      toast.error('Voice input not supported in your browser');
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
      toast('Voice input stopped', { icon: '🎤' });
    } else {
      setTranscript('');
      try {
        speechRecognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast.error('Failed to start voice input');
      }
    }
  };

  // File Upload Functions with mobile optimization
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB for mobile
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
        'application/pdf',
        'text/plain', 'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds ${isMobile ? '5MB' : '10MB'} limit`);
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} file type not supported`);
        return false;
      }

      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} file(s) selected`);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4" />;
    if (file.type === 'application/pdf') return <FileText className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Export Functions
  const handlePrint = useReactToPrint({
    contentRef: chatContainerRef,
    documentTitle: `Monietar-Chat-${currentSession?.title || 'Export'}`,
    onAfterPrint: () => toast.success('Exported successfully!')
  });

  const exportToTxt = () => {
    if (!currentSession) return;
    
    const content = currentSession.messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'Monietar AI'} (${msg.timestamp.toLocaleString()}):\n${msg.text}\n\n`
    ).join('---\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monietar-chat-${currentSession?.title || 'export'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Exported as TXT!');
  };

  const exportToJson = () => {
    if (!currentSession) return;
    
    const data = {
      session: currentSession,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monietar-chat-${currentSession?.title || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Exported as JSON!');
  };

  const handleExport = () => {
    setShowExportMenu(false);
    
    switch (exportFormat) {
      case 'pdf':
        handlePrint();
        break;
      case 'txt':
        exportToTxt();
        break;
      case 'json':
        exportToJson();
        break;
    }
  };

  const createNewChat = () => {
    if (!openRouterAvailable) {
      toast.error('Please configure OpenRouter API key to start chatting.');
      return;
    }

    const currentModelInfo = [...FREE_MODELS, ...PAID_MODELS].find(m => m.id === aiModel) || FREE_MODELS[0];
    const newSessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Analysis',
      messages: [{
        id: 'welcome_' + Date.now(),
        text: `# 💼 New Financial Analysis Session\n\nI'm ready to analyze your financial data using **${currentModelInfo.name}** via OpenRouter.\n\n## 📊 Your Current Data:\n${generateFinancialContext(financialData, userData, formatCurrency).split('\n').slice(0, 8).join('\n')}\n\n## 🎯 What would you like to focus on today?`,
        sender: 'ai',
        timestamp: new Date(),
        model: currentModelInfo.name,
        provider: 'OpenRouter',
        estimatedCost: '0.000000',
        tokensUsed: 0
      }],
      createdAt: new Date(),
      lastActive: new Date(),
      category: 'general'
    };

    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setNewMessage('');
    setUploadedFiles([]);
    setConnectionError(null);
    
    toast.success('New conversation created!');
    
    if (isMobile) {
      setShowSidebar(false);
      setShowMobileMenu(false);
    }
  };

  const switchChatSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setNewMessage('');
    setUploadedFiles([]);
    setConnectionError(null);
    setStreamedResponse('');
    
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, lastActive: new Date() }
        : session
    ));
    
    if (isMobile) {
      setShowSidebar(false);
      setShowMobileMenu(false);
    }
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
    if ((!newMessage.trim() && uploadedFiles.length === 0) || isLoading) return;
    
    if (!openRouterAvailable) {
      toast.error('Please configure OpenRouter API key in settings.');
      setConnectionError('OpenRouter API key not configured');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      attachments: uploadedFiles.map((file, index) => ({
        id: `file_${Date.now()}_${index}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type === 'application/pdf' ? 'pdf' :
              file.type.includes('spreadsheet') ? 'spreadsheet' :
              file.type === 'text/plain' ? 'text' : 'document',
        size: formatFileSize(file.size),
        uploadedAt: new Date()
      }))
    };

    if (currentSession?.messages.length === 1 && newMessage.trim()) {
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
    const currentFiles = [...uploadedFiles];
    const financialContext = generateFinancialContext(financialData, userData, formatCurrency);
    
    setNewMessage('');
    setUploadedFiles([]);
    setIsLoading(true);
    setStreamedResponse('');
    setConnectionError(null);

    try {
      const openRouterResponse = await queryOpenRouterAPI(
        currentMessage, 
        financialContext,
        currentFiles, 
        aiModel,
        responseStyle
      );
      
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        text: openRouterResponse.response,
        sender: 'ai',
        timestamp: new Date(),
        model: openRouterResponse.model,
        provider: openRouterResponse.provider,
        estimatedCost: `$${openRouterResponse.costEstimate}`,
        tokensUsed: openRouterResponse.tokensUsed,
        reasoningTokens: openRouterResponse.reasoningTokens
      };

      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, aiMessage] }
          : session
      ));
      
      // Update model performance
      setModelPerformance(prev => ({
        ...prev,
        [aiModel]: {
          avgResponseTime: openRouterResponse.responseTime,
          successRate: 100
        }
      }));
      
      toast.success('Response received!');
      
    } catch (error: any) {
      console.error('OpenRouter request failed:', error);
      
      let errorMessage = '';
      if (error.message?.includes('quota') || error.message?.includes('429')) {
        errorMessage = `## ⚠️ Free Tier Limit Reached\n\n### Usage Status:\n📊 **Requests:** ${openRouterUsage.dailyRequests}/${openRouterUsage.dailyLimit} daily\n💾 **Tokens:** ${(openRouterUsage.monthlyTokens/1000).toFixed(0)}K/${(openRouterUsage.monthlyLimit/1000).toFixed(0)}K monthly\n\n### Options:\n1. **Wait** for daily reset\n2. **Upgrade** for more capacity\n3. **Use shorter messages**\n\n**💡 Tip:** Free tier resets daily at midnight UTC`;
        toast.error('Free tier limit reached for today');
      } else if (error.message?.includes('API key')) {
        errorMessage = `## 🔑 OpenRouter API Key Required\n\n### Setup Steps:\n1. Visit **https://openrouter.ai**\n2. Sign up for free account\nn3. Get your API key\n4. Add to environment:\n\n\`\`\`env\nOPENROUTER_API_KEY=your_key_here\n\`\`\`\n\n**Current Mode:** Using built-in financial knowledge`;
        toast.error('OpenRouter API key not configured');
      } else {
        errorMessage = `## ⚠️ Service Temporary Unavailable\n\n### Details:\n**Error:** ${error.message || 'Unknown error'}\n\n### What to do:\n1. Try again in a few moments\n2. Check your internet connection\n3. Use simpler questions\n\n**⚠️ Using built-in financial guidance**`;
        toast.error('Temporary service issue');
      }
      
      const errorAiMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        model: 'Built-in'
      };
      
      setChatSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, errorAiMessage] }
          : session
      ));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (!openRouterAvailable) {
      toast.error('Please configure OpenRouter API key.');
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

  const getCurrentModelInfo = () => {
    return [...FREE_MODELS, ...PAID_MODELS].find(m => m.id === aiModel) || FREE_MODELS[0];
  };

  const getModelColor = (modelId: string) => {
    if (modelId.includes('claude')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    if (modelId.includes('gpt')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (modelId.includes('gemini')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (modelId.includes('llama')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const financialTopics = [
    { icon: <Calculator className="w-4 h-4" />, text: "Analyze spending", desc: "Review expense patterns" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Investment advice", desc: "Grow your money" },
    { icon: <Wallet className="w-4 h-4" />, text: "Budget optimization", desc: "Improve cash flow" },
    { icon: <Target className="w-4 h-4" />, text: "Savings goals", desc: "Plan for the future" },
    { icon: <Shield className="w-4 h-4" />, text: "Risk assessment", desc: "Financial protection" },
    { icon: <PieChartIcon className="w-4 h-4" />, text: "Portfolio review", desc: "Asset allocation" },
    { icon: <CreditCard className="w-4 h-4" />, text: "Debt strategy", desc: "Payoff planning" },
    { icon: <Banknote className="w-4 h-4" />, text: "Tax tips", desc: "Optimize taxes" },
  ];

  const suggestedQuestions = [
    "How can I reduce my expenses?",
    "What's the best way to save for emergencies?",
    "Should I pay off debt or invest first?",
    "How can I optimize my budget?",
    "What investments are good for beginners?",
    "How much should I save for retirement?",
    "How can I improve my cash flow?",
    "What are the best ways to grow my money?"
  ];

  const filteredSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Custom markdown components with mobile optimization
  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-lg md:text-xl font-bold mb-3 mt-4 text-gray-900 dark:text-gray-100">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-base md:text-lg font-semibold mb-2 mt-3 text-gray-800 dark:text-gray-200">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm md:text-base font-medium mb-2 mt-2 text-gray-700 dark:text-gray-300">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
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
        <span className="mr-2 text-gray-800 dark:text-gray-300 mt-1">•</span>
        <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{children}</span>
      </li>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-600 dark:text-gray-400">
        {children}
      </em>
    ),
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs md:text-sm font-mono text-gray-800 dark:text-gray-200">
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="p-2 md:p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto mb-4 text-xs md:text-sm">
        <code className="font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      </pre>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 md:pl-4 italic text-gray-600 dark:text-gray-400 my-4 text-sm md:text-base">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4 -mx-2 md:mx-0">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="px-2 md:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-2 md:px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs md:text-sm text-gray-600 dark:text-gray-400">
        {children}
      </td>
    ),
    a: ({ children, href }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 underline underline-offset-2 break-words"
      >
        {children}
      </a>
    ),
  };

  // Handle textarea input for mobile
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    const newHeight = Math.min(target.scrollHeight, isMobile ? 100 : 200);
    target.style.height = `${newHeight}px`;
    setInputHeight(`${newHeight}px`);
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx global>{`
        /* Mobile-optimized styles */
        @media (max-width: 768px) {
          .chat-modal {
            font-size: 14px;
          }
          
          .message-text {
            font-size: 15px;
            line-height: 1.5;
          }
          
          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 40;
            animation: fadeIn 0.2s ease;
          }
          
          .sidebar-slide {
            animation: slideIn 0.3s ease-out;
          }
          
          .touch-button {
            min-height: 44px;
            min-width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .mobile-scrollbar-hide {
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          
          .mobile-scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          /* Typing indicator */
          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 3px;
          }
          
          .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #9ca3af;
            animation: typing 1.4s infinite ease-in-out both;
          }
          
          .typing-dot:nth-child(1) { animation-delay: -0.32s; }
          .typing-dot:nth-child(2) { animation-delay: -0.16s; }
          
          @keyframes typing {
            0%, 80%, 100% { 
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          /* Message entrance animation */
          .message-enter {
            animation: messageEnter 0.3s ease-out;
          }
          
          @keyframes messageEnter {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
        
        /* Prevent body scroll when modal is open */
        body.modal-open {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
      
      {/* Add modal-open class to body - SINGLE global style tag
      {isOpen && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )} */}
      
      <div className="fixed inset-0 z-[9999] overflow-hidden" ref={modalRef}>
        <Toaster 
          position={isMobile ? "top-center" : "top-right"}
          toastOptions={{
            style: {
              background: darkMode ? '#1f2937' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#111827',
              border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              maxWidth: isMobile ? '90vw' : '400px',
              margin: isMobile ? '0 auto' : undefined,
            },
            duration: 3000,
          }}
        />
        
        {/* Clean backdrop with touch-friendly close */}
        <div 
          className={`absolute inset-0 ${darkMode ? 'bg-gray-900/95' : 'bg-black/60'}`} 
          onClick={isMobile ? undefined : onClose}
        />
        
        {/* Main Modal - Mobile Optimized */}
        <div className={`absolute inset-0 flex ${darkMode ? 'bg-gray-900' : 'bg-white'} ${isFullscreen ? '' : 'md:inset-4 md:rounded-lg overflow-hidden'} chat-modal ${isKeyboardVisible ? 'keyboard-aware' : ''}`}>
          {/* Mobile Sidebar Overlay */}
          {isMobile && showSidebar && (
            <div 
              className="sidebar-overlay"
              onClick={() => setShowSidebar(false)}
            />
          )}
          
          {/* Left Sidebar - Mobile Optimized */}
          {(showSidebar || !isMobile) && (
            <div className={`${isMobile ? 'fixed left-0 top-0 bottom-0 w-72 z-50 sidebar-slide' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
              {/* Sidebar Header */}
              <div className="p-3 md:p-4 border-b border-gray-700/50 dark:border-gray-200/20">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded`}>
                      <Brain className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-gray-200" />
                    </div>
                    <div>
                      <h1 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">Monietar AI</h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Financial Assistant</p>
                    </div>
                  </div>
                  {isMobile && (
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-2 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded touch-button"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                </div>
                
                {/* New Chat Button - Mobile Optimized */}
                <button 
                  onClick={createNewChat}
                  disabled={!openRouterAvailable}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-3 md:py-2.5 rounded text-sm font-medium touch-button ${
                    openRouterAvailable 
                      ? `${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} text-gray-900 dark:text-gray-100`
                      : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-400'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
                
                {/* Search - Mobile Optimized */}
                <div className="mt-2 md:mt-3 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 md:py-2 rounded text-sm touch-button ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } border focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500`}
                  />
                </div>

                {/* Export Button - Mobile Optimized */}
                <div className="mt-2 md:mt-3 relative" ref={exportRef}>
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-3 md:py-2.5 rounded text-sm font-medium touch-button ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    } text-gray-900 dark:text-gray-100`}
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Export Chat</span>
                  </button>

                  {showExportMenu && (
                    <div className={`absolute left-0 right-0 top-full mt-1 z-20 rounded shadow-lg border ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="p-2">
                        <div className="text-xs font-medium px-2 py-1 text-gray-500 mb-1">Export Format</div>
                        {(['pdf', 'txt', 'json'] as const).map((format) => (
                          <button
                            key={format}
                            onClick={() => setExportFormat(format)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm mb-1 touch-button ${
                              exportFormat === format
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                : darkMode
                                  ? 'hover:bg-gray-700 text-gray-300'
                                  : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {format === 'pdf' && <FileText className="w-4 h-4" />}
                              {format === 'txt' && <FileText className="w-4 h-4" />}
                              {format === 'json' && <FileText className="w-4 h-4" />}
                              {format.toUpperCase()}
                            </span>
                            {exportFormat === format && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                        <button
                          onClick={handleExport}
                          className="w-full mt-2 px-3 py-2.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded text-sm font-medium touch-button"
                        >
                          Export Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat History - Mobile Optimized */}
              <div className="flex-1 overflow-y-auto mobile-scrollbar-hide p-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-2 mb-2">Recent</div>
                <div className="space-y-1">
                  {filteredSessions.slice(0, isMobile ? 6 : 8).map((session) => (
                    <div key={session.id} className="relative message-enter">
                      {editingSessionId === session.id ? (
                        <div className="p-2 rounded bg-gray-700/30 dark:bg-gray-200/20">
                          <input
                            type="text"
                            value={sessionEditTitle}
                            onChange={(e) => setSessionEditTitle(e.target.value)}
                            className={`w-full px-2 py-2.5 rounded text-sm touch-button ${
                              darkMode 
                                ? 'bg-gray-600 text-white' 
                                : 'bg-gray-200 text-gray-900'
                            } border ${darkMode ? 'border-gray-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-gray-500`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRenameSession(session.id);
                              if (e.key === 'Escape') cancelRenameSession();
                            }}
                            autoFocus
                          />
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={() => saveRenameSession(session.id)}
                              className="flex-1 px-2 py-2 text-xs bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded touch-button"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelRenameSession}
                              className="flex-1 px-2 py-2 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded touch-button"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => switchChatSession(session.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded touch-button ${
                            currentSessionId === session.id 
                              ? `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-gray-900 dark:text-gray-100`
                              : `${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100`
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                            <div className="text-left truncate">
                              <div className="text-sm truncate">{session.title}</div>
                              <div className="text-xs text-gray-500 truncate">
                                {formatDate(session.lastActive)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => toggleSessionMenu(session.id, e)}
                            className="p-1 hover:bg-gray-700/30 dark:hover:bg-gray-200/20 rounded touch-button"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                        </button>
                      )}

                      {/* Session Menu */}
                      {showSessionMenu === session.id && (
                        <div
                          ref={el => {
                            if (el) sessionMenuRefs.current[session.id] = el;
                          }}
                          className={`absolute right-2 top-12 z-20 ${isMobile ? 'w-56' : 'w-48'} rounded shadow-lg border ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-700' 
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="p-1">
                            <button
                              onClick={() => startRenameSession(session.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm touch-button ${
                                darkMode 
                                  ? 'hover:bg-gray-700 text-gray-300' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Edit3 className="w-4 h-4" />
                              Rename
                            </button>
                            <button
                              onClick={() => duplicateSession(session.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm touch-button ${
                                darkMode 
                                  ? 'hover:bg-gray-700 text-gray-300' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              <Copy className="w-4 h-4" />
                              Duplicate
                            </button>
                            <div className="h-px my-1 bg-gray-700/30 dark:bg-gray-200/20" />
                            <button
                              onClick={() => deleteChatSession(session.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm touch-button ${
                                darkMode 
                                  ? 'hover:bg-red-500/20 text-red-400' 
                                  : 'hover:bg-red-50 text-red-600'
                              }`}
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

              {/* Sidebar Footer - Mobile Optimized */}
              <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${openRouterAvailable ? 'bg-gray-900 dark:bg-gray-100' : 'bg-red-600'}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">{openRouterAvailable ? 'Connected' : 'Offline'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="p-2 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded touch-button"
                    >
                      {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </button>
                    {!isMobile && (
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-gray-700/50 dark:hover:bg-gray-200/20 rounded touch-button"
                      >
                        {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
                {!openRouterAvailable && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-2 p-1.5 rounded bg-red-50 dark:bg-red-900/20">
                    <Key className="w-3 h-3 inline mr-1" />
                    Add OPENROUTER_API_KEY
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Main Chat Area - Mobile Optimized */}
          <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'} ${isMobile && showSidebar ? 'hidden' : ''}`}>
            {/* Chat Header - Mobile Optimized */}
            <div className={`px-3 md:px-6 h-14 md:h-16 flex items-center justify-between border-b ${
              darkMode ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2 md:gap-4">
                {isMobile ? (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded touch-button"
                  >
                    <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                ) : !showSidebar && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                )}
                
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`p-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Brain className="w-4 h-4 md:w-5 md:h-5 text-gray-800 dark:text-gray-200" />
                  </div>
                  <div className="max-w-[150px] md:max-w-none">
                    <h1 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100 truncate">{currentSession?.title || 'Financial Analysis'}</h1>
                    <div className="flex items-center gap-1 md:gap-2">
                      {/* Model Selector - Mobile Optimized */}
                      <div className="relative" ref={modelSelectorRef}>
                        <button
                          onClick={() => setShowModelSelector(!showModelSelector)}
                          className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getModelColor(aiModel)} touch-button`}
                        >
                          {getCurrentModelInfo().icon}
                          {!isMobile && (
                            <span className="font-medium">{getCurrentModelInfo().name}</span>
                          )}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        
                        {showModelSelector && (
                          <div className={`absolute ${isMobile ? 'left-0' : 'left-0'} top-10 z-20 ${isMobile ? 'w-64' : 'w-64'} rounded shadow-lg border ${
                            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}>
                            <div className="p-2">
                              <div className="text-xs font-medium text-gray-500 mb-2 px-2">Free Models</div>
                              <div className="space-y-1 mb-2">
                                {FREE_MODELS.map((model) => (
                                  <button
                                    key={model.id}
                                    onClick={() => {
                                      setAiModel(model.id);
                                      setShowModelSelector(false);
                                      toast.success(`Switched to ${model.name}`);
                                    }}
                                    className={`w-full flex items-center justify-between p-2.5 rounded text-sm touch-button ${
                                      aiModel === model.id
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                        : darkMode
                                          ? 'hover:bg-gray-700 text-gray-300'
                                          : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {model.icon}
                                      <div className="text-left">
                                        <div className="font-medium text-sm">{model.name}</div>
                                        <div className="text-xs text-gray-500">{model.description}</div>
                                      </div>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${aiModel === model.id ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Response Style - Mobile Optimized */}
                      {!isMobile && (
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded p-0.5">
                          {(['simple', 'balanced', 'professional'] as const).map((style) => (
                            <button
                              key={style}
                              onClick={() => setResponseStyle(style)}
                              className={`text-xs px-2 py-0.5 rounded touch-button ${
                                responseStyle === style
                                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                              }`}
                            >
                              {style.charAt(0).toUpperCase()}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Voice Input Button - Mobile Optimized */}
                <button
                  onClick={toggleVoiceInput}
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded touch-button ${
                    isListening
                      ? 'text-red-600 animate-pulse'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  title={voiceSupported ? "Voice input" : "Voice input not supported"}
                  disabled={!voiceSupported}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

                {!isMobile && (
                  <button
                    onClick={toggleTextToSpeech}
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded ${
                      textToSpeech 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                    title="Text-to-speech"
                  >
                    {textToSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded touch-button"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Dashboard Insights Panel - Mobile Optimized */}
            {showDashboardInsights && financialData && (
              <div className={`border-b ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="font-semibold text-xs md:text-sm text-gray-900 dark:text-gray-100">Your Financial Snapshot</h3>
                    <button
                      onClick={() => setShowDashboardInsights(false)}
                      className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 touch-button"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    <div className={`p-2 md:p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Income</div>
                      <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                        {formatCurrency ? formatCurrency(financialData.income) : `$${financialData.income}`}
                      </div>
                    </div>
                    <div className={`p-2 md:p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expenses</div>
                      <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                        {formatCurrency ? formatCurrency(financialData.expenses) : `$${financialData.expenses}`}
                      </div>
                    </div>
                    <div className={`p-2 md:p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit</div>
                      <div className={`font-semibold text-sm md:text-base ${financialData.profit >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-600'}`}>
                        {formatCurrency ? formatCurrency(financialData.profit) : `$${financialData.profit}`}
                      </div>
                    </div>
                    <div className={`p-2 md:p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transactions</div>
                      <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                        {financialData.transactions?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Container - Mobile Optimized */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto mobile-scrollbar-hide">
              <div className="max-w-3xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
                {connectionError && (
                  <div className={`p-3 md:p-4 rounded ${
                    darkMode
                      ? 'bg-red-900/20 border border-red-800/30'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start gap-2 md:gap-3">
                      <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm md:text-base text-red-600 dark:text-red-400">Connection Error</p>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{connectionError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voice Input Indicator - Mobile Optimized */}
                {isListening && (
                  <div className={`p-3 md:p-4 rounded ${
                    darkMode
                      ? 'bg-blue-900/20 border border-blue-800/30'
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="relative">
                        <Mic className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm md:text-base text-blue-600 dark:text-blue-400">Listening...</p>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {transcript || "Speak now..."}
                        </p>
                      </div>
                      <button
                        onClick={toggleVoiceInput}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm touch-button"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages - Mobile Optimized */}
                {currentSession?.messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`flex gap-2 md:gap-3 message-enter ${message.sender === 'user' ? 'justify-end' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {message.sender === 'ai' && (
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                        <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-800 dark:text-gray-200" />
                      </div>
                    )}
                    
                    <div className={`flex-1 ${message.sender === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div className={`flex items-center justify-between mb-1 px-1 ${message.sender === 'user' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-xs md:text-sm font-medium">
                            {message.sender === 'ai' ? 'Monietar AI' : 'You'}
                          </span>
                          {!isMobile && message.model && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${getModelColor(message.model || '')}`}>
                              {message.model.split('/')[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          <button
                            onClick={() => copyMessage(message.text, message.id)}
                            className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded touch-button"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="w-3 h-3 text-gray-900 dark:text-gray-100" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className={`rounded-lg p-3 md:p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} ${message.sender === 'user' ? 'bg-gray-900 text-gray-100 dark:bg-gray-700' : ''} message-text`}>
                        <ReactMarkdown components={markdownComponents}>
                          {message.text}
                        </ReactMarkdown>
                        
                        {/* Message Actions - Mobile Optimized */}
                        <div className={`flex items-center justify-between mt-2 md:mt-3 pt-2 md:pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-1 md:gap-2">
                            {message.sender === 'ai' && (
                              <>
                                <button
                                  onClick={() => togglePlayPause(message.text, message.id)}
                                  className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded touch-button ${
                                    currentlyPlayingId === message.id
                                      ? 'text-gray-900 dark:text-gray-100'
                                      : 'text-gray-500 dark:text-gray-400'
                                  }`}
                                >
                                  {currentlyPlayingId === message.id ? (
                                    <Pause className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                  ) : (
                                    <Play className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                  )}
                                </button>
                                {speechProgress[message.id] !== undefined && (
                                  <div className="w-12 md:w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gray-900 dark:bg-gray-100 transition-all duration-300"
                                      style={{ width: `${speechProgress[message.id]}%` }}
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          {!isMobile && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              {message.tokensUsed && message.tokensUsed > 0 && (
                                <span>Tokens: {message.tokensUsed}</span>
                              )}
                              {message.estimatedCost && message.estimatedCost !== '$0.000000' && (
                                <span>Cost: {message.estimatedCost}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-800 dark:text-gray-200" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Loading Indicator - Mobile Optimized */}
                {isLoading && (
                  <div className="flex gap-2 md:gap-3 message-enter">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center flex-shrink-0`}>
                      <Brain className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-800 dark:text-gray-200" />
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-lg p-3 md:p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                          <span className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">Monietar AI</span>
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <div className="typing-indicator">
                              <div className="typing-dot"></div>
                              <div className="typing-dot"></div>
                              <div className="typing-dot"></div>
                            </div>
                            <span>Thinking...</span>
                          </div>
                        </div>
                        <div className="space-y-1 md:space-y-1.5">
                          <div className={`h-1.5 md:h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} style={{ width: '85%' }} />
                          <div className={`h-1.5 md:h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} style={{ width: '70%' }} />
                          <div className={`h-1.5 md:h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Welcome Screen - Mobile Optimized */}
                {currentSession?.messages.length === 1 && !connectionError && (
                  <div className="text-center py-4 md:py-8 px-3 md:px-4">
                    <div className="inline-flex items-center justify-center p-2 md:p-3 rounded-lg bg-gray-100 dark:bg-gray-800 mb-4 md:mb-6">
                      <Brain className="w-8 h-8 md:w-12 md:h-12 text-gray-800 dark:text-gray-200" />
                    </div>
                    <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 text-gray-900 dark:text-gray-100">
                      Monietar Financial AI
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 max-w-md mx-auto text-sm md:text-base">
                      Your personal financial analyst powered by AI
                    </p>
                    
                    {/* Quick Actions - Mobile Optimized */}
                    <div className="grid grid-cols-2 gap-2 md:gap-3 max-w-2xl mx-auto mb-4 md:mb-6">
                      {financialTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestedQuestion(topic.text)}
                          className={`group p-2 md:p-3 rounded-lg text-left touch-button ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition`}
                        >
                          <div className="flex flex-col items-start gap-1 md:gap-2">
                            <div className={`p-1.5 md:p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              {topic.icon}
                            </div>
                            <div>
                              <div className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100">{topic.text}</div>
                              <div className="text-xs text-gray-500">{topic.desc}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Suggested Questions - Mobile Optimized */}
                    <div className="max-w-2xl mx-auto">
                      <h3 className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                        Try asking...
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestedQuestion(question)}
                            className={`text-left p-2.5 md:p-3 rounded-lg touch-button ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition text-xs md:text-sm text-gray-900 dark:text-gray-100`}
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

            {/* File Upload Preview - Mobile Optimized */}
            {uploadedFiles.length > 0 && (
              <div className={`px-3 md:px-6 py-2 md:py-3 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Files to upload ({uploadedFiles.length})
                    </div>
                    <button
                      onClick={() => setUploadedFiles([])}
                      className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 touch-button"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} max-w-[200px]`}
                      >
                        {getFileIcon(file)}
                        <div className="text-xs md:text-sm overflow-hidden">
                          <div className="font-medium truncate max-w-[100px] md:max-w-[150px] text-gray-900 dark:text-gray-100">
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-1 p-0.5 md:p-1 hover:bg-gray-700/30 rounded touch-button"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Input Area - Mobile Optimized */}
            <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="max-w-3xl mx-auto p-3 md:p-4 md:p-6">
                <div className={`rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
                  <div className="flex items-start gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-3">
                    {/* File Upload Button */}
                    <div className="relative">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded touch-button`}
                        title="Upload files"
                      >
                        <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        multiple
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.csv,.xlsx,.xls"
                      />
                    </div>

                    {/* Text Area - Mobile Optimized */}
                    <textarea
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onInput={handleTextareaInput}
                      onKeyDown={handleKeyPress}
                      placeholder={openRouterAvailable ? "Ask about your finances..." : "Configure OpenRouter API key to start..."}
                      className={`flex-1 px-2 py-2 bg-transparent outline-none resize-none ${
                        darkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                      } min-h-[44px] max-h-[100px] md:max-h-[200px] text-sm md:text-base`}
                      rows={1}
                      disabled={isLoading || !openRouterAvailable}
                      style={{ height: inputHeight }}
                    />
                    
                    {/* Send Button - Mobile Optimized */}
                    <button
                      onClick={handleSend}
                      disabled={(!newMessage.trim() && uploadedFiles.length === 0) || isLoading || !openRouterAvailable}
                      className={`p-2 rounded touch-button ${
                        (newMessage.trim() || uploadedFiles.length > 0) && !isLoading && openRouterAvailable
                          ? 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white'
                          : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-400 dark:text-gray-600'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className={`flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-1 md:gap-2">
                      {isMobile && (
                        <button
                          onClick={toggleTextToSpeech}
                          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded touch-button ${
                            textToSpeech 
                              ? 'text-gray-900 dark:text-gray-100' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                          title="Text-to-speech"
                        >
                          {textToSpeech ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                      )}
                      <div className="text-xs text-gray-500">
                        {openRouterAvailable 
                          ? `${getCurrentModelInfo().name} • ${responseStyle} style • Enter to send`
                          : 'OpenRouter not configured'}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {openRouterUsage.dailyRequests}/{openRouterUsage.dailyLimit} requests today
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-center text-gray-500 mt-2 md:mt-3">
                  Powered by OpenRouter • Secured
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}