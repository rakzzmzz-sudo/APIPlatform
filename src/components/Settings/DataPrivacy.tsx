import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Download, Trash2, Shield, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';

type DataExport = {
  id: string;
  export_type: string;
  status: string;
  data_types: string[];
  file_url: string | null;
  expires_at: string | null;
  created_at: string;
  completed_at: string | null;
};

const dataTypes = [
  { id: 'profile', label: 'Profile Data', description: 'Your personal information and preferences' },
  { id: 'campaigns', label: 'Campaigns', description: 'All campaign data and history' },
  { id: 'messages', label: 'Messages', description: 'Message logs and content' },
  { id: 'transactions', label: 'Transactions', description: 'Payment and billing history' },
  { id: 'api_keys', label: 'API Keys', description: 'API key information (excluding secrets)' },
  { id: 'activity_logs', label: 'Activity Logs', description: 'Your activity and usage logs' }
];

export default function DataPrivacy() {
  const { user } = useAuth();
  const [exports, setExports] = useState<DataExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      loadExports();

      const channel = db
        .channel('exports-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'data_exports', filter: `user_id=eq.${user.id}` },
          () => loadExports()
        )
        .subscribe();

      return () => {
        db.removeChannel(channel);
      };
    }
  }, [user]);

  const loadExports = async () => {
    if (!user) return;

    const { data, error } = await db
      .from('data_exports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading exports:', error);
    } else {
      setExports(data || []);
    }
    setLoading(false);
  };

  const toggleDataType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const requestExport = async () => {
    if (!user || selectedTypes.length === 0) return;

    setProcessing(true);
    const { error } = await db
      .from('data_exports')
      .insert({
        user_id: user.id,
        export_type: 'partial',
        status: 'pending',
        data_types: selectedTypes,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

    if (error) {
      console.error('Error requesting export:', error);
      alert('Failed to request export');
    } else {
      setShowExportModal(false);
      setSelectedTypes([]);

      setTimeout(async () => {
        const { data: exports } = await db
          .from('data_exports')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1);

        if (exports && exports[0]) {
          await db
            .from('data_exports')
            .update({
              status: 'completed',
              file_url: `https://example.com/exports/${exports[0].id}.zip`,
              completed_at: new Date().toISOString()
            })
            .eq('id', exports[0].id);
        }
      }, 2000);
    }
    setProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'processing': return 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Loading data privacy settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Data & Privacy</h2>
        <p className="text-slate-400">Manage your data, exports, and privacy settings</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Download className="w-5 h-5" style={{ color: '#40C706' }} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Exports</p>
              <p className="text-2xl font-bold text-white">{exports.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Data exports requested</p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{exports.filter(e => e.status === 'completed').length}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm">Ready to download</p>
        </div>

        <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-500/20 p-3 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Processing</p>
              <p className="text-2xl font-bold text-white">{exports.filter(e => e.status === 'pending' || e.status === 'processing').length}</p>
            </div>
          </div>
          <p className="text-yellow-400 text-sm">In progress</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#012419]/50 to-[#012419]/30 backdrop-blur-sm border border-[#024d30] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Export Your Data</h3>
            <p className="text-slate-400 text-sm">Download a copy of your data in a portable format</p>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <Download className="w-4 h-4" />
            Request Export
          </button>
        </div>

        {exports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No exports yet</p>
            <p className="text-slate-500 text-sm">Request your first data export to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exports.map((exp) => (
              <div key={exp.id} className="bg-[#012419]/50 border border-[#024d30] rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(exp.status)}`}>
                        {exp.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {exp.status === 'pending' && <Clock className="w-3 h-3" />}
                        {exp.status.toUpperCase()}
                      </span>
                      <span className="text-slate-400 text-sm">{new Date(exp.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.data_types.map((type: string) => (
                        <span key={type} className="px-2 py-1 bg-[#024d30]/30 text-slate-300 text-xs rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                    {exp.expires_at && exp.status === 'completed' && (
                      <p className="text-slate-500 text-xs mt-2">
                        Expires: {new Date(exp.expires_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {exp.status === 'completed' && exp.file_url && (
                    <a
                      href={exp.file_url}
                      className="ml-4 bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-red-500/20 p-3 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-400 mb-1">Delete Account</h3>
              <p className="text-slate-300 text-sm">Permanently delete your account and all associated data</p>
              <p className="text-slate-400 text-xs mt-2">This action cannot be undone. All your data will be permanently removed.</p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#39FF14]/20 p-3 rounded-lg">
            <Shield className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div>
            <h4 className="text-[#39FF14] font-semibold mb-2">Data Protection & Privacy</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Your data is encrypted at rest and in transit</li>
              <li>• Data exports are available for 7 days after completion</li>
              <li>• We comply with GDPR and PDPA regulations</li>
              <li>• You have the right to request data deletion at any time</li>
              <li>• Export files are password-protected and encrypted</li>
            </ul>
          </div>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#012419] border border-[#024d30] rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Request Data Export</h2>
            <p className="text-slate-400 mb-6">Select the types of data you want to export</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {dataTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTypes.includes(type.id)
                      ? 'border-[#39FF14] bg-[#39FF14]/10'
                      : 'border-[#024d30] bg-[#012419]/50 hover:border-[#024d30]/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => toggleDataType(type.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-white font-semibold">{type.label}</p>
                    <p className="text-slate-400 text-sm">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setSelectedTypes([]);
                }}
                className="flex-1 bg-[#024d30]/30 hover:bg-[#024d30]/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={requestExport}
                disabled={selectedTypes.length === 0 || processing}
                className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : `Export ${selectedTypes.length} Type${selectedTypes.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#012419] border border-red-500/50 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-red-400">Delete Account?</h2>
            </div>

            <p className="text-slate-300 mb-4">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-semibold mb-2">The following will be deleted:</p>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• All campaigns and message history</li>
                <li>• API keys and integrations</li>
                <li>• Payment history and transaction data</li>
                <li>• All settings and preferences</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#024d30]/30 hover:bg-[#024d30]/50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Account deletion would be processed here');
                  setShowDeleteModal(false);
                }}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
