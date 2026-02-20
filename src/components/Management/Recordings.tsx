import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Download, Trash2, Search, Phone, Video as VideoIcon, Calendar, X, Pause } from 'lucide-react';

interface Recording {
  id: string;
  type: 'voice' | 'video';
  title: string;
  date: string;
  duration: string;
  size: string;
  status: 'available' | 'processing' | 'archived';
  url?: string;
}

export default function Recordings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'voice' | 'video'>('all');
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [recordings, setRecordings] = useState<Recording[]>([
    {
      id: '1',
      type: 'voice',
      title: 'Customer Support Call - #12345',
      date: '2024-12-26 10:30 AM',
      duration: '5:42',
      size: '2.8 MB',
      status: 'available',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: '2',
      type: 'video',
      title: 'Product Demo Session',
      date: '2024-12-25 2:15 PM',
      duration: '12:30',
      size: '45.6 MB',
      status: 'available',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: '3',
      type: 'voice',
      title: 'Sales Call - Lead Qualification',
      date: '2024-12-25 11:00 AM',
      duration: '8:15',
      size: '4.2 MB',
      status: 'available',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: '4',
      type: 'video',
      title: 'Team Meeting Recording',
      date: '2024-12-24 3:00 PM',
      duration: '45:20',
      size: '156.3 MB',
      status: 'available',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: '5',
      type: 'voice',
      title: 'Technical Support Call',
      date: '2024-12-24 9:45 AM',
      duration: '15:30',
      size: '7.8 MB',
      status: 'available',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: '6',
      type: 'video',
      title: 'Webinar - Q4 Review',
      date: '2024-12-23 1:00 PM',
      duration: '60:00',
      size: '210.5 MB',
      status: 'processing'
    }
  ]);

  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || recording.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const totalRecordings = recordings.length;
  const voiceRecordings = recordings.filter(r => r.type === 'voice').length;
  const videoRecordings = recordings.filter(r => r.type === 'video').length;
  const totalSize = recordings.reduce((sum, r) => {
    const size = parseFloat(r.size);
    return sum + size;
  }, 0);

  const handlePlay = (recording: Recording) => {
    if (recording.status !== 'available') {
      alert('This recording is not available for playback yet.');
      return;
    }
    setPlayingRecording(recording);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setPlayingRecording(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const togglePlayPause = () => {
    const mediaElement = playingRecording?.type === 'voice' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause();
      } else {
        mediaElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = (recording: Recording) => {
    if (recording.status !== 'available') {
      alert('This recording is not available for download yet.');
      return;
    }
    if (recording.url) {
      const link = document.createElement('a');
      link.href = recording.url;
      link.download = `${recording.title}.${recording.type === 'voice' ? 'mp3' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = (recordingId: string) => {
    if (confirm('Are you sure you want to delete this recording? This action cannot be undone.')) {
      setRecordings(recordings.filter(r => r.id !== recordingId));
      if (playingRecording?.id === recordingId) {
        handleClosePlayer();
      }
    }
  };

  useEffect(() => {
    const mediaElement = playingRecording?.type === 'voice' ? audioRef.current : videoRef.current;
    if (mediaElement) {
      const handleEnded = () => setIsPlaying(false);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      mediaElement.addEventListener('ended', handleEnded);
      mediaElement.addEventListener('play', handlePlay);
      mediaElement.addEventListener('pause', handlePause);

      return () => {
        mediaElement.removeEventListener('ended', handleEnded);
        mediaElement.removeEventListener('play', handlePlay);
        mediaElement.removeEventListener('pause', handlePause);
      };
    }
  }, [playingRecording]);

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Recordings</h1>
        <p className="text-slate-400 text-lg">Manage your voice and video recordings</p>
      </div>



      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-[#39FF14] text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('voice')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'voice'
                  ? 'bg-[#39FF14] text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Voice
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'video'
                  ? 'bg-[#39FF14] text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Video
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="space-y-4">
          {filteredRecordings.map((recording) => (
            <div
              key={recording.id}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  recording.type === 'voice'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-[#39FF14]/20 text-[#39FF14]'
                }`}>
                  {recording.type === 'voice' ? (
                    <Phone className="w-6 h-6" />
                  ) : (
                    <VideoIcon className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-1">{recording.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{recording.date}</span>
                    <span>•</span>
                    <span>{recording.duration}</span>
                    <span>•</span>
                    <span>{recording.size}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(recording.status)}`}>
                  {recording.status}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePlay(recording)}
                    disabled={recording.status !== 'available'}
                    className={`p-2 rounded-lg transition-colors ${
                      recording.status === 'available'
                        ? 'bg-[#39FF14]/20/20 hover:bg-[#39FF14]/20/30 text-[#39FF14]'
                        : 'bg-slate-700/20 text-slate-500 cursor-not-allowed'
                    }`}
                    title={recording.status === 'available' ? 'Play recording' : 'Recording not available'}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(recording)}
                    disabled={recording.status !== 'available'}
                    className={`p-2 rounded-lg transition-colors ${
                      recording.status === 'available'
                        ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400'
                        : 'bg-slate-700/20 text-slate-500 cursor-not-allowed'
                    }`}
                    title={recording.status === 'available' ? 'Download recording' : 'Recording not available'}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(recording.id)}
                    className="p-2 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] rounded-lg transition-colors"
                    title="Delete recording"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecordings.length === 0 && (
          <div className="text-center py-12">
            <Mic className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No recordings found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {playingRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl mx-4 overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <div>
                <h3 className="text-white font-semibold text-lg">{playingRecording.title}</h3>
                <p className="text-slate-400 text-sm mt-1">
                  {playingRecording.date} • {playingRecording.duration}
                </p>
              </div>
              <button
                onClick={handleClosePlayer}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {playingRecording.type === 'voice' ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 rounded-xl p-12 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-[#39FF14]/20/20 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-16 h-16 text-[#39FF14]" />
                      </div>
                      <p className="text-white font-medium text-lg">Audio Recording</p>
                      <p className="text-slate-400 text-sm mt-2">Playing voice call</p>
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    src={playingRecording.url}
                    className="w-full"
                    controls
                    autoPlay
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    src={playingRecording.url}
                    className="w-full rounded-lg bg-black"
                    controls
                    autoPlay
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayPause}
                    className="p-3 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                  <div className="text-sm text-slate-400">
                    <span className={`px-2 py-1 rounded ${
                      playingRecording.type === 'voice'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-[#39FF14]/20 text-[#39FF14]'
                    }`}>
                      {playingRecording.type === 'voice' ? 'Voice' : 'Video'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(playingRecording)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleClosePlayer}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
