import React, { useState, useEffect } from 'react';
import {
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Phone, Settings,
  Users, MessageSquare, MoreVertical, Grid, Maximize2, Volume2, VolumeX,
  Camera, ChevronDown, Clock, Activity
} from 'lucide-react';
import { db } from '../../lib/db';

interface Participant {
  id: string;
  participant_name: string;
  participant_email: string;
  role: string;
  audio_enabled: boolean;
  video_enabled: boolean;
  speaking_time_seconds: number;
}

interface Transcript {
  id: string;
  segment_number: number;
  speaker_name: string;
  transcript_text: string;
  start_time_seconds: number;
  sentiment: string;
  is_question: boolean;
}

interface LiveMeetingRoomProps {
  meetingId: string;
  meetingTitle: string;
  onLeave: () => void;
}

export const LiveMeetingRoom: React.FC<LiveMeetingRoomProps> = ({
  meetingId,
  meetingTitle,
  onLeave
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<'participants' | 'chat' | 'transcript'>('participants');
  const [speakerVolume, setSpeakerVolume] = useState(80);
  const [micVolume, setMicVolume] = useState(80);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    loadParticipants();
    loadTranscripts();

    // Update duration every second
    const durationInterval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Simulate real-time transcript updates
    const transcriptInterval = setInterval(() => {
      loadTranscripts();
    }, 5000);

    return () => {
      clearInterval(durationInterval);
      clearInterval(transcriptInterval);
    };
  }, [meetingId]);

  const loadParticipants = async () => {
    try {
      const { data, error } = await db
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('role', { ascending: false });
      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const loadTranscripts = async () => {
    try {
      const { data, error } = await db
        .from('meeting_transcripts')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('segment_number', { ascending: true });
      if (error) throw error;
      setTranscripts(data || []);
    } catch (error) {
      console.error('Error loading transcripts:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    if (confirm('Are you sure you want to leave this meeting?')) {
      onLeave();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{meetingTitle}</h2>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {formatDuration(duration)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              {participants.length} participants
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm font-semibold text-red-500">LIVE</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 bg-black p-4 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-6xl">
            {/* Main Speaker (larger) */}
            <div className="col-span-2 relative bg-gray-800 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#39FF14] to-[#32e012] flex items-center justify-center text-black text-4xl font-bold">
                  {participants[0]?.participant_name.charAt(0) || 'H'}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-2 rounded-lg flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-white font-semibold">{participants[0]?.participant_name || 'Host'}</span>
                {participants[0]?.audio_enabled && <Volume2 className="w-4 h-4 text-green-400" />}
                {!participants[0]?.audio_enabled && <VolumeX className="w-4 h-4 text-red-400" />}
              </div>
            </div>

            {/* Other Participants */}
            {participants.slice(1, 5).map((participant, idx) => (
              <div key={participant.id} className="relative bg-gray-800 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  {participant.participant_name.charAt(0)}
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-sm flex items-center gap-1">
                  <span className="text-white">{participant.participant_name}</span>
                  {participant.audio_enabled && <Volume2 className="w-3 h-3 text-green-400" />}
                  {!participant.audio_enabled && <VolumeX className="w-3 h-3 text-red-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveView('participants')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'participants'
                    ? 'text-white bg-gray-700 border-b-2 border-[#39FF14]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }`}
              >
                <Users className="w-4 h-4 mx-auto mb-1" />
                Participants
              </button>
              <button
                onClick={() => setActiveView('chat')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'chat'
                    ? 'text-white bg-gray-700 border-b-2 border-[#39FF14]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }`}
              >
                <MessageSquare className="w-4 h-4 mx-auto mb-1" />
                Chat
              </button>
              <button
                onClick={() => setActiveView('transcript')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeView === 'transcript'
                    ? 'text-white bg-gray-700 border-b-2 border-[#39FF14]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }`}
              >
                <MessageSquare className="w-4 h-4 mx-auto mb-1" />
                Transcript
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeView === 'participants' && (
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14] to-[#32e012] flex items-center justify-center text-black font-semibold">
                          {participant.participant_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-white font-medium">{participant.participant_name}</div>
                          <div className="text-xs text-gray-400">{participant.role}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {participant.audio_enabled ? (
                          <Mic className="w-4 h-4 text-green-400" />
                        ) : (
                          <MicOff className="w-4 h-4 text-red-400" />
                        )}
                        {participant.video_enabled ? (
                          <Video className="w-4 h-4 text-green-400" />
                        ) : (
                          <VideoOff className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeView === 'chat' && (
                <div className="space-y-3">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Sarah Johnson</div>
                    <div className="text-white text-sm">Great discussion everyone!</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Participant A</div>
                    <div className="text-white text-sm">Agreed, very productive session.</div>
                  </div>
                </div>
              )}

              {activeView === 'transcript' && (
                <div className="space-y-3">
                  {transcripts.length > 0 ? (
                    transcripts.map((transcript) => (
                      <div key={transcript.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-white">{transcript.speaker_name}</span>
                          <span className="text-xs text-gray-400">{Math.floor(transcript.start_time_seconds / 60)}:{(transcript.start_time_seconds % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <p className="text-sm text-gray-300">{transcript.transcript_text}</p>
                        {transcript.is_question && (
                          <span className="inline-block mt-2 px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">
                            Question
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Live transcription will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={speakerVolume}
                onChange={(e) => setSpeakerVolume(Number(e.target.value))}
                className="w-20 accent-blue-500"
              />
              <span className="text-xs text-gray-400 w-8">{speakerVolume}%</span>
            </div>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-4 rounded-full transition-colors ${
                audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {audioEnabled ? (
                <Mic className="w-5 h-5 text-white" />
              ) : (
                <MicOff className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-4 rounded-full transition-colors ${
                videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {videoEnabled ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-4 rounded-full transition-colors ${
                screenSharing ? 'bg-[#39FF14] hover:bg-[#32e012]' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {screenSharing ? (
                <MonitorOff className="w-5 h-5 text-white" />
              ) : (
                <Monitor className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={handleLeave}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            >
              <Phone className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <Grid className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
            <button className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
