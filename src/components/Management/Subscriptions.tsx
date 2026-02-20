import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import {
  CreditCard, Package, Calendar, TrendingUp, CheckCircle, XCircle,
  AlertCircle, RefreshCw, Download, Clock, Award, Zap, Shield,
  Users, Activity, Tag, Gift, BarChart3, Info
} from 'lucide-react';

export default function Subscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionsAndOffers();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const subscriptionsChannel = db
      .channel('user-subscriptions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadSubscriptionsAndOffers();
        }
      )
      .subscribe();

    const offersChannel = db
      .channel('user-offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_offers',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadSubscriptionsAndOffers();
        }
      )
      .subscribe();

    return () => {
      db.removeChannel(subscriptionsChannel);
      db.removeChannel(offersChannel);
    };
  }, [user]);

  const loadSubscriptionsAndOffers = async () => {
    try {
      const { data: subsData, error: subsError } = await db
        .from('user_subscriptions')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      const { data: offersData, error: offersError } = await db
        .from('user_offers')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('expires_at', { ascending: true });

      if (offersError) throw offersError;

      setSubscriptions(subsData || []);
      setOffers(offersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Active
          </span>
        );
      case 'expired':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Expired
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  const calculateDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalSpending = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#012419]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#39FF14] animate-spin" />
          <div className="text-slate-400">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#012419] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <CreditCard className="w-10 h-10 text-[#39FF14]" />
          My Subscriptions
        </h1>
        <p className="text-slate-400">Manage your subscriptions, licenses, and offers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <Package className="w-6 h-6 text-[#39FF14]" />
            </div>
            <TrendingUp className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeSubscriptions.length}</div>
          <div className="text-slate-400 text-sm">Active Subscriptions</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">RM {totalSpending.toFixed(2)}</div>
          <div className="text-slate-400 text-sm">Monthly Spending</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <Gift className="w-6 h-6 text-[#39FF14]" />
            </div>
            <span className="text-[#39FF14] text-sm font-semibold">NEW</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{offers.length}</div>
          <div className="text-slate-400 text-sm">Available Offers</div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-[#39FF14]/20 rounded-lg">
              <Award className="w-6 h-6 text-[#39FF14]" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {subscriptions.filter(s => s.license_key).length}
          </div>
          <div className="text-slate-400 text-sm">Active Licenses</div>
        </div>
      </div>

      {offers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#39FF14]" />
            Special Offers for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                    <Tag className="w-6 h-6 text-[#39FF14]" />
                  </div>
                  <span className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-xs font-bold">
                    {offer.discount_percentage}% OFF
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{offer.offer_name}</h3>
                <p className="text-slate-400 text-sm mb-4">{offer.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Expires: {formatDate(offer.expires_at)}</span>
                  <button className="px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-white rounded-lg text-xs font-medium transition-colors">
                    Redeem Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Active Subscriptions</h2>
      </div>

      <div className="space-y-4">
        {subscriptions.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">No subscriptions found</p>
            <p className="text-slate-500 text-sm">Subscribe to products to get started</p>
          </div>
        ) : (
          subscriptions.map((subscription) => {
            const daysRemaining = calculateDaysRemaining(subscription.expires_at);
            const usagePercent = calculateUsagePercentage(
              subscription.usage_count || 0,
              subscription.usage_limit || 0
            );

            return (
              <div
                key={subscription.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-[#39FF14]/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                      <Package className="w-8 h-8 text-[#39FF14]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {subscription.product?.name || subscription.product_name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        {subscription.product?.description || 'Premium subscription'}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          Started: {formatDate(subscription.started_at)}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(subscription.status)}
                    <div className="text-2xl font-bold text-white mt-3">
                      RM {parseFloat(subscription.amount).toFixed(2)}
                    </div>
                    <div className="text-slate-400 text-sm">per {subscription.billing_cycle}</div>
                  </div>
                </div>

                {subscription.usage_limit && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Usage</span>
                      <span className="text-white font-medium">
                        {subscription.usage_count?.toLocaleString() || 0} / {subscription.usage_limit?.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          usagePercent >= 90
                            ? 'bg-red-500'
                            : usagePercent >= 70
                            ? 'bg-[#39FF14]'
                            : 'bg-[#39FF14]'
                        }`}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {subscription.license_key && (
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-sm text-slate-400 mb-1">License Key</div>
                          <div className="font-mono text-white text-sm">{subscription.license_key}</div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Download className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#39FF14]/20/20 rounded-lg">
                      <Activity className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Status</div>
                      <div className="text-sm text-white font-medium capitalize">{subscription.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Renewal Date</div>
                      <div className="text-sm text-white font-medium">{formatDate(subscription.expires_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                      <Zap className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Auto Renew</div>
                      <div className="text-sm text-white font-medium">
                        {subscription.auto_renew ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 px-4 py-2 bg-[#39FF14] hover:bg-[#32e012] text-black rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Usage
                  </button>
                  <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Manage Subscription
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors">
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
