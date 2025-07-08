import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Upload, Music, X } from 'lucide-react';

export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioFile?: File;
  audioUrl?: string;
  lyricsEn?: string;
  lyricsPt?: string;
  cover?: string;
}

interface MusicLibraryProps {
  tracks: Track[];
  onTracksUpdate: (tracks: Track[]) => void;
  onClose: () => void;
}

const MusicLibrary: React.FC<MusicLibraryProps> = ({ tracks, onTracksUpdate, onClose }) => {
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [newTrack, setNewTrack] = useState<Partial<Track>>({
    title: '',
    artist: '',
    album: '',
    duration: '0:00',
    lyricsEn: '',
    lyricsPt: ''
  });

  const handleFileUpload = (file: File) => {
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);
    
    audio.addEventListener('loadedmetadata', () => {
      const duration = Math.floor(audio.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      setNewTrack(prev => ({
        ...prev,
        audioFile: file,
        audioUrl,
        duration: formattedDuration,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    });
  };

  const handleAddTrack = () => {
    if (newTrack.title && newTrack.artist && newTrack.audioFile) {
      const track: Track = {
        id: Date.now(),
        title: newTrack.title,
        artist: newTrack.artist,
        album: newTrack.album || 'Unknown Album',
        duration: newTrack.duration || '0:00',
        audioFile: newTrack.audioFile,
        audioUrl: newTrack.audioUrl,
        lyricsEn: newTrack.lyricsEn || '',
        lyricsPt: newTrack.lyricsPt || '',
        cover: newTrack.cover || '/backpacker-7628303_1920.jpg'
      };

      onTracksUpdate([...tracks, track]);
      setNewTrack({
        title: '',
        artist: '',
        album: '',
        duration: '0:00',
        lyricsEn: '',
        lyricsPt: ''
      });
      setIsAddingTrack(false);
    }
  };

  const handleEditTrack = (track: Track) => {
    const updatedTracks = tracks.map(t => 
      t.id === track.id ? track : t
    );
    onTracksUpdate(updatedTracks);
    setEditingTrack(null);
  };

  const handleDeleteTrack = (id: number) => {
    const updatedTracks = tracks.filter(t => t.id !== id);
    onTracksUpdate(updatedTracks);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Music className="w-8 h-8 text-orange-500" />
            Music Library
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <button
            onClick={() => setIsAddingTrack(true)}
            className="w-full p-4 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-orange-500 transition-colors mb-6 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Track
          </button>

          {isAddingTrack && (
            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">Add New Track</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio File (MP3, WAV, etc.)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">
                      {newTrack.audioFile ? newTrack.audioFile.name : 'Choose audio file'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newTrack.title || ''}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Song title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
                  <input
                    type="text"
                    value={newTrack.artist || ''}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, artist: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Artist name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Album</label>
                  <input
                    type="text"
                    value={newTrack.album || ''}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, album: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Album name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={newTrack.duration || ''}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    placeholder="0:00"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lyrics (English)</label>
                  <textarea
                    value={newTrack.lyricsEn || ''}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, lyricsEn: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none h-32 resize-none"
                    placeholder="Enter English lyrics..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Lyrics (Portuguese)</label>
                  <textarea
                    value={newTrack.lyricsPt || ''}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, lyricsPt: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none h-32 resize-none"
                    placeholder="Digite a letra em português..."
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddTrack}
                  disabled={!newTrack.title || !newTrack.artist || !newTrack.audioFile}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Add Track
                </button>
                <button
                  onClick={() => {
                    setIsAddingTrack(false);
                    setNewTrack({
                      title: '',
                      artist: '',
                      album: '',
                      duration: '0:00',
                      lyricsEn: '',
                      lyricsPt: ''
                    });
                  }}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{track.title}</h4>
                    <p className="text-gray-400 text-sm">{track.artist} • {track.album}</p>
                    <p className="text-gray-500 text-xs">{track.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingTrack(track)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTrack(track.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tracks.length === 0 && !isAddingTrack && (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tracks in your library</p>
              <p className="text-gray-500">Add your first track to get started</p>
            </div>
          )}
        </div>
      </div>

      {editingTrack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Track</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editingTrack.title}
                  onChange={(e) => setEditingTrack(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Artist</label>
                <input
                  type="text"
                  value={editingTrack.artist}
                  onChange={(e) => setEditingTrack(prev => prev ? { ...prev, artist: e.target.value } : null)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lyrics (English)</label>
                <textarea
                  value={editingTrack.lyricsEn || ''}
                  onChange={(e) => setEditingTrack(prev => prev ? { ...prev, lyricsEn: e.target.value } : null)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none h-32 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Lyrics (Portuguese)</label>
                <textarea
                  value={editingTrack.lyricsPt || ''}
                  onChange={(e) => setEditingTrack(prev => prev ? { ...prev, lyricsPt: e.target.value } : null)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none h-32 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEditTrack(editingTrack)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingTrack(null)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicLibrary;