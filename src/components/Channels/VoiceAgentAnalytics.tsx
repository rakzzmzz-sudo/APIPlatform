import { useEffect, useState } from 'react';
import { db } from '../../lib/db';
import {
  TrendingUp, Phone, Clock, Users, BarChart3, Activity, Brain,
  MessageSquare, Zap, CheckCircle, XCircle, AlertCircle, DollarSign,
  TrendingDown, ArrowUp, ArrowDown
} from 'lucide-react';

interface VoiceAgentAnalyticsProps {
  agentId: string;
}

export default function VoiceAgentAnalytics({ agentId }: VoiceAgentAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
      loadAnalytics();
    }
  }, [agentId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data: analyticsData, error: analyticsError } = await db
        .from('voice_agent_analytics_daily')
        .select('*')
        .eq('agent_id', agentId)
        .order('analytics_date', { ascending: false })
        .limit(30);

      if (analyticsError) throw analyticsError;

      setAnalytics(analyticsData || []);

      if (analyticsData && analyticsData.length > 0) {
        const totalCalls = analyticsData.reduce((sum: number, day: any) => sum + day.total_calls, 0);
        const successfulCalls = analyticsData.reduce((sum: number, day: any) => sum + day.successful_calls, 0);
        const totalDuration = analyticsData.reduce((sum: number, day: any) => sum + day.total_call_duration_seconds, 0);
        const positiveSentiment = analyticsData.reduce((sum: number, day: any) => sum + day.positive_sentiment_count, 0);
        const totalCost = analyticsData.reduce((sum: number, day: any) => sum + parseFloat(day.total_cost_usd || 0), 0);

        const today = analyticsData[0];
        const yesterday = analyticsData[1];

        setSummary({
          totalCalls,
          successfulCalls,
          successRate: (successfulCalls / totalCalls * 100).toFixed(1),
          avgDuration: Math.floor(totalDuration / totalCalls),
          positiveSentimentRate: (positiveSentiment / totalCalls * 100).toFixed(1),
          totalCost: totalCost.toFixed(2),
          todayCallsTrend: today && yesterday ? ((today.total_calls - yesterday.total_calls) / yesterday.total_calls * 100).toFixed(1) : 0,
          todaySuccessRateTrend: today && yesterday ?
            (((today.successful_calls / today.total_calls) - (yesterday.successful_calls / yesterday.total_calls)) * 100).toFixed(1) : 0
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Voice Agent Analytics</h2>
        <p className="text-gray-400 text-sm">Comprehensive performance metrics and insights</p>
      </div>

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Phone className="w-8 h-8 text-white/80" />
                <div className={`flex items-center gap-1 text-sm ${
                  parseFloat(summary.todayCallsTrend) >= 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {parseFloat(summary.todayCallsTrend) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(parseFloat(summary.todayCallsTrend))}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{summary.totalCalls.toLocaleString()}</div>
              <div className="text-[#39FF14] text-sm">Total Calls (30 days)</div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-white/80" />
                <div className={`flex items-center gap-1 text-sm ${
                  parseFloat(summary.todaySuccessRateTrend) >= 0 ? 'text-green-300' : 'text-red-300'
                }`}>
                  {parseFloat(summary.todaySuccessRateTrend) >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(parseFloat(summary.todaySuccessRateTrend))}%
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{summary.successRate}%</div>
              <div className="text-green-100 text-sm">Success Rate</div>
            </div>

            <div className="bg-gradient-to-br from-[#39FF14]/20 to-[#32e012]/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{Math.floor(summary.avgDuration / 60)}m {summary.avgDuration % 60}s</div>
              <div className="text-white/80 text-sm">Avg Call Duration</div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-white/80" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{summary.positiveSentimentRate}%</div>
              <div className="text-[#39FF14]/80 text-sm">Positive Sentiment</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#39FF14]" />
                Call Volume Trend
              </h3>
              <div className="space-y-2">
                {analytics.slice(0, 7).reverse().map((day, index) => {
                  const maxCalls = Math.max(...analytics.slice(0, 7).map((d: any) => d.total_calls));
                  const width = (day.total_calls / maxCalls * 100).toFixed(0);

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <span className="text-gray-400">
                          {new Date(day.analytics_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-white font-semibold">{day.total_calls} calls</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#39FF14] to-[#32e012] transition-all duration-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#39FF14]" />
                Sentiment Distribution
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-300">Positive</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {analytics.length > 0 ? (
                        (analytics.reduce((sum: number, day: any) => sum + day.positive_sentiment_count, 0) / summary.totalCalls * 100).toFixed(1)
                      ) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${summary.positiveSentimentRate}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm text-gray-300">Neutral</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {analytics.length > 0 ? (
                        (analytics.reduce((sum: number, day: any) => sum + day.neutral_sentiment_count, 0) / summary.totalCalls * 100).toFixed(1)
                      ) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gray-500 to-gray-600"
                      style={{ width: `${analytics.length > 0 ? (analytics.reduce((sum: number, day: any) => sum + day.neutral_sentiment_count, 0) / summary.totalCalls * 100).toFixed(1) : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-300">Negative</span>
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {analytics.length > 0 ? (
                        (analytics.reduce((sum: number, day: any) => sum + day.negative_sentiment_count, 0) / summary.totalCalls * 100).toFixed(1)
                      ) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600"
                      style={{ width: `${analytics.length > 0 ? (analytics.reduce((sum: number, day: any) => sum + day.negative_sentiment_count, 0) / summary.totalCalls * 100).toFixed(1) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Top Intents
              </h3>
              <div className="space-y-3">
                {analytics.slice(0, 5).map((day, index) => (
                  day.most_detected_intent && (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{day.most_detected_intent}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(day.analytics_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#39FF14]" />
                Conversation Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Avg Turns per Call</span>
                  <span className="text-sm font-semibold text-white">
                    {analytics.length > 0 ? (
                      (analytics.reduce((sum: number, day: any) => sum + day.average_turns_per_call, 0) / analytics.length).toFixed(1)
                    ) : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Interruptions</span>
                  <span className="text-sm font-semibold text-white">
                    {analytics.reduce((sum: number, day: any) => sum + day.total_interruptions, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Avg Response Time</span>
                  <span className="text-sm font-semibold text-white">
                    {analytics.length > 0 ? (
                      (analytics.reduce((sum: number, day: any) => sum + day.average_response_time_ms, 0) / analytics.length).toFixed(0)
                    ) : 0}ms
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Usage & Cost
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Cost</span>
                  <span className="text-lg font-bold text-green-400">${summary.totalCost}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Cost per Call</span>
                  <span className="text-sm font-semibold text-white">
                    ${(parseFloat(summary.totalCost) / summary.totalCalls).toFixed(3)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Tokens</span>
                  <span className="text-sm font-semibold text-white">
                    {(analytics.reduce((sum: number, day: any) => sum + day.total_tokens_used, 0) / 1000).toFixed(1)}K
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#39FF14]" />
              Daily Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Calls</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Success</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Avg Duration</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Sentiment</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.slice(0, 10).map((day, index) => (
                    <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(day.analytics_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right text-white font-semibold">{day.total_calls}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-green-400">{((day.successful_calls / day.total_calls) * 100).toFixed(0)}%</span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        {Math.floor(day.average_call_duration_seconds / 60)}:{String(day.average_call_duration_seconds % 60).padStart(2, '0')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`${
                          day.average_sentiment_score >= 0.6 ? 'text-green-400' :
                          day.average_sentiment_score >= 0.4 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {(day.average_sentiment_score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300">
                        ${parseFloat(day.total_cost_usd || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!summary && (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">Analytics data will appear here once calls are made</p>
        </div>
      )}
    </div>
  );
}
