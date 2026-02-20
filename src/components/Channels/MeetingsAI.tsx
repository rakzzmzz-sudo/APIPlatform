import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import MeetingTemplates from './MeetingTemplates';
import ScheduleMeeting from './ScheduleMeeting';
import { LiveMeetingRoom } from './LiveMeetingRoom';
import {
  Video, Users, Clock, Calendar, Play, Pause, StopCircle,
  Mic, MicOff, VideoIcon, VideoOff, MessageSquare, Brain,
  FileText, CheckSquare, TrendingUp, BarChart3, Download,
  Share2, Settings, Plus, Eye, Edit2, Trash2, AlertCircle,
  CheckCircle, XCircle, Target, Zap, Sparkles, Activity,
  Search, Filter, MoreVertical, Link as LinkIcon, Award, LayoutTemplate
} from 'lucide-react';

interface Meeting {
  id: string;
  meeting_title: string;
  meeting_description: string;
  meeting_type: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  duration_minutes: number | null;
  room_url: string;
  host_name: string;
  status: string;
  tags: string[];
  enable_transcription: boolean;
  enable_ai_summary: boolean;
  created_at: string;
}

interface Participant {
  id: string;
  participant_name: string;
  participant_email: string;
  role: string;
  joined_at: string;
  left_at: string | null;
  speaking_time_seconds: number;
  questions_asked: number;
  reactions_count: number;
  audio_enabled: boolean;
  video_enabled: boolean;
  connection_quality: string;
}

interface Transcript {
  id: string;
  segment_number: number;
  speaker_name: string;
  transcript_text: string;
  start_time_seconds: number;
  end_time_seconds: number;
  sentiment: string | null;
  keywords: string[];
  topics: string[];
  is_question: boolean;
}

interface ActionItem {
  id: string;
  action_item_text: string;
  action_item_type: string;
  assigned_to: string;
  due_date: string;
  priority: string;
  status: string;
  confidence_score: number;
}

interface Summary {
  id: string;
  summary_type: string;
  summary_text: string;
  key_points: string[];
  decisions_made: string[];
  next_steps: string[];
  confidence_score: number;
}

interface Analytics {
  total_participants: number;
  peak_concurrent_participants: number;
  total_speaking_time_seconds: number;
  engagement_score: number;
  participation_balance: number;
  action_items_count: number;
}

interface AIInsight {
  id: string;
  insight_type: string;
  insight_category: string;
  insight_title: string;
  insight_description: string;
  importance_score: number;
  confidence_level: number;
}

