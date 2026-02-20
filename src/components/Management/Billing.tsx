import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Plus, 
  X, 
  FileText, 
  History, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Search,
  Bell,
  Wallet,
  Settings as SettingsIcon,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import MalaysianInvoiceViewer from './MalaysianInvoiceViewer';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  type: 'topup' | 'usage' | 'subscription' | 'refund';
  channel?: string;
}

interface PaymentMethod {
  id: string;
  card_type: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  cardholder_name: string;
  is_primary: boolean;
}

interface UsageStat {
  channel: string;
  amount: number;
  percentage: number;
  color: string;
}

type BillingTab = 'overview' | 'invoices' | 'payments' | 'history';

export default function Billing() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<BillingTab>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentModalMode, setPaymentModalMode] = useState<'add' | 'update'>('add');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [processingTopUp, setProcessingTopUp] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [autoTopUp, setAutoTopUp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadTransactions();
      loadPaymentMethods();
    }
  }, [user]);

  const loadTransactions = async () => {
    const { data, error } = await db
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      const formattedTransactions = data.map((t: any) => ({
        id: t.id,
        date: t.created_at,
        description: t.description,
        amount: Math.abs(Number(t.amount)),
        status: 'paid' as const,
        type: t.type || 'usage',
        channel: t.channel
      }));
      setTransactions(formattedTransactions);
    }
    setLoading(false);
  };

  const loadPaymentMethods = async () => {
    const { data, error } = await db
      .from('payment_methods')
      .select('*')
      .order('is_primary', { ascending: false });

    if (!error && data) {
      setPaymentMethods(data);
      const primary = data.find((pm: PaymentMethod) => pm.is_primary);
      if (primary) {
        setSelectedPaymentMethod(primary.id);
      }
    }
  };

  const mockTransactions: Transaction[] = [
    { id: '1', date: '2024-12-20', description: 'SMS API Campaign - Year End Sale', amount: 10890.00, status: 'paid', type: 'usage', channel: 'SMS' },
    { id: '2', date: '2024-12-18', description: 'WhatsApp Business API Usage', amount: 8402.50, status: 'paid', type: 'usage', channel: 'WhatsApp' },
    { id: '3', date: '2024-12-15', description: 'AI Voice Agent - Customer Support', amount: 3001.25, status: 'paid', type: 'usage', channel: 'Voice AI' },
    { id: '4', date: '2024-12-10', description: 'RCS Messaging Campaign', amount: 5555.00, status: 'paid', type: 'usage', channel: 'RCS' },
    { id: '5', date: '2024-12-05', description: 'Account Top-up (Manual)', amount: 20000.00, status: 'paid', type: 'topup' },
    { id: '6', date: '2024-11-28', description: 'Monthly Platform Subscription', amount: 999.00, status: 'paid', type: 'subscription' },
    { id: '7', date: '2024-11-25', description: 'Email Marketing Credits', amount: 1550.00, status: 'paid', type: 'usage', channel: 'Email' },
    { id: '8', date: '2024-11-20', description: 'Chatbot AI Training Usage', amount: 4200.00, status: 'paid', type: 'usage', channel: 'Chatbot' }
  ];

  const usageStats: UsageStat[] = [
    { channel: 'WhatsApp', amount: 12450.00, percentage: 45, color: '#39FF14' },
    { channel: 'SMS API', amount: 8600.00, percentage: 30, color: '#32e012' },
    { channel: 'AI Voice', amount: 5200.00, percentage: 15, color: '#2bad0f' },
    { channel: 'Other', amount: 3240.00, percentage: 10, color: '#218a0c' }
  ];

  const displayTransactions = transactions.length > 5 ? transactions : mockTransactions;
  const filteredTransactions = displayTransactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.channel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBalance = profile?.balance || 25420.50; // Use mock if DB is empty
  const totalSpentThisMonth = usageStats.reduce((sum, s) => sum + s.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">
          <CheckCircle2 className="w-3 h-3" /> COMPLETED
        </span>
      );
      case 'pending': return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
          <Clock className="w-3 h-3" /> PENDING
        </span>
      );
      case 'failed': return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle className="w-3 h-3" /> FAILED
        </span>
      );
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topup': return <ArrowDownRight className="w-4 h-4 text-[#39FF14]" />;
      case 'usage': return <ArrowUpRight className="w-4 h-4 text-orange-400" />;
      case 'subscription': return <History className="w-4 h-4 text-cyan-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleOpenPaymentModal = (mode: 'add' | 'update', paymentMethodId?: string) => {
    setPaymentModalMode(mode);
    if (mode === 'update' && paymentMethodId) {
      const pm = paymentMethods.find(p => p.id === paymentMethodId);
      if (pm) {
        setCardNumber(`**** **** **** ${pm.last_four}`);
        setCardName(pm.cardholder_name);
        setExpiryDate(`${pm.expiry_month}/${pm.expiry_year}`);
        setCvv('');
        setSelectedPaymentMethod(paymentMethodId);
      }
    } else {
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      setSelectedPaymentMethod(null);
    }
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setSelectedPaymentMethod(null);
  };

  const getCardIcon = (type: string) => {
    return <CreditCard className="w-6 h-6 text-[#39FF14]" />;
  };

  const handleSubmitPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const [month, year] = expiryDate.split('/');
    const lastFour = cardNumber.replace(/\s/g, '').slice(-4);
    const cardType = cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';

    try {
      if (paymentModalMode === 'update' && selectedPaymentMethod) {
        const { error } = await db
          .from('payment_methods')
          .update({
            card_type: cardType,
            last_four: lastFour,
            expiry_month: month,
            expiry_year: year,
            cardholder_name: cardName,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedPaymentMethod);
        if (error) throw error;
      } else {
        const { error } = await db
          .from('payment_methods')
          .insert({
            user_id: user?.id,
            card_type: cardType,
            last_four: lastFour,
            expiry_month: month,
            expiry_year: year,
            cardholder_name: cardName,
            is_primary: paymentMethods.length === 0
          });
        if (error) throw error;
      }
      loadPaymentMethods();
      handleClosePaymentModal();
    } catch (err) {
      console.error(err);
      alert('Failed to save payment method');
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0 || !selectedPaymentMethod) return;
    setProcessingTopUp(true);
    try {
      const amount = parseFloat(topUpAmount);
      const { error } = await db
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'topup',
          amount: amount,
          description: `Account Top-up - RM ${amount.toFixed(2)}`,
          status: 'completed'
        });
      if (error) throw error;
      alert(`Successfully topped up RM ${amount.toFixed(2)}!`);
      setShowTopUpModal(false);
      setTopUpAmount('');
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert('Failed to process top-up');
    } finally {
      setProcessingTopUp(false);
    }
  };

  const handleViewInvoice = async (transactionId: string) => {
    setGeneratingInvoice(transactionId);
    // Simple mock for now, real logic involves MalaysianInvoiceViewer
    setTimeout(() => {
      setSelectedInvoiceId(transactionId);
      setGeneratingInvoice(null);
    }, 1000);
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#024d30]/40 to-[#013221]/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-2xl p-6 shadow-lg shadow-black/20 group hover:border-[#39FF14]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#39FF14]/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <Wallet className="w-5 h-5 text-[#39FF14]" />
            </div>
            <TrendingUp className="w-4 h-4 text-[#39FF14] opacity-50" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Available Credits</p>
          <p className="text-3xl font-bold text-white tracking-tight">RM {currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-gradient-to-br from-[#024d30]/40 to-[#013221]/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-2xl p-6 shadow-lg shadow-black/20 group hover:border-[#39FF14]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#39FF14]/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5 text-[#39FF14]" />
            </div>
            <TrendingUp className="w-4 h-4 text-[#39FF14] opacity-50" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Spent This Month</p>
          <p className="text-3xl font-bold text-white tracking-tight">RM {totalSpentThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-gradient-to-br from-[#024d30]/40 to-[#013221]/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-2xl p-6 shadow-lg shadow-black/20 group hover:border-[#39FF14]/40 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#39FF14]/10 p-2.5 rounded-xl group-hover:scale-110 transition-transform">
              <History className="w-5 h-5 text-[#39FF14]" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Last Invoice</p>
          <p className="text-3xl font-bold text-white tracking-tight">RM 4,200.00</p>
          <p className="text-[10px] text-[#39FF14] mt-2 font-mono">INV-2024-0012</p>
        </div>

        <div className="bg-gradient-to-br from-[#024d30]/40 to-[#013221]/40 backdrop-blur-sm border border-[#39FF14]/20 rounded-2xl p-6 shadow-lg shadow-black/20 flex flex-col justify-center items-center">
          <button
            onClick={() => setShowTopUpModal(true)}
            className="w-full h-full bg-[#39FF14] hover:bg-[#32e012] text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span className="text-xl">TOP UP</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#012419]/60 border border-[#024d30] rounded-2xl p-8 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#39FF14]" />
              Usage by Channel
            </h3>
            <select className="bg-[#024d30] border border-[#39FF14]/20 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#39FF14]">
              <option>Current Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <div className="space-y-6">
            {usageStats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">{stat.channel}</span>
                  <span className="text-[#39FF14] font-bold">RM {stat.amount.toLocaleString()} ({stat.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-[#013221] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${stat.percentage}%`, 
                      backgroundColor: stat.color,
                      boxShadow: `0 0 10px ${stat.color}80`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#012419]/60 border border-[#024d30] rounded-2xl p-8 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-8">
            <Bell className="w-5 h-5 text-[#39FF14]" />
            Quick Actions & Alerts
          </h3>
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Low Balance Threshold</p>
                <p className="text-slate-400 text-xs mt-1">Your balance is below RM 5,000. Consider topping up to prevent service interruptions.</p>
                <button className="text-orange-400 text-[10px] font-bold mt-2 uppercase tracking-wider hover:underline">Settings</button>
              </div>
            </div>

            <div className="bg-[#39FF14]/10 border border-[#39FF14]/20 p-4 rounded-xl flex items-start gap-4">
              <div className="p-2 bg-[#39FF14]/20 rounded-lg">
                <SettingsIcon className="w-5 h-5 text-[#39FF14]" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Auto Top-Up</p>
                <p className="text-slate-400 text-xs mt-1">Automatically charge RM 1,000 when balance falls below RM 500.</p>
                <div className="flex items-center gap-3 mt-3">
                   <button 
                    onClick={() => setAutoTopUp(!autoTopUp)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${autoTopUp ? 'bg-[#39FF14]' : 'bg-slate-700'}`}
                   >
                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${autoTopUp ? 'left-6' : 'left-1'}`}></div>
                   </button>
                   <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">{autoTopUp ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>
            </div>
            
            <button className="w-full py-4 border-2 border-dashed border-[#024d30] rounded-xl text-slate-500 text-sm font-bold hover:border-[#39FF14]/30 hover:text-[#39FF14] transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              ADD BILLING RECIPIENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="bg-[#012419]/60 border border-[#024d30] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-[#024d30] bg-[#024d30]/20 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Invoice Records</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="bg-[#013221] border border-[#024d30] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#39FF14] w-64"
            />
          </div>
          <button className="p-2 bg-[#024d30] border border-[#39FF14]/20 rounded-lg text-white hover:bg-[#39FF14]/20 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#013221]/30">
              <th className="text-left py-4 px-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Invoice ID</th>
              <th className="text-left py-4 px-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Date</th>
              <th className="text-left py-4 px-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Due Date</th>
              <th className="text-right py-4 px-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Amount</th>
              <th className="text-center py-4 px-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Status</th>
              <th className="text-right py-4 px-6 text-slate-400 font-bold text-[10px] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-[#024d30] hover:bg-[#39FF14]/5 transition-colors group">
                <td className="py-4 px-6 font-mono text-xs text-[#39FF14]">INV-2024-{(12 - i).toString().padStart(4, '0')}</td>
                <td className="py-4 px-6 text-slate-400 text-sm">Dec {20 - i}, 2024</td>
                <td className="py-4 px-6 text-slate-400 text-sm">Jan {19 - i}, 2025</td>
                <td className="py-4 px-6 text-right text-white font-bold">RM {(5000 + i * 1200).toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-[10px] font-bold border border-[#39FF14]/20">PAID</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 bg-[#024d30] border border-[#39FF14]/20 rounded-lg text-white group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#012419]/60 border border-[#024d30] rounded-2xl p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Stored Payment Methods</h3>
            <p className="text-slate-400 text-sm">Manage cards and bank accounts for automatic billing</p>
          </div>
          <button
            onClick={() => handleOpenPaymentModal('add')}
            className="bg-[#39FF14] hover:bg-[#32e012] text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#39FF14]/10 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            ADD METHOD
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="border-2 border-dashed border-[#024d30] rounded-2xl py-20 text-center">
            <CreditCard className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h4 className="text-white font-bold text-lg mb-2">No payment methods found</h4>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">Securely add your primary payment method to ensure continuous service for your API channels.</p>
            <button 
              onClick={() => handleOpenPaymentModal('add')}
              className="text-[#39FF14] font-bold border-b-2 border-transparent hover:border-[#39FF14] transition-all"
            >
              Add your first card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((pm) => (
              <div key={pm.id} className="relative bg-gradient-to-br from-[#024d30] to-[#013221] border border-[#39FF14]/30 rounded-2xl p-6 group hover:border-[#39FF14] transition-all overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-start justify-between relative z-10">
                  <div className="space-y-4">
                    <div className="bg-[#012419] w-12 h-8 rounded border border-[#024d30] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-orange-500 opacity-80 shadow-[6px_0_0_rgb(234,179,8,0.8)]"></div>
                    </div>
                    <div>
                      <p className="text-white font-mono text-lg tracking-widest group-hover:tracking-[0.25em] transition-all">•••• •••• •••• {pm.last_four}</p>
                      <p className="text-slate-400 text-xs font-medium uppercase mt-2 tracking-widest">{pm.cardholder_name}</p>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-slate-500 text-[8px] uppercase font-bold tracking-tighter">Expires</p>
                        <p className="text-white text-sm font-bold font-mono">{pm.expiry_month}/{pm.expiry_year}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[8px] uppercase font-bold tracking-tighter">Type</p>
                        <p className="text-white text-sm font-bold">{pm.card_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {pm.is_primary && (
                      <span className="px-2 py-0.5 bg-[#39FF14] text-black text-[8px] font-black rounded flex items-center gap-1 shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                        <CheckCircle2 className="w-2.5 h-2.5" /> PRIMARY
                      </span>
                    )}
                    <div className="flex gap-1 mt-auto">
                      <button 
                         onClick={() => handleOpenPaymentModal('update', pm.id)}
                        className="p-2 bg-[#012419] border border-[#024d30] rounded-lg text-slate-400 hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-all"
                      >
                        <SettingsIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-[#012419] border border-[#024d30] rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500/50 transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-[#012419]/60 border border-[#024d30] rounded-2xl overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-[#024d30] bg-[#024d30]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Advanced History</h3>
          <p className="text-slate-400 text-xs">Full transparency of your account transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter transactions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#013221] border border-[#024d30] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14] w-full md:w-64 shadow-inner"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#024d30] border border-[#39FF14]/20 rounded-xl text-white font-bold text-xs hover:bg-[#39FF14]/10 transition-all">
            <Download className="w-4 h-4" />
            EXPORT PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#013221]/50">
              <th className="text-left py-4 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Activity</th>
              <th className="text-left py-4 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Description</th>
              <th className="text-left py-4 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Channel</th>
              <th className="text-right py-4 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Amount</th>
              <th className="text-center py-4 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Status</th>
              <th className="text-right py-4 px-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Transaction ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#024d30]/50">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-[#39FF14]/5 transition-all group">
                <td className="py-5 px-6">
                  <div className="w-10 h-10 rounded-xl bg-[#013221] flex items-center justify-center border border-[#024d30] group-hover:border-[#39FF14]/30 transition-all">
                    {getTypeIcon(t.type)}
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="space-y-0.5">
                    <p className="text-white font-bold text-sm group-hover:text-[#39FF14] transition-colors">{t.description}</p>
                    <p className="text-slate-500 text-[10px] flex items-center gap-1.5 uppercase tracking-wider font-bold">
                      <Calendar className="w-3 h-3" />
                      {new Date(t.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </td>
                <td className="py-5 px-6">
                  {t.channel ? (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">{t.channel}</span>
                  ) : (
                    <span className="text-slate-600 text-[10px] font-black italic">---</span>
                  )}
                </td>
                <td className="py-5 px-6 text-right">
                  <p className={`text-sm font-black ${t.type === 'topup' ? 'text-[#39FF14]' : 'text-white'}`}>
                    {t.type === 'topup' ? '+' : '-'} RM {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </td>
                <td className="py-5 px-6">
                   <div className="flex justify-center">
                    {getStatusBadge(t.status)}
                   </div>
                </td>
                <td className="py-5 px-6 text-right font-mono text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors uppercase">
                  TRX-{t.id.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Re-use current modal structure but within the new container logic
  const renderModals = () => (
    <>
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#012419] border border-[#39FF14]/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {paymentModalMode === 'add' ? 'ADD NEW CARD' : 'UPDATE METHOD'}
              </h2>
              <button
                onClick={handleClosePaymentModal}
                className="w-10 h-10 flex items-center justify-center bg-[#013221] rounded-full text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-500 transition-all border border-[#024d30]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPaymentMethod} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    required
                    className="w-full bg-[#013221] border border-[#024d30] rounded-2xl pl-12 pr-4 py-4 text-white font-mono placeholder-slate-700 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cardholder Name</label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="AS WRITTEN ON CARD"
                    required
                    className="w-full bg-[#013221] border border-[#024d30] rounded-2xl pl-12 pr-4 py-4 text-white font-bold uppercase placeholder-slate-700 focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                    className="w-full bg-[#013221] border border-[#024d30] rounded-2xl px-4 py-4 text-white font-mono placeholder-slate-700 focus:outline-none focus:border-[#39FF14] text-center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CVC / CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    required
                    maxLength={4}
                    className="w-full bg-[#013221] border border-[#024d30] rounded-2xl px-4 py-4 text-white font-mono placeholder-slate-700 focus:outline-none focus:border-[#39FF14] text-center tracking-[0.5em]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black font-black py-4 rounded-2xl shadow-lg shadow-[#39FF14]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest mt-4"
              >
                {paymentModalMode === 'add' ? 'INITIALIZE CARD' : 'AUTHORIZE UPDATES'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#012419] border border-[#39FF14]/30 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white tracking-tight">TOP UP CREDITS</h2>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="w-10 h-10 flex items-center justify-center bg-[#013221] rounded-full text-slate-400 hover:text-white transition-all border border-[#024d30]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Amount (RM)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[#39FF14]" />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#013221] border border-[#024d30] rounded-2xl pl-12 pr-4 py-6 text-3xl font-black text-white placeholder-slate-800 focus:outline-none focus:border-[#39FF14] shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[500, 1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className="py-3 bg-[#013221] border border-[#024d30] rounded-xl text-slate-400 font-bold text-xs hover:border-[#39FF14] hover:text-[#39FF14] transition-all"
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                 <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payment Source</label>
                 {paymentMethods.length === 0 ? (
                    <div className="p-4 bg-slate-900/50 border border-dashed border-[#024d30] rounded-2xl text-center">
                        <p className="text-slate-500 text-xs mb-3">No cards found</p>
                        <button onClick={() => { setShowTopUpModal(false); setShowPaymentModal(true); }} className="text-[#39FF14] text-xs font-black uppercase tracking-widest">Connect Card</button>
                    </div>
                 ) : (
                    <div className="space-y-2">
                        {paymentMethods.map(pm => (
                            <button 
                                key={pm.id}
                                onClick={() => setSelectedPaymentMethod(pm.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedPaymentMethod === pm.id ? 'bg-[#39FF14]/10 border-[#39FF14]' : 'bg-[#013221] border-[#024d30] text-slate-400 opacity-60'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-[#39FF14]" />
                                    <span className="font-mono text-sm tracking-widest">•••• {pm.last_four}</span>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === pm.id ? 'border-[#39FF14]' : 'border-slate-700'}`}>
                                    {selectedPaymentMethod === pm.id && <div className="w-2 h-2 rounded-full bg-[#39FF14]"></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                 )}
              </div>

              <button
                onClick={handleTopUp}
                disabled={processingTopUp || !topUpAmount}
                className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black font-black py-5 rounded-2xl shadow-xl shadow-[#39FF14]/10 disabled:opacity-50 disabled:grayscale transition-all text-md uppercase tracking-widest"
              >
                {processingTopUp ? 'VERIFYING TRANSACTION...' : 'AUTHORIZE TRANSACTION'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="flex-1 overflow-auto bg-[#012419] p-8 font-sans selection:bg-[#39FF14] selection:text-black">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Billing <span className="text-[#39FF14]">&</span> Payments</h1>
        <div className="flex items-center gap-2 p-1 bg-[#013221] rounded-2xl border border-[#024d30] shadow-inner">
           {(['overview', 'invoices', 'payments', 'history'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 activeTab === tab 
                   ? 'bg-[#39FF14] text-black shadow-lg shadow-[#39FF14]/10' 
                   : 'text-slate-500 hover:text-white'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="pb-16">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'invoices' && renderInvoices()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {renderModals()}

      {selectedInvoiceId && (
        <MalaysianInvoiceViewer
          invoiceId={selectedInvoiceId}
          onClose={() => setSelectedInvoiceId(null)}
        />
      )}
    </div>
  );
}

// Minimal placeholder for User icon since it wasn't in the initial imports
function User({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
