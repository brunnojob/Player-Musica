import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat,
  Heart,
  Music,
  Library,
  Github,
  Linkedin
} from 'lucide-react';
import MusicLibrary, { Track } from './MusicLibrary';
import LyricsDisplay from './LyricsDisplay';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const savedTracks = localStorage.getItem('musicPlayerTracks');
    if (savedTracks) {
      try {
        const parsedTracks = JSON.parse(savedTracks);
        setTracks(parsedTracks);
      } catch (error) {
        console.error('Error loading saved tracks:', error);
        setTracks([
          {
            id: 1,
            title: "Journey's End",
            artist: "Wanderer",
            album: "Paths Unknown",
            duration: "4:23",
            cover: "/backpacker-7628303_1920.jpg",
            lyricsEn: "Sample English lyrics would go here...\n\nThis is where your song lyrics\nwould be displayed in English.",
            lyricsPt: "Exemplo de letra em português ficaria aqui...\n\nAqui é onde a letra da sua música\nseria exibida em português."
          },
          {
            id: 2,
            title: "Mountain Echoes",
            artist: "Nature's Call",
            album: "Wilderness",
            duration: "3:45",
            cover: "/backpacker-7628303_1920.jpg",
            lyricsEn: "Another sample of English lyrics...\n\nYour actual song lyrics\nwould replace this text.",
            lyricsPt: "Outro exemplo de letra em português...\n\nSua letra real da música\nsubstituiria este texto."
          }
        ]);
      }
    } else {
      setTracks([
        {
          id: 1,
          title: "Journey's End",
          artist: "Wanderer",
          album: "Paths Unknown",
          duration: "4:23",
          cover: "/backpacker-7628303_1920.jpg",
          lyricsEn: "Sample English lyrics would go here...\n\nThis is where your song lyrics\nwould be displayed in English.",
          lyricsPt: "Exemplo de letra em português ficaria aqui...\n\nAqui é onde a letra da sua música\nseria exibida em português."
        },
        {
          id: 2,
          title: "Mountain Echoes",
          artist: "Nature's Call",
          album: "Wilderness",
          duration: "3:45",
          cover: "/backpacker-7628303_1920.jpg",
          lyricsEn: "Another sample of English lyrics...\n\nYour actual song lyrics\nwould replace this text.",
          lyricsPt: "Outro exemplo de letra em português...\n\nSua letra real da música\nsubstituiria este texto."
        }
      ]);
    }
  }, []);

  const handleTracksUpdate = (newTracks: Track[]) => {
    setTracks(newTracks);
    try {
      const tracksToSave = newTracks.map(track => ({
        ...track,
        audioFile: undefined,
        audioUrl: track.audioFile ? URL.createObjectURL(track.audioFile) : track.audioUrl
      }));
      localStorage.setItem('musicPlayerTracks', JSON.stringify(tracksToSave));
    } catch (error) {
      console.error('Error saving tracks:', error);
    }
  };

  useEffect(() => {
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 1 || currentTrackIndex < tracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, repeatMode, tracks.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack?.audioUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleLike = () => setIsLiked(!isLiked);
  
  const cycleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const nextTrack = () => {
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (tracks.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Music className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">No Music in Library</h2>
          <p className="text-gray-400 mb-8">Add your first track to start listening</p>
          <button
            onClick={() => setShowLibrary(true)}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors flex items-center gap-2 mx-auto"
          >
            <Library className="w-5 h-5" />
            Open Library
          </button>
        </div>
        
        {showLibrary && (
          <MusicLibrary
            tracks={tracks}
            onTracksUpdate={setTracks}
            onClose={() => setShowLibrary(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <audio ref={audioRef} preload="metadata" />

      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ backgroundImage: `url(${currentTrack.cover})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />
        
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent animate-pulse" 
               style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500/15 to-transparent animate-pulse" 
               style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-purple-500/10 to-transparent animate-pulse" 
               style={{ animationDuration: '7s', animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={`note-${i}`}
              className="absolute text-white/20 animate-bounce"
              style={{
                left: `${5 + (i * 6)}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${1.5 + Math.random() * 3}s`
              }}
            >
              <Music className="w-3 h-3" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="absolute border border-white/10 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                width: `${20 + Math.random() * 40}px`,
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 via-transparent to-transparent animate-pulse"
             style={{ animationDuration: '6s' }} />
      </div>

      <div className="absolute top-6 left-6 z-20 flex gap-3">
        <button
          onClick={() => setShowLibrary(true)}
          className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all duration-300"
        >
          <Library className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <a
          href="https://github.com/brunnojob"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all duration-300 hover:scale-110"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/brunnojob/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/60 transition-all duration-300 hover:scale-110"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>

      <LyricsDisplay
        lyricsEn={currentTrack.lyricsEn}
        lyricsPt={currentTrack.lyricsPt}
        isVisible={showLyrics}
        onToggle={() => setShowLyrics(!showLyrics)}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="relative mb-12">
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-orange-500/20">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.album}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/30 animate-pulse" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full shadow-lg animate-spin"
                 style={{ animationDuration: '8s' }}>
              <Music className="w-6 h-6 text-white" />
            </div>

            <div className="absolute inset-0 rounded-2xl border border-orange-500/20 animate-ping"
                 style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 rounded-2xl border border-white/10 animate-ping"
                 style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">{currentTrack.title}</h1>
            <p className="text-xl text-gray-300 mb-1">{currentTrack.artist}</p>
            <p className="text-lg text-gray-400">{currentTrack.album}</p>
          </div>

          <div className="w-full max-w-md mb-8">
            <div 
              ref={progressRef}
              className="relative h-2 bg-white/20 rounded-full cursor-pointer group backdrop-blur-sm"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-300 shadow-lg shadow-orange-500/30"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-300 mt-3">
              <span className="font-mono">{formatTime(currentTime)}</span>
              <span className="font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-8 mb-12">
            <button 
              onClick={toggleShuffle}
              className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
                isShuffled 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button 
              onClick={prevTrack}
              className="p-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button 
              onClick={togglePlay}
              disabled={!currentTrack?.audioUrl}
              className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full shadow-2xl shadow-orange-500/40 transform hover:scale-110 transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>

            <button 
              onClick={nextTrack}
              className="p-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button 
              onClick={cycleRepeat}
              className={`p-4 rounded-full transition-all duration-300 transform hover:scale-110 relative ${
                repeatMode > 0 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              }`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 2 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-orange-500 rounded-full text-xs flex items-center justify-center font-bold">
                  1
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-8 bg-black/40 backdrop-blur-md border-t border-white/10">
          <button 
            onClick={toggleLike}
            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
              isLiked ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <div className="flex items-center space-x-4 text-white">
            <button 
              onClick={toggleMute} 
              className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 transform hover:scale-110"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-32 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>

      {showLibrary && (
        <MusicLibrary
          tracks={tracks}
          onTracksUpdate={handleTracksUpdate}
          onClose={() => setShowLibrary(false)}
        />
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #f97316, #ea580c);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #f97316, #ea580c);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          background: rgba(255, 255, 255, 0.2);
          height: 8px;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          height: 8px;
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;