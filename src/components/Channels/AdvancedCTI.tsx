import React from 'react';
import { Zap, MessageSquare, Mail, Phone, Eye, Mic, Users, BarChart3, Target, PhoneForwarded, Shield, Clock, CheckCircle, XCircle, Play, Pause, PhoneCall } from 'lucide-react';

interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  condition_type: string;
  routing_action: string;
  routing_target: string;
  is_active: boolean;
}

interface OmnichannelSession {
  id: string;
  session_type: 'voice' | 'whatsapp' | 'chat' | 'email' | 'sms';
  session_data: any;
  status: string;
  started_at: string;
  ended_at?: string;
  contact?: {
    first_name: string;
    last_name: string;
  };
}

interface DialerCampaign {
  id: string;
  name: string;
  dialer_mode: 'predictive' | 'preview' | 'progressive' | 'manual';
  concurrent_calls: number;
  status: string;
  stats: any;
}

interface AgentSkill {
  id: string;
  skill_name: string;
  skill_level: number;
}

interface IVRDataCollection {
  id: string;
  caller_id: string;
  collected_data: any;
  collected_at: string;
}

interface AdvancedCTIProps {
  routingRules: RoutingRule[];
  omnichannelSessions: OmnichannelSession[];
  dialerCampaigns: DialerCampaign[];
  agentSkills: AgentSkill[];
  ivrData: IVRDataCollection | null;
  supervisorMode: 'monitor' | 'whisper' | 'barge' | null;
  selectedView: 'routing' | 'omnichannel' | 'dialer' | 'supervisor';
  onViewChange: (view: 'routing' | 'omnichannel' | 'dialer' | 'supervisor') => void;
  onSupervisorModeChange: (mode: 'monitor' | 'whisper' | 'barge' | null) => void;
  onCampaignAction: (campaignId: string, action: 'start' | 'pause') => void;
}

