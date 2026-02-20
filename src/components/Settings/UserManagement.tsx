import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { UserPlus, Search, MoreVertical, Shield, Mail, Calendar, Edit2, Trash2, CheckCircle, XCircle, X } from 'lucide-react';

type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  balance: number;
  created_at: string;
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    balance: '0'
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Hardcoded predefined users (matching login credentials)
    const predefinedUsers: User[] = [
      {
        id: 'admin@cpaas.com',
        email: 'admin@cpaas.com',
        full_name: 'Admin User',
        role: 'admin',
        balance: 1000.00,
        created_at: new Date().toISOString(),
      },
      {
        id: 'presales@cpaas.com',
        email: 'presales@cpaas.com',
        full_name: 'Presales User',
        role: 'user',
        balance: 1000.00,
        created_at: new Date().toISOString(),
      },
      {
        id: 'sales@cpaas.com',
        email: 'sales@cpaas.com',
        full_name: 'Sales User',
        role: 'user',
        balance: 1000.00,
        created_at: new Date().toISOString(),
      },
    ];

    try {
      const { data, error } = await db
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If database is not available, just use predefined users
        console.log('Database not available, showing predefined users only');
        setUsers(predefinedUsers);
      } else {
        // Merge predefined users with database users (avoid duplicates)
        const dbUsers = data || [];
        const allUsers = [...predefinedUsers];
        
        // Add database users that aren't in the predefined list
        dbUsers.forEach((dbUser: User) => {
          if (!predefinedUsers.find(pu => pu.email === dbUser.email)) {
            allUsers.push(dbUser);
          }
        });
        
        setUsers(allUsers);
      }
    } catch (err) {
      console.log('Error fetching users, showing predefined users only:', err);
      setUsers(predefinedUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: authData, error: authError } = await db.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await db
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            balance: parseFloat(formData.balance)
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;
      }

      setNotification({
        type: 'success',
        message: 'User added successfully'
      });

      setShowAddModal(false);
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'user',
        balance: '0'
      });

      await fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to add user'
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'developer': return 'bg-[#39FF14]/20/20 text-[#39FF14] border-[#39FF14]/50';
      case 'user': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const { error } = await db
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } else {
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
          <p className="text-slate-400">Manage user accounts, roles, and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="developer">Developer</option>
            <option value="user">User</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Role</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Joined</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Status</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#39FF14] to-[#32e012] flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.full_name || 'N/A'}</div>
                          <div className="text-slate-400 text-sm flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                        <Shield className="w-3 h-3" />
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-emerald-400 font-semibold">RM {user.balance.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">
                        <CheckCircle className="w-3 h-3" />
                        ACTIVE
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors group">
                          <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-[#39FF14]" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#39FF14]/20 p-3 rounded-lg">
              <Shield className="w-5 h-5 text-[#39FF14]" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">All registered users</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500/20 p-3 rounded-lg">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Full access users</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-500/20 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
          <p className="text-emerald-400 text-sm">100% active</p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New User</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({
                    email: '',
                    password: '',
                    full_name: '',
                    role: 'user',
                    balance: '0'
                  });
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="user">User</option>
                  <option value="developer">Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Initial Balance (RM)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      email: '',
                      password: '',
                      full_name: '',
                      role: 'user',
                      balance: '0'
                    });
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#39FF14] to-[#32e012] hover:from-[#32e012] hover:to-[#28b80f] text-black px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`${
            notification.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
          } border backdrop-blur-sm rounded-lg p-4 max-w-md`}>
            <div className="flex items-start gap-3">
              <div className={`${
                notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              } rounded-full p-1`}>
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${notification.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {notification.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className="text-white text-sm mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
