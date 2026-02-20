import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Platform } from '../../types/database';
import * as Icons from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function PlatformPerformance() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    loadPlatforms();

    let interval: number | undefined;
    if (isLive) {
      interval = window.setInterval(loadPlatforms, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLive]);

  const loadPlatforms = async () => {
    try {
      const { data, error } = await db
        .from('platforms')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setPlatforms(data || []);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  const getSuccessRateChange = (rate: number): number => {
    const baseRate = 95;
    return Number((rate - baseRate).toFixed(1));
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon || Icons.MessageSquare;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading platforms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          Platform Performance (Real-time)
          {isLive && (
            <span className="flex items-center gap-2 text-sm font-normal text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live data sync
            </span>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const Icon = getIconComponent(platform.icon);
          const change = getSuccessRateChange(platform.success_rate);

          return (
            <div
              key={platform.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{platform.name}</h3>
                    <p className="text-sm text-slate-400">{platform.total_campaigns} campaigns</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{platform.success_rate.toFixed(1)}%</div>
                  <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change >= 0 ? '+' : ''}{change}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-white font-medium">{platform.success_rate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-900/50 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${platform.success_rate}%`,
                        backgroundColor: platform.color,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2 border-t border-slate-700">
                  <span className="text-slate-400 text-sm">Total Messages</span>
                  <span className="text-white font-semibold">{formatNumber(platform.total_messages)}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Last sync</span>
                  <span>{formatTimeAgo(platform.last_sync)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {platforms.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">No active platforms found</p>
          <p className="text-slate-500 text-sm mt-2">Platforms will appear here once configured</p>
        </div>
      )}
    </div>
  );
}
