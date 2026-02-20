import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Info } from 'lucide-react';

export default function Login({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const quickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <div className="flex items-center justify-center mb-8">
            <img src="/image copy.png" alt="CPaaS Platform" className="w-24 h-24 rounded-xl" />
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-center mb-8">Sign in to your CPaaS dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <div className="flex items-start gap-2 mb-3">
              <Info className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-300 mb-1">Demo Credentials</p>
                <p className="text-xs text-slate-400">Click to quick login:</p>
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('admin@cpaas.com', 'admin123')}
                className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-xs text-slate-300 transition-colors"
              >
                <span className="font-semibold text-[#39FF14]">Admin:</span> admin@cpaas.com / admin123
              </button>
              <button
                onClick={() => quickLogin('presales@cpaas.com', 'presales123')}
                className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-xs text-slate-300 transition-colors"
              >
                <span className="font-semibold text-green-400">Presales:</span> presales@cpaas.com / presales123
              </button>
              <button
                onClick={() => quickLogin('sales@cpaas.com', 'sales123')}
                className="w-full text-left px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded text-xs text-slate-300 transition-colors"
              >
                <span className="font-semibold text-[#39FF14]">Sales:</span> sales@cpaas.com / sales123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
