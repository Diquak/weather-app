import React from 'react';
import { X, Moon, Sun, Thermometer, CloudRain } from 'lucide-react';
import { AppSettings, Unit, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, updateSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Thermometer size={20} className="text-blue-600 dark:text-blue-300" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">Temperature Unit</span>
            </div>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer">
              <button
                onClick={() => updateSettings({ unit: Unit.CELSIUS })}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  settings.unit === Unit.CELSIUS
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => updateSettings({ unit: Unit.FAHRENHEIT })}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  settings.unit === Unit.FAHRENHEIT
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                {settings.theme === Theme.LIGHT ? (
                  <Sun size={20} className="text-purple-600 dark:text-purple-300" />
                ) : (
                  <Moon size={20} className="text-purple-600 dark:text-purple-300" />
                )}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">Theme</span>
            </div>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer">
              <button
                onClick={() => updateSettings({ theme: Theme.LIGHT })}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  settings.theme === Theme.LIGHT
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => updateSettings({ theme: Theme.DARK })}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  settings.theme === Theme.DARK
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* Rain Notification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                <CloudRain size={20} className="text-teal-600 dark:text-teal-300" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-200">Rain Notification</span>
            </div>
            <button
              onClick={() => updateSettings({ rainNotification: !settings.rainNotification })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.rainNotification ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                  settings.rainNotification ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
