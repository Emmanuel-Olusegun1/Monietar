// components/pages/ComingSoonPage.tsx
import { motion } from 'framer-motion';
import { FileText, BarChart3, Zap, Target } from 'lucide-react';

interface ComingSoonPageProps {
  activeTab: string;
  darkMode: boolean;
  themeClasses: any;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  activeTab,
  darkMode,
  themeClasses
}) => {
  const getIcon = () => {
    switch (activeTab) {
      case 'reports':
        return FileText;
      case 'analytics':
        return BarChart3;
      case 'accounts':
        return Target;
      default:
        return Zap;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'reports':
        return 'Reports';
      case 'analytics':
        return 'Analytics';
      case 'accounts':
        return 'Bank Accounts';
      default:
        return 'Feature';
    }
  };

  const IconComponent = getIcon();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-8 rounded-2xl border text-center max-w-md w-full ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        } backdrop-blur-sm`}
      >
        {/* Icon */}
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
          darkMode 
            ? 'bg-blue-900/20 border border-blue-800' 
            : 'bg-blue-100 border border-blue-200'
        }`}>
          <IconComponent className={`w-10 h-10 ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold mb-3 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {getTitle()}
        </h2>

        {/* Description */}
        <p className={`text-lg mb-6 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Coming Soon
        </p>

        {/* Subtext */}
        <p className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          We're working on something amazing. Stay tuned!
        </p>
      </motion.div>
    </div>
  );
};