"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, Wallet, CreditCard, ShoppingCart, X, AlertCircle, User, Settings, LogOut, FileText, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/db';
import { useRouter } from 'next/navigation';

interface PaymentMethod {
  id: string;
  card_type: string;
  last_four: string;
  is_primary: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
}

export default function Header() {
  const router = useRouter();
  
  const onNavigate = (path: string) => {
    // Map existing path keys to routes
    const routeMap: Record<string, string> = {
      'product-catalog': '/product-catalog',
      'support': '/support',
      'billing': '/billing',
      'cart': '/cart',
      'settings': '/settings',
      'documentation': '/documentation',
      'access-management': '/settings',
      'dashboard': '/',
    };
    
    // Check if the path is a direct route matching the key, or use the map
    if (Object.keys(routeMap).includes(path)) {
      router.push(routeMap[path]);
    } else {
       // fallback for direct navigation if path corresponds to a route
       // remove 'bulk_' prefix if it matches sidebar logic
      router.push(`/${path}`);
    }
  };

  const { profile, user, signOut } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadCartCount();
      loadPaymentMethod();
      loadNotifications();

      const channel = db
        .channel('cart-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${user.id}` },
          () => loadCartCount()
        )
        .subscribe();

      return () => {
        db.removeChannel(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCartCount = async () => {
    if (!user) return;

    const { data, error } = await db
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    if (!error && data) {
      const total = data.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const loadPaymentMethod = async () => {
    if (!user) return;

    const { data } = await db
      .from('payment_methods')
      .select('id, card_type, last_four, is_primary')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .maybeSingle();

    if (data) {
      setPaymentMethod(data);
    }
  };

  const loadNotifications = async () => {
    if (!user) return;

    const { data: transactionsData } = await db
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (transactionsData) {
      const notificationsList: Notification[] = transactionsData.map((transaction: any) => ({
        id: transaction.id,
        title: transaction.type === 'credit' ? 'Balance Top Up' : 'Purchase',
        message: `${transaction.description} - RM ${transaction.amount.toFixed(2)}`,
        type: transaction.type === 'credit' ? 'success' : 'info',
        created_at: transaction.created_at,
        read: false
      }));
      setNotifications(notificationsList);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setShowProfileMenu(false);
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleOpenTopUpModal = () => {
    setShowTopUpModal(true);
    setTopUpAmount('');
    setCustomAmount('');
    setError(null);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
    setTopUpAmount('');
    setCustomAmount('');
    setError(null);
  };

  const handleTopUp = async () => {
    if (!user) return;

    if (!paymentMethod) {
      setError('Please add a payment method first');
      setTimeout(() => {
        setShowTopUpModal(false);
        onNavigate('billing');
      }, 2000);
      return;
    }

    const amount = topUpAmount === 'custom' ? parseFloat(customAmount) : parseFloat(topUpAmount);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount < 10) {
      setError('Minimum top-up amount is RM 10.00');
      return;
    }

    setProcessing(true);
    setError(null);

    const { data: profileData } = await db
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    const currentBalance = profileData?.balance || 0;
    const newBalance = currentBalance + amount;

    const transactionRef = `TOPUP-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const { error: transactionError } = await db
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'credit',
        amount: amount,
        balance_after: newBalance,
        description: 'Account Top Up',
        reference: transactionRef,
        metadata: {
          payment_method_id: paymentMethod.id,
          payment_method: `${paymentMethod.card_type} ending in ${paymentMethod.last_four}`
        }
      });

    if (transactionError) {
      setError('Failed to process top-up. Please try again.');
      setProcessing(false);
      return;
    }

    const { error: balanceError } = await db
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (balanceError) {
      setError('Failed to update balance. Please contact support.');
      setProcessing(false);
      return;
    }

    setSuccess(`Successfully added RM ${amount.toFixed(2)} to your account!`);
    setProcessing(false);
    handleCloseTopUpModal();

    window.location.reload();
  };

  return (
    <header className="bg-[#012419] px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg px-4 py-2 inline-flex items-center gap-2 max-w-md shadow-[0_0_10px_rgba(57,255,20,0.1)]">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse shadow-[0_0_8px_#39FF14]"></div>
            <span className="text-[#39FF14] text-sm font-medium tracking-wide">WhatsApp Business API</span>
            <span className="text-slate-400 text-sm">•</span>
            <span className="text-slate-300 text-sm">Now Available!</span>
            <button
              onClick={() => onNavigate('product-catalog')}
              className="ml-auto bg-[#39FF14] hover:bg-[#32e012] text-black text-xs font-bold px-3 py-1 rounded transition-colors shadow-[0_0_10px_rgba(57,255,20,0.4)]"
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('support')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Request Demo
          </button>

          <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700/50">
            <Wallet className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Balance:</span>
            <span className="text-lg font-bold text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
              RM {profile?.balance?.toFixed(2) || '0.00'}
            </span>
            <button
              onClick={() => onNavigate('billing')}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-300 text-xs font-semibold rounded ml-1 transition-colors"
            >
              TRIAL
            </button>
          </div>

          <button
            onClick={handleOpenTopUpModal}
            className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
          >
            <CreditCard className="w-4 h-4" />
            Top Up
          </button>

          <button
            onClick={() => onNavigate('cart')}
            className="relative p-2 text-slate-400 hover:text-[#39FF14] hover:bg-slate-800 rounded-lg transition-all group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#39FF14] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_5px_#39FF14]">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-400 hover:text-[#39FF14] hover:bg-slate-800 rounded-lg transition-all group"
            >
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <span className="text-xs text-slate-400">{notifications.length} recent</span>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${
                            notification.type === 'success' ? 'bg-[#39FF14] text-[#39FF14]' :
                            notification.type === 'error' ? 'bg-red-500 text-red-500' :
                            notification.type === 'warning' ? 'bg-yellow-500 text-yellow-500' :
                            'bg-[#39FF14]/20 text-[#39FF14]'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-white font-medium text-sm group-hover:text-[#39FF14] transition-colors">{notification.title}</p>
                            <p className="text-slate-400 text-xs mt-1">{notification.message}</p>
                            <p className="text-slate-500 text-xs mt-1">{formatNotificationTime(notification.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="bg-slate-800 px-4 py-3 border-t border-slate-700">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('billing');
                      }}
                      className="text-[#39FF14] hover:text-[#32e012] text-sm font-medium transition-colors"
                    >
                      View all transactions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14] to-[#32e012] flex items-center justify-center hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:scale-105 transition-all cursor-pointer border-2 border-[#39FF14]/20"
            >
              <span className="text-black font-bold text-sm">
                {profile?.full_name?.charAt(0) || 'A'}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                  <p className="text-white font-semibold truncate">{profile?.full_name || 'User'}</p>
                  <p className="text-slate-400 text-sm truncate">{profile?.email}</p>
                  <div className="mt-2 inline-block">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                      profile?.role === 'admin' ? 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20' :
                      profile?.role === 'developer' ? 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/20' :
                      'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                      {profile?.role?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-[#39FF14] transition-colors group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-[#39FF14] transition-colors group"
                  >
                    <Settings className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('billing');
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-[#39FF14] transition-colors group"
                  >
                    <CreditCard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Billing</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('documentation');
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-[#39FF14] transition-colors group"
                  >
                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Documentation</span>
                  </button>

                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onNavigate('access-management');
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-[#39FF14] transition-colors group"
                    >
                      <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Admin Panel</span>
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-700">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Top Up Balance</h2>
              <button
                onClick={handleCloseTopUpModal}
                className="text-slate-400 hover:text-white transition-colors hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {paymentMethod ? (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5 text-[#39FF14]" />
                  <span className="text-slate-400 text-sm">Payment Method</span>
                </div>
                <div className="text-white font-medium">
                  {paymentMethod.card_type} ending in {paymentMethod.last_four}
                </div>
                <button
                  onClick={() => {
                    handleCloseTopUpModal();
                    onNavigate('billing');
                  }}
                  className="text-[#39FF14] hover:text-[#32e012] text-xs mt-2 font-medium"
                >
                  Change payment method
                </button>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-400 text-sm font-semibold">No payment method on file</p>
                </div>
                <button
                  onClick={() => {
                    handleCloseTopUpModal();
                    onNavigate('billing');
                  }}
                  className="text-yellow-400 hover:text-yellow-300 text-xs underline"
                >
                  Add payment method
                </button>
              </div>
            )}

            <div className="mb-6">
              <label className="text-white font-semibold mb-3 block">Select Amount</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {['50', '100', '250', '500'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setTopUpAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                      topUpAmount === amount
                        ? 'border-[#39FF14] bg-[#39FF14]/10 text-white shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                        : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-lg font-bold">RM {amount}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setTopUpAmount('custom')}
                className={`w-full py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  topUpAmount === 'custom'
                  ? 'border-[#39FF14] bg-[#39FF14]/10 text-white shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                  : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                Custom Amount
              </button>
              {topUpAmount === 'custom' && (
                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (min RM 10)"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-[#39FF14] transition-colors"
                    min="10"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl animate-shake">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Current Balance:</span>
                <span className="text-white font-semibold">RM {profile?.balance?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Top Up Amount:</span>
                <span className="text-white font-semibold">
                  RM {(topUpAmount === 'custom' ? parseFloat(customAmount) || 0 : parseFloat(topUpAmount) || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-white font-bold">New Balance:</span>
                  <span className="text-[#39FF14] font-bold text-lg drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
                    RM {(
                      (profile?.balance || 0) +
                      (topUpAmount === 'custom' ? parseFloat(customAmount) || 0 : parseFloat(topUpAmount) || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTopUp}
              disabled={processing || !paymentMethod || !topUpAmount || (topUpAmount === 'custom' && !customAmount)}
              className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] active:scale-[0.98]"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Confirm Top Up
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-[#39FF14]/20 border border-[#39FF14]/50 backdrop-blur-sm rounded-xl p-4 max-w-md shadow-[0_0_20px_rgba(57,255,20,0.2)]">
            <div className="flex items-start gap-3">
              <div className="bg-[#39FF14] rounded-full p-1 shadow-[0_0_8px_#39FF14]">
                <svg className="w-5 h-5 text-black" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#39FF14]">Success!</p>
                <p className="text-white text-sm mt-1">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && !showTopUpModal && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-sm rounded-xl p-4 max-w-md shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <div className="flex items-start gap-3">
              <div className="bg-red-500 rounded-full p-1 shadow-[0_0_8px_#ef4444]">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-red-500">Error</p>
                <p className="text-white text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
