import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Phone, Calendar, Award, Video, BarChart2, PhoneCall, Play, Pause, Plus, Edit, Trash2, Eye, Settings, Zap } from 'lucide-react';

type DialerCampaign = {
  id: string;
  campaign_name: string;
  campaign_description: string;
  dialer_type: string;
  status: string;
  target_agents: number;
  max_call_attempts: number;
  created_at: string;
};

type CallList = {
  id: string;
  list_name: string;
  list_description: string;
  total_contacts: number;
  contacted_count: number;
  connected_count: number;
  conversion_count: number;
  status: string;
};

type WEMForecast = {
  id: string;
  forecast_name: string;
  forecast_date: string;
  predicted_volume: number;
  required_agents: number;
  status: string;
};

type WEMSchedule = {
  id: string;
  agent_name: string;
  schedule_date: string;
  shift_type: string;
  total_hours: number;
  status: string;
  adherence_percentage: number;
};

type QualityEvaluation = {
  id: string;
  agent_name: string;
  interaction_date: string;
  evaluation_type: string;
  score_percentage: number;
  passed: boolean;
  evaluator_name: string;
};

type ScreenRecording = {
  id: string;
  agent_name: string;
  recording_start_time: string;
  duration_seconds: number;
  status: string;
  access_level: string;
};

