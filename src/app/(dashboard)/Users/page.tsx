'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, Edit, Trash2, Shield } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: '',
    jawatan: '',
    user_id: '',
    password: '',
    role: 'Supervisor'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('jawatan');
    
    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('users')
      .insert({
        username: form.username,
        jawatan: form.jawatan,
        user_id: form.user_id,
        password_hash: form.password,
        role: form.role
      });
    
    if (!error) {
      setShowModal(false);
      setForm({ username: '', jawatan: '', user_id: '', password: '', role: 'Supervisor' });
      fetchUsers();
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Padam user ini?')) {
      await supabase.from('users').delete().eq('id', id);
      fetchUsers();
    }
  }

  const roleColors: Record<string, string> = {
    'Developer': 'bg-purple-100 text-purple-800',
    'Field Controller': 'bg-blue-100 text-blue-800',
    'AFC': 'bg-green-100 text-green-800',
    'Supervisor': 'bg-gray-100 text-gray-800',
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengurusan Pengguna</h1>
          <p className="text-gray-500">Senarai pengguna sistem</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <UserPlus size={18} />
          Tambah Pengguna
        </button>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Nama</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">Jawatan</th>
                <th className="px-4 py-3 text-left text-gray-600 font-medium">ID Pengguna</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Role</th>
                <th className="px-4 py-3 text-center text-gray-600 font-medium">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.username}</td>
                  <td className="px-4 py-3">{user.jawatan}</td>
                  <td className="px-4 py-3">{user.user_id}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah User */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah Pengguna</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Nama Pengguna</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Jawatan</label>
                  <input
                    type="text"
                    value={form.jawatan}
                    onChange={(e) => setForm({ ...form, jawatan: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">ID Pengguna</label>
                  <input
                    type="text"
                    value={form.user_id}
                    onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Kata Laluan</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Field Controller">Field Controller</option>
                    <option value="AFC">AFC</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
