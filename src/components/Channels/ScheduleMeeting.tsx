import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import {
  Calendar, Clock, Link as LinkIcon, Hash, Video, FileText,
  Globe, Languages, Users, Mic, Volume2, Radio, Activity,
  CheckCircle, AlertCircle, Upload, X, Info
} from 'lucide-react';

interface MeetingTemplate {
  id: string;
  template_name: string;
  template_category: string;
}

interface ScheduleMeetingProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleMeeting({ onClose, onSuccess }: ScheduleMeetingProps) {

  const [formData, setFormData] = useState({
    meetingTitle: '',
    description: '',
    meetingLink: '',
    referenceId: '',
    meetingDate: '',
    meetingTime: '',
    meetingPlatform: 'direct_recording',
    documentTemplateId: '',
    documentLanguage: 'english',
    transcriptionLanguage: 'auto-detect',
    enableTranslation: false,
    participantEmails: [] as string[],
  });

  const [audioSettings, setAudioSettings] = useState({
    liveTranscription: true,
    microphoneDevice: 'default',
    speakerDiarization: true,
    languageEnhancement: true,
    echoCancellation: false,
    volumeNormalization: false,
    voiceIsolation: false,
    noiseReductionLevel: 'medium',
  });

  const [templates, setTemplates] = useState<MeetingTemplate[]>([]);
  const [participantEmail, setParticipantEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recordingMode, setRecordingMode] = useState<'ready' | 'recording' | 'uploading'>('ready');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await db
        .from('meeting_templates')
        .select('id, template_name, template_category')
        .order('template_name');

      if (error) throw error;
      setTemplates(data || []);

