import React from 'react';
import { X, Sparkles, Shirt } from 'lucide-react';

interface OutfitModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: string;
  loading: boolean;
}

const OutfitModal: React.FC<OutfitModalProps> = ({ isOpen, onClose, suggestion, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl p-8 relative border border-white/20">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full"></div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full shadow-lg relative z-10">
              <Shirt size={32} className="text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Vibe Check <Sparkles size={20} className="text-yellow-400" />
          </h3>

          {loading ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Consulting the AI stylist...</p>
            </div>
          ) : (
            <div className="py-2">
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                "{suggestion}"
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutfitModal;
