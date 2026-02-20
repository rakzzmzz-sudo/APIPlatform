import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Building2, Mail, Phone, MapPin, Globe } from 'lucide-react';

type Props = {
  onToggle: () => void;
};

export default function Signup({ onToggle }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyRegistrationNumber, setCompanyRegistrationNumber] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!companyName.trim()) {
      setError('Company name is required');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName, {
      companyName,
      companyRegistrationNumber,
      contactPhone,
      address,
      city,
      country
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-[#39FF14]/20 to-[#32e012]/20 p-3 rounded-xl">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
          <p className="text-slate-400 text-center mb-8">Start building with our CPaaS platform</p>

          <form onSubmit={handleSubmit} className="space-y-5 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 sticky top-0 z-10">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#39FF14]" />
                Personal Information
              </h3>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
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
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <p className="text-slate-500 text-xs mt-1">Must be at least 6 characters</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#39FF14]" />
                Company Information
              </h3>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div>
                <label htmlFor="companyRegistrationNumber" className="block text-sm font-medium text-slate-300 mb-2">
                  Company Registration Number
                </label>
                <input
                  id="companyRegistrationNumber"
                  type="text"
                  value={companyRegistrationNumber}
                  onChange={(e) => setCompanyRegistrationNumber(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-300 mb-2">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                    placeholder="+60 1X-XXXX-XXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                    placeholder="123 Main Street"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-transparent transition-all"
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <button
                onClick={onToggle}
                className="text-[#39FF14] hover:text-[#39FF14] font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