export default function ContactCenterExtended() {
  const [activeTab, setActiveTab] = useState('dialers');
  const [loading, setLoading] = useState(true);

  const [campaigns, setCampaigns] = useState<DialerCampaign[]>([]);
  const [callLists, setCallLists] = useState<CallList[]>([]);
  const [forecasts, setForecasts] = useState<WEMForecast[]>([]);
  const [schedules, setSchedules] = useState<WEMSchedule[]>([]);
  const [evaluations, setEvaluations] = useState<QualityEvaluation[]>([]);
  const [recordings, setRecordings] = useState<ScreenRecording[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCampaigns(),
      fetchCallLists(),
      fetchForecasts(),
      fetchSchedules(),
      fetchEvaluations(),
      fetchRecordings()
    ]);
    setLoading(false);
  };

  const fetchCampaigns = async () => {
    const { data } = await db
      .from('cc_dialer_campaigns')
      .select('*')
      
      .order('created_at', { ascending: false });
    setCampaigns(data || []);
  };

  const fetchCallLists = async () => {
    const { data } = await db
      .from('cc_call_lists')
      .select('*')
      
      .order('created_at', { ascending: false });
    setCallLists(data || []);
  };

  const fetchForecasts = async () => {
    const { data } = await db
      .from('cc_wem_forecasts')
      .select('*')
      
      .order('forecast_date', { ascending: false });
    setForecasts(data || []);
  };

  const fetchSchedules = async () => {
    const { data } = await db
      .from('cc_wem_schedules')
      .select('*')
      
      .order('schedule_date', { ascending: false });
    setSchedules(data || []);
  };

  const fetchEvaluations = async () => {
    const { data } = await db
      .from('cc_wem_quality_evaluations')
      .select('*')
      
      .order('interaction_date', { ascending: false });
    setEvaluations(data || []);
  };

  const fetchRecordings = async () => {
    const { data } = await db
      .from('cc_wem_screen_recordings')
      .select('*')
      
      .order('recording_start_time', { ascending: false });
    setRecordings(data || []);
  };

  const deleteItem = async (table: string, id: string, refreshFn: () => void) => {
    const { error } = await db.from(table).delete().eq('id', id);
    if (!error) refreshFn();
  };

  const toggleCampaignStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const { error } = await db.from('cc_dialer_campaigns').update({ status: newStatus }).eq('id', id);
    if (!error) fetchCampaigns();
  };

  const getDialerBadge = (type: string) => {
    const colors: Record<string, string> = {
      predictive: 'bg-red-500/20 text-red-400',
      power: 'bg-[#39FF14]/20 text-[#39FF14]',
      preview: 'bg-green-500/20 text-green-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400',
      paused: 'bg-yellow-500/20 text-yellow-400',
      draft: 'bg-gray-500/20 text-gray-400',
      completed: 'bg-[#39FF14]/20 text-[#39FF14]',
      scheduled: 'bg-[#39FF14]/20 text-[#39FF14]',
      in_progress: 'bg-[#39FF14]/20 text-[#39FF14]'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Loading...</div></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Outbound & WEM</h1>
        <p className="text-gray-400">Outbound dialer management and workforce engagement</p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('dialers')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'dialers' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <PhoneCall className="w-4 h-4 inline mr-2" />Dialer Campaigns
        </button>
        <button onClick={() => setActiveTab('call-lists')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'call-lists' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Phone className="w-4 h-4 inline mr-2" />Call Lists
        </button>
        <button onClick={() => setActiveTab('forecasting')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'forecasting' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <BarChart2 className="w-4 h-4 inline mr-2" />Forecasting
        </button>
        <button onClick={() => setActiveTab('scheduling')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'scheduling' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Calendar className="w-4 h-4 inline mr-2" />Scheduling
        </button>
        <button onClick={() => setActiveTab('quality')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'quality' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Award className="w-4 h-4 inline mr-2" />Quality Management
        </button>
        <button onClick={() => setActiveTab('recordings')} className={`px-4 py-2 rounded-lg whitespace-nowrap ${activeTab === 'recordings' ? 'bg-[#39FF14] text-white' : 'bg-gray-800 text-gray-300'}`}>
          <Video className="w-4 h-4 inline mr-2" />Screen Recordings
        </button>
      </div>

      {activeTab === 'dialers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Dialer Campaigns</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Campaign
            </button>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{campaign.campaign_name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${getDialerBadge(campaign.dialer_type)}`}>
                        {campaign.dialer_type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{campaign.campaign_description}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Target Agents</div>
                        <div className="text-white font-bold">{campaign.target_agents}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Max Attempts</div>
                        <div className="text-white font-bold">{campaign.max_call_attempts}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Created</div>
                        <div className="text-white">{new Date(campaign.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button onClick={() => toggleCampaignStatus(campaign.id, campaign.status)} className="p-2 hover:bg-gray-700 rounded">
                      {campaign.status === 'active' ? <Pause className="w-4 h-4 text-yellow-400" /> : <Play className="w-4 h-4 text-green-400" />}
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded">
                      <Settings className="w-4 h-4 text-[#39FF14]" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => deleteItem('cc_dialer_campaigns', campaign.id, fetchCampaigns)} className="p-2 hover:bg-gray-700 rounded">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'call-lists' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Call Lists</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create List
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callLists.map((list) => (
              <div key={list.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold">{list.list_name}</h3>
                    <p className="text-gray-400 text-sm">{list.list_description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(list.status)}`}>
                    {list.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Total Contacts</div>
                    <div className="text-white font-bold text-lg">{list.total_contacts}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Contacted</div>
                    <div className="text-[#39FF14] font-bold text-lg">{list.contacted_count}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Connected</div>
                    <div className="text-green-400 font-bold text-lg">{list.connected_count}</div>
                  </div>
                  <div className="bg-gray-700 p-2 rounded">
                    <div className="text-gray-400 text-xs">Conversions</div>
                    <div className="text-[#39FF14] font-bold text-lg">{list.conversion_count}</div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-3">
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <Eye className="w-4 h-4 text-[#39FF14]" />
                  </button>
                  <button className="p-1 hover:bg-gray-700 rounded">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteItem('cc_call_lists', list.id, fetchCallLists)} className="p-1 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'forecasting' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Workforce Forecasting</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Forecast
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Forecast Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Predicted Volume</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Required Agents</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {forecasts.map((forecast) => (
                  <tr key={forecast.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{forecast.forecast_name}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(forecast.forecast_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-[#39FF14] font-bold">{forecast.predicted_volume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">{forecast.required_agents}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(forecast.status)}`}>
                        {forecast.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Eye className="w-4 h-4 text-[#39FF14]" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => deleteItem('cc_wem_forecasts', forecast.id, fetchForecasts)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'scheduling' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Agent Schedules</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />Create Schedule
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Shift</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Hours</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Adherence</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{schedule.agent_name}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(schedule.schedule_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded text-xs font-medium uppercase">
                        {schedule.shift_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{schedule.total_hours}h</td>
                    <td className="px-4 py-3">
                      {schedule.adherence_percentage ? (
                        <span className={`font-bold ${schedule.adherence_percentage >= 95 ? 'text-green-400' : schedule.adherence_percentage >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {schedule.adherence_percentage.toFixed(1)}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => deleteItem('cc_wem_schedules', schedule.id, fetchSchedules)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quality' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Quality Evaluations</h2>
            <button className="px-4 py-2 bg-[#39FF14] text-white rounded-lg hover:bg-[#32e012] flex items-center">
              <Plus className="w-4 h-4 mr-2" />New Evaluation
            </button>
          </div>

          <div className="space-y-3">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl ${evaluation.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {evaluation.score_percentage.toFixed(0)}%
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{evaluation.agent_name}</h3>
                    <div className="text-gray-400 text-sm">
                      {new Date(evaluation.interaction_date).toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${evaluation.evaluation_type === 'ai_auto' ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-[#39FF14]/20 text-[#39FF14]'}`}>
                        {evaluation.evaluation_type === 'ai_auto' ? 'AI Auto' : 'Manual'}
                      </span>
                      {evaluation.evaluator_name && (
                        <span className="text-xs text-gray-400">by {evaluation.evaluator_name}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Eye className="w-4 h-4 text-[#39FF14]" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => deleteItem('cc_wem_quality_evaluations', evaluation.id, fetchEvaluations)} className="p-2 hover:bg-gray-700 rounded">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'recordings' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Screen Recordings</h2>
          </div>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Agent</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Recording Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Access</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recordings.map((recording) => (
                  <tr key={recording.id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-white font-medium">{recording.agent_name}</td>
                    <td className="px-4 py-3 text-gray-300">{new Date(recording.recording_start_time).toLocaleString()}</td>
                    <td className="px-4 py-3 text-white">{Math.floor(recording.duration_seconds / 60)}m {recording.duration_seconds % 60}s</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(recording.status)}`}>
                        {recording.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium uppercase">
                        {recording.access_level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <Play className="w-4 h-4 text-green-400" />
                        </button>
                        <button onClick={() => deleteItem('cc_wem_screen_recordings', recording.id, fetchRecordings)} className="p-1 hover:bg-gray-700 rounded">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
