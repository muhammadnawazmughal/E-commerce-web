import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, UserCheck, Check, X, ShieldAlert } from 'lucide-react';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCustomers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({ search, limit: 50 });
      setUsers(res.data || []);
    } catch (err) {
      showToast('Failed to load users list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleToggleStatus = async (user) => {
    const newStatus = !user.isActive;
    try {
      const res = await userService.updateUser(user._id, { isActive: newStatus });
      showToast(`User ${user.name} is now ${newStatus ? 'active' : 'deactivated'}`, 'info');
      setUsers((prev) => prev.map((u) => (u._id === user._id ? res.data : u)));
    } catch (err) {
      showToast(err.message || 'Failed to update user status.', 'error');
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Are you sure you want to alter role for ${user.name} to "${newRole}"?`)) return;
    try {
      const res = await userService.updateUser(user._id, { role: newRole });
      showToast(`User role updated to ${newRole}`, 'success');
      setUsers((prev) => prev.map((u) => (u._id === user._id ? res.data : u)));
    } catch (err) {
      showToast(err.message || 'Failed to update role.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
            Clientele & Privileges
          </span>
          <h1 className="font-serif text-3xl font-bold text-noir-900 mt-1">
            Registered Customers ({users.length})
          </h1>
        </div>

        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-luxury-300 rounded-xl pl-9 pr-4 py-2 text-xs text-noir-900 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-luxury-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-luxury-200 shadow-sm overflow-hidden p-6">
        {loading ? (
          <LoadingSpinner text="Querying clientele accounts..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-luxury-200 bg-[#FAF8F5] text-luxury-700 uppercase tracking-wider font-semibold">
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Contact Phone</th>
                  <th className="p-3.5">Registered</th>
                  <th className="p-3.5">Privilege Role</th>
                  <th className="p-3.5">Account State</th>
                  <th className="p-3.5 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-100 text-luxury-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-luxury-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-noir-900 text-gold flex items-center justify-center font-bold text-xs">
                          {u.name?.[0] || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-noir-900">{u.name}</p>
                        <p className="text-[11px] text-luxury-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-3.5 text-luxury-600">{u.phone || '—'}</td>
                    <td className="p-3.5 text-luxury-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-gold/20 text-gold-dark border border-gold/30' : 'bg-luxury-100 text-luxury-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u)}
                        className="px-2.5 py-1 text-[11px] font-medium border border-luxury-300 rounded-lg hover:bg-luxury-100 transition-colors"
                        title="Change role"
                      >
                        {u.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                          u.isActive
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
