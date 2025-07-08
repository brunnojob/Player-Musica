import React from 'react';
import { Languages } from 'lucide-react';

interface LyricsDisplayProps {
  lyricsEn?: string;
  lyricsPt?: string;
  isVisible: boolean;
  onToggle: () => void;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ 
  lyricsEn, 
  lyricsPt, 
  isVisible, 
  onToggle 
}) => {
  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-32 right-6 z-20 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all duration-300"
      >
        <Languages className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed bottom-32 right-6 z-30 p-3 bg-orange-500/80 backdrop-blur-md rounded-full text-white hover:bg-orange-600/80 transition-all duration-300"
      >
        <Languages className="w-5 h-5" />
      </button>

      <div className="fixed bottom-40 left-6 right-6 z-20 flex gap-6 max-h-[40vh] pointer-events-none">
        <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-y-auto pointer-events-auto">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            English
          </h3>
          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {lyricsEn || (
              <div className="text-gray-400 italic text-center py-8">
                No English lyrics available
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 overflow-y-auto pointer-events-auto">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Português
          </h3>
          <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {lyricsPt || (
              <div className="text-gray-400 italic text-center py-8">
                Nenhuma letra em português disponível
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LyricsDisplay;