      if (data && data.length > 0) {
        const defaultTemplate = data.find((t: any) => t.template_name.includes('Board'));
        if (defaultTemplate) {
          setFormData(prev => ({ ...prev, documentTemplateId: defaultTemplate.id }));
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAudioSettingChange = (field: string, value: any) => {
    setAudioSettings(prev => ({ ...prev, [field]: value }));
  };

  const addParticipant = () => {
    if (participantEmail && participantEmail.includes('@')) {
      if (!formData.participantEmails.includes(participantEmail)) {
        setFormData(prev => ({
          ...prev,
          participantEmails: [...prev.participantEmails, participantEmail]
        }));
      }
      setParticipantEmail('');
    }
  };

  const removeParticipant = (email: string) => {
    setFormData(prev => ({
      ...prev,
      participantEmails: prev.participantEmails.filter(e => e !== email)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.meetingTitle) {
      setError('Meeting title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let scheduledStartTime = null;
      if (formData.meetingDate && formData.meetingTime) {
        scheduledStartTime = new Date(`${formData.meetingDate}T${formData.meetingTime}`).toISOString();
      }

      const { data: meeting, error: meetingError } = await db
        .from('meetings')
        .insert({
              meeting_title: formData.meetingTitle,
          meeting_description: formData.description || null,
          meeting_type: 'scheduled',
          meeting_link: formData.meetingLink || null,
          reference_id: formData.referenceId || null,
          scheduled_start_time: scheduledStartTime,
          meeting_platform: formData.meetingPlatform,
          document_template_id: formData.documentTemplateId || null,
          document_language: formData.documentLanguage,
          transcription_language: formData.transcriptionLanguage,
          enable_translation: formData.enableTranslation,
          translation_target_language: formData.enableTranslation ? 'english' : null,
          participant_emails: formData.participantEmails.length > 0 ? formData.participantEmails : null,
          meeting_status: 'scheduled',
        })
        .select()
        .single();

      if (meetingError) throw meetingError;

      const { error: audioError } = await db
        .from('meeting_audio_settings')
        .insert({
          meeting_id: meeting.id,
              live_transcription_enabled: audioSettings.liveTranscription,
          microphone_device: audioSettings.microphoneDevice,
          websocket_transcription_enabled: true,
          speaker_diarization_enabled: audioSettings.speakerDiarization,
          language_enhancement_enabled: audioSettings.languageEnhancement,
          echo_cancellation_enabled: audioSettings.echoCancellation,
          volume_normalization_enabled: audioSettings.volumeNormalization,
          voice_isolation_enabled: audioSettings.voiceIsolation,
          noise_reduction_level: audioSettings.noiseReductionLevel,
        });

      if (audioError) throw audioError;

      if (formData.participantEmails.length > 0) {
        const participantRecords = formData.participantEmails.map(email => ({
          meeting_id: meeting.id,
          participant_email: email,
          notify_on_transcript: true,
        }));

        const { error: participantsError } = await db
          .from('meeting_participants_list')
          .insert(participantRecords);

        if (participantsError) throw participantsError;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      setError(error.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-6 max-w-6xl w-full my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Schedule New Meeting</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Weekly Team Sync, Client Discovery Call"
                value={formData.meetingTitle}
                onChange={(e) => handleInputChange('meetingTitle', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                placeholder="Brief overview of the meeting objective..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Meeting Link/ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://zoom.us/j/123456789 or Meeting ID"
                  value={formData.meetingLink}
                  onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Reference ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Internal ID or code"
                  value={formData.referenceId}
                  onChange={(e) => handleInputChange('referenceId', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Meeting Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Meeting Time (Optional)
                </label>
                <input
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Meeting Platform
                </label>
                <select
                  value={formData.meetingPlatform}
                  onChange={(e) => handleInputChange('meetingPlatform', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  <option value="direct_recording">Direct Recording</option>
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                  <option value="microsoft_teams">Microsoft Teams</option>
                  <option value="webex">Webex</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Document Template
                </label>
                <select
                  value={formData.documentTemplateId}
                  onChange={(e) => handleInputChange('documentTemplateId', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.template_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">Template for meeting minutes document</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Document Language
                </label>
                <select
                  value={formData.documentLanguage}
                  onChange={(e) => handleInputChange('documentLanguage', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  <option value="english">English</option>
                  <option value="malay">Bahasa Melayu</option>
                  <option value="chinese">Chinese</option>
                  <option value="tamil">Tamil</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Language for meeting minutes document</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Transcription Language
                </label>
                <select
                  value={formData.transcriptionLanguage}
                  onChange={(e) => handleInputChange('transcriptionLanguage', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  <option value="auto-detect">Auto-Detect (Recommended for Mixed Languages)</option>
                  <option value="english">English</option>
                  <option value="malay">Bahasa Melayu</option>
                  <option value="chinese">Chinese</option>
                  <option value="mixed">Mixed (English + Bahasa Melayu)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Automatically detect language (supports English + Bahasa Malay mixed conversations)</p>
              </div>
            </div>

            <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.enableTranslation}
                  onChange={(e) => handleInputChange('enableTranslation', e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5"
                />
                <div>
                  <span className="text-white font-medium">Enable Translation to English</span>
                  <p className="text-sm text-[#39FF14] mt-1">
                    Translate non-English speech to English
                  </p>
                  {formData.enableTranslation && (
                    <p className="text-xs text-[#39FF14] mt-2 italic">
                      When enabled, Malay speech will be transcribed in Malay and automatically translated to English
                    </p>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                />
                <button
                  onClick={addParticipant}
                  className="bg-[#39FF14] text-white px-4 py-2 rounded-lg hover:bg-[#32e012] transition-colors"
                >
                  Add
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                ✓ All participants with email addresses will automatically receive a notification when the meeting transcript is ready
              </p>
              {formData.participantEmails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.participantEmails.map((email) => (
                    <span
                      key={email}
                      className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {email}
                      <button
                        onClick={() => removeParticipant(email)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Participants will receive an email with the transcript when the meeting is complete
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-400" />
                  Real-Time Audio Capture
                </h3>
                <label className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Live Transcription</span>
                  <input
                    type="checkbox"
                    checked={audioSettings.liveTranscription}
                    onChange={(e) => handleAudioSettingChange('liveTranscription', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Microphone Device
                </label>
                <select
                  value={audioSettings.microphoneDevice}
                  onChange={(e) => handleAudioSettingChange('microphoneDevice', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                >
                  <option value="default">MacBook Pro Microphone (Built-in)</option>
                  <option value="external">External Microphone</option>
                  <option value="headset">Headset Microphone</option>
                </select>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Real-time WebSocket transcription enabled - powered by Teleaon AI
                </p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Audio Processing Settings
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={audioSettings.speakerDiarization}
                    onChange={(e) => handleAudioSettingChange('speakerDiarization', e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-white font-medium text-sm">Speaker Diarization</span>
                    <p className="text-xs text-gray-400">Identify speakers</p>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={audioSettings.languageEnhancement}
                    onChange={(e) => handleAudioSettingChange('languageEnhancement', e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-white font-medium text-sm">Language Enhancement</span>
                    <p className="text-xs text-gray-400">Context-aware AI</p>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={audioSettings.echoCancellation}
                    onChange={(e) => handleAudioSettingChange('echoCancellation', e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-white font-medium text-sm">Echo Cancellation</span>
                    <p className="text-xs text-gray-400">Remove echo</p>
                  </div>
                </label>

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={audioSettings.volumeNormalization}
                    onChange={(e) => handleAudioSettingChange('volumeNormalization', e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-white font-medium text-sm">Volume Normalization</span>
                    <p className="text-xs text-gray-400">Auto-adjust levels</p>
                  </div>
                </label>
              </div>

              <label className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={audioSettings.voiceIsolation}
                  onChange={(e) => handleAudioSettingChange('voiceIsolation', e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5"
                />
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">Voice Isolation</span>
                  <span className="px-2 py-0.5 bg-[#39FF14] text-black text-xs rounded font-bold">PRO</span>
                  <p className="text-xs text-gray-400">AI voice extraction</p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Noise Reduction Level
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['low', 'medium', 'high', 'aggressive'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleAudioSettingChange('noiseReductionLevel', level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        audioSettings.noiseReductionLevel === level
                          ? 'bg-[#39FF14] text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Mic className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Ready to Record</h3>
              <p className="text-sm text-gray-400 mb-4">
                Recording will be transcribed with speaker identification, action items, and insights
              </p>
              <div className="flex gap-3">
                <button
                  disabled
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Start Recording
                </button>
                <button
                  disabled
                  className="flex-1 bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload File
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Recording features will be available after scheduling
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.meetingTitle}
            className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Scheduling...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Schedule Meeting
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