export default function AdvancedCTI({
  routingRules,
  omnichannelSessions,
  dialerCampaigns,
  agentSkills,
  ivrData,
  supervisorMode,
  selectedView,
  onViewChange,
  onSupervisorModeChange,
  onCampaignAction
}: AdvancedCTIProps) {

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'voice': return <Phone className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Phone className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const getDialerModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      predictive: 'Predictive',
      preview: 'Preview',
      progressive: 'Progressive',
      manual: 'Manual'
    };
    return labels[mode] || mode;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => onViewChange('routing')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedView === 'routing'
              ? 'bg-[#39FF14] text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Zap className="w-5 h-5" />
          Intelligent Routing
        </button>
        <button
          onClick={() => onViewChange('omnichannel')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedView === 'omnichannel'
              ? 'bg-[#39FF14] text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Omnichannel
        </button>
        <button
          onClick={() => onViewChange('dialer')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedView === 'dialer'
              ? 'bg-[#39FF14] text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Target className="w-5 h-5" />
          Dialer Modes
        </button>
        <button
          onClick={() => onViewChange('supervisor')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            selectedView === 'supervisor'
              ? 'bg-[#39FF14] text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          <Shield className="w-5 h-5" />
          Supervisor
        </button>
      </div>

      {selectedView === 'routing' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-7 h-7 text-brand-lime" />
                  Intelligent Routing Rules
                </h3>
                <p className="text-slate-400 mt-1">
                  Automatically route calls based on customer data and business rules
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {routingRules.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No routing rules configured</p>
                </div>
              ) : (
                routingRules.map((rule, index) => (
                  <div key={rule.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-[#39FF14]/20/20 px-3 py-1 rounded text-[#39FF14] font-bold">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{rule.name}</h4>
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="text-slate-400">
                              When <span className="text-brand-lime">{rule.condition_type.replace('_', ' ')}</span>
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="text-slate-400">
                              Route to <span className="text-brand-lime">{rule.routing_target}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {rule.is_active ? (
                          <span className="px-3 py-1 bg-green-500/20 text-brand-lime rounded-full text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-slate-700 text-slate-400 rounded-full text-xs font-medium flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {ivrData && (
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <PhoneForwarded className="w-6 h-6 text-brand-lime" />
                IVR Data Pass-Through
              </h3>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Caller ID</p>
                    <p className="text-sm font-mono text-white">{ivrData.caller_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Collected At</p>
                    <p className="text-sm text-slate-300">
                      {new Date(ivrData.collected_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {Object.keys(ivrData.collected_data || {}).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400 mb-2">Collected Data</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(ivrData.collected_data).map(([key, value]) => (
                        <div key={key} className="bg-slate-700/50 rounded p-2">
                          <p className="text-xs text-slate-400">{key.replace('_', ' ')}</p>
                          <p className="text-sm text-white font-medium">{String(value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {agentSkills.length > 0 && (
            <div className="bg-slate-900 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-brand-lime" />
                Your Agent Skills
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {agentSkills.map((skill) => (
                  <div key={skill.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">{skill.skill_name}</span>
                      <span className="text-xs font-bold text-brand-lime">
                        Level {skill.skill_level}/10
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#39FF14] to-[#32e012] h-2 rounded-full"
                        style={{ width: `${(skill.skill_level / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedView === 'omnichannel' && (
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-brand-lime" />
              Omnichannel Sessions
            </h3>
            <p className="text-slate-400 mt-1">
              Unified view of customer interactions across all channels
            </p>
          </div>

          <div className="space-y-3">
            {omnichannelSessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No omnichannel sessions found</p>
              </div>
            ) : (
              omnichannelSessions.map((session) => (
                <div key={session.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${
                        session.session_type === 'voice' ? 'bg-green-500/20 text-brand-lime' :
                        session.session_type === 'whatsapp' ? 'bg-[#39FF14]/20/20 text-brand-lime' :
                        session.session_type === 'chat' ? 'bg-[#39FF14]/20 text-brand-lime' :
                        session.session_type === 'email' ? 'bg-[#39FF14]/20 text-brand-lime' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {getChannelIcon(session.session_type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {session.contact
                            ? `${session.contact.first_name} ${session.contact.last_name}`
                            : 'Unknown Contact'}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="capitalize">{session.session_type}</span>
                          <span>•</span>
                          <span>
                            <Clock className="w-3 h-3 inline mr-1" />
                            {new Date(session.started_at).toLocaleString()}
                          </span>
                          {session.session_data?.message_count && (
                            <>
                              <span>•</span>
                              <span>{session.session_data.message_count} messages</span>
                            </>
                          )}
                        </div>
                        {session.session_data?.last_message && (
                          <p className="text-sm text-slate-300 mt-2 italic">
                            "{session.session_data.last_message}"
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedView === 'dialer' && (
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Target className="w-7 h-7 text-brand-lime" />
              Outbound Dialer Campaigns
            </h3>
            <p className="text-slate-400 mt-1">
              Automated outbound calling with predictive and preview modes
            </p>
          </div>

          <div className="space-y-4">
            {dialerCampaigns.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No dialer campaigns configured</p>
              </div>
            ) : (
              dialerCampaigns.map((campaign) => (
                <div key={campaign.id} className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{campaign.name}</h4>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="px-2 py-1 bg-[#39FF14]/20/20 text-brand-lime rounded text-xs font-medium">
                          {getDialerModeLabel(campaign.dialer_mode)}
                        </span>
                        <span className="text-slate-400">
                          {campaign.concurrent_calls} concurrent calls
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCampaignAction(campaign.id, campaign.status === 'active' ? 'pause' : 'start')}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                          campaign.status === 'active'
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {campaign.status === 'active' ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Start
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-400 mb-1">Total Calls</p>
                      <p className="text-xl font-bold text-white">
                        {campaign.stats?.total_calls || 0}
                      </p>
                    </div>
                    <div className="bg-green-500/10 rounded p-3">
                      <p className="text-xs text-brand-lime mb-1">Connected</p>
                      <p className="text-xl font-bold text-brand-lime">
                        {campaign.stats?.connected || 0}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-400 mb-1">No Answer</p>
                      <p className="text-xl font-bold text-slate-300">
                        {campaign.stats?.no_answer || 0}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-400 mb-1">Busy</p>
                      <p className="text-xl font-bold text-slate-300">
                        {campaign.stats?.busy || 0}
                      </p>
                    </div>
                    <div className="bg-slate-700/50 rounded p-3">
                      <p className="text-xs text-slate-400 mb-1">Voicemail</p>
                      <p className="text-xl font-bold text-slate-300">
                        {campaign.stats?.voicemail || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="font-semibold text-white mb-3">Dialer Modes Explained</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="bg-[#39FF14]/20/20 p-1 rounded mt-0.5">
                  <PhoneCall className="w-3 h-3 text-brand-lime" />
                </div>
                <div>
                  <span className="font-semibold text-white">Predictive:</span>
                  <span className="text-slate-400 ml-1">
                    Calls multiple numbers simultaneously, connects only when human answers
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-green-500/20 p-1 rounded mt-0.5">
                  <Eye className="w-3 h-3 text-brand-lime" />
                </div>
                <div>
                  <span className="font-semibold text-white">Preview:</span>
                  <span className="text-slate-400 ml-1">
                    Shows customer record first, agent reviews before calling
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'supervisor' && (
        <div className="bg-slate-900 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-7 h-7 text-brand-lime" />
              Supervisor Controls
            </h3>
            <p className="text-slate-400 mt-1">
              Monitor, coach, and assist agents in real-time
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => onSupervisorModeChange(supervisorMode === 'monitor' ? null : 'monitor')}
              className={`p-6 rounded-xl border-2 transition-all ${
                supervisorMode === 'monitor'
                  ? 'border-[#39FF14] bg-[#39FF14]/20/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  supervisorMode === 'monitor' ? 'bg-[#39FF14]/20' : 'bg-slate-700'
                }`}>
                  <Eye className="w-8 h-8 text-brand-lime" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-white mb-1">Monitor</h4>
                  <p className="text-xs text-slate-400">
                    Listen to calls silently without agent or customer knowing
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSupervisorModeChange(supervisorMode === 'whisper' ? null : 'whisper')}
              className={`p-6 rounded-xl border-2 transition-all ${
                supervisorMode === 'whisper'
                  ? 'border-[#39FF14] bg-[#39FF14]/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  supervisorMode === 'whisper' ? 'bg-[#39FF14]/20' : 'bg-slate-700'
                }`}>
                  <Mic className="w-8 h-8 text-[#39FF14]" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-white mb-1">Whisper</h4>
                  <p className="text-xs text-slate-400">
                    Coach agent privately without customer hearing
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => onSupervisorModeChange(supervisorMode === 'barge' ? null : 'barge')}
              className={`p-6 rounded-xl border-2 transition-all ${
                supervisorMode === 'barge'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-lg ${
                  supervisorMode === 'barge' ? 'bg-red-500/20' : 'bg-slate-700'
                }`}>
                  <Users className="w-8 h-8 text-brand-lime" />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-white mb-1">Barge-in</h4>
                  <p className="text-xs text-slate-400">
                    Join call as three-way conference to assist
                  </p>
                </div>
              </div>
            </button>
          </div>

          {supervisorMode && (
            <div className="bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/20 border-2 border-[#39FF14]/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[#39FF14]/20/20 p-2 rounded-lg">
                  {supervisorMode === 'monitor' && <Eye className="w-6 h-6 text-[#39FF14]" />}
                  {supervisorMode === 'whisper' && <Mic className="w-6 h-6 text-[#39FF14]" />}
                  {supervisorMode === 'barge' && <Users className="w-6 h-6 text-red-400" />}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white capitalize">{supervisorMode} Mode Active</h4>
                  <p className="text-slate-300 text-sm">Select an agent to {supervisorMode} their call</p>
                </div>
              </div>
              <div className="text-center text-slate-400 py-8">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active agent calls available</p>
                <p className="text-xs mt-1">When agents are on calls, they will appear here</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}