export default function MeetingsAI() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [dataLoading, setDataLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [joinedMeeting, setJoinedMeeting] = useState<Meeting | null>(null);

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    loadMeetings();
  }, []);

  useEffect(() => {
    if (selectedMeeting) {
      loadMeetingDetails();
    }
  }, [selectedMeeting]);

  const loadMeetings = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await db
        .from('meetings')
        .select('*')
        
        .order('scheduled_start_time', { ascending: false });
      if (error) throw error;
      const parsedData = (data || []).map((m: any) => ({
        ...m,
        tags: typeof m.tags === 'string' ? JSON.parse(m.tags) : (m.tags || [])
      }));
      
      setMeetings(parsedData);
      if (parsedData.length > 0 && !selectedMeeting) {
        setSelectedMeeting(parsedData[0].id);
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const loadMeetingDetails = async () => {
    if (!selectedMeeting) return;
    await Promise.all([
      loadParticipants(),
      loadTranscripts(),
      loadActionItems(),
      loadSummaries(),
      loadAnalytics(),
      loadAIInsights()
    ]);
  };

  const loadParticipants = async () => {
    if (!selectedMeeting) return;
    try {
      const { data, error } = await db
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', selectedMeeting)
        .order('joined_at', { ascending: false });
      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const loadTranscripts = async () => {
    if (!selectedMeeting) return;
    try {
      const { data, error } = await db
        .from('meeting_transcripts')
        .select('*')
        .eq('meeting_id', selectedMeeting)
        .order('segment_number');
      if (error) throw error;
      const parsedData = (data || []).map((t: any) => ({
        ...t,
        keywords: typeof t.keywords === 'string' ? JSON.parse(t.keywords) : (t.keywords || []),
        topics: typeof t.topics === 'string' ? JSON.parse(t.topics) : (t.topics || [])
      }));
      
      setTranscripts(parsedData);
    } catch (error) {
      console.error('Error loading transcripts:', error);
    }
  };

  const loadActionItems = async () => {
    if (!selectedMeeting) return;
    try {
      const { data, error } = await db
        .from('meeting_action_items')
        .select('*')
        .eq('meeting_id', selectedMeeting)
        .order('priority', { ascending: false });
      if (error) throw error;
      setActionItems(data || []);
    } catch (error) {
      console.error('Error loading action items:', error);
    }
  };

  const loadSummaries = async () => {
    if (!selectedMeeting) return;
    try {
      const { data, error } = await db
        .from('meeting_summaries')
        .select('*')
        .eq('meeting_id', selectedMeeting);
      if (error) throw error;
      const parsedData = (data || []).map((s: any) => ({
        ...s,
        key_points: typeof s.key_points === 'string' ? JSON.parse(s.key_points) : (s.key_points || []),
        decisions_made: typeof s.decisions_made === 'string' ? JSON.parse(s.decisions_made) : (s.decisions_made || []),
        next_steps: typeof s.next_steps === 'string' ? JSON.parse(s.next_steps) : (s.next_steps || [])
      }));
      
      setSummaries(parsedData);
    } catch (error) {
      console.error('Error loading summaries:', error);
    }
  };

  const loadAnalytics = async () => {
    if (!selectedMeeting) return;
    try {
      const { data, error } = await db
        .from('meeting_analytics')
        .select('*')
        .eq('meeting_id', selectedMeeting)
        .maybeSingle();
      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadAIInsights = async () => {
    if (!selectedMeeting) return;
    try {
      const { data, error } = await db
        .from('meeting_ai_insights')
        .select('*')
        .eq('meeting_id', selectedMeeting)
        .order('importance_score', { ascending: false });
      if (error) throw error;
      setAIInsights(data || []);
    } catch (error) {
      console.error('Error loading AI insights:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Meetings AI...</p>
        </div>
      </div>
    );
  }

  const currentMeeting = meetings.find(m => m.id === selectedMeeting);
  const upcomingMeetings = meetings.filter(m => m.status === 'scheduled');
  const liveMeetings = meetings.filter(m => m.status === 'live');
  const pastMeetings = meetings.filter(m => m.status === 'ended');

  // Show live meeting room if a meeting is joined
  if (joinedMeeting) {
    return (
      <LiveMeetingRoom
        meetingId={joinedMeeting.id}
        meetingTitle={joinedMeeting.meeting_title}
        onLeave={() => setJoinedMeeting(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Video className="w-8 h-8 text-[#39FF14]" />
              Meetings AI
            </h1>
            <p className="text-gray-400">
              AI-powered meeting platform with real-time transcription, summaries, and insights
            </p>
          </div>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#39FF14] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Schedule Meeting
          </button>
        </div>


      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'upcoming' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Upcoming ({upcomingMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'live' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Play className="w-4 h-4" />
          Live ({liveMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'past' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Past ({pastMeetings.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'templates' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </button>
        {currentMeeting && (
          <>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'transcript' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'summary' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Summary
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'actions' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Actions ({actionItems.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'insights' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Insights
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'analytics' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </>
        )}
      </div>

      {(activeTab === 'upcoming' || activeTab === 'live' || activeTab === 'past') && (
        <div className="grid grid-cols-1 gap-4">
          {(activeTab === 'upcoming' ? upcomingMeetings :
            activeTab === 'live' ? liveMeetings : pastMeetings).map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeeting(meeting.id)}
              className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-all hover:bg-gray-750 ${
                selectedMeeting === meeting.id ? 'ring-2 ring-[#39FF14]' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{meeting.meeting_title}</h3>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      meeting.status === 'live' ? 'bg-green-500/20 text-green-400 animate-pulse' :
                      meeting.status === 'scheduled' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      meeting.status === 'ended' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {meeting.status === 'live' ? 'Live Now' : meeting.status}
                    </span>
                    {meeting.enable_ai_summary && (
                      <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] text-xs rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Enabled
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{meeting.meeting_description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {formatTime(meeting.scheduled_start_time)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Host: {meeting.host_name}
                    </span>
                    <span className="flex items-center gap-2">
                      <VideoIcon className="w-4 h-4" />
                      {meeting.meeting_type}
                    </span>
                    {meeting.duration_minutes && (
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {meeting.duration_minutes} min
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {meeting.status === 'live' && (
                    <button
                      onClick={() => setJoinedMeeting(meeting)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Join
                    </button>
                  )}
                  {meeting.status === 'scheduled' && (
                    <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#32e012] transition-colors flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Join Link
                    </button>
                  )}
                </div>
              </div>
              {meeting.tags && meeting.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {meeting.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'transcript' && currentMeeting && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#39FF14]" />
                Real-Time Transcript
              </h3>
              <div className="flex gap-2">
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transcripts.map((transcript) => (
                <div
                  key={transcript.id}
                  className="bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{transcript.speaker_name}</span>
                      <span className="text-xs text-gray-400">
                        {formatDuration(transcript.start_time_seconds)}
                      </span>
                      {transcript.sentiment && (
                        <span className={`px-2 py-1 text-xs rounded ${
                          transcript.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                          transcript.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {transcript.sentiment}
                        </span>
                      )}
                      {transcript.is_question && (
                        <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] text-xs rounded">
                          Question
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-200 mb-2">{transcript.transcript_text}</p>
                  {transcript.keywords && transcript.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {transcript.keywords.map((keyword, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-600 text-gray-300 text-xs rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'summary' && currentMeeting && summaries.length > 0 && (
        <div className="space-y-4">
          {summaries.map((summary) => (
            <div key={summary.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#39FF14]" />
                  AI-Generated Summary
                  <span className="text-sm text-gray-400 font-normal ml-2">
                    ({summary.summary_type})
                  </span>
                </h3>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-400">
                    {(summary.confidence_score * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Summary</h4>
                  <p className="text-gray-200 leading-relaxed">{summary.summary_text}</p>
                </div>

                {summary.key_points && summary.key_points.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Points</h4>
                    <ul className="space-y-2">
                      {summary.key_points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-200">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.decisions_made && summary.decisions_made.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Decisions Made</h4>
                    <ul className="space-y-2">
                      {summary.decisions_made.map((decision, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-200">
                          <Zap className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                          {decision}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.next_steps && summary.next_steps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Next Steps</h4>
                    <ul className="space-y-2">
                      {summary.next_steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-200">
                          <Target className="w-4 h-4 text-[#39FF14] mt-1 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'actions' && currentMeeting && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-400" />
                Action Items
              </h3>
              <button className="bg-[#39FF14] text-white px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Action
              </button>
            </div>

            <div className="space-y-3">
              {actionItems.map((action) => (
                <div key={action.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs rounded font-semibold ${
                          action.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                          action.priority === 'high' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          action.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {action.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          action.action_item_type === 'task' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          action.action_item_type === 'decision' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {action.action_item_type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          action.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          action.status === 'in_progress' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {action.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-white mb-2">{action.action_item_text}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Assigned to: {action.assigned_to}</span>
                        <span>Due: {new Date(action.due_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {(action.confidence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-white p-2">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && currentMeeting && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#012419] to-[#024d30] rounded-lg p-6 mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <Brain className="w-7 h-7" />
              AI-Powered Insights
            </h2>
            <p className="text-white/80">
              Intelligent analysis of meeting dynamics, engagement, and outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded ${
                      insight.insight_type === 'topic' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      insight.insight_type === 'sentiment' ? 'bg-green-500/20 text-green-400' :
                      insight.insight_type === 'engagement' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      insight.insight_type === 'recommendation' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-[#39FF14]/20 text-[#39FF14]'
                    }`}>
                      {insight.insight_type === 'topic' && <MessageSquare className="w-5 h-5" />}
                      {insight.insight_type === 'sentiment' && <Activity className="w-5 h-5" />}
                      {insight.insight_type === 'engagement' && <TrendingUp className="w-5 h-5" />}
                      {insight.insight_type === 'recommendation' && <Sparkles className="w-5 h-5" />}
                      {insight.insight_type === 'highlight' && <Zap className="w-5 h-5" />}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold text-white">{insight.insight_title}</h4>
                      <span className="text-xs text-gray-400 capitalize">{insight.insight_type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">
                        {insight.importance_score.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-400">
                        {(insight.confidence_level * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-200">{insight.insight_description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && currentMeeting && analytics && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants
              </h4>
              <div className="text-3xl font-bold text-white mb-1">{analytics.total_participants}</div>
              <div className="text-sm text-gray-400">Peak: {analytics.peak_concurrent_participants}</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Engagement Score
              </h4>
              <div className="text-3xl font-bold text-white mb-1">{analytics.engagement_score.toFixed(1)}</div>
              <div className="text-sm text-gray-400">Out of 10</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h4 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Action Items
              </h4>
              <div className="text-3xl font-bold text-white mb-1">{analytics.action_items_count}</div>
              <div className="text-sm text-gray-400">Generated by AI</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Participation Overview</h3>
            <div className="space-y-4">
              {participants.slice(0, 5).map((participant) => (
                <div key={participant.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{participant.participant_name}</span>
                    <span className="text-gray-400 text-sm">
                      {formatDuration(participant.speaking_time_seconds)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#39FF14]/20 h-2 rounded-full"
                      style={{
                        width: `${(participant.speaking_time_seconds / analytics.total_speaking_time_seconds) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{participant.questions_asked} questions</span>
                    <span>{participant.reactions_count} reactions</span>
                    <span className={`px-2 py-0.5 rounded ${
                      participant.connection_quality === 'excellent' ? 'bg-green-500/20 text-green-400' :
                      participant.connection_quality === 'good' ? 'bg-[#39FF14]/20 text-[#39FF14]' :
                      participant.connection_quality === 'fair' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {participant.connection_quality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <MeetingTemplates />
      )}

      {showScheduleModal && (
        <ScheduleMeeting
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            loadMeetings();
          }}
        />
      )}
    </div>
  );
}
